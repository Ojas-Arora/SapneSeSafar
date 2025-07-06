import React, { useState, useMemo } from 'react';
import { useDealsStore } from '../store/useDealsStore';
import { useThemeStore } from '../store/useThemeStore';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Award, Eye, Filter, Search, Star } from 'lucide-react';

export const Sharks: React.FC = () => {
  const { sharks, deals } = useDealsStore();
  const { isDarkMode } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('total_investment');
  const [selectedShark, setSelectedShark] = useState<string | null>(null);

  const filteredSharks = useMemo(() => {
    return sharks
      .filter(shark => 
        shark.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'total_deals':
            return b.total_deals - a.total_deals;
          case 'total_investment':
            return b.total_investment - a.total_investment;
          case 'success_rate':
            return (b.success_rate || 0) - (a.success_rate || 0);
          case 'avg_deal_size':
            return (b.avg_deal_size || 0) - (a.avg_deal_size || 0);
          default:
            return 0;
        }
      });
  }, [sharks, searchTerm, sortBy]);

  const chartData = filteredSharks.map((shark) => ({
    name: shark.name.split(' ')[0], // First name for better chart readability
    deals: shark.total_deals,
    investment: shark.total_investment / 10000000, // Convert to Cr
    success_rate: shark.success_rate || 0,
  }));

  const totalStats = useMemo(() => {
    return {
      totalSharks: sharks.length,
      totalDeals: sharks.reduce((acc, shark) => acc + shark.total_deals, 0),
      totalInvestment: sharks.reduce((acc, shark) => acc + shark.total_investment, 0),
      avgSuccessRate: sharks.reduce((acc, shark) => acc + (shark.success_rate || 0), 0) / sharks.length,
    };
  }, [sharks]);

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'];

  const getSharkDeals = (sharkName: string) => {
    return deals.filter(deal => deal.invested_sharks.includes(sharkName));
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Shark Profiles & Analytics
        </h1>
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Deep dive into each shark's investment strategy and performance
        </p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-2xl backdrop-blur-xl border ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50' 
            : 'bg-white/50 border-gray-200/50'
        } shadow-xl`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sharks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                isDarkMode
                  ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-3 rounded-xl border transition-all ${
                isDarkMode
                  ? 'bg-gray-700/50 border-gray-600/50 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            >
              <option value="total_investment">Total Investment</option>
              <option value="total_deals">Total Deals</option>
              <option value="success_rate">Success Rate</option>
              <option value="avg_deal_size">Avg Deal Size</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { 
            icon: Users, 
            label: 'Total Sharks', 
            value: totalStats.totalSharks.toString(), 
            color: 'text-blue-500',
            bg: 'from-blue-500 to-cyan-500'
          },
          { 
            icon: TrendingUp, 
            label: 'Total Deals', 
            value: totalStats.totalDeals.toString(), 
            color: 'text-green-500',
            bg: 'from-green-500 to-emerald-500'
          },
          { 
            icon: DollarSign, 
            label: 'Total Investment', 
            value: `₹${(totalStats.totalInvestment / 10000000).toFixed(1)}Cr`, 
            color: 'text-yellow-500',
            bg: 'from-yellow-500 to-orange-500'
          },
          { 
            icon: Award, 
            label: 'Avg Success Rate', 
            value: `${totalStats.avgSuccessRate.toFixed(1)}%`, 
            color: 'text-purple-500',
            bg: 'from-purple-500 to-pink-500'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className={`p-4 md:p-6 rounded-2xl backdrop-blur-xl border ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-white/50 border-gray-200/50'
            } shadow-xl`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.bg}`}>
                <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <span className="text-xs md:text-sm text-gray-500">{stat.label}</span>
            </div>
            <div className="text-xl md:text-3xl font-bold">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Investment Analysis Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className={`p-6 rounded-2xl backdrop-blur-xl border ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50' 
              : 'bg-white/50 border-gray-200/50'
          } shadow-xl`}
        >
          <h2 className="text-xl font-bold mb-6">Investment Analysis</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="deals" fill="#3B82F6" name="Total Deals" />
              <Bar yAxisId="right" dataKey="investment" fill="#10B981" name="Investment (Cr)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Success Rate Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className={`p-6 rounded-2xl backdrop-blur-xl border ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50' 
              : 'bg-white/50 border-gray-200/50'
          } shadow-xl`}
        >
          <h2 className="text-xl font-bold mb-6">Success Rate Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, success_rate }) => `${name}: ${success_rate.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="success_rate"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Shark Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredSharks.map((shark, index) => {
          const sharkDeals = getSharkDeals(shark.name);
          const topIndustry = shark.preferred_industries?.[0] || 'General';
          
          return (
            <motion.div
              key={shark.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 cursor-pointer ${
                selectedShark === shark.name
                  ? isDarkMode
                    ? 'bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/20'
                    : 'bg-purple-50 border-purple-300 shadow-lg shadow-purple-500/20'
                  : isDarkMode 
                    ? 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50' 
                    : 'bg-white/50 border-gray-200/50 hover:border-gray-300/50'
              } shadow-xl hover:shadow-2xl`}
              onClick={() => setSelectedShark(selectedShark === shark.name ? null : shark.name)}
            >
              {/* Shark Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <img
                    src={shark.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(shark.name)}&background=random&size=80`}
                    alt={shark.name}
                    className="w-16 h-16 rounded-full ring-4 ring-purple-500/30"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <Star className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{shark.name}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {topIndustry} Expert
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.floor((shark.success_rate || 0) / 20) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      {(shark.success_rate || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
                  <div className="text-lg font-bold text-blue-500">{shark.total_deals}</div>
                  <div className="text-xs text-gray-500">Total Deals</div>
                </div>
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
                  <div className="text-lg font-bold text-green-500">
                    ₹{(shark.total_investment / 10000000).toFixed(1)}Cr
                  </div>
                  <div className="text-xs text-gray-500">Investment</div>
                </div>
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
                  <div className="text-lg font-bold text-purple-500">
                    {(shark.success_rate || 0).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">Success Rate</div>
                </div>
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
                  <div className="text-lg font-bold text-orange-500">
                    ₹{((shark.avg_deal_size || 0) / 10000000).toFixed(1)}Cr
                  </div>
                  <div className="text-xs text-gray-500">Avg Deal</div>
                </div>
              </div>

              {/* Expertise Tags */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Expertise</h4>
                <div className="flex flex-wrap gap-1">
                  {shark.expertise?.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-500 rounded-lg text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expand Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                {selectedShark === shark.name ? 'Hide Details' : 'View Details'}
              </motion.button>

              {/* Expanded Details */}
              {selectedShark === shark.name && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-gray-200/20"
                >
                  {shark.bio && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Background</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {shark.bio}
                      </p>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Investment Style</h4>
                    <div className="flex flex-wrap gap-1">
                      {shark.investment_style?.map((style, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded-lg text-xs">
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Preferred Industries</h4>
                    <div className="flex flex-wrap gap-1">
                      {shark.preferred_industries?.map((industry, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-500 rounded-lg text-xs">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Recent Deals ({sharkDeals.length})</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {sharkDeals.slice(0, 3).map((deal, idx) => (
                        <div key={idx} className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/30'}`}>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{deal.startup_name}</span>
                            <span className="text-xs text-green-500">₹{(deal.deal_amount || 0) / 10000000}Cr</span>
                          </div>
                          <div className="text-xs text-gray-500">{deal.industry}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};