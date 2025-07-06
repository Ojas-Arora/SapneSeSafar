import React, { useState } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Users, DollarSign, Star, Award, Calendar, MapPin } from 'lucide-react';

export const SuccessStories: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Unicorns', 'IPO Ready', 'Acquired', 'Expanding'];

  const successStories = [
    {
      id: 1,
      company: 'BoAt',
      founder: 'Aman Gupta',
      category: 'Unicorns',
      valuation: '₹2,000Cr',
      growth: '+500%',
      story: 'From a small audio accessories brand to India\'s leading consumer electronics company',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      metrics: {
        revenue: '₹3,000Cr',
        employees: '500+',
        markets: '15 Countries'
      },
      timeline: [
        { year: '2016', event: 'Company Founded' },
        { year: '2018', event: 'First Major Investment' },
        { year: '2020', event: 'Market Leader' },
        { year: '2023', event: 'Unicorn Status' }
      ]
    },
    {
      id: 2,
      company: 'Lenskart',
      founder: 'Peyush Bansal',
      category: 'IPO Ready',
      valuation: '₹24,000Cr',
      growth: '+300%',
      story: 'Revolutionizing eyewear retail with technology and customer-first approach',
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400',
      metrics: {
        revenue: '₹4,000Cr',
        employees: '10,000+',
        markets: '20 Countries'
      },
      timeline: [
        { year: '2010', event: 'Company Founded' },
        { year: '2015', event: 'Omnichannel Strategy' },
        { year: '2020', event: 'International Expansion' },
        { year: '2023', event: 'IPO Preparation' }
      ]
    }
  ];

  const filteredStories = selectedCategory === 'All' 
    ? successStories 
    : successStories.filter(story => story.category === selectedCategory);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent">
          Success Stories
        </h1>
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Inspiring journeys from pitch to unicorn status
        </p>
      </motion.div>

      {/* Category Filter */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-2xl whitespace-nowrap font-semibold transition-all ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white shadow-lg'
                : isDarkMode
                ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* Success Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Trophy, label: 'Success Rate', value: '78%', color: 'text-yellow-500' },
          { icon: DollarSign, label: 'Total Valuation', value: '₹50,000Cr', color: 'text-green-500' },
          { icon: Users, label: 'Jobs Created', value: '50,000+', color: 'text-blue-500' },
          { icon: TrendingUp, label: 'Avg Growth', value: '+400%', color: 'text-purple-500' }
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
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
              <metric.icon className={`h-8 w-8 ${metric.color}`} />
              <span className="text-sm text-gray-500">{metric.label}</span>
            </div>
            <div className="text-3xl font-bold">{metric.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Success Stories Grid */}
      <div className="space-y-8">
        {filteredStories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className={`p-8 rounded-3xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white'
            } shadow-xl backdrop-blur-xl border ${
              isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{story.company}</h2>
                    <p className="text-lg text-gray-500 mb-4">Founded by {story.founder}</p>
                    <div className="flex items-center space-x-4 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        story.category === 'Unicorns' ? 'bg-purple-500/20 text-purple-500' :
                        story.category === 'IPO Ready' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-green-500/20 text-green-500'
                      }`}>
                        {story.category}
                      </span>
                      <div className="flex items-center text-green-500">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="font-semibold">{story.growth}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-500">{story.valuation}</div>
                    <div className="text-sm text-gray-500">Current Valuation</div>
                  </div>
                </div>

                <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {story.story}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {Object.entries(story.metrics).map(([key, value]) => (
                    <div key={key} className={`p-4 rounded-xl ${
                      isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100'
                    }`}>
                      <div className="text-lg font-bold">{value}</div>
                      <div className="text-sm text-gray-500 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Journey Timeline
                </h3>
                <div className="space-y-4">
                  {story.timeline.map((milestone, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 flex items-center justify-center text-white text-sm font-bold mr-4 flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{milestone.year}</div>
                        <div className="text-sm text-gray-500">{milestone.event}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-yellow-500/20 to-red-500/20 border border-yellow-500/30">
                  <div className="flex items-center mb-2">
                    <Award className="h-4 w-4 mr-2 text-yellow-500" />
                    <span className="font-semibold text-yellow-500">Achievement</span>
                  </div>
                  <p className="text-sm">Market leader in their category with sustainable growth</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};