package models

import (
	"time"
)

type Deal struct {
	ID              uint      `json:"id" gorm:"primaryKey"`
	Season          int       `json:"season"`
	Episode         int       `json:"episode"`
	StartupName     string    `json:"startup_name"`
	Industry        string    `json:"industry"`
	AskAmount       float64   `json:"ask_amount"`
	AskEquity       float64   `json:"ask_equity"`
	Valuation       float64   `json:"valuation"`
	DealAmount      float64   `json:"deal_amount"`
	DealEquity      float64   `json:"deal_equity"`
	DealDebt        float64   `json:"deal_debt"`
	MultipleSharks  bool      `json:"multiple_sharks"`
	InterestedSharks []string `json:"interested_sharks" gorm:"type:text[]"`
	InvestedSharks  []string `json:"invested_sharks" gorm:"type:text[]"`
	SuccessStatus   string    `json:"success_status"`
	PitchDescription string   `json:"pitch_description"`
	ProductCategory string    `json:"product_category"`
	RevenueCurrent  float64   `json:"revenue_current"`
	RevenueProjected float64  `json:"revenue_projected"`
	ProfitMargin    float64   `json:"profit_margin"`
	TeamSize        int       `json:"team_size"`
	FoundedYear     int       `json:"founded_year"`
	Location        string    `json:"location"`
	PatentStatus    string    `json:"patent_status"`
	OnlinePresence  struct {
		Website    string `json:"website"`
		SocialMedia struct {
			Instagram string `json:"instagram"`
			Facebook  string `json:"facebook"`
			Twitter   string `json:"twitter"`
		} `json:"social_media"`
	} `json:"online_presence"`
	PostShowStatus struct {
		RevenueGrowth  float64   `json:"revenue_growth"`
		EmployeeGrowth float64   `json:"employee_growth"`
		MarketExpansion []string `json:"market_expansion"`
		FundingRounds  []struct {
			Round     string    `json:"round"`
			Amount    float64   `json:"amount"`
			Investors []string  `json:"investors"`
			Date      time.Time `json:"date"`
		} `json:"funding_rounds"`
	} `json:"post_show_status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (Deal) TableName() string {
	return "deals"
}