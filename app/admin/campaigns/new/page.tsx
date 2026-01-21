'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    emailContent: '',
    landingPageUrl: '',
    educationalContent: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const campaign = await response.json();
        router.push(`/admin/campaigns/${campaign.id}`);
      } else {
        alert('Erreur lors de la création de la campagne');
      }
    } catch (error) {
      alert('Erreur lors de la création de la campagne');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nouvelle campagne</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nom de la campagne *
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Ex: Test de phishing - Banque"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Description de la campagne..."
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Sujet de l'email *
          </label>
          <input
            id="subject"
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Ex: Action requise : Vérifiez votre compte"
          />
        </div>

        <div>
          <label htmlFor="emailContent" className="block text-sm font-medium text-gray-700 mb-2">
            Contenu de l'email (HTML) *
          </label>
          <textarea
            id="emailContent"
            required
            value={formData.emailContent}
            onChange={(e) => setFormData({ ...formData, emailContent: e.target.value })}
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
            placeholder="<html>...</html>"
          />
        </div>

        <div>
          <label htmlFor="landingPageUrl" className="block text-sm font-medium text-gray-700 mb-2">
            URL de la landing page simulée *
          </label>
          <input
            id="landingPageUrl"
            type="url"
            required
            value={formData.landingPageUrl}
            onChange={(e) => setFormData({ ...formData, landingPageUrl: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="https://example.com/login"
          />
        </div>

        <div>
          <label htmlFor="educationalContent" className="block text-sm font-medium text-gray-700 mb-2">
            Contenu éducatif (affiché après interaction) *
          </label>
          <textarea
            id="educationalContent"
            required
            value={formData.educationalContent}
            onChange={(e) => setFormData({ ...formData, educationalContent: e.target.value })}
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Contenu éducatif expliquant pourquoi c'était un email de phishing..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création...' : 'Créer la campagne'}
          </button>
        </div>
      </form>
    </div>
  );
}

