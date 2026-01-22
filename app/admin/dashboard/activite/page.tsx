'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ActivityData {
  stats: {
    ouvert: number;
    clic: number;
    soumis: number;
  };
  interactions: Array<{
    id: string;
    type: string;
    timestamp: string;
    campaignName: string;
  }>;
}

export default function ActivitePage() {
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [minutes, setMinutes] = useState(60);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Rafraîchir toutes les 30 secondes
    return () => clearInterval(interval);
  }, [minutes]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/analytics/realtime?minutes=${minutes}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Grouper les interactions par minute pour le graphique
  const chartData = data?.interactions.reduce((acc: any[], interaction) => {
    const date = new Date(interaction.timestamp);
    const minute = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    
    const existing = acc.find((item) => item.minute === minute);
    if (existing) {
      if (interaction.type === 'EMAIL_OPENED') existing.ouvert++;
      if (interaction.type === 'LINK_CLICKED') existing.clic++;
      if (interaction.type === 'FORM_SUBMITTED') existing.soumis++;
    } else {
      acc.push({
        minute,
        ouvert: interaction.type === 'EMAIL_OPENED' ? 1 : 0,
        clic: interaction.type === 'LINK_CLICKED' ? 1 : 0,
        soumis: interaction.type === 'FORM_SUBMITTED' ? 1 : 0,
      });
    }
    return acc;
  }, []) || [];

  if (loading) {
    return <div className="text-center py-12 text-white">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Activité en temps réel</h1>
        <div className="flex gap-2">
          {[15, 30, 60, 120].map((m) => (
            <button
              key={m}
              onClick={() => setMinutes(m)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                minutes === m
                  ? 'bg-pink-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {m} min
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Ouverts (dernières {minutes} min)</h3>
          <p className="text-3xl font-bold text-pink-500">{data?.stats.ouvert || 0}</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Clics (dernières {minutes} min)</h3>
          <p className="text-3xl font-bold text-pink-400">{data?.stats.clic || 0}</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Soumissions (dernières {minutes} min)</h3>
          <p className="text-3xl font-bold text-yellow-500">{data?.stats.soumis || 0}</p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-6">
          Activité par minute (dernières {minutes} minutes)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorOuvert" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorClic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f472b6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSoumis" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="minute" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Area
              type="monotone"
              dataKey="ouvert"
              stackId="1"
              stroke="#ec4899"
              fill="url(#colorOuvert)"
              name="Ouverts"
            />
            <Area
              type="monotone"
              dataKey="clic"
              stackId="1"
              stroke="#f472b6"
              fill="url(#colorClic)"
              name="Clics"
            />
            <Area
              type="monotone"
              dataKey="soumis"
              stackId="1"
              stroke="#fbbf24"
              fill="url(#colorSoumis)"
              name="Soumissions"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-white mb-6">
          Dernières interactions
        </h2>
        <div className="space-y-2">
          {data?.interactions.slice(0, 20).map((interaction) => (
            <div
              key={interaction.id}
              className="flex items-center justify-between p-3 bg-slate-900 rounded-lg hover:bg-slate-800 transition"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    interaction.type === 'EMAIL_OPENED'
                      ? 'bg-pink-500'
                      : interaction.type === 'LINK_CLICKED'
                      ? 'bg-pink-400'
                      : 'bg-yellow-500'
                  }`}
                />
                <span className="text-sm text-slate-300">
                  {interaction.type === 'EMAIL_OPENED'
                    ? 'Email ouvert'
                    : interaction.type === 'LINK_CLICKED'
                    ? 'Lien cliqué'
                    : 'Formulaire soumis'}
                </span>
                <span className="text-xs text-slate-500">
                  - {interaction.campaignName}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {new Date(interaction.timestamp).toLocaleTimeString('fr-FR')}
              </span>
            </div>
          ))}
          {(!data?.interactions || data.interactions.length === 0) && (
            <p className="text-center text-slate-400 py-8">
              Aucune interaction récente
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

