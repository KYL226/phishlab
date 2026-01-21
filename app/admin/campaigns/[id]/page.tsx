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
  const [showEditForm, setShowEditForm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    subject: '',
    emailContent: '',
    landingPageUrl: '',
    educationalContent: '',
  });

  useEffect(() => {
    fetchCampaign();
  }, [params.id]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCampaign(data);
        setEditData({
          name: data.name,
          description: data.description || '',
          subject: data.subject,
          emailContent: data.emailContent,
          landingPageUrl: data.landingPageUrl,
          educationalContent: data.educationalContent || '',
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const response = await fetch(`/api/campaigns/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        setShowEditForm(false);
        fetchCampaign();
        alert('Campagne mise à jour avec succès');
      } else {
        alert('Erreur lors de la mise à jour');
      }
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette campagne ? Cette action est irréversible.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/campaigns/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/campaigns');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      alert('Erreur lors de la suppression');
    } finally {
      setDeleting(false);
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
    return <div className="text-center py-12 text-white">Chargement...</div>;
  }

  if (!campaign) {
    return <div className="text-center py-12 text-white">Campagne non trouvée</div>;
  }

  const clickedCount = campaign.targets.filter((t) => t.clickedAt).length;
  const submittedCount = campaign.targets.filter((t) => t.submittedAt).length;
  const openedCount = campaign.targets.filter((t) => t.openedAt).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin/campaigns" className="text-pink-600 hover:text-pink-500 mb-2 inline-block transition">
            ← Retour aux campagnes
          </Link>
          <h1 className="text-3xl font-bold text-white">{campaign.name}</h1>
        </div>
        <div className="flex gap-3">
          {campaign.status === 'DRAFT' && (
            <>
              <button
                onClick={() => setShowEditForm(!showEditForm)}
                className="bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-600 transition"
              >
                {showEditForm ? 'Annuler' : 'Modifier'}
              </button>
              <button
                onClick={() => setShowSendForm(!showSendForm)}
                className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition"
              >
                Envoyer la campagne
              </button>
            </>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
          >
            {deleting ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>

      {showEditForm && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Modifier la campagne</h2>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-slate-300 mb-2">
                Nom de la campagne *
              </label>
              <input
                id="edit-name"
                type="text"
                required
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>

            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                id="edit-description"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>

            <div>
              <label htmlFor="edit-subject" className="block text-sm font-medium text-slate-300 mb-2">
                Sujet de l'email *
              </label>
              <input
                id="edit-subject"
                type="text"
                required
                value={editData.subject}
                onChange={(e) => setEditData({ ...editData, subject: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>

            <div>
              <label htmlFor="edit-emailContent" className="block text-sm font-medium text-slate-300 mb-2">
                Contenu de l'email (HTML) *
              </label>
              <textarea
                id="edit-emailContent"
                required
                value={editData.emailContent}
                onChange={(e) => setEditData({ ...editData, emailContent: e.target.value })}
                rows={10}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition font-mono text-sm"
              />
            </div>

            <div>
              <label htmlFor="edit-landingPageUrl" className="block text-sm font-medium text-slate-300 mb-2">
                URL de la landing page simulée *
              </label>
              <input
                id="edit-landingPageUrl"
                type="url"
                required
                value={editData.landingPageUrl}
                onChange={(e) => setEditData({ ...editData, landingPageUrl: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>

            <div>
              <label htmlFor="edit-educationalContent" className="block text-sm font-medium text-slate-300 mb-2">
                Contenu éducatif (affiché après interaction) *
              </label>
              <textarea
                id="edit-educationalContent"
                required
                value={editData.educationalContent}
                onChange={(e) => setEditData({ ...editData, educationalContent: e.target.value })}
                rows={8}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                className="px-6 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={sending}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50 transition"
              >
                {sending ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>
      )}

      {showSendForm && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Envoyer la campagne</h2>
          <textarea
            value={targetsInput}
            onChange={(e) => setTargetsInput(e.target.value)}
            rows={8}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg mb-4 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
            placeholder="Entrez les emails des cibles (un par ligne)&#10;Exemple:&#10;user1@example.com&#10;Jean Dupont &lt;user2@example.com&gt;"
          />
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowSendForm(false)}
              className="px-6 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 transition"
            >
              Annuler
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50 transition"
            >
              {sending ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Cibles</h3>
          <p className="text-3xl font-bold text-white">{campaign._count.targets}</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Emails ouverts</h3>
          <p className="text-3xl font-bold text-white">{openedCount}</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Clics</h3>
          <p className="text-3xl font-bold text-white">{clickedCount}</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Formulaires soumis</h3>
          <p className="text-3xl font-bold text-white">{submittedCount}</p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white">Cibles</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Ouvert</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Cliqué</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Soumis</th>
              </tr>
            </thead>
            <tbody className="bg-slate-950 divide-y divide-slate-800">
              {campaign.targets.map((target) => (
                <tr key={target.id} className="hover:bg-slate-900 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{target.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{target.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {target.openedAt ? '✓' : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {target.clickedAt ? '✓' : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
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

