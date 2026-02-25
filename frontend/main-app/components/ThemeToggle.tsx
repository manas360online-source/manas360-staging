/**
 * Professional Theme Toggle Component
 * 
 * Features:
 * - Smooth icon animation
 * - Instant theme application
 * - localStorage persistence
 * - Accessible with proper ARIA labels
 */

import React from 'react';
import { useTheme } from '../utils/themeUtils';

// Icons
const SunIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transition-transform duration-300"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="transition-transform duration-300"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export const ThemeToggle: React.FC<{
  className?: string;
  showLabel?: boolean;
}> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Toggle ${theme === 'light' ? 'dark' : 'light'} theme`}
      className={`
        p-2 rounded-lg
        text-gray-700 dark:text-gray-200
        bg-gray-100 dark:bg-slate-800
        hover:bg-gray-200 dark:hover:bg-slate-700
        transition-all duration-200
        flex items-center gap-2
        ${className}
      `}
    >
      <div className="relative w-5 h-5">
        {theme === 'light' ? (
          <SunIcon />
        ) : (
          <MoonIcon />
        )}
      </div>
      {showLabel && (
        <span className="text-sm font-medium">
          {theme === 'light' ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
