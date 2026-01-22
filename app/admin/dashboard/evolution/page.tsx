'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  date: string;
  ouvert: number;
  clic: number;
  soumis: number;
}

export default function EvolutionPage() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchData();
  }, [days]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/evolution?days=${days}`);
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  if (loading) {
    return <div className="text-center py-12 text-white">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Évolution des taux</h1>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                days === d
                  ? 'bg-pink-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {d} jours
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-6">
          Évolution des interactions sur {days} jours
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff',
              }}
              labelFormatter={(label) => `Date: ${formatDate(label)}`}
            />
            <Legend
              wrapperStyle={{ color: '#9CA3AF' }}
            />
            <Line
              type="monotone"
              dataKey="ouvert"
              stroke="#ec4899"
              strokeWidth={2}
              name="Emails ouverts"
              dot={{ fill: '#ec4899', r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="clic"
              stroke="#f472b6"
              strokeWidth={2}
              name="Clics"
              dot={{ fill: '#f472b6', r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="soumis"
              stroke="#fbbf24"
              strokeWidth={2}
              name="Soumissions"
              dot={{ fill: '#fbbf24', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Total ouvert</h3>
          <p className="text-3xl font-bold text-pink-500">
            {data.reduce((sum, d) => sum + d.ouvert, 0)}
          </p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Total clics</h3>
          <p className="text-3xl font-bold text-pink-400">
            {data.reduce((sum, d) => sum + d.clic, 0)}
          </p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Total soumissions</h3>
          <p className="text-3xl font-bold text-yellow-500">
            {data.reduce((sum, d) => sum + d.soumis, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}

