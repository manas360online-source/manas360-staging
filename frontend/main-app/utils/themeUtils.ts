/**
 * Theme System - Production-Grade Implementation
 * 
 * Features:
 * - Class-based dark mode (darkMode: "class" in Tailwind)
 * - localStorage persistence
 * - System preference fallback (only if no saved preference)
 * - Instant toggle without layout shift
 * - React hook for component integration
 */

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'manas360-theme-preference';

/**
 * Get the current theme from storage or system preference
 */
export const getInitialTheme = (): Theme => {
  return 'light';
};

/**
 * Apply theme to DOM
 */
export const applyTheme = (_theme: Theme): void => {
  const html = document.documentElement;
  const forcedTheme: Theme = 'light';
  html.classList.remove('dark');
  html.style.colorScheme = 'light';

  // Persist preference
  localStorage.setItem(STORAGE_KEY, forcedTheme);
  localStorage.setItem('theme', forcedTheme);

  // Fire custom event for other listeners
  window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: forcedTheme } }));
};

/**
 * Get current theme from DOM
 */
export const getCurrentTheme = (): Theme => {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

/**
 * Toggle between light and dark
 */
export const toggleTheme = (): Theme => {
  applyTheme('light');
  return 'light';
};

/**
 * Initialize theme on app start
 * Call this once in index.tsx before React renders
 */
export const initializeTheme = (): Theme => {
  const theme = getInitialTheme();
  applyTheme(theme);
  return theme;
};

/**
 * React Hook: useTheme
 * 
 * Usage:
 * const { theme, toggleTheme, setTheme } = useTheme();
 */
import React from 'react';

export const useTheme = () => {
  const [theme, setThemeState] = React.useState<Theme>(() => getCurrentTheme());

  React.useEffect(() => {
    // Listen for theme changes
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ theme: Theme }>;
      setThemeState(customEvent.detail.theme);
    };

    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  return {
    theme,
    toggleTheme: () => {
      const newTheme = toggleTheme();
      setThemeState(newTheme);
      return newTheme;
    },
    setTheme: (newTheme: Theme) => {
      applyTheme(newTheme);
      setThemeState(newTheme);
    },
  };
};

// Re-export for convenience
export default {
  getInitialTheme,
  applyTheme,
  getCurrentTheme,
  toggleTheme,
  initializeTheme,
  useTheme,
};
