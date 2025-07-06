import React from 'react';
import { useDealsStore } from '../store/useDealsStore';
import { useThemeStore } from '../store/useThemeStore';

export const SeasonSelector: React.FC = () => {
  const { selectedSeason, setSelectedSeason } = useDealsStore();
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`inline-block ${
      isDarkMode ? 'text-[#E0E0E0]' : 'text-[#5D87FF]'
    }`}>
      <select
        value={selectedSeason}
        onChange={(e) => setSelectedSeason(Number(e.target.value))}
        className={`px-4 py-2 rounded-lg appearance-none ${
          isDarkMode 
            ? 'bg-[#1E2A3B] border-[#17BEBB]' 
            : 'bg-white border-[#5D87FF]'
        } border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50`}
      >
        <option value={1}>Season 1</option>
        <option value={2}>Season 2</option>
        <option value={3}>Season 3</option>
        <option value={4}>Season 4</option>
      </select>
    </div>
  );
};