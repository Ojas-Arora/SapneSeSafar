package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/tealeg/xlsx"
	_ "modernc.org/sqlite"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB
var jwtSecret = []byte("your-secret-key") // In production, use environment variable

func main() {
	var err error
	// Initialize SQLite database
	db, err = sql.Open("sqlite", "deals.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Create tables
	createTables()

	// Import Excel data
	importExcelData()

	// Setup Gin router
	r := gin.Default()

	// Enable CORS
	r.Use(cors())

	// Auth routes
	auth := r.Group("/api/auth")
	{
		auth.POST("/register", register)
		auth.POST("/login", login)
		auth.POST("/logout", authMiddleware(), logout)
		auth.GET("/profile", authMiddleware(), getProfile)
		auth.PUT("/profile", authMiddleware(), updateProfile)
	}

	// API routes
	api := r.Group("/api")
	{
		api.GET("/deals", getDeals)
		api.GET("/sharks", getSharks)
		api.GET("/analytics", getAnalytics)
		api.GET("/predictions", getPredictions)
	}

	// Start server
	r.Run(":8080")
}

func createTables() {
	// Create users table
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id TEXT PRIMARY KEY,
			email TEXT UNIQUE NOT NULL,
			password TEXT NOT NULL,
			full_name TEXT,
			avatar_url TEXT,
			preferences TEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		log.Fatal(err)
	}

	// Create deals table
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS deals (
			id INTEGER PRIMARY KEY,
			season INTEGER,
			episode INTEGER,
			startup_name TEXT,
			industry TEXT,
			ask_amount REAL,
			ask_equity REAL,
			valuation REAL,
			deal_amount REAL,
			deal_equity REAL,
			deal_debt REAL,
			multiple_sharks BOOLEAN,
			interested_sharks TEXT,
			invested_sharks TEXT,
			success_status TEXT
		)
	`)
	if err != nil {
		log.Fatal(err)
	}
}

func importExcelData() {
	// Open Excel file
	xlFile, err := xlsx.OpenFile("data/deals.xlsx")
	if err != nil {
		log.Fatal(err)
	}

	// Get the first sheet
	sheet := xlFile.Sheets[0]

	// Prepare insert statement
	stmt, err := db.Prepare(`
		INSERT INTO deals (
			season, episode, startup_name, industry, ask_amount,
			ask_equity, valuation, deal_amount, deal_equity, deal_debt,
			multiple_sharks, interested_sharks, invested_sharks, success_status
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()

	// Skip header row
	for i := 1; i < sheet.MaxRow; i++ {
		row := sheet.Row(i)
		
		// Convert Excel row to Deal struct
		deal := Deal{
			Season:          row.GetCell(0).Int(),
			Episode:         row.GetCell(1).Int(),
			StartupName:     row.GetCell(2).String(),
			Industry:        row.GetCell(3).String(),
			AskAmount:       row.GetCell(4).Float(),
			AskEquity:       row.GetCell(5).Float(),
			Valuation:       row.GetCell(6).Float(),
			DealAmount:      row.GetCell(7).Float(),
			DealEquity:      row.GetCell(8).Float(),
			DealDebt:        row.GetCell(9).Float(),
			MultipleSharks:  row.GetCell(10).Bool(),
			InterestedSharks: strings.Split(row.GetCell(11).String(), ","),
			InvestedSharks:  strings.Split(row.GetCell(12).String(), ","),
			SuccessStatus:   row.GetCell(13).String(),
		}

		// Insert into database
		_, err = stmt.Exec(
			deal.Season, deal.Episode, deal.StartupName, deal.Industry,
			deal.AskAmount, deal.AskEquity, deal.Valuation, deal.DealAmount,
			deal.DealEquity, deal.DealDebt, deal.MultipleSharks,
			strings.Join(deal.InterestedSharks, ","),
			strings.Join(deal.InvestedSharks, ","),
			deal.SuccessStatus,
		)
		if err != nil {
			log.Printf("Error inserting row %d: %v", i, err)
		}
	}
}

func cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		
		c.Next()
	}
}

func register(c *gin.Context) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		FullName string `json:"full_name"`
	}

	if err := c.BindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Create user
	result, err := db.Exec(`
		INSERT INTO users (email, password, full_name)
		VALUES (?, ?, ?)
	`, input.Email, string(hashedPassword), input.FullName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	id, _ := result.LastInsertId()
	token := generateToken(id)

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user": gin.H{
			"id": id,
			"email": input.Email,
			"full_name": input.FullName,
		},
	})
}

func login(c *gin.Context) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user struct {
		ID       int64
		Email    string
		Password string
		FullName string
	}

	err := db.QueryRow(`
		SELECT id, email, password, full_name
		FROM users
		WHERE email = ?
	`, input.Email).Scan(&user.ID, &user.Email, &user.Password, &user.FullName)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token := generateToken(user.ID)

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user": gin.H{
			"id": user.ID,
			"email": user.Email,
			"full_name": user.FullName,
		},
	})
}

func generateToken(userID int64) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
	})

	tokenString, _ := token.SignedString(jwtSecret)
	return tokenString
}

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
			c.Abort()
			return
		}

		tokenString = strings.Replace(tokenString, "Bearer ", "", 1)

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		claims := token.Claims.(jwt.MapClaims)
		c.Set("user_id", claims["user_id"])
		c.Next()
	}
}

func getDeals(c *gin.Context) {
	// Get deals from database
	rows, err := db.Query("SELECT * FROM deals")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var deals []Deal
	for rows.Next() {
		var deal Deal
		var interestedSharksStr, investedSharksStr string
		
		err := rows.Scan(
			&deal.ID, &deal.Season, &deal.Episode, &deal.StartupName,
			&deal.Industry, &deal.AskAmount, &deal.AskEquity, &deal.Valuation,
			&deal.DealAmount, &deal.DealEquity, &deal.DealDebt,
			&deal.MultipleSharks, &interestedSharksStr, &investedSharksStr,
			&deal.SuccessStatus,
		)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}

		deal.InterestedSharks = strings.Split(interestedSharksStr, ",")
		deal.InvestedSharks = strings.Split(investedSharksStr, ",")
		deals = append(deals, deal)
	}

	c.JSON(http.StatusOK, deals)
}

func getSharks(c *gin.Context) {
	// Get unique sharks and their statistics
	rows, err := db.Query(`
		SELECT 
			invested_sharks,
			COUNT(*) as total_deals,
			SUM(deal_amount) as total_investment
		FROM deals
		GROUP BY invested_sharks
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	sharks := make(map[string]gin.H)
	for rows.Next() {
		var sharkStr string
		var totalDeals int
		var totalInvestment float64
		
		err := rows.Scan(&sharkStr, &totalDeals, &totalInvestment)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}

		for _, shark := range strings.Split(sharkStr, ",") {
			if shark == "" {
				continue
			}
			sharks[shark] = gin.H{
				"name": shark,
				"total_deals": totalDeals,
				"total_investment": totalInvestment,
			}
		}
	}

	c.JSON(http.StatusOK, sharks)
}

func getAnalytics(c *gin.Context) {
	// Get overall analytics
	var totalDeals int
	var totalInvestment float64
	var avgValuation float64
	var successRate float64

	err := db.QueryRow(`
		SELECT 
			COUNT(*) as total_deals,
			SUM(deal_amount) as total_investment,
			AVG(valuation) as avg_valuation,
			(SELECT CAST(COUNT(*) AS FLOAT) / (SELECT COUNT(*) FROM deals) 
			 FROM deals WHERE success_status = 'funded') as success_rate
		FROM deals
	`).Scan(&totalDeals, &totalInvestment, &avgValuation, &successRate)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Get industry breakdown
	rows, err := db.Query(`
		SELECT 
			industry,
			COUNT(*) as count,
			AVG(valuation) as avg_valuation,
			SUM(deal_amount) as total_investment
		FROM deals
		GROUP BY industry
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	industries := make([]gin.H, 0)
	for rows.Next() {
		var industry string
		var count int
		var avgVal, totalInv float64
		
		err := rows.Scan(&industry, &count, &avgVal, &totalInv)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}

		industries = append(industries, gin.H{
			"industry": industry,
			"count": count,
			"avg_valuation": avgVal,
			"total_investment": totalInv,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"overall": gin.H{
			"total_deals": totalDeals,
			"total_investment": totalInvestment,
			"avg_valuation": avgValuation,
			"success_rate": successRate,
		},
		"industries": industries,
	})
}

func getPredictions(c *gin.Context) {
	// Get data for ML predictions
	rows, err := db.Query(`
		SELECT 
			industry,
			AVG(deal_amount) as avg_deal,
			AVG(valuation) as avg_valuation,
			COUNT(*) as deal_count,
			(SELECT CAST(COUNT(*) AS FLOAT) / COUNT(*) 
			 FROM deals d2 
			 WHERE d2.industry = d1.industry 
			 AND d2.success_status = 'funded'
			) as success_rate
		FROM deals d1
		GROUP BY industry
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	predictions := make([]gin.H, 0)
	for rows.Next() {
		var industry string
		var avgDeal, avgValuation float64
		var dealCount int
		var successRate float64
		
		err := rows.Scan(&industry, &avgDeal, &avgValuation, &dealCount, &successRate)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}

		// Simple prediction model based on historical data
		growthPotential := (successRate * avgValuation) / avgDeal
		riskScore := 1 - successRate

		predictions = append(predictions, gin.H{
			"industry": industry,
			"success_probability": successRate,
			"growth_potential": growthPotential,
			"risk_score": riskScore,
			"market_data": gin.H{
				"avg_deal": avgDeal,
				"avg_valuation": avgValuation,
				"total_deals": dealCount,
			},
		})
	}

	c.JSON(http.StatusOK, predictions)
}