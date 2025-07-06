import React, { useState } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Zap, Brain, Crown } from 'lucide-react';

export const SharkChat: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const [selectedShark, setSelectedShark] = useState('Ashneer Grover');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Ashneer Grover',
      message: "Welcome! I'm here to help you understand investment strategies. What would you like to discuss?",
      timestamp: new Date(),
      isShark: true
    }
  ]);

  const sharks = [
    { name: 'Ashneer Grover', specialty: 'Fintech & Aggressive Deals', color: 'from-red-500 to-orange-500' },
    { name: 'Namita Thapar', specialty: 'Healthcare & Pharma', color: 'from-blue-500 to-cyan-500' },
    { name: 'Aman Gupta', specialty: 'D2C & Consumer Brands', color: 'from-purple-500 to-pink-500' },
    { name: 'Peyush Bansal', specialty: 'E-commerce & Tech', color: 'from-green-500 to-emerald-500' }
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'You',
      message: message,
      timestamp: new Date(),
      isShark: false
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: selectedShark,
        message: "That's an interesting point! Based on my experience in the tank, I'd suggest focusing on your unit economics and customer acquisition cost. What's your current CAC?",
        timestamp: new Date(),
        isShark: true
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-200px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
          AI Shark Chat
        </h1>
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Get personalized advice from AI-powered shark personalities
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Shark Selector */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-2xl ${
            isDarkMode ? 'bg-slate-800/50' : 'bg-white'
          } shadow-lg h-fit`}
        >
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Crown className="h-5 w-5 mr-2 text-yellow-500" />
            Choose Your Shark
          </h3>
          <div className="space-y-3">
            {sharks.map((shark) => (
              <motion.button
                key={shark.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedShark(shark.name)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedShark === shark.name
                    ? `bg-gradient-to-r ${shark.color} text-white shadow-lg`
                    : isDarkMode
                    ? 'bg-slate-700/50 hover:bg-slate-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="font-semibold">{shark.name}</div>
                <div className={`text-sm ${
                  selectedShark === shark.name ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {shark.specialty}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Chat Interface */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Chat Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-t-2xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white'
            } shadow-lg border-b ${
              isDarkMode ? 'border-slate-700' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center mr-3">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold">{selectedShark} AI</h3>
                <p className="text-sm text-green-500">● Online</p>
              </div>
            </div>
          </motion.div>

          {/* Messages */}
          <div className={`flex-1 p-6 overflow-y-auto ${
            isDarkMode ? 'bg-slate-800/30' : 'bg-gray-50'
          }`}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.isShark ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    msg.isShark
                      ? isDarkMode
                        ? 'bg-slate-700 text-white'
                        : 'bg-white text-gray-800 shadow-md'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  }`}>
                    <div className="flex items-center mb-1">
                      {msg.isShark ? (
                        <Bot className="h-4 w-4 mr-2" />
                      ) : (
                        <User className="h-4 w-4 mr-2" />
                      )}
                      <span className="text-xs font-semibold">{msg.sender}</span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-b-2xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white'
            } shadow-lg border-t ${
              isDarkMode ? 'border-slate-700' : 'border-gray-200'
            }`}
          >
            <div className="flex space-x-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about investment strategies, market insights..."
                className={`flex-1 px-4 py-3 rounded-xl border ${
                  isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                    : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};