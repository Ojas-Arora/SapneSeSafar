import React, { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart2,
  Users,
  TrendingUp,
  Table,
  Activity,
  ArrowRight,
  Zap,
  Target,
  DollarSign,
  Award,
  Sparkles,
  TrendingDown,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSharkTankTheme } from '../hooks/useSharkTankTheme';
import { useAuthStore } from '../store/useAuthStore';
import { useDealsStore } from '../store/useDealsStore';

const StatCard: React.FC<{
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
  trend: 'up' | 'down';
}> = React.memo(({ title, value, change, icon, color, trend }) => {
  const { theme, isDarkMode } = useSharkTankTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`p-4 md:p-6 rounded-2xl md:rounded-3xl backdrop-blur-xl border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-shark-navy-800/50 border-shark-navy-700/50 hover:border-shark-navy-600/50' 
          : 'bg-white/50 border-shark-navy-200/50 hover:border-shark-navy-300/50'
      } shadow-xl hover:shadow-2xl`}
    >
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-r ${color}`}>
          {icon}
        </div>
        <div className={`flex items-center space-x-1 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm ${
          trend === 'up' 
            ? 'bg-green-500/20 text-green-500' 
            : 'bg-red-500/20 text-red-500'
        }`}>
          {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{change}</span>
        </div>
      </div>
      <h3 className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-shark-navy-400' : 'text-shark-navy-600'}`}>
        {title}
      </h3>
      <p className="text-xl md:text-3xl font-bold mt-1">{value}</p>
    </motion.div>
  );
});

const DashboardCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  badge?: string;
}> = React.memo(({ title, description, icon, link, color, badge }) => {
  const { isDarkMode } = useSharkTankTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      <Link
        to={link}
        className={`block p-4 md:p-6 rounded-2xl md:rounded-3xl backdrop-blur-xl border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-shark-navy-800/50 border-shark-navy-700/50 hover:border-shark-navy-600/50' 
            : 'bg-white/50 border-shark-navy-200/50 hover:border-shark-navy-300/50'
        } shadow-xl hover:shadow-2xl relative overflow-hidden`}
      >
        {/* Background gradient effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
        
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-r ${color} shadow-lg`}>
            {icon}
          </div>
          {badge && (
            <span className="px-2 md:px-3 py-1 bg-gradient-to-r from-shark-yellow-400 to-shark-yellow-500 text-white text-xs font-semibold rounded-full">
              {badge}
            </span>
          )}
          <motion.div
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ x: 5 }}
          >
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
          </motion.div>
        </div>
        
        <h3 className="text-lg md:text-xl font-bold mb-2">{title}</h3>
        <p className={`text-sm md:text-base ${isDarkMode ? 'text-shark-navy-400' : 'text-shark-navy-600'} leading-relaxed`}>
          {description}
        </p>
      </Link>
    </motion.div>
  );
});

export const Dashboard: React.FC = () => {
  const { theme, isDarkMode, getGradientClass } = useSharkTankTheme();
  const { user } = useAuthStore();
  const { deals, sharks, analytics, initializeData } = useDealsStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const stats = useMemo(() => {
    if (!analytics) {
      return [
        {
          title: 'Total Deals',
          value: deals.length.toString(),
          change: '+12%',
          icon: <Target className="h-4 w-4 md:h-6 md:w-6 text-white" />,
          color: 'from-shark-blue-500 to-shark-cyan-500',
          trend: 'up' as const,
        },
        {
          title: 'Active Sharks',
          value: sharks.length.toString(),
          change: '+5%',
          icon: <Users className="h-4 w-4 md:h-6 md:w-6 text-white" />,
          color: 'from-shark-navy-500 to-shark-blue-500',
          trend: 'up' as const,
        },
        {
          title: 'Success Rate',
          value: '68%',
          change: '+8%',
          icon: <Award className="h-4 w-4 md:h-6 md:w-6 text-white" />,
          color: 'from-green-500 to-emerald-500',
          trend: 'up' as const,
        },
        {
          title: 'Total Investment',
          value: '₹500Cr+',
          change: '+25%',
          icon: <DollarSign className="h-4 w-4 md:h-6 md:w-6 text-white" />,
          color: 'from-shark-yellow-500 to-orange-500',
          trend: 'up' as const,
        },
      ];
    }

    return [
      {
        title: 'Total Deals',
        value: analytics.totalDeals.toString(),
        change: '+12%',
        icon: <Target className="h-4 w-4 md:h-6 md:w-6 text-white" />,
        color: 'from-shark-blue-500 to-shark-cyan-500',
        trend: 'up' as const,
      },
      {
        title: 'Active Sharks',
        value: analytics.sharksCount.toString(),
        change: '+5%',
        icon: <Users className="h-4 w-4 md:h-6 md:w-6 text-white" />,
        color: 'from-shark-navy-500 to-shark-blue-500',
        trend: 'up' as const,
      },
      {
        title: 'Success Rate',
        value: `${analytics.successRate.toFixed(1)}%`,
        change: '+8%',
        icon: <Award className="h-4 w-4 md:h-6 md:w-6 text-white" />,
        color: 'from-green-500 to-emerald-500',
        trend: 'up' as const,
      },
      {
        title: 'Total Investment',
        value: `₹${(analytics.totalInvestment / 10000000).toFixed(0)}Cr+`,
        change: '+25%',
        icon: <DollarSign className="h-4 w-4 md:h-6 md:w-6 text-white" />,
        color: 'from-shark-yellow-500 to-orange-500',
        trend: 'up' as const,
      },
    ];
  }, [analytics, deals.length, sharks.length]);

  const cards = useMemo(() => [
    {
      title: 'Analytics Hub',
      description: 'Comprehensive insights into deal patterns, investment trends, and market analysis',
      icon: <BarChart2 className="h-4 w-4 md:h-6 md:w-6 text-white" />,
      link: '/analytics',
      color: 'from-shark-blue-500 to-shark-cyan-500',
      badge: 'Popular',
    },
    {
      title: 'Shark Profiles',
      description: 'Deep dive into each shark\'s investment strategy, preferences, and success stories',
      icon: <Users className="h-4 w-4 md:h-6 md:w-6 text-white" />,
      link: '/sharks',
      color: 'from-shark-navy-500 to-shark-blue-500',
    },
    {
      title: 'Deal Intelligence',
      description: 'Track and analyze successful deals, negotiations, and startup journeys',
      icon: <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-white" />,
      link: '/deals',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Deal Database',
      description: 'Comprehensive searchable database of all Shark Tank India deals and pitches',
      icon: <Table className="h-4 w-4 md:h-6 md:w-6 text-white" />,
      link: '/deal-table',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      title: 'AI Predictions',
      description: 'Machine learning powered insights for future investment trends and opportunities',
      icon: <Activity className="h-4 w-4 md:h-6 md:w-6 text-white" />,
      link: '/predictions',
      color: 'from-pink-500 to-rose-500',
      badge: 'AI Powered',
    },
    {
      title: 'Market Insights',
      description: 'Industry trends, startup ecosystem analysis, and investment pattern recognition',
      icon: <Eye className="h-4 w-4 md:h-6 md:w-6 text-white" />,
      link: '/insights',
      color: 'from-shark-cyan-500 to-shark-blue-500',
    },
  ], []);

  return (
    <div className="space-y-6 md:space-y-8 px-4 md:px-0">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className={`absolute -top-40 -right-40 w-72 h-72 md:w-96 md:h-96 rounded-full ${
            isDarkMode ? 'bg-gradient-to-r from-shark-blue-500/20 to-shark-cyan-500/20' : 'bg-gradient-to-r from-shark-blue-200/40 to-shark-cyan-200/40'
          } blur-3xl`}
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className={`absolute -bottom-40 -left-40 w-80 h-80 md:w-[500px] md:h-[500px] rounded-full ${
            isDarkMode ? 'bg-gradient-to-r from-shark-navy-500/20 to-shark-yellow-500/20' : 'bg-gradient-to-r from-shark-navy-200/40 to-shark-yellow-200/40'
          } blur-3xl`}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-12 relative z-10"
      >
        <h1 className={`text-3xl md:text-5xl font-bold mb-3 md:mb-4`}
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #06b6d4 50%, #fcd34d 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Welcome to Tank Time Capsule
        </h1>
        <p className={`text-base md:text-xl ${isDarkMode ? 'text-shark-navy-400' : 'text-shark-navy-600'} max-w-3xl mx-auto px-4`}>
          Dive deep into Shark Tank India analytics with AI-powered insights, comprehensive data analysis, and real-time market intelligence.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 relative z-10"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative z-10"
      >
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <DashboardCard {...card} />
          </motion.div>
        ))}
      </motion.div>

      {/* Premium CTA */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 md:mt-12 p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-r from-shark-blue-600 via-shark-navy-600 to-shark-cyan-600 text-white shadow-2xl relative z-10"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
                <h2 className="text-xl md:text-2xl font-bold">Unlock Premium Features</h2>
              </div>
              <p className="text-sm md:text-lg opacity-90 mb-4 md:mb-6 max-w-2xl">
                Get access to advanced analytics, AI predictions, custom reports, and exclusive insights that give you the edge in understanding Shark Tank India's ecosystem.
              </p>
              <ul className="space-y-2 mb-4 md:mb-6 text-sm md:text-base">
                <li className="flex items-center justify-center lg:justify-start space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>AI-powered investment predictions</span>
                </li>
                <li className="flex items-center justify-center lg:justify-start space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Personalized market insights</span>
                </li>
                <li className="flex items-center justify-center lg:justify-start space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Custom analytics reports</span>
                </li>
                <li className="flex items-center justify-center lg:justify-start space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Early access to new features</span>
                </li>
              </ul>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/auth"
                className="inline-flex items-center space-x-2 px-6 md:px-8 py-3 md:py-4 bg-white text-shark-blue-600 rounded-xl md:rounded-2xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
                <span>Get Started Free</span>
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`p-4 md:p-6 rounded-2xl md:rounded-3xl backdrop-blur-xl border ${
          isDarkMode 
            ? 'bg-shark-navy-800/50 border-shark-navy-700/50' 
            : 'bg-white/50 border-shark-navy-200/50'
        } shadow-xl relative z-10`}
      >
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Recent Market Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${
            isDarkMode ? 'bg-shark-navy-700/50' : 'bg-shark-navy-100/50'
          }`}>
            <h3 className="font-semibold mb-2 text-sm md:text-base">Latest Deal</h3>
            <p className={`text-xs md:text-sm ${isDarkMode ? 'text-shark-navy-400' : 'text-shark-navy-600'}`}>
              {deals.length > 0 ? `${deals[0].startup_name} secured ₹${(deals[0].deal_amount || 0) / 10000000}Cr` : 'Loading latest deals...'}
            </p>
          </div>
          <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${
            isDarkMode ? 'bg-shark-navy-700/50' : 'bg-shark-navy-100/50'
          }`}>
            <h3 className="font-semibold mb-2 text-sm md:text-base">Trending Industry</h3>
            <p className={`text-xs md:text-sm ${isDarkMode ? 'text-shark-navy-400' : 'text-shark-navy-600'}`}>
              {analytics ? `${analytics.successRate.toFixed(0)}% success rate this season` : 'Analyzing trends...'}
            </p>
          </div>
          <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${
            isDarkMode ? 'bg-shark-navy-700/50' : 'bg-shark-navy-100/50'
          }`}>
            <h3 className="font-semibold mb-2 text-sm md:text-base">AI Prediction</h3>
            <p className={`text-xs md:text-sm ${isDarkMode ? 'text-shark-navy-400' : 'text-shark-navy-600'}`}>
              Healthcare startups predicted to dominate next quarter
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};