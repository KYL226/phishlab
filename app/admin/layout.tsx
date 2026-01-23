import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-helpers';
import AdminNavbar from '@/components/AdminNavbar';
import DashboardLayout from '@/components/DashboardLayout';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminNavbar />
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}

