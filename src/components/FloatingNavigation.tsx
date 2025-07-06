import React, { useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, Users, TrendingUp, PieChart, Table, Activity, Lightbulb, LineChart, Building2, Factory, GitCompare, X, Sparkles, Zap, Brain, Target, Eye, Rocket, Crown, Globe, Camera, MessageSquare, Trophy, Gamepad2, Radio, Video, Mic, Calendar, BookOpen, Star, Shield, Briefcase, TrendingDown, DollarSign, Award, Search, Filter, Download, Share2, Heart, Bookmark, Bell, Settings, HelpCircle, Map, Compass, Layers, Database, Code, Smartphone, Monitor, Tablet, Headphones, Coffee, Flame, Diamond, Gem, Palette, Brush, Scissors, Wrench, Hammer, HardDrive as Screwdriver, Cpu, HardDrive, Wifi, Bluetooth, Battery, Power, Volume2, Play, Pause, SkipForward, SkipBack, Repeat, Shuffle, Music, Image, Film, FileText, Folder, Archive, Trash2, Edit, Copy, Clipboard, ExternalLink, Mail, Phone, MapPin, Clock, Timer, Watch as Stopwatch, AlarmClock, Sun, Moon, Cloud, CloudRain, CloudSnow, Wind, Thermometer, Umbrella, Sunrise, Sunset, Mountain, Trees as Tree, Flower, Leaf, Snowflake, Droplets, Waves, Anchor, Ship, Plane, Car, Truck, Bus, Train, Bike, NotebookIcon as Scooter, Keyboard as Skateboard, Footprints, Navigation, Route, Flag, Home, Building, Store, School, Guitar as Hospital, Church, Ban as Bank, Hotel, ListRestart as Restaurant, ShoppingCart, ShoppingBag, CreditCard, Wallet, Coins, Banknote, Receipt, Calculator, Scale, Ruler, PenTool, Paintbrush, Eraser, Highlighter, BookMarked as Marker, Pen, Pencil, Feather, Info as Ink, Stamp, Paperclip, Pin, Brush as Pushpin, ThumbsUp as Thumbtack, Magnet, Key, Lock, Unlock, ShieldCheck, ShieldAlert, ShieldX, AlertTriangle, AlertCircle, AlertOctagon, Info, CheckCircle, XCircle, Plus, Minus, Equal, Divide, Percent, Hash, AtSign, Ampersand, Quote, Trophy as Apostrophe, GemIcon as Semicolon, Cone as Colon, Command as Comma, Percent as Period, FileQuestion as Question, Radiation as Exclamation, Slash, Slack as Backslash, Pipette as Pipe, UnderlineIcon as Underscore, Pen as Hyphen, Folder as Tilde, Car as Caret, Asterisk, DollarSign as Dollar, Euro, KeyRound as Pound, Pen as Yen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';

interface FloatingNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FloatingNavigation: React.FC<FloatingNavigationProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useThemeStore();
  const location = useLocation();

  const menuItems = useMemo(() => [
    { 
      icon: BarChart2, 
      label: 'Analytics Hub', 
      path: '/analytics', 
      color: 'from-blue-500 to-cyan-500',
      description: 'Deep Market Intelligence',
      category: 'Core'
    },
    { 
      icon: Users, 
      label: 'Shark Profiles', 
      path: '/sharks', 
      color: 'from-purple-500 to-pink-500',
      description: 'Investor Deep Dive',
      category: 'Core'
    },
    { 
      icon: TrendingUp, 
      label: 'Deal Intelligence', 
      path: '/deals', 
      color: 'from-green-500 to-emerald-500',
      description: 'Investment Tracking',
      category: 'Core'
    },
    { 
      icon: Table, 
      label: 'Deal Database', 
      path: '/deal-table', 
      color: 'from-indigo-500 to-purple-500',
      description: 'Comprehensive Data',
      category: 'Core'
    },
    { 
      icon: Brain, 
      label: 'AI Predictions', 
      path: '/predictions', 
      color: 'from-pink-500 to-rose-500',
      description: 'ML-Powered Insights',
      premium: true,
      category: 'AI'
    },
    { 
      icon: Eye, 
      label: 'Market Insights', 
      path: '/insights', 
      color: 'from-yellow-500 to-orange-500',
      description: 'Industry Intelligence',
      category: 'Analytics'
    },
    { 
      icon: LineChart, 
      label: 'Trend Analysis', 
      path: '/trends', 
      color: 'from-teal-500 to-cyan-500',
      description: 'Investment Patterns',
      category: 'Analytics'
    },
    { 
      icon: Building2, 
      label: 'Startup Tracker', 
      path: '/startups', 
      color: 'from-violet-500 to-purple-500',
      description: 'Company Analysis',
      category: 'Business'
    },
    { 
      icon: Factory, 
      label: 'Industry Map', 
      path: '/industries', 
      color: 'from-emerald-500 to-teal-500',
      description: 'Sector Deep Dive',
      category: 'Business'
    },
    { 
      icon: GitCompare, 
      label: 'Shark Compare', 
      path: '/comparisons', 
      color: 'from-blue-500 to-indigo-500',
      description: 'Head-to-Head Analysis',
      category: 'Analytics'
    },
    { 
      icon: Globe, 
      label: 'Global Markets', 
      path: '/global-markets', 
      color: 'from-cyan-500 to-blue-500',
      description: 'International Insights',
      category: 'Global',
      new: true
    },
    { 
      icon: Camera, 
      label: 'Pitch Analyzer', 
      path: '/pitch-analyzer', 
      color: 'from-red-500 to-pink-500',
      description: 'Video Analysis AI',
      premium: true,
      category: 'AI',
      new: true
    },
    { 
      icon: MessageSquare, 
      label: 'Shark Chat', 
      path: '/shark-chat', 
      color: 'from-green-500 to-blue-500',
      description: 'AI Shark Simulator',
      premium: true,
      category: 'AI',
      new: true
    },
    { 
      icon: Trophy, 
      label: 'Success Stories', 
      path: '/success-stories', 
      color: 'from-yellow-500 to-red-500',
      description: 'Winner Journeys',
      category: 'Stories',
      new: true
    },
    { 
      icon: Gamepad2, 
      label: 'Pitch Simulator', 
      path: '/pitch-simulator', 
      color: 'from-purple-500 to-cyan-500',
      description: 'Practice Mode',
      premium: true,
      category: 'Tools',
      new: true
    },
    { 
      icon: Radio, 
      label: 'Live Episodes', 
      path: '/live-episodes', 
      color: 'from-red-500 to-orange-500',
      description: 'Real-time Tracking',
      category: 'Live',
      new: true
    },
    { 
      icon: Video, 
      label: 'Pitch Library', 
      path: '/pitch-library', 
      color: 'from-indigo-500 to-pink-500',
      description: 'Video Collection',
      premium: true,
      category: 'Media',
      new: true
    },
    { 
      icon: Mic, 
      label: 'Voice Analytics', 
      path: '/voice-analytics', 
      color: 'from-teal-500 to-purple-500',
      description: 'Speech Patterns',
      premium: true,
      category: 'AI',
      new: true
    },
    { 
      icon: Calendar, 
      label: 'Event Calendar', 
      path: '/events', 
      color: 'from-orange-500 to-red-500',
      description: 'Startup Events',
      category: 'Events',
      new: true
    },
    { 
      icon: BookOpen, 
      label: 'Learning Hub', 
      path: '/learning', 
      color: 'from-blue-500 to-purple-500',
      description: 'Educational Content',
      category: 'Education',
      new: true
    },
    { 
      icon: Star, 
      label: 'Rating System', 
      path: '/ratings', 
      color: 'from-yellow-500 to-pink-500',
      description: 'Community Scores',
      category: 'Community',
      new: true
    },
    { 
      icon: Shield, 
      label: 'Risk Analyzer', 
      path: '/risk-analyzer', 
      color: 'from-red-500 to-purple-500',
      description: 'Investment Risk',
      premium: true,
      category: 'Analytics',
      new: true
    },
    { 
      icon: Briefcase, 
      label: 'Portfolio Tracker', 
      path: '/portfolio', 
      color: 'from-green-500 to-teal-500',
      description: 'Investment Portfolio',
      premium: true,
      category: 'Tools',
      new: true
    },
    { 
      icon: Compass, 
      label: 'Market Navigator', 
      path: '/market-navigator', 
      color: 'from-cyan-500 to-indigo-500',
      description: 'Market Discovery',
      category: 'Discovery',
      new: true
    },
    { 
      icon: Layers, 
      label: 'Data Layers', 
      path: '/data-layers', 
      color: 'from-purple-500 to-blue-500',
      description: 'Multi-dimensional Data',
      premium: true,
      category: 'Data',
      new: true
    },
    { 
      icon: Flame, 
      label: 'Trending Now', 
      path: '/trending', 
      color: 'from-orange-500 to-yellow-500',
      description: 'Hot Topics',
      category: 'Trending',
      new: true
    },
    { 
      icon: Diamond, 
      label: 'Premium Analytics', 
      path: '/premium-analytics', 
      color: 'from-pink-500 to-purple-500',
      description: 'Advanced Insights',
      premium: true,
      category: 'Premium',
      new: true
    },
    { 
      icon: Zap, 
      label: 'Quick Insights', 
      path: '/quick-insights', 
      color: 'from-yellow-500 to-orange-500',
      description: 'Instant Analysis',
      category: 'Quick',
      new: true
    },
    { 
      icon: Map, 
      label: 'Ecosystem Map', 
      path: '/ecosystem-map', 
      color: 'from-green-500 to-cyan-500',
      description: 'Startup Ecosystem',
      category: 'Visualization',
      new: true
    },
    { 
      icon: Database, 
      label: 'Data Explorer', 
      path: '/data-explorer', 
      color: 'from-indigo-500 to-blue-500',
      description: 'Advanced Data Mining',
      premium: true,
      category: 'Data',
      new: true
    },
    { 
      icon: Code, 
      label: 'API Playground', 
      path: '/api-playground', 
      color: 'from-gray-500 to-slate-500',
      description: 'Developer Tools',
      premium: true,
      category: 'Developer',
      new: true
    }
  ], []);

  const categories = useMemo(() => {
    const cats = [...new Set(menuItems.map(item => item.category))];
    return cats;
  }, [menuItems]);

  // Optimized animation variants with reduced complexity for mobile
  const containerVariants = useMemo(() => ({
    hidden: { 
      opacity: 0,
      scale: 0.95,
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        staggerChildren: 0.02
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: 10
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    }
  }), []);

  const handleItemClick = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Floating Navigation Panel - Full Screen on Mobile with Proper Scrolling */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed inset-2 sm:inset-4 md:inset-8 z-50 
              rounded-2xl md:rounded-3xl backdrop-blur-2xl border shadow-2xl overflow-hidden ${
              isDarkMode 
                ? 'bg-slate-900/95 border-slate-700/50' 
                : 'bg-white/95 border-gray-200/50'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Rocket className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Navigation Hub
                  </h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {menuItems.length} Premium Features
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`p-2 md:p-3 rounded-xl transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-slate-700/50 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                }`}
              >
                <X className="h-5 w-5 md:h-6 md:w-6" />
              </motion.button>
            </div>

            {/* Navigation Grid - Properly Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {/* Category Sections */}
              {categories.map((category, categoryIndex) => (
                <motion.div
                  key={category}
                  variants={itemVariants}
                  className="mb-8"
                >
                  <div className="flex items-center mb-4">
                    <h3 className={`text-lg font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {category}
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent ml-4" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {menuItems
                      .filter(item => item.category === category)
                      .map((item, index) => {
                        const isActive = location.pathname === item.path;
                        
                        return (
                          <motion.div
                            key={item.path}
                            variants={itemVariants}
                            whileHover={{ 
                              scale: 1.02,
                              transition: { type: "spring", stiffness: 400, damping: 25 }
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link
                              to={item.path}
                              onClick={handleItemClick}
                              className={`group block p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 relative overflow-hidden ${
                                isActive
                                  ? isDarkMode
                                    ? 'bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-2 border-blue-500/50 shadow-lg shadow-blue-500/20'
                                    : 'bg-gradient-to-br from-white to-blue-50 border-2 border-blue-500/50 shadow-lg shadow-blue-500/20'
                                  : isDarkMode
                                    ? 'bg-slate-800/40 hover:bg-slate-700/60 border border-slate-600/30 hover:border-slate-500/50'
                                    : 'bg-white/60 hover:bg-white/80 border border-gray-200/50 hover:border-gray-300/50'
                              } backdrop-blur-xl shadow-lg hover:shadow-xl`}
                            >
                              {/* Badges */}
                              <div className="absolute top-2 right-2 flex flex-col gap-1">
                                {item.premium && (
                                  <div className="flex items-center space-x-1 px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                                    <Crown className="h-2 w-2 text-white" />
                                    <span className="text-xs font-semibold text-white">PRO</span>
                                  </div>
                                )}
                                {item.new && (
                                  <div className="flex items-center space-x-1 px-1.5 py-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full">
                                    <Sparkles className="h-2 w-2 text-white" />
                                    <span className="text-xs font-semibold text-white">NEW</span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Icon */}
                              <div className={`relative mb-3 p-2 md:p-3 rounded-lg bg-gradient-to-r ${item.color} shadow-lg w-fit`}>
                                <item.icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                              </div>
                              
                              {/* Content */}
                              <div className="relative z-10">
                                <h3 className={`text-sm md:text-base font-bold mb-1 ${
                                  isActive 
                                    ? 'text-blue-500' 
                                    : isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-800 group-hover:text-blue-600'
                                } transition-colors duration-300`}>
                                  {item.label}
                                </h3>
                                <p className={`text-xs ${
                                  isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'
                                } transition-colors duration-300`}>
                                  {item.description}
                                </p>
                              </div>
                              
                              {/* Active Indicator */}
                              {isActive && (
                                <motion.div
                                  layoutId="activeNavIndicator"
                                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-xl"
                                />
                              )}
                            </Link>
                          </motion.div>
                        );
                      })}
                  </div>
                </motion.div>
              ))}
              
              {/* Quick Stats */}
              <motion.div
                variants={itemVariants}
                className={`mt-6 p-4 md:p-6 rounded-2xl ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/30' 
                    : 'bg-gradient-to-r from-white/60 to-gray-50/60 border border-gray-200/50'
                } backdrop-blur-xl`}
              >
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-500" />
                  Platform Stats
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-blue-500">{menuItems.length}</div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Features</div>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-green-500">15+</div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>New Tools</div>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-purple-500">AI</div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Powered</div>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-yellow-500">24/7</div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Live Data</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};