'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/_components/ui/button';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    try {
      const root = document.documentElement;
      const stored = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialDark = stored ? stored === 'dark' : systemPrefersDark;
      setIsDark(root.classList.contains('dark') || initialDark);
    } catch {
      // no-op
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    const root = document.documentElement;
    if (next) {
      root.classList.add('dark');
      try { localStorage.setItem('theme', 'dark'); } catch { /* empty */ }
    } else {
      root.classList.remove('dark');
      try { localStorage.setItem('theme', 'light'); } catch { /* empty */ }
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggle}
      className="h-9 w-9"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}


