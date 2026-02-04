'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Activity
} from 'lucide-react';

export default function DashboardSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Vue d\'ensemble',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Évolution des taux',
      href: '/admin/dashboard/evolution',
      icon: TrendingUp,
    },
    {
      name: 'Statistiques détaillées',
      href: '/admin/dashboard/statistiques',
      icon: BarChart3,
    },
    {
      name: 'Heatmap',
      href: '/admin/dashboard/heatmap',
      icon: Calendar,
    },
    {
      name: 'Activité en temps réel',
      href: '/admin/dashboard/activite',
      icon: Activity,
    },
  ];

  return (
    <aside className="fixed left-0 top-16 w-64 bg-slate-950 border-r border-slate-800 h-[calc(100vh-4rem)] overflow-y-auto p-6 z-40">
      <h2 className="text-xl font-bold text-white mb-6">Analytics</h2>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-pink-600/20 text-pink-400 border border-pink-800'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-pink-400'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

