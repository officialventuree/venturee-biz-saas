import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Default dark theme with gold accents
const darkTheme = {
  // Background colors
  background: '#0B0F14',           // Deep charcoal
  backgroundLight: '#111827',      // Midnight black
  backgroundMedium: '#1F2937',     // Dark gray
  backgroundCard: '#111827',       // Card backgrounds
  
  // Text colors
  textPrimary: '#E5E7EB',          // Platinum white
  textSecondary: '#9CA3AF',        // Light gray
  textTertiary: '#6B7280',         // Muted gray
  
  // Gold accents
  goldPrimary: '#D4AF37',          // Rich gold
  goldSecondary: '#F5D547',        // Lighter gold
  goldTertiary: '#C5A82A',         // Darker gold
  
  // Status colors
  success: '#10B981',              // Green
  warning: '#F59E0B',              // Amber
  error: '#EF4444',                // Red
  info: '#3B82F6',                 // Blue
  
  // UI elements
  border: '#374151',               // Dark border
  shadow: 'rgba(0, 0, 0, 0.5)',   // Shadow color
  overlay: 'rgba(0, 0, 0, 0.7)',  // Overlay for modals
  
  // Other
  transition: 'all 0.3s ease-in-out',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
};

// Light theme (optional)
const lightTheme = {
  // Background colors
  background: '#F9FAFB',
  backgroundLight: '#FFFFFF',
  backgroundMedium: '#F3F4F6',
  backgroundCard: '#FFFFFF',
  
  // Text colors
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  
  // Gold accents
  goldPrimary: '#D4AF37',
  goldSecondary: '#F5D547',
  goldTertiary: '#C5A82A',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // UI elements
  border: '#E5E7EB',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Other
  transition: 'all 0.3s ease-in-out',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(darkTheme);
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    if (isDark) {
      setTheme(lightTheme);
      setIsDark(false);
    } else {
      setTheme(darkTheme);
      setIsDark(true);
    }
  };

  // Apply theme to document root for CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    // Set CSS variables based on theme
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--background-light', theme.backgroundLight);
    root.style.setProperty('--background-medium', theme.backgroundMedium);
    root.style.setProperty('--background-card', theme.backgroundCard);
    
    root.style.setProperty('--text-primary', theme.textPrimary);
    root.style.setProperty('--text-secondary', theme.textSecondary);
    root.style.setProperty('--text-tertiary', theme.textTertiary);
    
    root.style.setProperty('--gold-primary', theme.goldPrimary);
    root.style.setProperty('--gold-secondary', theme.goldSecondary);
    root.style.setProperty('--gold-tertiary', theme.goldTertiary);
    
    root.style.setProperty('--success', theme.success);
    root.style.setProperty('--warning', theme.warning);
    root.style.setProperty('--error', theme.error);
    root.style.setProperty('--info', theme.info);
    
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--shadow', theme.shadow);
    root.style.setProperty('--overlay', theme.overlay);
    
    root.style.setProperty('--transition', theme.transition);
    root.style.setProperty('--border-radius', theme.borderRadius);
    root.style.setProperty('--box-shadow', theme.boxShadow);
  }, [theme]);

  const value = {
    theme,
    isDark,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};