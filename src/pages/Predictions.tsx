import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, AlertTriangle, ChevronRight, Award } from 'lucide-react';

export const Predictions: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>('Technology');
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  const industries = [
    'Technology',
    'Food & Beverage',
    'Healthcare',
    'E-commerce',
    'Education',
    'Manufacturing',
  ];

  type Industry = 'Technology' | 'Food & Beverage' | 'Healthcare' | 'E-commerce' | 'Education' | 'Manufacturing';

  const predictions: Record<Industry, {
    success_rate: number;
    growth_potential: number;
    market_size: string;
    top_sharks: string[];
    risk_factors: string[];
    valuation_range: string;
  }> = {
    Technology: {
      success_rate: 75,
      growth_potential: 85,
      market_size: '₹12,000Cr',
      top_sharks: ['Ashneer Grover', 'Namita Thapar'],
      risk_factors: ['Market Competition', 'Tech Adoption', 'Funding Environment'],
      valuation_range: '₹2Cr - ₹10Cr',
    },
    'Food & Beverage': {
      success_rate: 65,
      growth_potential: 70,
      market_size: '₹8,000Cr',
      top_sharks: ['Aman Gupta', 'Vineeta Singh'],
      risk_factors: ['Supply Chain', 'Food Safety', 'Market Saturation'],
      valuation_range: '₹1Cr - ₹5Cr',
    },
    Healthcare: {
      success_rate: 80,
      growth_potential: 90,
      market_size: '₹15,000Cr',
      top_sharks: ['Peyush Bansal', 'Ghazal Alagh'],
      risk_factors: ['Regulatory Compliance', 'Clinical Trials', 'Market Access'],
      valuation_range: '₹3Cr - ₹12Cr',
    },
    'E-commerce': {
      success_rate: 70,
      growth_potential: 80,
      market_size: '₹10,000Cr',
      top_sharks: ['Anupam Mittal', 'Namita Thapar'],
      risk_factors: ['Customer Acquisition', 'Logistics', 'Competition'],
      valuation_range: '₹2Cr - ₹8Cr',
    },
    Education: {
      success_rate: 72,
      growth_potential: 78,
      market_size: '₹7,000Cr',
      top_sharks: ['Peyush Bansal', 'Vineeta Singh'],
      risk_factors: ['Market Adoption', 'Content Quality', 'Tech Infrastructure'],
      valuation_range: '₹1.5Cr - ₹6Cr',
    },
    Manufacturing: {
      success_rate: 68,
      growth_potential: 75,
      market_size: '₹9,000Cr',
      top_sharks: ['Ashneer Grover', 'Aman Gupta'],
      risk_factors: ['Raw Material Costs', 'Production Scale', 'Supply Chain'],
      valuation_range: '₹2.5Cr - ₹9Cr',
    },
  };

  useEffect(() => {
    const targetPercentage = predictions[selectedIndustry].success_rate;
    let start = 0;
    const increment = targetPercentage / 60;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= targetPercentage) {
        setAnimatedPercentage(targetPercentage);
        clearInterval(timer);
      } else {
        setAnimatedPercentage(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [selectedIndustry]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">AI Predictions</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Machine learning powered insights and predictions
          </p>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Brain className="h-8 w-8 text-blue-500" />
        </motion.div>
      </div>

      {/* Industry Selection */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {industries.map((industry) => (
          <motion.button
            key={industry}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedIndustry(industry as Industry)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedIndustry === industry
                ? isDarkMode
                  ? 'bg-[#17BEBB] text-white'
                  : 'bg-[#5D87FF] text-white'
                : isDarkMode
                ? 'bg-[#1E2A3B] text-gray-300'
                : 'bg-white text-gray-700'
            } shadow-lg`}
          >
            {industry}
          </motion.button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Success Prediction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-lg ${
            isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
          } shadow-lg`}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Target className="h-6 w-6 mr-2 text-green-500" />
            Success Prediction
          </h2>
          <div className="relative h-48 flex items-center justify-center">
            <svg className="w-40 h-40" viewBox="0 0 100 100">
              <circle
                className="text-gray-200 stroke-current"
                strokeWidth="10"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
              />
              <circle
                className="text-blue-500 stroke-current"
                strokeWidth="10"
                strokeLinecap="round"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
                style={{
                  strokeDasharray: `${2 * Math.PI * 45}`,
                  strokeDashoffset: `${2 * Math.PI * 45 * (1 - animatedPercentage / 100)}`,
                  transform: 'rotate(-90deg)',
                  transformOrigin: '50% 50%',
                }}
              />
            </svg>
            <div className="absolute text-center">
              <div className="text-4xl font-bold">{Math.round(animatedPercentage)}%</div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span>Market Size</span>
              <span className="font-semibold">{predictions[selectedIndustry].market_size}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Valuation Range</span>
              <span className="font-semibold">{predictions[selectedIndustry].valuation_range}</span>
            </div>
          </div>
        </motion.div>

        {/* Risk Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-lg ${
            isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
          } shadow-lg`}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2 text-yellow-500" />
            Risk Analysis
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Key Risk Factors</h3>
              <div className="space-y-2">
                {predictions[selectedIndustry].risk_factors.map((factor, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      isDarkMode ? 'bg-[#0D1B2A]' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <ChevronRight className="h-4 w-4 mr-2" />
                      {factor}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Recommended Sharks</h3>
              <div className="grid grid-cols-2 gap-4">
                {predictions[selectedIndustry].top_sharks.map((shark, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      isDarkMode ? 'bg-[#0D1B2A]' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-blue-500" />
                      {shark}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Growth Potential */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-lg ${
          isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
        } shadow-lg`}
      >
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-purple-500" />
          Growth Potential
        </h2>
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${predictions[selectedIndustry].growth_potential}%` }}
            transition={{ duration: 1 }}
            className="absolute h-full bg-purple-500"
          />
        </div>
        <div className="mt-2 text-right">
          {predictions[selectedIndustry].growth_potential}% Growth Potential
        </div>
      </motion.div>
    </div>
  );
};