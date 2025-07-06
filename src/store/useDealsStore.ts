import { create } from 'zustand';
import { csvParser, DealData, SharkData } from '../lib/csvParser';

interface DealsStore {
  deals: DealData[];
  sharks: SharkData[];
  selectedSeason: number;
  loading: boolean;
  error: string | null;
  predictions: any[];
  insights: any[];
  analytics: any;
  isInitialized: boolean;
  
  // Actions
  fetchDeals: () => Promise<void>;
  fetchSharks: () => Promise<void>;
  fetchPredictions: () => Promise<void>;
  fetchInsights: () => Promise<void>;
  setSelectedSeason: (season: number) => void;
  initializeData: () => Promise<void>;
  
  // Getters
  getDealsByIndustry: (industry: string) => DealData[];
  getDealsBySeason: (season: number) => DealData[];
  getSharkByName: (name: string) => SharkData | undefined;
  getIndustries: () => string[];
  getSeasons: () => number[];
  getFilteredDeals: (filters: any) => DealData[];
  getSharkComparison: (shark1: string, shark2: string) => any;
}

const samplePredictions = [
  {
    id: 1,
    startup_type: "Technology",
    success_probability: 0.75,
    recommended_sharks: ["Ashneer Grover", "Peyush Bansal"],
    risk_factors: ["Market Competition", "Tech Adoption"],
    predicted_valuation: 50000000,
    growth_potential: 85,
    market_insights: {
      market_size: "₹12,000Cr",
      growth_rate: 25,
      competition: "Medium",
      entry_barriers: "High",
    },
  },
  {
    id: 2,
    startup_type: "Healthcare",
    success_probability: 0.82,
    recommended_sharks: ["Namita Thapar", "Vineeta Singh"],
    risk_factors: ["Regulatory Compliance", "Market Access"],
    predicted_valuation: 75000000,
    growth_potential: 90,
    market_insights: {
      market_size: "₹15,000Cr",
      growth_rate: 30,
      competition: "Low",
      entry_barriers: "Very High",
    },
  },
  {
    id: 3,
    startup_type: "Food & Beverage",
    success_probability: 0.68,
    recommended_sharks: ["Aman Gupta", "Vineeta Singh"],
    risk_factors: ["Supply Chain", "Food Safety", "Market Saturation"],
    predicted_valuation: 35000000,
    growth_potential: 70,
    market_insights: {
      market_size: "₹8,000Cr",
      growth_rate: 20,
      competition: "High",
      entry_barriers: "Medium",
    },
  },
];

const sampleInsights = [
  {
    id: 1,
    title: "AI Startup Trends",
    description: "Analysis of AI and ML startup performance in recent seasons",
    data_points: {
      ai_startups: 15,
      success_rate: 0.8,
      avg_valuation: 50000000,
    },
    trend: "increasing",
    impact: "high",
  },
  {
    id: 2,
    title: "D2C Brand Success",
    description: "Direct-to-consumer brands showing exceptional growth",
    data_points: {
      d2c_startups: 25,
      success_rate: 0.72,
      avg_valuation: 35000000,
    },
    trend: "stable",
    impact: "medium",
  },
  {
    id: 3,
    title: "Healthcare Innovation",
    description: "Healthcare startups gaining momentum post-pandemic",
    data_points: {
      healthcare_startups: 18,
      success_rate: 0.85,
      avg_valuation: 60000000,
    },
    trend: "increasing",
    impact: "very_high",
  },
];

export const useDealsStore = create<DealsStore>((set, get) => ({
  deals: [],
  sharks: [],
  selectedSeason: 1,
  loading: false,
  error: null,
  predictions: samplePredictions,
  insights: sampleInsights,
  analytics: null,
  isInitialized: false,

  initializeData: async () => {
    const { isInitialized } = get();
    if (isInitialized) return;

    set({ loading: true, error: null });
    try {
      await csvParser.loadCSVData();
      await Promise.all([
        get().fetchDeals(),
        get().fetchSharks(),
        get().fetchPredictions(),
        get().fetchInsights(),
      ]);
      set({ isInitialized: true });
    } catch (error) {
      console.error('Error initializing data:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchDeals: async () => {
    try {
      const deals = csvParser.getDeals();
      const analytics = csvParser.getAnalytics();
      set({ deals, analytics, error: null });
    } catch (error) {
      console.error('Error fetching deals:', error);
      set({ error: (error as Error).message });
    }
  },

  fetchSharks: async () => {
    try {
      const sharks = csvParser.getSharks();
      set({ sharks, error: null });
    } catch (error) {
      console.error('Error fetching sharks:', error);
      set({ error: (error as Error).message });
    }
  },

  fetchPredictions: async () => {
    try {
      // Enhanced predictions based on real data
      const { deals } = get();
      const industries = csvParser.getIndustries();
      
      const enhancedPredictions = industries.map((industry, index) => {
        const industryDeals = deals.filter(deal => deal.industry === industry);
        const successRate = industryDeals.length > 0 
          ? industryDeals.filter(deal => deal.success_status === 'funded').length / industryDeals.length 
          : 0.5;
        
        const avgValuation = industryDeals.length > 0
          ? industryDeals.reduce((sum, deal) => sum + deal.valuation, 0) / industryDeals.length
          : 25000000;

        return {
          id: index + 1,
          startup_type: industry,
          success_probability: Math.min(successRate + (Math.random() * 0.2 - 0.1), 1),
          recommended_sharks: samplePredictions[index % samplePredictions.length].recommended_sharks,
          risk_factors: samplePredictions[index % samplePredictions.length].risk_factors,
          predicted_valuation: avgValuation * (1 + Math.random() * 0.5),
          growth_potential: Math.floor(successRate * 100 + Math.random() * 20),
          market_insights: samplePredictions[index % samplePredictions.length].market_insights,
        };
      });

      set({ predictions: enhancedPredictions, error: null });
    } catch (error) {
      console.error('Error fetching predictions:', error);
      set({ error: (error as Error).message, predictions: samplePredictions });
    }
  },

  fetchInsights: async () => {
    try {
      // Generate insights based on real data
      const { deals } = get();
      const industries = csvParser.getIndustries();
      
      const enhancedInsights = industries.slice(0, 3).map((industry, index) => {
        const industryDeals = deals.filter(deal => deal.industry === industry);
        const successRate = industryDeals.length > 0 
          ? industryDeals.filter(deal => deal.success_status === 'funded').length / industryDeals.length 
          : 0.5;
        
        const avgValuation = industryDeals.length > 0
          ? industryDeals.reduce((sum, deal) => sum + deal.valuation, 0) / industryDeals.length
          : 25000000;

        return {
          id: index + 1,
          title: `${industry} Market Analysis`,
          description: `Comprehensive analysis of ${industry} sector performance and trends`,
          data_points: {
            [`${industry.toLowerCase()}_startups`]: industryDeals.length,
            success_rate: successRate,
            avg_valuation: avgValuation,
          },
          trend: successRate > 0.7 ? "increasing" : successRate > 0.5 ? "stable" : "decreasing",
          impact: successRate > 0.8 ? "very_high" : successRate > 0.6 ? "high" : "medium",
        };
      });

      set({ insights: enhancedInsights, error: null });
    } catch (error) {
      console.error('Error fetching insights:', error);
      set({ error: (error as Error).message, insights: sampleInsights });
    }
  },

  setSelectedSeason: (season) => set({ selectedSeason: season }),

  // Getter methods
  getDealsByIndustry: (industry: string) => {
    return get().deals.filter(deal => deal.industry === industry);
  },

  getDealsBySeason: (season: number) => {
    return get().deals.filter(deal => deal.season === season);
  },

  getSharkByName: (name: string) => {
    return get().sharks.find(shark => shark.name === name);
  },

  getIndustries: () => {
    return [...new Set(get().deals.map(deal => deal.industry))];
  },

  getSeasons: () => {
    return [...new Set(get().deals.map(deal => deal.season))].sort();
  },

  getFilteredDeals: (filters: any) => {
    const { deals } = get();
    return deals.filter(deal => {
      if (filters.season && deal.season !== filters.season) return false;
      if (filters.industry && deal.industry !== filters.industry) return false;
      if (filters.status && deal.success_status !== filters.status) return false;
      if (filters.minValuation && deal.valuation < filters.minValuation) return false;
      if (filters.maxValuation && deal.valuation > filters.maxValuation) return false;
      return true;
    });
  },

  getSharkComparison: (shark1: string, shark2: string) => {
    return csvParser.getSharkComparison(shark1, shark2);
  },
}));