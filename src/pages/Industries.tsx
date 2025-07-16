import React from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { SeasonSelector } from '../components/SeasonSelector';

export const Industries: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const { deals } = useDealsStore();

  // Calculate real industry data from deals
  const industries = React.useMemo(() => {
    const industryMap = deals.reduce((acc: any, deal) => {
      if (!acc[deal.industry]) {
        acc[deal.industry] = {
          name: deal.industry,
          deals: 0,
          totalInvestment: 0,
          totalValuation: 0,
          fundedDeals: 0
        };
      }
      acc[deal.industry].deals++;
      acc[deal.industry].totalInvestment += (deal.deal_amount || 0);
      acc[deal.industry].totalValuation += deal.valuation;
      if (deal.success_status === 'funded') {
        acc[deal.industry].fundedDeals++;
      }
      return acc;
    }, {});

    return Object.values(industryMap).map((industry: any) => ({
      name: industry.name,
      deals: industry.deals,
      totalInvestment: `₹${(industry.totalInvestment / 10000000).toFixed(1)}Cr`,
      avgValuation: `₹${(industry.totalValuation / industry.deals / 10000000).toFixed(1)}Cr`,
      growth: `${((industry.fundedDeals / industry.deals) * 100).toFixed(0)}%`
    }));
  }, [deals]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Industry Analysis</h1>
        <SeasonSelector />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industries.map((industry, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg ${
              isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
            } shadow-lg`}
          >
            <h2 className="text-xl font-bold mb-4">{industry.name}</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Deals</span>
                <span>{industry.deals}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Investment</span>
                <span>{industry.totalInvestment}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Valuation</span>
                <span>{industry.avgValuation}</span>
              </div>
              <div className="flex justify-between">
                <span>Growth</span>
                <span className="text-green-500">{industry.growth}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add more industry analysis sections */}
    </div>
  );
};