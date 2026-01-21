'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-8">
            <Link
              href="/admin/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/admin/dashboard'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Tableau de bord
            </Link>
            <Link
              href="/admin/campaigns"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname?.startsWith('/admin/campaigns')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Campagnes
            </Link>
            <Link
              href="/admin/campaigns/new"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/admin/campaigns/new'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Nouvelle campagne
            </Link>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}

