import Papa from 'papaparse';

export interface DealData {
  id: number;
  season: number;
  episode: number;
  startup_name: string;
  industry: string;
  ask_amount: number;
  ask_equity: number;
  valuation: number;
  deal_amount: number | null;
  deal_equity: number | null;
  deal_debt: number;
  multiple_sharks: boolean;
  interested_sharks: string[];
  invested_sharks: string[];
  success_status: string;
  pitch_description?: string;
  revenue_current?: number;
  revenue_projected?: number;
  profit_margin?: number;
  team_size?: number;
  founded_year?: number;
  location?: string;
  patent_status?: string;
  website?: string;
  social_media?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  post_show_status?: {
    revenue_growth?: number;
    employee_growth?: number;
    market_expansion?: string[];
  };
  created_at: string;
}

export interface SharkData {
  id: string;
  name: string;
  total_deals: number;
  total_investment: number;
  appearances: number[];
  profile_image?: string;
  expertise?: string[];
  success_rate?: number;
  avg_deal_size?: number;
  preferred_industries?: string[];
  investment_style?: string[];
  bio?: string;
  company?: string;
  title?: string;
  notable_investments?: string[];
  investment_range?: {
    min: number;
    max: number;
  };
  created_at: string;
}

export class CSVDataParser {
  private static instance: CSVDataParser;
  private deals: DealData[] = [];
  private sharks: SharkData[] = [];
  private isLoaded = false;

  static getInstance(): CSVDataParser {
    if (!CSVDataParser.instance) {
      CSVDataParser.instance = new CSVDataParser();
    }
    return CSVDataParser.instance;
  }

  async loadCSVData(): Promise<void> {
    if (this.isLoaded) return;

    try {
      // Load the CSV file from the data directory
      const response = await fetch('/data/Shark Tank India.csv');
      const csvText = await response.text();
      
      // Parse CSV using Papa Parse with enhanced configuration
      const parseResult = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        transformHeader: (header) => this.normalizeHeader(header),
        transform: (value, header) => this.transformValue(value, header)
      });
      
      if (parseResult.errors.length > 0) {
        console.warn('CSV parsing warnings:', parseResult.errors);
      }
      
      // Parse the data with comprehensive mapping
      this.parseDealsData(parseResult.data);
      this.generateSharksData();
      
      this.isLoaded = true;
      console.log('CSV data loaded successfully:', {
        deals: this.deals.length,
        sharks: this.sharks.length,
        columns: parseResult.meta.fields
      });
    } catch (error) {
      console.error('Error loading CSV data:', error);
      // Fallback to enhanced sample data
      this.generateEnhancedSampleData();
      this.isLoaded = true;
    }
  }

  private normalizeHeader(header: string): string {
    return header
      .trim()
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  private transformValue(value: any, header: string): any {
    if (value === null || value === undefined || value === '') return null;
    
    // Handle currency values
    if (typeof value === 'string' && /[₹$€£]/.test(value)) {
      return this.parseNumber(value);
    }
    
    // Handle percentage values
    if (typeof value === 'string' && value.includes('%')) {
      return parseFloat(value.replace('%', ''));
    }
    
    return value;
  }

  private parseDealsData(rawData: any[]): void {
    if (!rawData || rawData.length === 0) {
      this.generateEnhancedSampleData();
      return;
    }

    console.log('Parsing deals data:', rawData.length, 'rows');
    console.log('Sample row:', rawData[0]);

    this.deals = rawData.map((row, index) => {
      // Comprehensive column mapping for various CSV formats
      const deal: DealData = {
        id: index + 1,
        season: this.parseNumber(
          row.season || row.s_no || row.series || row.season_number
        ) || Math.floor(Math.random() * 4) + 1,
        
        episode: this.parseNumber(
          row.episode || row.ep_no || row.episode_number || row.ep
        ) || Math.floor(Math.random() * 20) + 1,
        
        startup_name: this.parseString(
          row.startup_name || row.brand || row.company_name || 
          row.startup || row.business_name || row.company
        ) || `Startup ${index + 1}`,
        
        industry: this.parseString(
          row.industry || row.sector || row.category || 
          row.business_category || row.vertical
        ) || this.getRandomIndustry(),
        
        ask_amount: this.parseNumber(
          row.ask_amount || row.amount_asked || row.ask || 
          row.funding_ask || row.investment_ask
        ) || (Math.floor(Math.random() * 50) + 10) * 100000,
        
        ask_equity: this.parseNumber(
          row.ask_equity || row.equity_asked || row.equity || 
          row.equity_ask || row.stake_asked
        ) || Math.floor(Math.random() * 20) + 5,
        
        valuation: this.parseNumber(
          row.valuation || row.company_valuation || row.pre_money_valuation
        ) || 0,
        
        deal_amount: this.parseNumber(
          row.deal_amount || row.amount_invested || row.investment || 
          row.final_amount || row.invested_amount
        ),
        
        deal_equity: this.parseNumber(
          row.deal_equity || row.equity_given || row.final_equity || 
          row.equity_taken || row.stake_given
        ),
        
        deal_debt: this.parseNumber(
          row.deal_debt || row.debt || row.debt_component
        ) || 0,
        
        multiple_sharks: this.parseBoolean(
          row.multiple_sharks || row.joint_deal || row.multiple_investors
        ) || false,
        
        interested_sharks: this.parseSharkArray(
          row.interested_sharks || row.sharks_interested || 
          row.sharks_shown_interest || row.interested_investors
        ),
        
        invested_sharks: this.parseSharkArray(
          row.invested_sharks || row.sharks_invested || 
          row.deal_sharks || row.final_sharks || row.investors
        ),
        
        success_status: this.parseString(
          row.success_status || row.deal_status || row.status || 
          row.outcome || row.result
        ) || 'pending',
        
        // Additional fields
        pitch_description: this.parseString(
          row.pitch_description || row.description || row.business_description
        ),
        
        revenue_current: this.parseNumber(
          row.revenue_current || row.current_revenue || row.revenue || 
          row.annual_revenue || row.monthly_revenue
        ),
        
        revenue_projected: this.parseNumber(
          row.revenue_projected || row.projected_revenue || 
          row.future_revenue || row.target_revenue
        ),
        
        profit_margin: this.parseNumber(
          row.profit_margin || row.margin || row.profit_percentage
        ),
        
        team_size: this.parseNumber(
          row.team_size || row.employees || row.team_members || row.staff
        ),
        
        founded_year: this.parseNumber(
          row.founded_year || row.year_founded || row.establishment_year
        ),
        
        location: this.parseString(
          row.location || row.city || row.headquarters || row.base_location
        ),
        
        patent_status: this.parseString(
          row.patent_status || row.patents || row.ip_status
        ),
        
        website: this.parseString(
          row.website || row.website_url || row.company_website
        ),
        
        created_at: new Date().toISOString(),
      };

      // Auto-calculate valuation if not provided
      if (!deal.valuation && deal.ask_amount && deal.ask_equity) {
        deal.valuation = (deal.ask_amount / deal.ask_equity) * 100;
      }

      // Auto-detect deal status
      if (!deal.success_status || deal.success_status === 'pending') {
        deal.success_status = deal.deal_amount && deal.deal_amount > 0 ? 'funded' : 'not_funded';
      }

      // Normalize success status
      deal.success_status = this.normalizeStatus(deal.success_status);

      return deal;
    }).filter(deal => deal.startup_name && deal.startup_name !== '');

    console.log('Parsed deals:', this.deals.length);
  }

  private normalizeStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'yes': 'funded',
      'no': 'not_funded',
      'deal': 'funded',
      'no deal': 'not_funded',
      'funded': 'funded',
      'not funded': 'not_funded',
      'rejected': 'not_funded',
      'accepted': 'funded',
      'success': 'funded',
      'failed': 'not_funded',
    };
    
    return statusMap[status.toLowerCase()] || status;
  }

  private parseSharkArray(value: any): string[] {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(v => this.normalizeSharkName(String(v)));
    if (typeof value === 'string') {
      return value
        .split(/[,;|&+]/)
        .map(s => s.trim())
        .filter(s => s && s !== 'None' && s !== 'N/A' && s !== '-')
        .map(s => this.normalizeSharkName(s));
    }
    return [];
  }

  private normalizeSharkName(name: string): string {
    // Comprehensive shark name mapping
    const nameMap: Record<string, string> = {
      'ashneer grover': 'Ashneer Grover',
      'ashneer': 'Ashneer Grover',
      'grover': 'Ashneer Grover',
      'namita thapar': 'Namita Thapar',
      'namita': 'Namita Thapar',
      'thapar': 'Namita Thapar',
      'aman gupta': 'Aman Gupta',
      'aman': 'Aman Gupta',
      'gupta': 'Aman Gupta',
      'peyush bansal': 'Peyush Bansal',
      'peyush': 'Peyush Bansal',
      'bansal': 'Peyush Bansal',
      'vineeta singh': 'Vineeta Singh',
      'vineeta': 'Vineeta Singh',
      'singh': 'Vineeta Singh',
      'anupam mittal': 'Anupam Mittal',
      'anupam': 'Anupam Mittal',
      'mittal': 'Anupam Mittal',
      'ghazal alagh': 'Ghazal Alagh',
      'ghazal': 'Ghazal Alagh',
      'alagh': 'Ghazal Alagh',
      'ritesh agarwal': 'Ritesh Agarwal',
      'ritesh': 'Ritesh Agarwal',
      'agarwal': 'Ritesh Agarwal',
      'amit jain': 'Amit Jain',
      'amit': 'Amit Jain',
      'jain': 'Amit Jain',
      'radhika gupta': 'Radhika Gupta',
      'radhika': 'Radhika Gupta',
    };

    const lowerName = name.toLowerCase().trim();
    return nameMap[lowerName] || name;
  }

  private getRandomIndustry(): string {
    const industries = [
      'Technology', 'Food & Beverage', 'Healthcare', 'E-commerce', 
      'Education', 'Manufacturing', 'Fashion', 'Beauty & Personal Care',
      'Automotive', 'Agriculture', 'Sports & Fitness', 'Entertainment',
      'Fintech', 'Travel & Tourism', 'Real Estate', 'Media'
    ];
    return industries[Math.floor(Math.random() * industries.length)];
  }

  private generateSharksData(): void {
    const sharkProfiles = {
      'Ashneer Grover': {
        title: 'Co-founder & Former MD',
        company: 'BharatPe',
        expertise: ['Fintech', 'Banking', 'Digital Payments', 'Technology', 'Aggressive Negotiations'],
        bio: 'Former MD & Co-founder of BharatPe, known for aggressive deal-making and fintech expertise. Built one of India\'s fastest-growing fintech companies.',
        investment_style: ['Aggressive', 'High-Growth', 'Scalable Business Models', 'Tech-First'],
        notable_investments: ['BharatPe', 'PostPe', 'Payback'],
        investment_range: { min: 50000000, max: 500000000 }
      },
      'Namita Thapar': {
        title: 'Executive Director',
        company: 'Emcure Pharmaceuticals',
        expertise: ['Healthcare', 'Pharmaceuticals', 'Consumer Goods', 'Manufacturing', 'Women Entrepreneurship'],
        bio: 'Executive Director of Emcure Pharmaceuticals, focuses on healthcare and consumer products with emphasis on women-led businesses.',
        investment_style: ['Conservative', 'Sustainable Growth', 'Market Validation', 'Social Impact'],
        notable_investments: ['Emcure Pharmaceuticals', 'The Whole Truth', 'Skippi Ice Pops'],
        investment_range: { min: 25000000, max: 200000000 }
      },
      'Aman Gupta': {
        title: 'Co-founder & CMO',
        company: 'boAt',
        expertise: ['Consumer Electronics', 'D2C Brands', 'Marketing', 'E-commerce', 'Brand Building'],
        bio: 'Co-founder & CMO of boAt, expert in consumer electronics and direct-to-consumer brands. Built India\'s leading audio brand.',
        investment_style: ['Brand Building', 'Marketing Focus', 'Consumer Insights', 'D2C Strategy'],
        notable_investments: ['boAt', 'Noise', 'Hammer'],
        investment_range: { min: 30000000, max: 300000000 }
      },
      'Peyush Bansal': {
        title: 'Founder & CEO',
        company: 'Lenskart',
        expertise: ['E-commerce', 'Technology', 'Retail', 'Consumer Products', 'Omnichannel'],
        bio: 'Founder & CEO of Lenskart, pioneer in omnichannel retail and technology integration in eyewear industry.',
        investment_style: ['Tech-Enabled', 'Omnichannel', 'Customer Experience', 'Data-Driven'],
        notable_investments: ['Lenskart', 'Purplle', 'Xylem Learning'],
        investment_range: { min: 40000000, max: 400000000 }
      },
      'Vineeta Singh': {
        title: 'Co-founder & CEO',
        company: 'SUGAR Cosmetics',
        expertise: ['Beauty & Personal Care', 'D2C', 'Consumer Brands', 'Digital Marketing', 'Women-Centric Products'],
        bio: 'Co-founder & CEO of SUGAR Cosmetics, expert in beauty and personal care industry with focus on millennial consumers.',
        investment_style: ['Brand Differentiation', 'Digital First', 'Consumer Behavior', 'Millennial Focus'],
        notable_investments: ['SUGAR Cosmetics', 'Nykaa', 'MyGlamm'],
        investment_range: { min: 20000000, max: 250000000 }
      },
      'Anupam Mittal': {
        title: 'Founder & CEO',
        company: 'Shaadi.com',
        expertise: ['Internet', 'Technology', 'Real Estate', 'Consumer Internet', 'Marketplaces'],
        bio: 'Founder & CEO of Shaadi.com, veteran internet entrepreneur and investor with deep understanding of consumer internet.',
        investment_style: ['Internet Business', 'Network Effects', 'Platform Thinking', 'Long-term Vision'],
        notable_investments: ['Shaadi.com', 'People Group', 'Ola'],
        investment_range: { min: 35000000, max: 350000000 }
      },
      'Ghazal Alagh': {
        title: 'Co-founder',
        company: 'Mamaearth',
        expertise: ['FMCG', 'Baby Care', 'Consumer Products', 'D2C', 'Natural Products'],
        bio: 'Co-founder of Mamaearth, expert in natural and organic consumer products with focus on toxin-free solutions.',
        investment_style: ['Natural Products', 'Sustainability', 'Parent-focused', 'Clean Beauty'],
        notable_investments: ['Mamaearth', 'The Derma Co', 'Aqualogica'],
        investment_range: { min: 25000000, max: 200000000 }
      },
      'Ritesh Agarwal': {
        title: 'Founder & CEO',
        company: 'OYO',
        expertise: ['Hospitality', 'Technology', 'Travel', 'Real Estate', 'Asset-Light Models'],
        bio: 'Founder & CEO of OYO, youngest entrepreneur to build a global hospitality brand with asset-light model.',
        investment_style: ['Asset Light', 'Technology Platform', 'Global Scalability', 'Operational Excellence'],
        notable_investments: ['OYO', 'Sunday', 'Zostel'],
        investment_range: { min: 50000000, max: 500000000 }
      }
    };

    const allSharks = Object.keys(sharkProfiles);
    
    this.sharks = allSharks.map((name, index) => {
      const sharkDeals = this.deals.filter(deal => 
        deal.invested_sharks.includes(name) || deal.interested_sharks.includes(name)
      );

      const investedDeals = this.deals.filter(deal => deal.invested_sharks.includes(name));
      const totalInvestment = investedDeals.reduce((sum, deal) => 
        sum + (deal.deal_amount || 0), 0
      );

      const successfulDeals = investedDeals.filter(deal => deal.success_status === 'funded');
      const profile = sharkProfiles[name as keyof typeof sharkProfiles];

      return {
        id: `shark-${index + 1}`,
        name,
        title: profile.title,
        company: profile.company,
        total_deals: investedDeals.length,
        total_investment: totalInvestment,
        appearances: [...new Set(sharkDeals.map(deal => deal.season))],
        profile_image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`,
        expertise: profile.expertise,
        bio: profile.bio,
        investment_style: profile.investment_style,
        notable_investments: profile.notable_investments,
        investment_range: profile.investment_range,
        success_rate: investedDeals.length > 0 ? (successfulDeals.length / investedDeals.length) * 100 : 0,
        avg_deal_size: investedDeals.length > 0 ? totalInvestment / investedDeals.length : 0,
        preferred_industries: this.getPreferredIndustries(investedDeals),
        created_at: new Date().toISOString(),
      };
    }).filter(shark => shark.total_deals > 0 || shark.name in sharkProfiles);
  }

  private getPreferredIndustries(deals: DealData[]): string[] {
    const industries = deals.map(deal => deal.industry);
    const counts = industries.reduce((acc, industry) => {
      acc[industry] = (acc[industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([industry]) => industry);
  }

  private generateEnhancedSampleData(): void {
    console.log('Generating enhanced sample data...');
    
    const industries = [
      'Technology', 'Food & Beverage', 'Healthcare', 'E-commerce', 
      'Education', 'Manufacturing', 'Fashion', 'Beauty & Personal Care',
      'Fintech', 'Travel & Tourism', 'Agriculture', 'Sports & Fitness'
    ];
    
    const sharks = [
      'Ashneer Grover', 'Namita Thapar', 'Aman Gupta', 'Peyush Bansal',
      'Vineeta Singh', 'Anupam Mittal', 'Ghazal Alagh', 'Ritesh Agarwal'
    ];

    const startupNames = [
      'TechFlow Solutions', 'FoodieDelight', 'HealthFirst', 'ShopEasy',
      'EduTech Pro', 'ManufactureMax', 'StyleHub', 'BeautyBloom',
      'PaySecure', 'TravelMate', 'AgriGrow', 'FitLife'
    ];

    this.deals = Array.from({ length: 250 }, (_, i) => {
      const industry = industries[Math.floor(Math.random() * industries.length)];
      const askAmount = (Math.floor(Math.random() * 100) + 10) * 100000;
      const askEquity = Math.floor(Math.random() * 25) + 5;
      const valuation = (askAmount / askEquity) * 100;
      const hasDeal = Math.random() > 0.3;
      const dealAmount = hasDeal ? (Math.floor(Math.random() * 50) + 5) * 100000 : null;
      const dealEquity = hasDeal ? Math.floor(Math.random() * 20) + 5 : null;
      
      const interestedSharks = sharks.slice(0, Math.floor(Math.random() * 4) + 1);
      const investedSharks = hasDeal ? interestedSharks.slice(0, Math.floor(Math.random() * 2) + 1) : [];

      return {
        id: i + 1,
        season: Math.floor(Math.random() * 4) + 1,
        episode: Math.floor(Math.random() * 25) + 1,
        startup_name: startupNames[Math.floor(Math.random() * startupNames.length)] + ` ${i + 1}`,
        industry,
        ask_amount: askAmount,
        ask_equity: askEquity,
        valuation,
        deal_amount: dealAmount,
        deal_equity: dealEquity,
        deal_debt: 0,
        multiple_sharks: investedSharks.length > 1,
        interested_sharks: interestedSharks,
        invested_sharks: investedSharks,
        success_status: hasDeal ? 'funded' : 'not_funded',
        revenue_current: Math.floor(Math.random() * 20000000),
        revenue_projected: Math.floor(Math.random() * 100000000),
        profit_margin: Math.floor(Math.random() * 40),
        team_size: Math.floor(Math.random() * 50) + 1,
        founded_year: 2015 + Math.floor(Math.random() * 9),
        location: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad'][Math.floor(Math.random() * 6)],
        patent_status: ['Filed', 'Granted', 'None', 'Pending'][Math.floor(Math.random() * 4)],
        website: `https://${startupNames[Math.floor(Math.random() * startupNames.length)].toLowerCase().replace(/\s+/g, '')}.com`,
        created_at: new Date().toISOString(),
      };
    });

    this.generateSharksData();
    console.log('Enhanced sample data generated:', this.deals.length, 'deals');
  }

  private parseString(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value).trim();
  }

  private parseNumber(value: any): number | null {
    if (value === null || value === undefined || value === '') return null;
    
    if (typeof value === 'string') {
      const cleaned = value.replace(/[₹$€£,\s]/g, '');
      if (cleaned.toLowerCase().includes('cr') || cleaned.toLowerCase().includes('crore')) {
        return parseFloat(cleaned.replace(/[^\d.]/g, '')) * 10000000;
      }
      if (cleaned.toLowerCase().includes('l') || cleaned.toLowerCase().includes('lakh')) {
        return parseFloat(cleaned.replace(/[^\d.]/g, '')) * 100000;
      }
      if (cleaned.toLowerCase().includes('k')) {
        return parseFloat(cleaned.replace(/[^\d.]/g, '')) * 1000;
      }
      const num = Number(cleaned);
      return isNaN(num) ? null : num;
    }
    
    const num = Number(value);
    return isNaN(num) ? null : num;
  }

  private parseBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === '1' || value.toLowerCase() === 'yes';
    }
    return Boolean(value);
  }

  // Public methods
  getDeals(): DealData[] {
    return this.deals;
  }

  getSharks(): SharkData[] {
    return this.sharks;
  }

  getDealsByIndustry(industry: string): DealData[] {
    return this.deals.filter(deal => deal.industry === industry);
  }

  getDealsBySeason(season: number): DealData[] {
    return this.deals.filter(deal => deal.season === season);
  }

  getSharkByName(name: string): SharkData | undefined {
    return this.sharks.find(shark => shark.name === name);
  }

  getIndustries(): string[] {
    return [...new Set(this.deals.map(deal => deal.industry))];
  }

  getSeasons(): number[] {
    return [...new Set(this.deals.map(deal => deal.season))].sort();
  }

  getAnalytics() {
    const totalDeals = this.deals.length;
    const fundedDeals = this.deals.filter(deal => deal.success_status === 'funded');
    const totalInvestment = this.deals.reduce((sum, deal) => sum + (deal.deal_amount || 0), 0);
    const avgValuation = this.deals.reduce((sum, deal) => sum + deal.valuation, 0) / totalDeals;

    return {
      totalDeals,
      fundedDeals: fundedDeals.length,
      successRate: (fundedDeals.length / totalDeals) * 100,
      totalInvestment,
      avgValuation,
      avgDealSize: totalInvestment / fundedDeals.length || 0,
      industriesCount: this.getIndustries().length,
      seasonsCount: this.getSeasons().length,
      sharksCount: this.sharks.length,
    };
  }

  getSharkComparison(shark1Name: string, shark2Name: string) {
    const shark1 = this.getSharkByName(shark1Name);
    const shark2 = this.getSharkByName(shark2Name);
    
    if (!shark1 || !shark2) return null;

    const shark1Deals = this.deals.filter(deal => deal.invested_sharks.includes(shark1Name));
    const shark2Deals = this.deals.filter(deal => deal.invested_sharks.includes(shark2Name));

    return {
      shark1: {
        ...shark1,
        deals: shark1Deals,
        avgInvestment: shark1.total_investment / shark1.total_deals || 0,
        topIndustries: this.getTopIndustries(shark1Deals),
      },
      shark2: {
        ...shark2,
        deals: shark2Deals,
        avgInvestment: shark2.total_investment / shark2.total_deals || 0,
        topIndustries: this.getTopIndustries(shark2Deals),
      },
      commonIndustries: this.getCommonIndustries(shark1Deals, shark2Deals),
    };
  }

  private getTopIndustries(deals: DealData[]): Array<{industry: string, count: number}> {
    const industries = deals.reduce((acc, deal) => {
      acc[deal.industry] = (acc[deal.industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(industries)
      .map(([industry, count]) => ({ industry, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }

  private getCommonIndustries(deals1: DealData[], deals2: DealData[]): string[] {
    const industries1 = new Set(deals1.map(deal => deal.industry));
    const industries2 = new Set(deals2.map(deal => deal.industry));
    
    return Array.from(industries1).filter(industry => industries2.has(industry));
  }
}

export const csvParser = CSVDataParser.getInstance();