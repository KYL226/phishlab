'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  subject: string;
  status: string;
  targets: Array<{
    id: string;
    email: string;
    name: string | null;
    clickedAt: Date | null;
    submittedAt: Date | null;
    openedAt: Date | null;
  }>;
  interactions: Array<{
    id: string;
    type: string;
    timestamp: Date;
    data: string | null;
  }>;
  _count: {
    targets: number;
    interactions: number;
  };
}

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showSendForm, setShowSendForm] = useState(false);
  const [targetsInput, setTargetsInput] = useState('');

  useEffect(() => {
    fetchCampaign();
  }, [params.id]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCampaign(data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const targets = targetsInput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.includes('@'))
      .map((line) => {
        const parts = line.split(/[\s<>,]+/);
        const email = parts.find((p) => p.includes('@'));
        const name = parts.filter((p) => !p.includes('@') && p).join(' ') || undefined;
        return { email: email || line, name };
      });

    if (targets.length === 0) {
      alert('Veuillez entrer au moins une adresse email');
      return;
    }

    setSending(true);
    try {
      const response = await fetch(`/api/campaigns/${params.id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targets }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`${result.sent} emails envoyés sur ${result.total}`);
        setShowSendForm(false);
        setTargetsInput('');
        fetchCampaign();
      } else {
        alert('Erreur lors de l\'envoi');
      }
    } catch (error) {
      alert('Erreur lors de l\'envoi');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (!campaign) {
    return <div className="text-center py-12">Campagne non trouvée</div>;
  }

  const clickedCount = campaign.targets.filter((t) => t.clickedAt).length;
  const submittedCount = campaign.targets.filter((t) => t.submittedAt).length;
  const openedCount = campaign.targets.filter((t) => t.openedAt).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin/campaigns" className="text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
            ← Retour aux campagnes
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
        </div>
        {campaign.status === 'DRAFT' && (
          <button
            onClick={() => setShowSendForm(!showSendForm)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Envoyer la campagne
          </button>
        )}
      </div>

      {showSendForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Envoyer la campagne</h2>
          <textarea
            value={targetsInput}
            onChange={(e) => setTargetsInput(e.target.value)}
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            placeholder="Entrez les emails des cibles (un par ligne)&#10;Exemple:&#10;user1@example.com&#10;Jean Dupont &lt;user2@example.com&gt;"
          />
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowSendForm(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {sending ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Cibles</h3>
          <p className="text-3xl font-bold text-gray-900">{campaign._count.targets}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Emails ouverts</h3>
          <p className="text-3xl font-bold text-gray-900">{openedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Clics</h3>
          <p className="text-3xl font-bold text-gray-900">{clickedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Formulaires soumis</h3>
          <p className="text-3xl font-bold text-gray-900">{submittedCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Cibles</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ouvert</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliqué</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Soumis</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaign.targets.map((target) => (
                <tr key={target.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{target.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{target.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {target.openedAt ? '✓' : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {target.clickedAt ? '✓' : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {target.submittedAt ? '✓' : '-'}
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

