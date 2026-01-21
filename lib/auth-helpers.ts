import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth(role?: 'ADMIN' | 'TARGET') {
  const session = await getSession();
  
  if (!session?.user) {
    throw new Error('Non authentifié');
  }

  if (role && (session.user as any).role !== role) {
    throw new Error('Accès non autorisé');
  }

  return session.user;
}

