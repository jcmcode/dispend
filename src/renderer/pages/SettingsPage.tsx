import { Header } from '@renderer/components/layout/Header';
import { useThemeStore } from '@renderer/stores/theme';
import { Button } from '@renderer/components/ui/button';

export function SettingsPage() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div>
      <Header title="Settings" />
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-sm font-medium mb-2">Appearance</h2>
          <div className="flex gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('light')}
            >
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('dark')}
            >
              Dark
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-medium mb-2">Data</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.api.app.backup()}
          >
            Create Backup
          </Button>
        </div>
      </div>
    </div>
  );
}
