import React from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { SeasonSelector } from '../components/SeasonSelector';

export const Insights: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  const insights = [
    {
      title: "Investment Patterns",
      description: "Analysis of investment trends and patterns",
      stats: {
        avgDealSize: "₹1.5Cr",
        topIndustry: "Technology",
        growthRate: "45%"
      }
    },
    {
      title: "Startup Success Factors",
      description: "Key factors contributing to startup success",
      stats: {
        marketFit: "85%",
        teamExperience: "8+ years",
        scalability: "High"
      }
    },
    {
      title: "Shark Preferences",
      description: "Understanding shark investment preferences",
      stats: {
        preferredStage: "Growth",
        equityRange: "5-15%",
        industryFocus: "D2C"
      }
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Market Insights</h1>
        <SeasonSelector />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg ${
              isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
            } shadow-lg`}
          >
            <h2 className="text-xl font-bold mb-4">{insight.title}</h2>
            <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {insight.description}
            </p>
            <div className="space-y-2">
              {Object.entries(insight.stats).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-500">{key}</span>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add more sections as needed */}
    </div>
  );
};