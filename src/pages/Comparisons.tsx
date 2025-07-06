import React, { useState, useMemo } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { useDealsStore } from '../store/useDealsStore';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, DollarSign, Target, Award, Users, BarChart3, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Comparisons: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const { sharks, getSharkComparison } = useDealsStore();
  const [selectedShark1, setSelectedShark1] = useState('');
  const [selectedShark2, setSelectedShark2] = useState('');

  const comparison = useMemo(() => {
    if (!selectedShark1 || !selectedShark2) return null;
    return getSharkComparison(selectedShark1, selectedShark2);
  }, [selectedShark1, selectedShark2, getSharkComparison]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
          Shark Comparisons
        </h1>
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Compare investment strategies and performance metrics
        </p>
      </motion.div>

      {/* Shark Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-6 md:p-8 rounded-2xl md:rounded-3xl backdrop-blur-xl border ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700/50' 
            : 'bg-white/50 border-gray-200/50'
        } shadow-xl`}
      >
        <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center">
          <Users className="h-6 w-6 mr-2 text-blue-500" />
          Select Sharks to Compare
        </h2>
        
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium mb-2">First Shark</label>
            <select
              value={selectedShark1}
              onChange={(e) => setSelectedShark1(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                isDarkMode
                  ? 'bg-gray-700/50 border-gray-600/50 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            >
              <option value="">Select First Shark</option>
              {sharks.map(shark => (
                <option key={shark.id} value={shark.name} disabled={shark.name === selectedShark2}>
                  {shark.name}
                </option>
              ))}
            </select>
          </div>

          <motion.div
            animate={{ rotate: [0, 180, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex-shrink-0"
          >
            <ArrowRight className="h-6 w-6 text-blue-500" />
          </motion.div>

          <div className="flex-1 w-full">
            <label className="block text-sm font-medium mb-2">Second Shark</label>
            <select
              value={selectedShark2}
              onChange={(e) => setSelectedShark2(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                isDarkMode
                  ? 'bg-gray-700/50 border-gray-600/50 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            >
              <option value="">Select Second Shark</option>
              {sharks.map(shark => (
                <option key={shark.id} value={shark.name} disabled={shark.name === selectedShark1}>
                  {shark.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Comparison Results */}
      {comparison && (
        <div className="space-y-6 md:space-y-8">
          {/* Overview Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
          >
            {/* Shark 1 Card */}
            <div className={`p-6 md:p-8 rounded-2xl md:rounded-3xl backdrop-blur-xl border ${
              isDarkMode 
                ? 'bg-blue-500/10 border-blue-500/30' 
                : 'bg-blue-50 border-blue-200'
            } shadow-xl`}>
              <div className="flex items-center mb-6">
                <img
                  src={comparison.shark1.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(comparison.shark1.name)}&background=3B82F6&color=fff&size=80`}
                  alt={comparison.shark1.name}
                  className="w-16 h-16 rounded-full mr-4 ring-4 ring-blue-500/30"
                />
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-blue-500">{comparison.shark1.name}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {comparison.shark1.expertise?.[0] || 'Investment Expert'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                  <div className="text-2xl font-bold text-blue-500">{comparison.shark1.total_deals}</div>
                  <div className="text-sm text-gray-500">Total Deals</div>
                </div>
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                  <div className="text-2xl font-bold text-green-500">
                    ₹{(comparison.shark1.total_investment / 10000000).toFixed(1)}Cr
                  </div>
                  <div className="text-sm text-gray-500">Investment</div>
                </div>
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                  <div className="text-2xl font-bold text-purple-500">
                    {comparison.shark1.success_rate?.toFixed(1) || 0}%
                  </div>
                  <div className="text-sm text-gray-500">Success Rate</div>
                </div>
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                  <div className="text-2xl font-bold text-orange-500">
                    ₹{(comparison.shark1.avgInvestment / 10000000).toFixed(1)}Cr
                  </div>
                  <div className="text-sm text-gray-500">Avg Deal</div>
                </div>
              </div>
            </div>

            {/* Shark 2 Card */}
            <div className={`p-6 md:p-8 rounded-2xl md:rounded-3xl backdrop-blur-xl border ${
              isDarkMode 
                ? 'bg-purple-500/10 border-purple-500/30' 
                : 'bg-purple-50 border-purple-200'
            } shadow-xl`}>
              <div className="flex items-center mb-6">
                <img
                  src={comparison.shark2.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(comparison.shark2.name)}&background=8B5CF6&color=fff&size=80`}
                  alt={comparison.shark2.name}
                  className="w-16 h-16 rounded-full mr-4 ring-4 ring-purple-500/30"
                />
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-purple-500">{comparison.shark2.name}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {comparison.shark2.expertise?.[0] || 'Investment Expert'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                  <div className="text-2xl font-bold text-purple-500">{comparison.shark2.total_deals}</div>
                  <div className="text-sm text-gray-500">Total Deals</div>
                </div>
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                  <div className="text-2xl font-bold text-green-500">
                    ₹{(comparison.shark2.total_investment / 10000000).toFixed(1)}Cr
                  </div>
                  <div className="text-sm text-gray-500">Investment</div>
                </div>
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                  <div className="text-2xl font-bold text-purple-500">
                    {comparison.shark2.success_rate?.toFixed(1) || 0}%
                  </div>
                  <div className="text-sm text-gray-500">Success Rate</div>
                </div>
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                  <div className="text-2xl font-bold text-orange-500">
                    ₹{(comparison.shark2.avgInvestment / 10000000).toFixed(1)}Cr
                  </div>
                  <div className="text-sm text-gray-500">Avg Deal</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Detailed Comparison Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Investment Comparison Chart */}
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
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <BarChart3 className="h-6 w-6 mr-2 text-blue-500" />
                Investment Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  {
                    name: 'Total Deals',
                    [comparison.shark1.name]: comparison.shark1.total_deals,
                    [comparison.shark2.name]: comparison.shark2.total_deals,
                  },
                  {
                    name: 'Investment (Cr)',
                    [comparison.shark1.name]: comparison.shark1.total_investment / 10000000,
                    [comparison.shark2.name]: comparison.shark2.total_investment / 10000000,
                  },
                  {
                    name: 'Success Rate',
                    [comparison.shark1.name]: comparison.shark1.success_rate || 0,
                    [comparison.shark2.name]: comparison.shark2.success_rate || 0,
                  }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={comparison.shark1.name} fill="#3B82F6" />
                  <Bar dataKey={comparison.shark2.name} fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Industry Preferences */}
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
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Target className="h-6 w-6 mr-2 text-purple-500" />
                Industry Preferences
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blue-500 mb-2">{comparison.shark1.name}</h4>
                  <div className="space-y-2">
                    {comparison.shark1.topIndustries?.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{item.industry}</span>
                        <span className="text-sm font-semibold">{item.count} deals</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-purple-500 mb-2">{comparison.shark2.name}</h4>
                  <div className="space-y-2">
                    {comparison.shark2.topIndustries?.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{item.industry}</span>
                        <span className="text-sm font-semibold">{item.count} deals</span>
                      </div>
                    ))}
                  </div>
                </div>

                {comparison.commonIndustries?.length > 0 && (
                  <div className={`p-4 rounded-xl ${
                    isDarkMode ? 'bg-green-500/20 border border-green-500/30' : 'bg-green-50 border border-green-200'
                  }`}>
                    <h4 className="font-semibold text-green-500 mb-2">Common Industries</h4>
                    <div className="flex flex-wrap gap-2">
                      {comparison.commonIndustries.map((industry: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-green-500/20 text-green-500 rounded-lg text-xs">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Investment Styles & Expertise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className={`p-6 md:p-8 rounded-2xl md:rounded-3xl backdrop-blur-xl border ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-white/50 border-gray-200/50'
            } shadow-xl`}
          >
            <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center">
              <Zap className="h-6 w-6 mr-2 text-yellow-500" />
              Investment Styles & Expertise
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-blue-500 mb-4">{comparison.shark1.name}</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">Expertise</h5>
                    <div className="flex flex-wrap gap-2">
                      {comparison.shark1.expertise?.map((skill: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Investment Style</h5>
                    <div className="flex flex-wrap gap-2">
                      {comparison.shark1.investment_style?.map((style: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-sm border border-blue-500/30">
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                  {comparison.shark1.bio && (
                    <div>
                      <h5 className="font-medium mb-2">Background</h5>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {comparison.shark1.bio}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-purple-500 mb-4">{comparison.shark2.name}</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">Expertise</h5>
                    <div className="flex flex-wrap gap-2">
                      {comparison.shark2.expertise?.map((skill: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-500 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Investment Style</h5>
                    <div className="flex flex-wrap gap-2">
                      {comparison.shark2.investment_style?.map((style: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-sm border border-purple-500/30">
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                  {comparison.shark2.bio && (
                    <div>
                      <h5 className="font-medium mb-2">Background</h5>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {comparison.shark2.bio}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Empty State */}
      {!selectedShark1 || !selectedShark2 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className={`p-12 rounded-3xl backdrop-blur-xl border-2 border-dashed ${
            isDarkMode 
              ? 'border-gray-600 bg-gray-800/30' 
              : 'border-gray-300 bg-gray-50/30'
          } text-center`}
        >
          <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold mb-2">Select Two Sharks to Compare</h3>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Choose two sharks from the dropdowns above to see detailed comparison analytics
          </p>
        </motion.div>
      ) : null}
    </div>
  );
};