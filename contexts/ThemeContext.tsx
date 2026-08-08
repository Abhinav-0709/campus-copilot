'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [curtainActive, setCurtainActive] = useState(false);
  const [curtainColor, setCurtainColor] = useState<Theme>('dark');

  const applyTheme = (t: Theme) => {
    setThemeState(t);
    if (typeof document !== 'undefined') {
      if (t === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  }, []);

  const triggerCurtainTransition = (nextTheme: Theme) => {
    localStorage.setItem('theme', nextTheme);
    setCurtainColor(nextTheme);
    setCurtainActive(true);

    // Apply class midway through drop sweep
    setTimeout(() => {
      applyTheme(nextTheme);
    }, 180);

    // Reset curtain layer after drop sweep completes
    setTimeout(() => {
      setCurtainActive(false);
    }, 550);
  };

  const setTheme = (newTheme: Theme) => {
    triggerCurtainTransition(newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    triggerCurtainTransition(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {curtainActive && (
        <div
          className={`fixed inset-0 z-[999999] pointer-events-none animate-theme-drop-curtain ${
            curtainColor === 'dark' ? 'bg-[#080B0E]' : 'bg-[#EEF2F6]'
          }`}
        />
      )}
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
