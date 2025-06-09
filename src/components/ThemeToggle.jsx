import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="theme-toggle loading">
        <div className="theme-toggle-spinner"></div>
      </div>
    );
  }

  return (
    <button
      className={`theme-toggle ${isDark ? 'dark' : 'light'}`}
      onClick={toggleTheme}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="theme-toggle-track">
        <div className="theme-toggle-thumb">
          {isDark ? (
            <Moon size={14} className="theme-icon" />
          ) : (
            <Sun size={14} className="theme-icon" />
          )}
        </div>
      </div>
      <span className="theme-toggle-label">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
};

export default ThemeToggle;
