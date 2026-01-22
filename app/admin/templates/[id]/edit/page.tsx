'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Template {
  id: string;
  name: string;
  category: string;
  subject: string;
  emailContent: string;
  landingPageUrl: string;
  educationalContent: string;
  isDefault: boolean;
}

export default function EditTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [template, setTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'BANCAIRE',
    subject: '',
    emailContent: '',
    landingPageUrl: '',
    educationalContent: '',
  });

  useEffect(() => {
    fetchTemplate();
  }, [params.id]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/templates/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setTemplate(data);
        setFormData({
          name: data.name,
          category: data.category,
          subject: data.subject,
          emailContent: data.emailContent,
          landingPageUrl: data.landingPageUrl,
          educationalContent: data.educationalContent,
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/templates/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/templates');
      } else {
        alert('Erreur lors de la mise à jour du template');
      }
    } catch (error) {
      alert('Erreur lors de la mise à jour du template');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-white">Chargement...</div>;
  }

  if (!template || template.isDefault) {
    return (
      <div className="text-center py-12 text-white">
        <p>Template non trouvé ou non modifiable</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-pink-600 hover:text-pink-500"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Modifier le template</h1>

      <form onSubmit={handleSubmit} className="bg-slate-950 border border-slate-800 rounded-lg shadow p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Nom du template *
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">
            Catégorie *
          </label>
          <select
            id="category"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
          >
            <option value="BANCAIRE">Bancaire</option>
            <option value="ENTREPRISE">Entreprise</option>
            <option value="LIVRAISON">Livraison</option>
            <option value="CUSTOM">Personnalisé</option>
          </select>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
            Sujet de l'email *
          </label>
          <input
            id="subject"
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
          />
        </div>

        <div>
          <label htmlFor="emailContent" className="block text-sm font-medium text-slate-300 mb-2">
            Contenu de l'email (HTML) *
          </label>
          <textarea
            id="emailContent"
            required
            value={formData.emailContent}
            onChange={(e) => setFormData({ ...formData, emailContent: e.target.value })}
            rows={12}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition font-mono text-sm"
          />
        </div>

        <div>
          <label htmlFor="landingPageUrl" className="block text-sm font-medium text-slate-300 mb-2">
            URL de la landing page simulée *
          </label>
          <input
            id="landingPageUrl"
            type="url"
            required
            value={formData.landingPageUrl}
            onChange={(e) => setFormData({ ...formData, landingPageUrl: e.target.value })}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
          />
        </div>

        <div>
          <label htmlFor="educationalContent" className="block text-sm font-medium text-slate-300 mb-2">
            Contenu éducatif (affiché après interaction) *
          </label>
          <textarea
            id="educationalContent"
            required
            value={formData.educationalContent}
            onChange={(e) => setFormData({ ...formData, educationalContent: e.target.value })}
            rows={8}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {saving ? 'Sauvegarde...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}

