import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import Link from 'next/link';

export default async function CampaignsPage() {
  const user = await requireAuth('ADMIN');

  const campaigns = await prisma.campaign.findMany({
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
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Campagnes</h1>
        <Link
          href="/admin/campaigns/new"
          className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
        >
          Nouvelle campagne
        </Link>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-lg shadow overflow-hidden">
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
                Date de création
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
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  Aucune campagne créée. <Link href="/admin/campaigns/new" className="text-pink-600 hover:text-pink-500">Créez-en une maintenant</Link>.
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
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
                    {new Date(campaign.createdAt).toLocaleDateString('fr-FR')}
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
                      className="text-pink-600 hover:text-pink-500 mr-4 transition"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

