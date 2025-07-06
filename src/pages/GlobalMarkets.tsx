import React, { useState } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, DollarSign, Users, BarChart3, Map, Flag, Award } from 'lucide-react';

export const GlobalMarkets: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const [selectedRegion, setSelectedRegion] = useState('Asia');

  const regions = [
    {
      name: 'Asia',
      countries: ['India', 'China', 'Japan', 'Singapore', 'South Korea'],
      totalInvestment: '₹2,500Cr',
      deals: 450,
      growth: '+45%',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'North America',
      countries: ['USA', 'Canada', 'Mexico'],
      totalInvestment: '$5.2B',
      deals: 1200,
      growth: '+32%',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Europe',
      countries: ['UK', 'Germany', 'France', 'Netherlands'],
      totalInvestment: '€3.8B',
      deals: 890,
      growth: '+28%',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Global Shark Tank Markets
        </h1>
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Worldwide investment trends and market analysis
        </p>
      </motion.div>

      {/* Region Selector */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {regions.map((region) => (
          <motion.button
            key={region.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedRegion(region.name)}
            className={`px-6 py-3 rounded-2xl whitespace-nowrap font-semibold transition-all ${
              selectedRegion === region.name
                ? `bg-gradient-to-r ${region.color} text-white shadow-lg`
                : isDarkMode
                ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {region.name}
          </motion.button>
        ))}
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Globe, label: 'Global Markets', value: '50+', color: 'text-blue-500' },
          { icon: DollarSign, label: 'Total Investment', value: '$15.2B', color: 'text-green-500' },
          { icon: Users, label: 'Active Sharks', value: '200+', color: 'text-purple-500' },
          { icon: TrendingUp, label: 'Growth Rate', value: '+38%', color: 'text-orange-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-2xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white'
            } shadow-lg backdrop-blur-xl border ${
              isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <span className="text-sm text-gray-500">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Interactive World Map Placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-8 rounded-3xl ${
          isDarkMode ? 'bg-slate-800/50' : 'bg-white'
        } shadow-xl backdrop-blur-xl border ${
          isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Map className="h-6 w-6 mr-2 text-blue-500" />
          Interactive Investment Map
        </h2>
        <div className="h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <Globe className="h-16 w-16 mx-auto mb-4 text-blue-500" />
            <p className="text-lg font-semibold">Interactive World Map</p>
            <p className="text-gray-500">Click regions to explore markets</p>
          </div>
        </div>
      </motion.div>

      {/* Regional Details */}
      {selectedRegion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {regions
            .filter(region => region.name === selectedRegion)
            .map(region => (
              <React.Fragment key={region.name}>
                <div className={`p-6 rounded-2xl ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white'
                } shadow-lg`}>
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Flag className="h-5 w-5 mr-2" />
                    {region.name} Overview
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Investment</span>
                      <span className="font-bold text-green-500">{region.totalInvestment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Deals</span>
                      <span className="font-bold">{region.deals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth Rate</span>
                      <span className="font-bold text-blue-500">{region.growth}</span>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white'
                } shadow-lg`}>
                  <h3 className="text-xl font-bold mb-4">Top Countries</h3>
                  <div className="space-y-3">
                    {region.countries.map((country, index) => (
                      <div key={country} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${region.color} flex items-center justify-center text-white font-bold text-sm mr-3`}>
                            {index + 1}
                          </div>
                          <span>{country}</span>
                        </div>
                        <Award className="h-4 w-4 text-yellow-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            ))}
        </motion.div>
      )}
    </div>
  );
};