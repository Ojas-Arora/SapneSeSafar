import React, { useMemo } from 'react';
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
  Eye,
  Lightbulb,
  Building2,
  Trophy,
  Globe,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSharkTankTheme } from '../hooks/useSharkTankTheme';
import { useDealsStore } from '../store/useDealsStore';

const StatCard: React.FC<{
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
  trend: 'up' | 'down';
}> = React.memo(({ title, value, change, icon, color, trend }) => {
  const { isDarkMode } = useSharkTankTheme();

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
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-shark-blue-500" />
          </motion.div>
        </div>

        <h3 className="text-lg md:text-xl font-bold mb-2">{title}</h3>
        <p className={`text-xs md:text-sm ${isDarkMode ? 'text-shark-navy-400' : 'text-shark-navy-600'}`}>
          {description}
        </p>
      </Link>
    </motion.div>
  );
});

export const NavigationHub: React.FC = () => {
  const { isDarkMode } = useSharkTankTheme();
  const { deals, sharks } = useDealsStore();

  const stats = useMemo(() => {
    const totalFunding = deals.reduce((sum, deal) => {
      const amount = (deal as any).amountInvestedLakhs || (deal as any).amount_invested_lakhs || 0;
      return sum + amount;
    }, 0);
    const avgDeal = deals.length > 0 ? totalFunding / deals.length : 0;
    
    return {
      totalDeals: deals.length,
      totalFunding: `₹${(totalFunding / 100).toFixed(1)}Cr`,
      avgDeal: `₹${avgDeal.toFixed(1)}L`,
      totalSharks: sharks.length
    };
  }, [deals, sharks]);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-shark-blue-400 to-shark-purple-500 bg-clip-text text-transparent">
          Navigation Hub
        </h1>
        <p className={`text-sm md:text-lg ${isDarkMode ? 'text-shark-navy-400' : 'text-shark-navy-600'}`}>
          Your complete analytics dashboard for Shark Tank India
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard
          title="Total Deals"
          value={stats.totalDeals.toString()}
          change="+12%"
          icon={<DollarSign className="h-4 w-4 md:h-6 md:w-6 text-white" />}
          color="from-shark-blue-500 to-shark-blue-600"
          trend="up"
        />
        <StatCard
          title="Total Funding"
          value={stats.totalFunding}
          change="+8%"
          icon={<TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-white" />}
          color="from-green-500 to-green-600"
          trend="up"
        />
        <StatCard
          title="Avg Deal Size"
          value={stats.avgDeal}
          change="-3%"
          icon={<Target className="h-4 w-4 md:h-6 md:w-6 text-white" />}
          color="from-shark-purple-500 to-shark-purple-600"
          trend="down"
        />
        <StatCard
          title="Active Sharks"
          value={stats.totalSharks.toString()}
          change="+2"
          icon={<Users className="h-4 w-4 md:h-6 md:w-6 text-white" />}
          color="from-shark-yellow-400 to-shark-yellow-500"
          trend="up"
        />
      </div>

      {/* Main Features Grid */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-shark-yellow-400" />
          Core Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <DashboardCard
            title="Sharks"
            description="Explore detailed profiles of all Shark Tank India investors"
            icon={<Users className="h-5 w-5 md:h-6 md:w-6 text-white" />}
            link="/sharks"
            color="from-shark-blue-500 to-shark-blue-600"
          />
          <DashboardCard
            title="Deals"
            description="Browse through all investment deals and their details"
            icon={<DollarSign className="h-5 w-5 md:h-6 md:w-6 text-white" />}
            link="/deals"
            color="from-green-500 to-green-600"
          />
          <DashboardCard
            title="Analytics"
            description="Deep dive into investment patterns and trends"
            icon={<BarChart2 className="h-5 w-5 md:h-6 md:w-6 text-white" />}
            link="/analytics"
            color="from-shark-purple-500 to-shark-purple-600"
            badge="Popular"
          />
          <DashboardCard
            title="Deal Table"
            description="Comprehensive table view of all deals with filters"
            icon={<Table className="h-5 w-5 md:h-6 md:w-6 text-white" />}
            link="/deal-table"
            color="from-orange-500 to-orange-600"
          />
          <DashboardCard
            title="Predictions"
            description="AI-powered predictions for future deals"
            icon={<Activity className="h-5 w-5 md:h-6 md:w-6 text-white" />}
            link="/predictions"
            color="from-pink-500 to-pink-600"
            badge="AI"
          />
          <DashboardCard
            title="Trends"
            description="Identify emerging patterns and market movements"
            icon={<TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-white" />}
            link="/trends"
            color="from-cyan-500 to-cyan-600"
          />
        </div>
      </div>

      {/* Advanced Features */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
          <Zap className="h-5 w-5 md:h-6 md:w-6 text-shark-yellow-400" />
          Advanced Insights
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <DashboardCard
            title="Insights"
            description="Expert analysis and key takeaways from deals"
            icon={<Lightbulb className="h-5 w-5 md:h-6 md:w-6 text-white" />}
            link="/insights"
            color="from-yellow-500 to-yellow-600"
          />
          <DashboardCard
            title="Industries"
            description="Industry-wise breakdown and sector analysis"
            icon={<Building2 className="h-5 w-5 md:h-6 md:w-6 text-white" />}
            link="/industries"
            color="from-indigo-500 to-indigo-600"
          />
          <DashboardCard
            title="Startups"
            description="Complete startup database with performance metrics"
            icon={<Target className="h-5 w-5 md:h-6 md:w-6 text-white" />}
            link="/startups"
            color="from-red-500 to-red-600"
          />
          <DashboardCard
            title="Comparisons"
            description="Compare sharks, deals, and performance metrics"
            icon={<Activity className="h-5 w-5 md:h-6 md:w-6 text-white" />}
            link="/comparisons"
            color="from-purple-500 to-purple-600"
          />
          <DashboardCard
            title="Global Markets"
            description="International comparison with other Shark Tank editions"
            icon={<Globe className="h-5 w-5 md:h-6 md:w-6 text-white" />}
            link="/global-markets"
            color="from-blue-500 to-blue-600"
          />
          <DashboardCard
            title="Success Stories"
            description="Inspiring journeys of successful pitches"
            icon={<Trophy className="h-5 w-5 md:h-6 md:w-6 text-white" />}
            link="/success-stories"
            color="from-green-500 to-green-600"
          />
        </div>
      </div>

      {/* Interactive Tools */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
          <Award className="h-5 w-5 md:h-6 md:w-6 text-shark-yellow-400" />
          Interactive Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <DashboardCard
            title="Pitch Analyzer"
            description="Analyze pitch success factors and get recommendations"
            icon={<Eye className="h-5 w-5 md:h-6 md:w-6 text-white" />}
            link="/pitch-analyzer"
            color="from-teal-500 to-teal-600"
            badge="New"
          />
          <DashboardCard
            title="Shark Chat"
            description="AI-powered chat to discuss deals and strategies"
            icon={<MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-white" />}
            link="/shark-chat"
            color="from-violet-500 to-violet-600"
            badge="AI"
          />
        </div>
      </div>
    </div>
  );
};
