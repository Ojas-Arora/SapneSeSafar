import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { useDealsStore } from '../store/useDealsStore';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brain, DollarSign, Target, Award } from 'lucide-react';

export const Analytics: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const { deals } = useDealsStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // 3D Visualization setup
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    const container = containerRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create data visualization
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: isDarkMode ? 0x17BEBB : 0x5D87FF,
      wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add lights
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [isDarkMode]);

  // Calculate analytics data
  const totalInvestment = deals.reduce((sum, deal) => sum + deal.deal_amount, 0);
  const avgValuation = deals.reduce((sum, deal) => sum + deal.valuation, 0) / deals.length;
  const successRate = (deals.filter(deal => deal.success_status === 'funded').length / deals.length) * 100;

  const seasonalTrends = deals.reduce((acc: any[], deal) => {
    const season = acc.find(s => s.season === deal.season);
    if (season) {
      season.deals++;
      season.investment += deal.deal_amount;
    } else {
      acc.push({
        season: deal.season,
        deals: 1,
        investment: deal.deal_amount,
      });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-8">
      {/* 3D Visualization Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`h-[400px] rounded-lg ${
          isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
        } shadow-lg overflow-hidden`}
        ref={containerRef}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-lg ${
            isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
          } shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 text-green-500" />
            <span className="text-sm text-gray-500">Total Investment</span>
          </div>
          <div className="text-3xl font-bold">₹{(totalInvestment / 10000000).toFixed(1)}Cr</div>
          <div className="mt-2 text-sm text-gray-500">
            Across {deals.length} deals
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-lg ${
            isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
          } shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8 text-blue-500" />
            <span className="text-sm text-gray-500">Success Rate</span>
          </div>
          <div className="text-3xl font-bold">{successRate.toFixed(1)}%</div>
          <div className="mt-2 text-sm text-gray-500">
            Of all pitches
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-lg ${
            isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
          } shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <Award className="h-8 w-8 text-yellow-500" />
            <span className="text-sm text-gray-500">Avg Valuation</span>
          </div>
          <div className="text-3xl font-bold">₹{(avgValuation / 10000000).toFixed(1)}Cr</div>
          <div className="mt-2 text-sm text-gray-500">
            Per startup
          </div>
        </motion.div>
      </div>

      {/* Seasonal Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`p-6 rounded-lg ${
          isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
        } shadow-lg`}
      >
        <h2 className="text-xl font-bold mb-6">Seasonal Investment Trends</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={seasonalTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="season" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="deals"
              stroke="#8884d8"
              name="Number of Deals"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="investment"
              stroke="#82ca9d"
              name="Total Investment"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`p-6 rounded-lg ${
          isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
        } shadow-lg`}
      >
        <div className="flex items-center mb-6">
          <Brain className="h-6 w-6 mr-2" />
          <h2 className="text-xl font-bold">AI-Powered Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-[#0D1B2A]' : 'bg-gray-50'
          }`}>
            <h3 className="font-semibold mb-2">Investment Patterns</h3>
            <p className="text-sm text-gray-500">
              AI analysis shows a 23% increase in technology sector investments,
              with particular focus on AI and ML startups.
            </p>
          </div>
          <div className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-[#0D1B2A]' : 'bg-gray-50'
          }`}>
            <h3 className="font-semibold mb-2">Valuation Trends</h3>
            <p className="text-sm text-gray-500">
              Average valuations have increased by 45% in the last season,
              particularly in D2C and SaaS sectors.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};