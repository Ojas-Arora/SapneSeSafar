import { useThemeStore } from '../store/useThemeStore';
import { sharkTankTheme } from '../styles/sharkTankTheme';

export const useSharkTankTheme = () => {
  const { isDarkMode } = useThemeStore();
  
  const theme = {
    ...sharkTankTheme,
    current: isDarkMode ? sharkTankTheme.colors.dark : sharkTankTheme.colors.light,
    colors: {
      ...sharkTankTheme.colors,
      current: isDarkMode ? sharkTankTheme.colors.dark : sharkTankTheme.colors.light,
    }
  };
  
  const getSharkColor = (sharkName: string): string => {
    const name = sharkName.toLowerCase();
    if (name.includes('ashneer')) return sharkTankTheme.colors.sharks.ashneer;
    if (name.includes('namita')) return sharkTankTheme.colors.sharks.namita;
    if (name.includes('aman')) return sharkTankTheme.colors.sharks.aman;
    if (name.includes('peyush')) return sharkTankTheme.colors.sharks.peyush;
    if (name.includes('vineeta')) return sharkTankTheme.colors.sharks.vineeta;
    if (name.includes('anupam')) return sharkTankTheme.colors.sharks.anupam;
    if (name.includes('ghazal')) return sharkTankTheme.colors.sharks.ghazal;
    if (name.includes('ritesh')) return sharkTankTheme.colors.sharks.ritesh;
    return sharkTankTheme.colors.primary.blue;
  };
  
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'funded':
      case 'success':
        return sharkTankTheme.colors.status.success;
      case 'not_funded':
      case 'rejected':
        return sharkTankTheme.colors.status.error;
      case 'pending':
        return sharkTankTheme.colors.status.warning;
      default:
        return sharkTankTheme.colors.status.info;
    }
  };
  
  const getGradientClass = (type: 'primary' | 'secondary' | 'success' | 'danger' | 'shark'): string => {
    const gradients = {
      primary: 'bg-gradient-to-r from-blue-800 to-cyan-500',
      secondary: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      success: 'bg-gradient-to-r from-green-500 to-emerald-600',
      danger: 'bg-gradient-to-r from-red-500 to-red-600',
      shark: 'bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-500',
    };
    return gradients[type];
  };
  
  return {
    theme,
    isDarkMode,
    getSharkColor,
    getStatusColor,
    getGradientClass,
  };
};