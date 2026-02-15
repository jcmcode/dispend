import { Moon, Sun } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';
import { useThemeStore } from '@renderer/stores/theme';

export function Header({ title }: { title: string }) {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
