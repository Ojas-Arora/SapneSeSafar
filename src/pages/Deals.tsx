import React from 'react';
import { useDealsStore } from '../store/useDealsStore';
import { useThemeStore } from '../store/useThemeStore';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, DollarSign, Percent, Target } from 'lucide-react';

export const Deals: React.FC = () => {
  const { deals } = useDealsStore();
  const { isDarkMode } = useThemeStore();

  const totalValuation = deals.reduce((acc, deal) => acc + deal.valuation, 0);
  const avgEquity = deals.reduce((acc, deal) => acc + deal.deal_equity, 0) / deals.length;
  const successRate = (deals.filter(deal => deal.success_status === 'funded').length / deals.length) * 100;

  const industryData = deals.reduce((acc: any, deal) => {
    if (!acc[deal.industry]) {
      acc[deal.industry] = {
        name: deal.industry,
        count: 0,
        totalValuation: 0,
      };
    }
    acc[deal.industry].count++;
    acc[deal.industry].totalValuation += deal.valuation;
    return acc;
  }, {});

  const pieData = Object.values(industryData);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const seasonData = deals.reduce((acc: any[], deal) => {
    const season = acc.find(s => s.season === deal.season);
    if (season) {
      season.deals++;
      season.totalValuation += deal.valuation;
    } else {
      acc.push({
        season: deal.season,
        deals: 1,
        totalValuation: deal.valuation,
      });
    }
    return acc;
  }, []).sort((a, b) => a.season - b.season);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`p-6 rounded-lg ${
          isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <span className="text-sm text-gray-500">Total Deals</span>
          </div>
          <div className="text-3xl font-bold">{deals.length}</div>
        </div>

        <div className={`p-6 rounded-lg ${
          isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 text-green-500" />
            <span className="text-sm text-gray-500">Total Valuation</span>
          </div>
          <div className="text-3xl font-bold">₹{(totalValuation / 10000000).toFixed(1)}Cr</div>
        </div>

        <div className={`p-6 rounded-lg ${
          isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <Percent className="h-8 w-8 text-yellow-500" />
            <span className="text-sm text-gray-500">Avg Equity</span>
          </div>
          <div className="text-3xl font-bold">{avgEquity.toFixed(1)}%</div>
        </div>

        <div className={`p-6 rounded-lg ${
          isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8 text-red-500" />
            <span className="text-sm text-gray-500">Success Rate</span>
          </div>
          <div className="text-3xl font-bold">{successRate.toFixed(1)}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-lg ${
          isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
        } shadow-lg`}>
          <h2 className="text-xl font-bold mb-6">Industry Distribution</h2>
          <div className="flex justify-center">
            <PieChart width={400} height={400}>
              <Pie
                data={pieData}
                cx={200}
                cy={200}
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="count"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((_, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        <div className={`p-6 rounded-lg ${
          isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
        } shadow-lg`}>
          <h2 className="text-xl font-bold mb-6">Season Trends</h2>
          <LineChart
            width={500}
            height={400}
            data={seasonData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="season" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="deals"
              stroke="#8884d8"
              name="Number of Deals"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="totalValuation"
              stroke="#82ca9d"
              name="Total Valuation"
            />
          </LineChart>
        </div>
      </div>

      <div className={`p-6 rounded-lg ${
        isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
      } shadow-lg`}>
        <h2 className="text-xl font-bold mb-6">Recent Deals</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-4">Startup</th>
                <th className="pb-4">Industry</th>
                <th className="pb-4">Ask Amount</th>
                <th className="pb-4">Equity</th>
                <th className="pb-4">Valuation</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {deals.slice(0, 10).map((deal) => (
                <tr key={deal.id} className="border-t">
                  <td className="py-4">{deal.startup_name}</td>
                  <td className="py-4">{deal.industry}</td>
                  <td className="py-4">₹{(deal.ask_amount / 10000000).toFixed(1)}Cr</td>
                  <td className="py-4">{deal.ask_equity}%</td>
                  <td className="py-4">₹{(deal.valuation / 10000000).toFixed(1)}Cr</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      deal.success_status === 'funded'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {deal.success_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};