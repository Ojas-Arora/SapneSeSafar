package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/your-username/shark-tank-analytics/models"
)

// GetSharks returns all sharks with optional filtering
func GetSharks(c *gin.Context) {
	var sharks []models.Shark
	
	// Get query parameters for filtering
	season := c.DefaultQuery("season", "")
	
	// Build query based on filters
	query := db.Model(&models.Shark{})
	
	if season != "" {
		if seasonNum, err := strconv.Atoi(season); err == nil {
			query = query.Where("? = ANY(season_appearances)", seasonNum)
		}
	}
	
	// Execute query
	if err := query.Find(&sharks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch sharks"})
		return
	}
	
	c.JSON(http.StatusOK, sharks)
}

// GetSharkByID returns a specific shark by ID
func GetSharkByID(c *gin.Context) {
	id := c.Param("id")
	var shark models.Shark
	
	if err := db.First(&shark, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Shark not found"})
		return
	}
	
	c.JSON(http.StatusOK, shark)
}

// GetSharkAnalytics returns analytics for a specific shark
func GetSharkAnalytics(c *gin.Context) {
	id := c.Param("id")
	var shark models.Shark
	
	if err := db.First(&shark, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Shark not found"})
		return
	}
	
	// Get deals where this shark invested
	var deals []models.Deal
	db.Where("? = ANY(invested_sharks)", shark.Name).Find(&deals)
	
	// Calculate analytics
	totalInvestment := 0.0
	successfulDeals := 0
	industryBreakdown := make(map[string]int)
	
	for _, deal := range deals {
		totalInvestment += deal.DealAmount
		if deal.SuccessStatus == "funded" {
			successfulDeals++
		}
		industryBreakdown[deal.Industry]++
	}
	
	successRate := float64(successfulDeals) / float64(len(deals)) * 100
	
	analytics := gin.H{
		"total_deals":       len(deals),
		"total_investment":  totalInvestment,
		"success_rate":      successRate,
		"avg_deal_size":     totalInvestment / float64(len(deals)),
		"industry_breakdown": industryBreakdown,
		"investment_stats":   shark.InvestmentStats,
		"season_stats": gin.H{
			"appearances":     len(shark.SeasonAppearances),
			"seasons":        shark.SeasonAppearances,
			"deals_by_season": calculateDealsBySeason(deals),
		},
	}
	
	c.JSON(http.StatusOK, analytics)
}

// GetSharkComparison returns comparison between two sharks
func GetSharkComparison(c *gin.Context) {
	shark1ID := c.Query("shark1")
	shark2ID := c.Query("shark2")
	
	var shark1, shark2 models.Shark
	
	if err := db.First(&shark1, "id = ?", shark1ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "First shark not found"})
		return
	}
	
	if err := db.First(&shark2, "id = ?", shark2ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Second shark not found"})
		return
	}
	
	comparison := gin.H{
		"shark1": gin.H{
			"name":             shark1.Name,
			"total_deals":      shark1.TotalDeals,
			"total_investment": shark1.TotalInvestment,
			"success_rate":     shark1.InvestmentStats.SuccessRate,
			"avg_return":       shark1.InvestmentStats.AverageReturn,
		},
		"shark2": gin.H{
			"name":             shark2.Name,
			"total_deals":      shark2.TotalDeals,
			"total_investment": shark2.TotalInvestment,
			"success_rate":     shark2.InvestmentStats.SuccessRate,
			"avg_return":       shark2.InvestmentStats.AverageReturn,
		},
		"common_industries": findCommonIndustries(shark1, shark2),
		"investment_style_comparison": compareInvestmentStyles(shark1, shark2),
	}
	
	c.JSON(http.StatusOK, comparison)
}

// Helper functions

func calculateDealsBySeason(deals []models.Deal) map[int]int {
	dealsBySeason := make(map[int]int)
	for _, deal := range deals {
		dealsBySeason[deal.Season]++
	}
	return dealsBySeason
}

func findCommonIndustries(shark1, shark2 models.Shark) []string {
	industries := make(map[string]bool)
	var common []string
	
	for _, ind := range shark1.IndustryPreference {
		industries[ind] = true
	}
	
	for _, ind := range shark2.IndustryPreference {
		if industries[ind] {
			common = append(common, ind)
		}
	}
	
	return common
}

func compareInvestmentStyles(shark1, shark2 models.Shark) map[string][]string {
	return map[string][]string{
		shark1.Name: shark1.InvestmentStyle,
		shark2.Name: shark2.InvestmentStyle,
	}
}