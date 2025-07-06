export const sharkTankTheme = {
  // Official Shark Tank India Colors
  colors: {
    // Primary Brand Colors
    primary: {
      blue: '#1E3A8A', // Royal blue from logo
      yellow: '#FCD34D', // Golden yellow from logo
      cyan: '#06B6D4', // Turquoise blue accent
      navy: '#0F172A', // Dark navy for contrast
    },
    
    // Light Theme
    light: {
      background: {
        primary: '#FFFFFF', // White smoke
        secondary: '#F8FAFC', // Soft white
        tertiary: '#F1F5F9', // Light gray
        accent: '#EFF6FF', // Light blue tint
      },
      text: {
        primary: '#0F172A', // Charcoal black
        secondary: '#475569', // Steel gray
        tertiary: '#64748B', // Medium gray
        accent: '#1E3A8A', // Royal blue
      },
      border: {
        primary: '#E2E8F0', // Light border
        secondary: '#CBD5E1', // Medium border
        accent: '#3B82F6', // Blue accent border
      },
      surface: {
        card: '#FFFFFF', // Pure white cards
        elevated: '#F8FAFC', // Elevated surfaces
        overlay: 'rgba(255, 255, 255, 0.95)', // Modal overlays
      }
    },
    
    // Dark Theme
    dark: {
      background: {
        primary: '#0F172A', // Deep navy like the show
        secondary: '#1E293B', // Darker navy
        tertiary: '#334155', // Medium navy
        accent: '#1E3A8A', // Royal blue accent
      },
      text: {
        primary: '#F8FAFC', // Near white
        secondary: '#CBD5E1', // Light gray
        tertiary: '#94A3B8', // Medium gray
        accent: '#FCD34D', // Golden yellow
      },
      border: {
        primary: '#334155', // Dark border
        secondary: '#475569', // Medium border
        accent: '#06B6D4', // Cyan accent
      },
      surface: {
        card: '#1E293B', // Dark cards
        elevated: '#334155', // Elevated dark surfaces
        overlay: 'rgba(15, 23, 42, 0.95)', // Dark overlays
      }
    },
    
    // Status Colors
    status: {
      success: '#10B981', // Green for funded deals
      warning: '#F59E0B', // Orange for pending
      error: '#EF4444', // Red for rejected
      info: '#06B6D4', // Cyan for information
    },
    
    // Shark Individual Colors (for personal branding)
    sharks: {
      ashneer: '#EF4444', // Bold red - aggressive style
      namita: '#8B5CF6', // Purple - healthcare/pharma
      aman: '#06B6D4', // Cyan - consumer electronics
      peyush: '#10B981', // Green - e-commerce/tech
      vineeta: '#F59E0B', // Orange - beauty/D2C
      anupam: '#3B82F6', // Blue - internet/tech
      ghazal: '#EC4899', // Pink - FMCG/baby care
      ritesh: '#6366F1', // Indigo - hospitality/travel
    }
  },
  
  // Typography inspired by professional business aesthetics
  typography: {
    fontFamily: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      heading: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    }
  },
  
  // Spacing system
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  // Border radius for modern look
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
  },
  
  // Professional shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    shark: '0 20px 40px -12px rgba(30, 58, 138, 0.3)',
  },
  
  // Brand gradients
  gradients: {
    primary: 'linear-gradient(135deg, #1E3A8A 0%, #06B6D4 100%)',
    secondary: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    danger: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    shark: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #06B6D4 100%)',
  },
  
  // Animation system
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  }
};

export type SharkTankTheme = typeof sharkTankTheme;