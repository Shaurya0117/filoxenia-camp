import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Users, Calendar, 
  ClipboardList, CreditCard, Tent, 
  Stethoscope, LogOut, CheckSquare,
  ShieldAlert, Flame, BookOpen, Utensils
} from 'lucide-react';

export default function AdminLayout() {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/admin/analytics', icon: LayoutDashboard },
    { name: 'Campers', path: '/admin/campers', icon: Users },
    { name: 'Periods', path: '/admin/periods', icon: Calendar },
    { name: 'Registrations', path: '/admin/registrations', icon: ClipboardList },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Groups', path: '/admin/groups', icon: Tent },
    { name: 'Medical', path: '/admin/medical', icon: Stethoscope },
    { name: 'Check-in', path: '/admin/checkin', icon: CheckSquare },
    { name: 'Food (HACCP)', path: '/admin/food', icon: Utensils },
    { name: 'Incidents', path: '/admin/incidents', icon: ShieldAlert },
    { name: 'Fire Protection', path: '/admin/fire-protection', icon: Flame },
    { name: 'Pricing (APY)', path: '/admin/pricing', icon: CreditCard },
    { name: 'Manual', path: '/admin/manual', icon: BookOpen },
  ];

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border flex items-center gap-2">
          <Tent className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-primary">Filoxenia</h1>
            <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden text-sm">
              <p className="truncate font-medium">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="mt-2 flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
}
