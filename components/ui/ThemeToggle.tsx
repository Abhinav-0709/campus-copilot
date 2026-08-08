'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-[#232833] bg-white dark:bg-[#161B26] p-2 text-slate-700 dark:text-[#F5F6F8] hover:bg-slate-100 dark:hover:bg-[#232833] transition-all cursor-pointer shadow-sm"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-slate-700" />
      ) : (
        <Sun className="h-4 w-4 text-[#E8D44D]" />
      )}
    </button>
  );
}
