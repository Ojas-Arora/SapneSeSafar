import React, { useState } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { motion } from 'framer-motion';
import { Camera, Upload, Play, Brain, BarChart3, Eye, Mic, Target, Award, Zap } from 'lucide-react';

export const PitchAnalyzer: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const [analysisResults, setAnalysisResults] = useState(null);

  const analysisMetrics = [
    { label: 'Confidence Level', value: 85, color: 'text-green-500' },
    { label: 'Clarity Score', value: 78, color: 'text-blue-500' },
    { label: 'Engagement Factor', value: 92, color: 'text-purple-500' },
    { label: 'Persuasion Index', value: 88, color: 'text-orange-500' }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          AI Pitch Analyzer
        </h1>
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Advanced video analysis for perfect pitches
        </p>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-8 rounded-3xl ${
          isDarkMode ? 'bg-slate-800/50' : 'bg-white'
        } shadow-xl backdrop-blur-xl border-2 border-dashed ${
          isDarkMode ? 'border-slate-600' : 'border-gray-300'
        }`}
      >
        <div className="text-center">
          <Camera className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-4">Upload Your Pitch Video</h2>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Our AI will analyze your presentation, body language, and speech patterns
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-semibold"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Video
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center px-6 py-3 rounded-2xl font-semibold border-2 ${
                isDarkMode 
                  ? 'border-slate-600 text-gray-300 hover:bg-slate-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Camera className="h-5 w-5 mr-2" />
              Record Live
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-2xl ${
            isDarkMode ? 'bg-slate-800/50' : 'bg-white'
          } shadow-lg`}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-blue-500" />
            Analysis Metrics
          </h3>
          <div className="space-y-6">
            {analysisMetrics.map((metric, index) => (
              <div key={metric.label}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{metric.label}</span>
                  <span className={`font-bold ${metric.color}`}>{metric.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ delay: index * 0.2, duration: 1 }}
                    className={`h-2 rounded-full bg-gradient-to-r ${
                      metric.color.includes('green') ? 'from-green-400 to-green-600' :
                      metric.color.includes('blue') ? 'from-blue-400 to-blue-600' :
                      metric.color.includes('purple') ? 'from-purple-400 to-purple-600' :
                      'from-orange-400 to-orange-600'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-2xl ${
            isDarkMode ? 'bg-slate-800/50' : 'bg-white'
          } shadow-lg`}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <Brain className="h-6 w-6 mr-2 text-purple-500" />
            AI Insights
          </h3>
          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${
              isDarkMode ? 'bg-green-500/20 border border-green-500/30' : 'bg-green-50 border border-green-200'
            }`}>
              <div className="flex items-center mb-2">
                <Award className="h-4 w-4 mr-2 text-green-500" />
                <span className="font-semibold text-green-500">Strengths</span>
              </div>
              <p className="text-sm">Excellent eye contact and confident body language</p>
            </div>
            <div className={`p-4 rounded-xl ${
              isDarkMode ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'
            }`}>
              <div className="flex items-center mb-2">
                <Target className="h-4 w-4 mr-2 text-orange-500" />
                <span className="font-semibold text-orange-500">Improvements</span>
              </div>
              <p className="text-sm">Consider slowing down speech pace for better clarity</p>
            </div>
            <div className={`p-4 rounded-xl ${
              isDarkMode ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex items-center mb-2">
                <Zap className="h-4 w-4 mr-2 text-blue-500" />
                <span className="font-semibold text-blue-500">Recommendations</span>
              </div>
              <p className="text-sm">Add more data points to support your claims</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Eye, title: 'Body Language Analysis', desc: 'Posture, gestures, and eye contact tracking' },
          { icon: Mic, title: 'Voice Analysis', desc: 'Tone, pace, and clarity assessment' },
          { icon: Brain, title: 'Content Analysis', desc: 'Structure, persuasion, and impact scoring' }
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-2xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white'
            } shadow-lg text-center`}
          >
            <feature.icon className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};