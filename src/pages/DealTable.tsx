import React, { useState, useMemo } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { useDealsStore } from '../store/useDealsStore';
import { motion } from 'framer-motion';
import { Search, Download, ArrowUpDown, Eye } from 'lucide-react';

export const DealTable: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const { deals } = useDealsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    season: 'all',
    status: 'all',
    industry: 'all',
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'valuation',
    direction: 'desc',
  });

  // Filter and sort deals
  const filteredDeals = useMemo(() => {
    return deals
      .filter(deal => {
        const matchesSearch = 
          deal.startup_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.industry.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilters =
          (filters.season === 'all' || deal.season.toString() === filters.season) &&
          (filters.status === 'all' || deal.success_status === filters.status) &&
          (filters.industry === 'all' || deal.industry === filters.industry);

        return matchesSearch && matchesFilters;
      })
      .sort((a, b) => {
        if (sortConfig.key === 'valuation') {
          return sortConfig.direction === 'asc' 
            ? a.valuation - b.valuation
            : b.valuation - a.valuation;
        }
        return 0;
      });
  }, [deals, searchTerm, filters, sortConfig]);

  // Get unique values for filters
  const industries = [...new Set(deals.map(deal => deal.industry))];
  const seasons = [...new Set(deals.map(deal => deal.season))];

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const exportToCSV = () => {
    const headers = ['Startup', 'Industry', 'Ask Amount', 'Equity', 'Valuation', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredDeals.map(deal => [
        deal.startup_name,
        deal.industry,
        deal.ask_amount,
        deal.ask_equity,
        deal.valuation,
        deal.success_status,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'shark_tank_deals.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Deal Database</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToCSV}
          className={`flex items-center px-4 py-2 rounded-lg ${
            isDarkMode
              ? 'bg-[#17BEBB] hover:bg-opacity-90'
              : 'bg-[#5D87FF] hover:bg-opacity-90'
          } text-white`}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by startup or industry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              isDarkMode
                ? 'bg-[#1E2A3B] text-white'
                : 'bg-white text-gray-900'
            } border border-gray-300 focus:outline-none focus:ring-2`}
          />
        </div>
        
        <div className="flex gap-4">
          <select
            value={filters.season}
            onChange={(e) => setFilters(prev => ({ ...prev, season: e.target.value }))}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
            } border border-gray-300`}
          >
            <option value="all">All Seasons</option>
            {seasons.map(season => (
              <option key={season} value={season}>Season {season}</option>
            ))}
          </select>

          <select
            value={filters.industry}
            onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
            } border border-gray-300`}
          >
            <option value="all">All Industries</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
            } border border-gray-300`}
          >
            <option value="all">All Statuses</option>
            <option value="funded">Funded</option>
            <option value="not_funded">Not Funded</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-lg ${
        isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
      } shadow-lg overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${
                isDarkMode ? 'bg-[#0D1B2A]' : 'bg-gray-50'
              }`}>
                <th className="px-6 py-4 text-left">Startup</th>
                <th className="px-6 py-4 text-left">Industry</th>
                <th className="px-6 py-4 text-left cursor-pointer" onClick={() => handleSort('ask_amount')}>
                  <div className="flex items-center">
                    Ask Amount
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left">Equity</th>
                <th className="px-6 py-4 text-left cursor-pointer" onClick={() => handleSort('valuation')}>
                  <div className="flex items-center">
                    Valuation
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal) => (
                <motion.tr
                  key={deal.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`border-t ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <td className="px-6 py-4">{deal.startup_name}</td>
                  <td className="px-6 py-4">{deal.industry}</td>
                  <td className="px-6 py-4">₹{(deal.ask_amount / 10000000).toFixed(1)}Cr</td>
                  <td className="px-6 py-4">{deal.ask_equity}%</td>
                  <td className="px-6 py-4">₹{(deal.valuation / 10000000).toFixed(1)}Cr</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      deal.success_status === 'funded'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {deal.success_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className={`p-2 rounded-full ${
                      isDarkMode ? 'hover:bg-[#0D1B2A]' : 'hover:bg-gray-100'
                    }`}>
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};