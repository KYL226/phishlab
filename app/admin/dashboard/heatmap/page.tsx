'use client';

import { useEffect, useState } from 'react';
import { Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Rectangle } from 'recharts';

interface HeatmapData {
  jour: string;
  heure: number;
  valeur: number;
}

const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function HeatmapPage() {
  const [data, setData] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics/heatmap');
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

  // Transformer les données pour la heatmap
  const heatmapData: Record<string, Record<number, number>> = {};
  data.forEach((item) => {
    if (!heatmapData[item.jour]) {
      heatmapData[item.jour] = {};
    }
    heatmapData[item.jour][item.heure] = item.valeur;
  });

  const maxValue = Math.max(...data.map((d) => d.valeur));

  const getColor = (value: number) => {
    if (value === 0) return '#1e293b';
    const intensity = value / maxValue;
    if (intensity < 0.2) return '#7c2d12';
    if (intensity < 0.4) return '#9a3412';
    if (intensity < 0.6) return '#c2410c';
    if (intensity < 0.8) return '#ea580c';
    return '#ec4899';
  };

  if (loading) {
    return <div className="text-center py-12 text-white">Chargement...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Heatmap des interactions</h1>

      <div className="bg-slate-950 border border-slate-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-6">
          Répartition par jour de la semaine et heure
        </h2>
        <p className="text-slate-400 mb-6 text-sm">
          Visualisez les moments où vos utilisateurs sont le plus vulnérables aux attaques de phishing.
        </p>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-400">Jour</th>
                  {Array.from({ length: 24 }, (_, i) => (
                    <th
                      key={i}
                      className="px-2 py-2 text-center text-xs font-medium text-slate-400"
                    >
                      {i}h
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <tr key={day}>
                    <td className="px-4 py-2 text-sm text-white font-medium">{day}</td>
                    {Array.from({ length: 24 }, (_, hour) => {
                      const value = heatmapData[day]?.[hour] || 0;
                      return (
                        <td
                          key={hour}
                          className="px-2 py-2 text-center"
                          style={{
                            backgroundColor: getColor(value),
                            color: value > maxValue * 0.5 ? '#fff' : '#9ca3af',
                          }}
                          title={`${day} ${hour}h: ${value} interaction(s)`}
                        >
                          {value > 0 ? value : ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <span className="text-sm text-slate-400">Légende :</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-800 border border-slate-700"></div>
            <span className="text-xs text-slate-400">0</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-900"></div>
            <span className="text-xs text-slate-400">Faible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-700"></div>
            <span className="text-xs text-slate-400">Moyen</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500"></div>
            <span className="text-xs text-slate-400">Élevé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-600"></div>
            <span className="text-xs text-slate-400">Très élevé</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Période la plus vulnérable</h3>
          {(() => {
            const maxDay = days.reduce((max, day) => {
              const dayTotal = Object.values(heatmapData[day] || {}).reduce((a, b) => a + b, 0);
              const maxTotal = Object.values(heatmapData[max] || {}).reduce((a, b) => a + b, 0);
              return dayTotal > maxTotal ? day : max;
            }, days[0]);

            const maxHour = Array.from({ length: 24 }, (_, i) => i).reduce((max, hour) => {
              const hourTotal = days.reduce(
                (sum, day) => sum + (heatmapData[day]?.[hour] || 0),
                0
              );
              const maxTotal = days.reduce(
                (sum, day) => sum + (heatmapData[day]?.[max] || 0),
                0
              );
              return hourTotal > maxTotal ? hour : max;
            }, 0);

            return (
              <div className="text-slate-300">
                <p className="text-2xl font-bold text-pink-500 mb-2">{maxDay}</p>
                <p className="text-lg">Heure de pointe : {maxHour}h</p>
              </div>
            );
          })()}
        </div>

        <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Total d'interactions</h3>
          <p className="text-3xl font-bold text-white">
            {data.reduce((sum, d) => sum + d.valeur, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}

