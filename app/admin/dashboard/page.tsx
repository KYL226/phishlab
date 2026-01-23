import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await requireAuth('ADMIN');

  const stats = await prisma.campaign.aggregate({
    where: { createdBy: user.id },
    _count: { id: true },
  });

  const recentCampaigns = await prisma.campaign.findMany({
    where: { createdBy: user.id },
    include: {
      _count: {
        select: {
          targets: true,
          interactions: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const totalTargets = await prisma.campaignTarget.count({
    where: {
      campaign: { createdBy: user.id },
    },
  });

  const totalClicks = await prisma.interaction.count({
    where: {
      type: 'LINK_CLICKED',
      campaign: { createdBy: user.id },
    },
  });

  const totalSubmissions = await prisma.interaction.count({
    where: {
      type: 'FORM_SUBMITTED',
      campaign: { createdBy: user.id },
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Campagnes</h3>
          <p className="text-3xl font-bold text-white">{stats._count.id}</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Cibles</h3>
          <p className="text-3xl font-bold text-white">{totalTargets}</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Clics</h3>
          <p className="text-3xl font-bold text-white">{totalClicks}</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Soumissions</h3>
          <p className="text-3xl font-bold text-white">{totalSubmissions}</p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white">Campagnes récentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Cibles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Interactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-950 divide-y divide-slate-800">
              {recentCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-slate-900 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      {campaign.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        campaign.status === 'SENT'
                          ? 'bg-green-900/50 text-green-400 border border-green-800'
                          : campaign.status === 'COMPLETED'
                          ? 'bg-blue-900/50 text-blue-400 border border-blue-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {campaign.status === 'SENT'
                        ? 'Envoyée'
                        : campaign.status === 'COMPLETED'
                        ? 'Terminée'
                        : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {campaign._count.targets}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {campaign._count.interactions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/admin/campaigns/${campaign.id}`}
                      className="text-pink-600 hover:text-pink-500 transition"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/admin/campaigns/new"
          className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
        >
          Créer une nouvelle campagne
        </Link>
        <Link
          href="/admin/dashboard/evolution"
          className="inline-block bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors border border-slate-700"
        >
          Voir les graphiques
        </Link>
      </div>
    </div>
  );
}

