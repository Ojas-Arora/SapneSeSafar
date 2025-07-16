import React from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { SeasonSelector } from '../components/SeasonSelector';

export const Trends: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const { deals } = useDealsStore();

  // Calculate real trend data from deals
  const data = React.useMemo(() => {
    const seasonData = deals.reduce((acc: any[], deal) => {
      const season = acc.find(s => s.season === deal.season);
      if (season) {
        season.deals++;
        season.investment += (deal.deal_amount || 0);
      } else {
        acc.push({
          month: `Season ${deal.season}`,
          deals: 1,
          investment: (deal.deal_amount || 0) / 10000000 // Convert to Cr
        });
      }
      return acc;
    }, []);
    
    return seasonData.sort((a, b) => a.month.localeCompare(b.month));
  }, [deals]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Investment Trends</h1>
        <SeasonSelector />
      </div>

      <div className={`p-6 rounded-lg ${
        isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
      } shadow-lg`}>
        <h2 className="text-xl font-bold mb-6">Monthly Trends</h2>
        <LineChart width={800} height={400} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="deals" stroke="#8884d8" />
          <Line type="monotone" dataKey="investment" stroke="#82ca9d" />
        </LineChart>
      </div>

      {/* Add more trend analysis sections */}
    </div>
  );
};