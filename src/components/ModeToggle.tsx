import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ModeToggle() {
  const [theme, setThemeState] = useState<'theme-light' | 'dark' | 'system'>('theme-light');

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setThemeState(isDarkMode ? 'dark' : 'theme-light');
  }, []);

  // Handle theme changing with animation
  const setTheme = (newTheme: 'theme-light' | 'dark' | 'system') => {
    // Check if View Transitions API is supported
    if ('startViewTransition' in document) {
      // @ts-ignore - TypeScript doesn't know about startViewTransition yet
      document.startViewTransition(() => {
        setThemeState(newTheme);

        const isDark =
          newTheme === 'dark' ||
          (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
      });
    } else {
      // Fallback for browsers without View Transitions API
      setThemeState(newTheme);

      const isDark =
        newTheme === 'dark' ||
        (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      (document as Document).documentElement.classList[isDark ? 'add' : 'remove']('dark');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('theme-light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
