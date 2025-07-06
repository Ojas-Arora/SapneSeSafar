import React from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { SeasonSelector } from '../components/SeasonSelector';

export const Startups: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  const startups = [
    {
      name: "TechInnovate",
      industry: "Technology",
      valuation: "₹10Cr",
      growth: "+150%",
      status: "Funded"
    },
    {
      name: "HealthFirst",
      industry: "Healthcare",
      valuation: "₹8Cr",
      growth: "+120%",
      status: "Funded"
    },
    // Add more startups...
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Startup Analysis</h1>
        <SeasonSelector />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {startups.map((startup, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg ${
              isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
            } shadow-lg`}
          >
            <h2 className="text-xl font-bold mb-4">{startup.name}</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Industry</span>
                <span>{startup.industry}</span>
              </div>
              <div className="flex justify-between">
                <span>Valuation</span>
                <span>{startup.valuation}</span>
              </div>
              <div className="flex justify-between">
                <span>Growth</span>
                <span className="text-green-500">{startup.growth}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                  {startup.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add more startup analysis sections */}
    </div>
  );
};