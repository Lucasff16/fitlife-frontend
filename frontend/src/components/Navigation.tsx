import {
  Activity,
  Dumbbell,
  Home,
  LineChart,
  Settings,
  Target,
  User
} from 'lucide-react';
import { Dock, DockIcon, DockItem, DockLabel } from './ui/dock';

const menuItems = [
  {
    title: 'Home',
    icon: <Home className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
    href: '/'
  },
  {
    title: 'Workouts',
    icon: <Dumbbell className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
    href: '/workouts'
  },
  {
    title: 'Progress',
    icon: <Activity className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
    href: '/progress'
  },
  {
    title: 'Goals',
    icon: <Target className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
    href: '/goals'
  },
  {
    title: 'Stats',
    icon: <LineChart className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
    href: '/stats'
  },
  {
    title: 'Profile',
    icon: <User className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
    href: '/profile'
  },
  {
    title: 'Settings',
    icon: <Settings className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
    href: '/settings'
  }
];

export function Navigation() {
  return (
    <div className="fixed bottom-2 left-1/2 max-w-full -translate-x-1/2">
      <Dock>
        {menuItems.map((item, idx) => (
          <DockItem
            key={idx}
            className="group relative aspect-square rounded-xl bg-white/50 dark:bg-neutral-800/50"
          >
            <DockLabel>{item.title}</DockLabel>
            <DockIcon>{item.icon}</DockIcon>
          </DockItem>
        ))}
      </Dock>
    </div>
  );
}