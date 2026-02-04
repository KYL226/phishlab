'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface CampaignStat {
  nom: string;
  total: number;
  ouvert: number;
  clic: number;
  soumis: number;
  tauxOuverture: number;
  tauxClic: number;
  tauxSoumission: number;
}

const COLORS = ['#ec4899', '#f472b6', '#fbbf24', '#34d399', '#60a5fa'];

export default function StatistiquesPage() {
  const [campaignStats, setCampaignStats] = useState<CampaignStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics/stats');
      if (response.ok) {
        const result = await response.json();
        setCampaignStats(result.campaigns);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-white">Chargement...</div>;
  }

  const pieData = [
    { name: 'Ouverts', value: campaignStats.reduce((sum, c) => sum + c.ouvert, 0) },
    { name: 'Clics', value: campaignStats.reduce((sum, c) => sum + c.clic, 0) },
    { name: 'Soumissions', value: campaignStats.reduce((sum, c) => sum + c.soumis, 0) },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Statistiques détaillées</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-950 border border-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            Répartition des interactions
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(((percent ?? 0) * 100).toFixed(0))}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            Taux par campagne
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignStats.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="nom"
                stroke="#9CA3AF"
                angle={-45}
                textAnchor="end"
                height={100}
                style={{ fontSize: '10px' }}
              />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Bar dataKey="tauxOuverture" fill="#ec4899" name="Taux ouverture %" />
              <Bar dataKey="tauxClic" fill="#f472b6" name="Taux clic %" />
              <Bar dataKey="tauxSoumission" fill="#fbbf24" name="Taux soumission %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-white mb-6">
          Statistiques par campagne
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                  Campagne
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                  Ouvert
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                  Clic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                  Soumis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                  Taux Ouverture
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                  Taux Clic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                  Taux Soumission
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-950 divide-y divide-slate-800">
              {campaignStats.map((stat, index) => (
                <tr key={index} className="hover:bg-slate-900 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {stat.nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {stat.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {stat.ouvert}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {stat.clic}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {stat.soumis}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-500">
                    {stat.tauxOuverture.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-400">
                    {stat.tauxClic.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-500">
                    {stat.tauxSoumission.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

