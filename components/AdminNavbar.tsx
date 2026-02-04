'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-950 shadow-sm border-b border-slate-800 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-8">
            <Link
              href="/admin/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                pathname === '/admin/dashboard'
                  ? 'bg-pink-600/20 text-pink-400 border border-pink-800'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-pink-400'
              }`}
            >
              Tableau de bord
            </Link>
            <Link
              href="/admin/campaigns"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                pathname?.startsWith('/admin/campaigns')
                  ? 'bg-pink-600/20 text-pink-400 border border-pink-800'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-pink-400'
              }`}
            >
              Campagnes
            </Link>
            <Link
              href="/admin/campaigns/new"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                pathname === '/admin/campaigns/new'
                  ? 'bg-pink-600/20 text-pink-400 border border-pink-800'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-pink-400'
              }`}
            >
              Nouvelle campagne
            </Link>
            <Link
              href="/admin/templates"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                pathname?.startsWith('/admin/templates')
                  ? 'bg-pink-600/20 text-pink-400 border border-pink-800'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-pink-400'
              }`}
            >
              Templates
            </Link>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-pink-400 rounded-md transition"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}

