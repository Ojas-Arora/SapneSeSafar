import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { FloatingNavigation } from './components/FloatingNavigation';
import { Dashboard } from './pages/Dashboard';
import { Sharks } from './pages/Sharks';
import { Deals } from './pages/Deals';
import { Analytics } from './pages/Analytics';
import { DealTable } from './pages/DealTable';
import { Predictions } from './pages/Predictions';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';
import { Insights } from './pages/Insights';
import { Trends } from './pages/Trends';
import { Startups } from './pages/Startups';
import { Industries } from './pages/Industries';
import { Comparisons } from './pages/Comparisons';
import { GlobalMarkets } from './pages/GlobalMarkets';
import { PitchAnalyzer } from './pages/PitchAnalyzer';
import { SharkChat } from './pages/SharkChat';
import { SuccessStories } from './pages/SuccessStories';
import { LoadingScreen } from './components/LoadingScreen';
import { useThemeStore } from './store/useThemeStore';
import { useDealsStore } from './store/useDealsStore';
import { useAuthStore } from './store/useAuthStore';
import { motion } from 'framer-motion';

// Placeholder components for new features
const PlaceholderPage: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`text-center p-12 rounded-3xl ${
          isDarkMode ? 'bg-slate-800/50' : 'bg-white'
        } shadow-xl backdrop-blur-xl border ${
          isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'
        }`}
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-3xl">🚀</span>
        </div>
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
          {description}
        </p>
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold">
          Coming Soon
        </div>
      </motion.div>
    </div>
  );
};

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { isDarkMode } = useThemeStore();
  const { initializeData, isInitialized } = useDealsStore();
  const { initialize, initialized } = useAuthStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initialize();
        await initializeData();
      } catch (error) {
        console.error('App initialization error:', error);
      }
    };

    initializeApp();
  }, [initialize, initializeData]);

  const toggleNav = useCallback(() => {
    setIsNavOpen(prev => !prev);
  }, []);

  const closeNav = useCallback(() => {
    setIsNavOpen(false);
  }, []);

  if (!initialized || !isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className={`min-h-screen transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' 
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'
      }`}>
        {/* Optimized Background Elements */}
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
              isDarkMode ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' : 'bg-gradient-to-r from-blue-200/40 to-purple-200/40'
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
              isDarkMode ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' : 'bg-gradient-to-r from-purple-200/40 to-pink-200/40'
            } blur-3xl`}
          />
        </div>

        <Navbar toggleNav={toggleNav} />
        
        {/* Revolutionary Floating Navigation */}
        <FloatingNavigation isOpen={isNavOpen} onClose={closeNav} />
        
        <motion.main 
          className="pt-16 md:pt-20 relative z-10"
          layout
        >
          <div className="p-3 md:p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sharks" element={<Sharks />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/deal-table" element={<DealTable />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/trends" element={<Trends />} />
              <Route path="/startups" element={<Startups />} />
              <Route path="/industries" element={<Industries />} />
              <Route path="/comparisons" element={<Comparisons />} />
              <Route path="/global-markets" element={<GlobalMarkets />} />
              <Route path="/pitch-analyzer" element={<PitchAnalyzer />} />
              <Route path="/shark-chat" element={<SharkChat />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* New Feature Placeholders */}
              <Route path="/pitch-simulator" element={<PlaceholderPage title="Pitch Simulator" description="Practice your pitch with AI-powered feedback and realistic shark responses" />} />
              <Route path="/live-episodes" element={<PlaceholderPage title="Live Episodes" description="Real-time tracking and analysis of ongoing Shark Tank episodes" />} />
              <Route path="/pitch-library" element={<PlaceholderPage title="Pitch Library" description="Comprehensive video collection of successful and failed pitches" />} />
              <Route path="/voice-analytics" element={<PlaceholderPage title="Voice Analytics" description="Advanced speech pattern analysis for pitch optimization" />} />
              <Route path="/events" element={<PlaceholderPage title="Event Calendar" description="Startup events, pitch competitions, and networking opportunities" />} />
              <Route path="/learning" element={<PlaceholderPage title="Learning Hub" description="Educational content, courses, and masterclasses for entrepreneurs" />} />
              <Route path="/ratings" element={<PlaceholderPage title="Rating System" description="Community-driven scoring and feedback platform" />} />
              <Route path="/risk-analyzer" element={<PlaceholderPage title="Risk Analyzer" description="AI-powered investment risk assessment and mitigation strategies" />} />
              <Route path="/portfolio" element={<PlaceholderPage title="Portfolio Tracker" description="Track and manage your investment portfolio with advanced analytics" />} />
              <Route path="/market-navigator" element={<PlaceholderPage title="Market Navigator" description="Discover emerging markets and investment opportunities" />} />
              <Route path="/data-layers" element={<PlaceholderPage title="Data Layers" description="Multi-dimensional data visualization and analysis tools" />} />
              <Route path="/trending" element={<PlaceholderPage title="Trending Now" description="Real-time trending topics and hot investment opportunities" />} />
              <Route path="/premium-analytics" element={<PlaceholderPage title="Premium Analytics" description="Advanced insights and exclusive data for premium subscribers" />} />
              <Route path="/quick-insights" element={<PlaceholderPage title="Quick Insights" description="Instant analysis and bite-sized market intelligence" />} />
              <Route path="/ecosystem-map" element={<PlaceholderPage title="Ecosystem Map" description="Visual representation of the startup ecosystem and connections" />} />
              <Route path="/data-explorer" element={<PlaceholderPage title="Data Explorer" description="Advanced data mining and exploration tools" />} />
              <Route path="/api-playground" element={<PlaceholderPage title="API Playground" description="Developer tools and API testing environment" />} />
              
              <Route path="/settings" element={<PlaceholderPage title="Settings" description="Customize your experience and manage preferences" />} />
            </Routes>
          </div>
        </motion.main>
      </div>
    </Router>
  );
}

export default App;