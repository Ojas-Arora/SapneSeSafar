import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  Menu, 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  ChevronDown,
  Zap,
  Sparkles,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSharkTankTheme } from '../hooks/useSharkTankTheme';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

interface NavbarProps {
  toggleNav: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleNav }) => {
  const { theme, isDarkMode, getGradientClass } = useSharkTankTheme();
  const { toggleTheme } = useThemeStore();
  const { user, profile, signOut } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleToggleNav = useCallback(() => {
    toggleNav();
  }, [toggleNav]);

  const handleToggleTheme = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const handleToggleUserMenu = useCallback(() => {
    setShowUserMenu(prev => !prev);
  }, []);

  const handleSearchFocus = useCallback(() => {
    setSearchFocused(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    setSearchFocused(false);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b shadow-2xl ${
        isDarkMode 
          ? 'bg-shark-navy-900/90 border-shark-navy-700/50 text-white' 
          : 'bg-white/90 border-shark-navy-200/50 text-shark-navy-900'
      }`}
      style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 58, 138, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left Section */}
          <div className="flex items-center space-x-3 md:space-x-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleNav}
              className={`p-2 md:p-3 rounded-xl md:rounded-2xl transition-all duration-300 ${
                isDarkMode 
                  ? 'hover:bg-shark-navy-700/50 hover:shadow-lg hover:shadow-shark-blue-500/20' 
                  : 'hover:bg-shark-navy-100 hover:shadow-lg hover:shadow-shark-blue-500/20'
              }`}
            >
              <Menu className="h-5 w-5 md:h-6 md:w-6" />
            </motion.button>
            
            <Link to="/" className="flex items-center space-x-2 md:space-x-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <div className={`w-8 h-8 md:w-12 md:h-12 ${getGradientClass('shark')} rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-lg md:text-2xl">🦈</span>
                </div>
              </motion.div>
              <div className="hidden sm:block">
                <motion.h1 
                  className={`font-bold text-lg md:text-2xl ${getGradientClass('primary')} bg-clip-text text-transparent`}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #06b6d4 50%, #fcd34d 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Tank Time Capsule
                </motion.h1>
                <p className={`text-xs ${isDarkMode ? 'text-shark-navy-400' : 'text-shark-navy-600'} hidden md:block`}>
                  Shark Tank India Analytics
                </p>
              </div>
            </Link>
          </div>

          {/* Search Bar - Hidden on small screens */}
          <motion.div 
            className="hidden md:flex flex-1 max-w-2xl mx-8"
            animate={{ scale: searchFocused ? 1.02 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search deals, sharks, startups..."
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className={`w-full px-6 py-3 md:py-4 pl-12 md:pl-14 pr-12 md:pr-16 rounded-xl md:rounded-2xl transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-shark-navy-800/50 text-white placeholder-shark-navy-400 border border-shark-navy-700/50 focus:border-shark-blue-500/50 focus:bg-shark-navy-800/70' 
                    : 'bg-white/50 text-shark-navy-900 placeholder-shark-navy-500 border border-shark-navy-200/50 focus:border-shark-blue-500/50 focus:bg-white/70'
                } focus:outline-none focus:ring-2 focus:ring-shark-blue-500/20 backdrop-blur-xl shadow-lg hover:shadow-xl`}
              />
              <Search className={`absolute left-4 md:left-5 top-3 md:top-4 h-5 w-5 md:h-6 md:w-6 transition-colors ${
                searchFocused 
                  ? 'text-shark-blue-500' 
                  : isDarkMode ? 'text-shark-navy-400' : 'text-shark-navy-500'
              }`} />
              
              {/* AI Search Badge */}
              <motion.div
                animate={{ scale: searchFocused ? 1 : 0.9, opacity: searchFocused ? 1 : 0.7 }}
                className={`absolute right-3 md:right-4 top-2 md:top-2 flex items-center space-x-1 px-2 md:px-3 py-1 md:py-2 ${getGradientClass('primary')} rounded-lg md:rounded-xl`}
              >
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-white" />
                <span className="text-xs font-semibold text-white">AI</span>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Right Section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Notifications - Hidden on small screens */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`hidden sm:flex relative p-2 md:p-3 rounded-xl md:rounded-2xl transition-all duration-300 ${
                isDarkMode 
                  ? 'hover:bg-shark-navy-700/50 hover:shadow-lg hover:shadow-shark-blue-500/20' 
                  : 'hover:bg-shark-navy-100 hover:shadow-lg hover:shadow-shark-blue-500/20'
              }`}
            >
              <Bell className="h-5 w-5 md:h-6 md:w-6" />
              <span className="absolute top-1 right-1 md:top-2 md:right-2 h-2 w-2 md:h-3 md:w-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg" />
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleTheme}
              className={`p-2 md:p-3 rounded-xl md:rounded-2xl transition-all duration-300 ${
                isDarkMode 
                  ? 'hover:bg-shark-navy-700/50 hover:shadow-lg hover:shadow-shark-yellow-500/20' 
                  : 'hover:bg-shark-navy-100 hover:shadow-lg hover:shadow-shark-blue-500/20'
              }`}
            >
              <AnimatePresence mode="wait">
                {isDarkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sun className="h-5 w-5 md:h-6 md:w-6 text-shark-yellow-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Moon className="h-5 w-5 md:h-6 md:w-6 text-shark-blue-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleToggleUserMenu}
                  className={`flex items-center space-x-2 md:space-x-3 p-2 md:p-3 rounded-xl md:rounded-2xl transition-all duration-300 ${
                    isDarkMode 
                      ? 'hover:bg-shark-navy-700/50 hover:shadow-lg hover:shadow-shark-blue-500/20' 
                      : 'hover:bg-shark-navy-100 hover:shadow-lg hover:shadow-shark-blue-500/20'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || user.email}&background=random`}
                      alt="Profile"
                      className="h-8 w-8 md:h-10 md:w-10 rounded-full ring-2 ring-shark-blue-500/30 shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 md:h-4 md:w-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-lg" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="font-semibold text-sm">{profile?.full_name || 'User'}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-shark-navy-400' : 'text-shark-navy-600'}`}>
                      Premium Member
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 hidden md:block" />
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={`absolute right-0 mt-2 w-64 md:w-72 rounded-2xl md:rounded-3xl shadow-2xl border backdrop-blur-2xl ${
                        isDarkMode 
                          ? 'bg-shark-navy-800/90 border-shark-navy-700/50' 
                          : 'bg-white/90 border-shark-navy-200/50'
                      }`}
                    >
                      <div className="p-4 md:p-6 border-b border-gray-200/20">
                        <div className="flex items-center space-x-3">
                          <img
                            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || user.email}&background=random`}
                            alt="Profile"
                            className="h-10 w-10 md:h-12 md:w-12 rounded-full"
                          />
                          <div>
                            <p className="font-bold">{profile?.full_name || 'User'}</p>
                            <p className={`text-sm ${isDarkMode ? 'text-shark-navy-400' : 'text-shark-navy-600'}`}>
                              {user.email}
                            </p>
                            <div className="flex items-center space-x-1 mt-1">
                              <Crown className="h-3 w-3 text-shark-yellow-500" />
                              <span className="text-xs text-shark-yellow-500 font-semibold">Premium</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className={`flex items-center px-4 md:px-6 py-3 transition-colors ${
                            isDarkMode 
                              ? 'hover:bg-shark-navy-700/50 text-shark-navy-300 hover:text-white' 
                              : 'hover:bg-shark-navy-100 text-shark-navy-700 hover:text-shark-navy-900'
                          }`}
                        >
                          <User className="h-5 w-5 mr-3" />
                          My Profile
                        </Link>
                        <Link
                          to="/settings"
                          className={`flex items-center px-4 md:px-6 py-3 transition-colors ${
                            isDarkMode 
                              ? 'hover:bg-shark-navy-700/50 text-shark-navy-300 hover:text-white' 
                              : 'hover:bg-shark-navy-100 text-shark-navy-700 hover:text-shark-navy-900'
                          }`}
                        >
                          <Settings className="h-5 w-5 mr-3" />
                          Settings
                        </Link>
                        <button
                          onClick={signOut}
                          className={`w-full flex items-center px-4 md:px-6 py-3 transition-colors ${
                            isDarkMode 
                              ? 'hover:bg-red-500/20 text-red-400 hover:text-red-300' 
                              : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                          }`}
                        >
                          <LogOut className="h-5 w-5 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/auth"
                  className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-6 py-2 md:py-3 ${getGradientClass('shark')} text-white rounded-xl md:rounded-2xl font-bold hover:shadow-lg hover:shadow-shark-blue-500/25 transition-all duration-300`}
                >
                  <Zap className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-sm md:text-base">Get Started</span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};