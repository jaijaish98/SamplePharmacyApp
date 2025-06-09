import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme - force dark theme as default
  useEffect(() => {
    const initializeTheme = () => {
      try {
        // Force dark theme as default
        setTheme('dark');
        // Clear any existing theme preference
        localStorage.removeItem('pharmacy-theme');
      } catch (error) {
        console.warn('Error accessing localStorage:', error);
        setTheme('dark'); // Fallback to dark theme
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, []);

  // Apply dark theme to document root
  useEffect(() => {
    if (!isLoading) {
      document.documentElement.setAttribute('data-theme', 'dark');

      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#1f2937');
      }
    }
  }, [isLoading]);

  // Save theme preference to localStorage
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    try {
      localStorage.setItem('pharmacy-theme', newTheme);
    } catch (error) {
      console.warn('Error saving theme to localStorage:', error);
    }
  };

  // Set specific theme
  const setSpecificTheme = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
      
      try {
        localStorage.setItem('pharmacy-theme', newTheme);
      } catch (error) {
        console.warn('Error saving theme to localStorage:', error);
      }
    }
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      // Only update if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('pharmacy-theme');
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const value = {
    theme: 'dark',
    toggleTheme: () => {}, // Disabled
    setTheme: () => {}, // Disabled
    isDark: true,
    isLight: false,
    isLoading
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
