package models

import (
	"time"
)

type Shark struct {
	ID               string    `json:"id" gorm:"primaryKey"`
	Name             string    `json:"name"`
	Title            string    `json:"title"`
	Company          string    `json:"company"`
	TotalDeals       int       `json:"total_deals"`
	TotalInvestment  float64   `json:"total_investment"`
	AverageEquity    float64   `json:"average_equity"`
	SuccessfulExits  int       `json:"successful_exits"`
	IndustryPreference []string `json:"industry_preference" gorm:"type:text[]"`
	InvestmentRange  struct {
		Min float64 `json:"min"`
		Max float64 `json:"max"`
	} `json:"investment_range"`
	NotableInvestments []string  `json:"notable_investments" gorm:"type:text[]"`
	InvestmentStyle   []string  `json:"investment_style" gorm:"type:text[]"`
	SeasonAppearances []int     `json:"season_appearances" gorm:"type:integer[]"`
	Bio              string    `json:"bio"`
	Expertise        []string  `json:"expertise" gorm:"type:text[]"`
	Education        []string  `json:"education" gorm:"type:text[]"`
	Achievements     []string  `json:"achievements" gorm:"type:text[]"`
	SocialMedia      struct {
		Twitter   string `json:"twitter"`
		LinkedIn  string `json:"linkedin"`
		Instagram string `json:"instagram"`
	} `json:"social_media"`
	InvestmentStats struct {
		ByIndustry    map[string]float64 `json:"by_industry"`
		ByStage       map[string]float64 `json:"by_stage"`
		SuccessRate   float64            `json:"success_rate"`
		AverageReturn float64            `json:"average_return"`
	} `json:"investment_stats"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (Shark) TableName() string {
	return "sharks"
}