import React from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { SeasonSelector } from '../components/SeasonSelector';

export const Trends: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  const data = [
    { month: 'Jan', deals: 12, investment: 150 },
    { month: 'Feb', deals: 15, investment: 180 },
    { month: 'Mar', deals: 18, investment: 220 },
    { month: 'Apr', deals: 16, investment: 190 },
    { month: 'May', deals: 22, investment: 280 },
    { month: 'Jun', deals: 25, investment: 310 },
  ];

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