import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-helpers';

export default async function HomePage() {
  const session = await getSession();

  if (session && (session.user as any)?.role === 'ADMIN') {
    redirect('/admin/dashboard');
  }

  // Page d'accueil publique si pas connecté
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          PhishLab
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Plateforme de sensibilisation au phishing
        </p>
        <div className="space-x-4">
          <a
            href="/auth/signin"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Se connecter
          </a>
        </div>
      </div>
    </div>
  );
}

