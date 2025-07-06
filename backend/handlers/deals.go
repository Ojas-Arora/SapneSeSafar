package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/your-username/shark-tank-analytics/models"
)

// GetDeals returns all deals with optional filtering
func GetDeals(c *gin.Context) {
	var deals []models.Deal
	
	// Get query parameters for filtering
	season := c.DefaultQuery("season", "")
	industry := c.DefaultQuery("industry", "")
	status := c.DefaultQuery("status", "")
	
	// Build query based on filters
	query := db.Model(&models.Deal{})
	
	if season != "" {
		if seasonNum, err := strconv.Atoi(season); err == nil {
			query = query.Where("season = ?", seasonNum)
		}
	}
	
	if industry != "" {
		query = query.Where("industry = ?", industry)
	}
	
	if status != "" {
		query = query.Where("success_status = ?", status)
	}
	
	// Execute query
	if err := query.Find(&deals).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch deals"})
		return
	}
	
	c.JSON(http.StatusOK, deals)
}

// GetDealByID returns a specific deal by ID
func GetDealByID(c *gin.Context) {
	id := c.Param("id")
	var deal models.Deal
	
	if err := db.First(&deal, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Deal not found"})
		return
	}
	
	c.JSON(http.StatusOK, deal)
}

// GetDealAnalytics returns analytics for deals
func GetDealAnalytics(c *gin.Context) {
	var totalDeals int64
	var totalInvestment float64
	var avgValuation float64
	var successRate float64
	
	// Get total deals
	db.Model(&models.Deal{}).Count(&totalDeals)
	
	// Get total investment
	db.Model(&models.Deal{}).Select("COALESCE(SUM(deal_amount), 0)").Row().Scan(&totalInvestment)
	
	// Get average valuation
	db.Model(&models.Deal{}).Select("COALESCE(AVG(valuation), 0)").Row().Scan(&avgValuation)
	
	// Get success rate
	var successfulDeals int64
	db.Model(&models.Deal{}).Where("success_status = ?", "funded").Count(&successfulDeals)
	if totalDeals > 0 {
		successRate = float64(successfulDeals) / float64(totalDeals) * 100
	}
	
	// Get industry breakdown
	var industryStats []struct {
		Industry        string  `json:"industry"`
		Count          int64   `json:"count"`
		TotalInvestment float64 `json:"total_investment"`
		AvgValuation    float64 `json:"avg_valuation"`
	}
	
	db.Model(&models.Deal{}).
		Select("industry, COUNT(*) as count, SUM(deal_amount) as total_investment, AVG(valuation) as avg_valuation").
		Group("industry").
		Find(&industryStats)
	
	analytics := gin.H{
		"total_deals":      totalDeals,
		"total_investment": totalInvestment,
		"avg_valuation":    avgValuation,
		"success_rate":     successRate,
		"industry_stats":   industryStats,
	}
	
	c.JSON(http.StatusOK, analytics)
}

// GetDealPredictions returns ML predictions for deals
func GetDealPredictions(c *gin.Context) {
	industry := c.DefaultQuery("industry", "")
	
	// Example prediction logic (replace with actual ML model)
	predictions := []gin.H{
		{
			"industry":            industry,
			"success_probability": 0.75,
			"predicted_valuation": 50000000,
			"risk_score":         3,
			"growth_potential":   85,
			"recommended_sharks": []string{"Ashneer Grover", "Namita Thapar"},
			"market_insights": gin.H{
				"market_size":     "₹12,000Cr",
				"growth_rate":     25,
				"competition":     "Medium",
				"entry_barriers": "High",
			},
		},
	}
	
	c.JSON(http.StatusOK, predictions)
}

// ImportDealsFromExcel imports deals from Excel file
func ImportDealsFromExcel(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}
	
	// Process Excel file and import deals
	// Implementation depends on the Excel library being used
	
	c.JSON(http.StatusOK, gin.H{"message": "Deals imported successfully"})
}