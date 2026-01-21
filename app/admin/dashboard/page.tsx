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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Campagnes</h3>
          <p className="text-3xl font-bold text-gray-900">{stats._count.id}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Cibles</h3>
          <p className="text-3xl font-bold text-gray-900">{totalTargets}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Clics</h3>
          <p className="text-3xl font-bold text-gray-900">{totalClicks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Soumissions</h3>
          <p className="text-3xl font-bold text-gray-900">{totalSubmissions}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Campagnes récentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cibles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentCampaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {campaign.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        campaign.status === 'SENT'
                          ? 'bg-green-100 text-green-800'
                          : campaign.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {campaign.status === 'SENT'
                        ? 'Envoyée'
                        : campaign.status === 'COMPLETED'
                        ? 'Terminée'
                        : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign._count.targets}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign._count.interactions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/admin/campaigns/${campaign.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
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

      <div className="mt-8">
        <Link
          href="/admin/campaigns/new"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Créer une nouvelle campagne
        </Link>
      </div>
    </div>
  );
}

