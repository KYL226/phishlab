'use client';

import { usePathname } from 'next/navigation';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex">
      {pathname?.startsWith('/admin/dashboard') && <DashboardSidebar />}
      <main className={`flex-1 container mx-auto px-4 py-8 ${pathname?.startsWith('/admin/dashboard') ? 'ml-64' : ''}`}>{children}</main>
    </div>
  );
}

