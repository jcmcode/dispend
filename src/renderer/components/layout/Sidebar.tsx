import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Landmark,
  PieChart,
  TrendingUp,
  FileText,
  Lightbulb,
  Settings,
  Upload,
  FolderTree,
} from 'lucide-react';
import { cn } from '@renderer/lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/accounts', icon: Landmark, label: 'Accounts' },
  { to: '/categories', icon: FolderTree, label: 'Categories' },
  { to: '/budgets', icon: PieChart, label: 'Budgets' },
  { to: '/investments', icon: TrendingUp, label: 'Investments' },
  { to: '/reports', icon: FileText, label: 'Reports' },
  { to: '/insights', icon: Lightbulb, label: 'Insights' },
  { to: '/import', icon: Upload, label: 'Import' },
];

const bottomItems = [
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-60 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center px-6 font-bold text-lg tracking-tight" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
        <span className="ml-8">Dispend</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t px-3 py-2">
        {bottomItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
