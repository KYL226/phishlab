import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-helpers';
import AdminNavbar from '@/components/AdminNavbar';

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
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

