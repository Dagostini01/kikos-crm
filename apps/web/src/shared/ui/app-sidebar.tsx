import {
  BriefcaseBusiness,
  LayoutDashboard,
  LogOut,
  Users,
  UserRound,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { User } from '@/features/auth/model/types';
import { cn } from '@/lib/utils';

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/negocios', label: 'Negócios', icon: BriefcaseBusiness },
  { to: '/vendedores', label: 'Vendedores', icon: UserRound },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function roleLabel(role: User['role']) {
  return role === 'ADMIN' ? 'Administrador' : 'Membro';
}

type AppSidebarProps = {
  user: User;
  onLogout: () => void;
  onNavigate?: () => void;
  className?: string;
};

export function AppSidebar({
  user,
  onLogout,
  onNavigate,
  className,
}: AppSidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-full min-h-svh w-60 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground',
        className,
      )}
    >
      <div className="flex items-baseline gap-2 px-5 py-5">
        <span className="text-lg font-bold tracking-wide">KIKOS</span>
        <span className="text-xs font-bold tracking-widest text-primary">
          CRM
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive &&
                    'border-l-2 border-primary bg-sidebar-accent text-sidebar-accent-foreground',
                )
              }
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 px-3 pb-4">
        <Separator />
        <div className="flex items-center gap-3 px-1">
          <Avatar size="sm">
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {roleLabel(user.role)}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start"
          onClick={onLogout}
        >
          <LogOut />
          Sair
        </Button>
      </div>
    </aside>
  );
}
