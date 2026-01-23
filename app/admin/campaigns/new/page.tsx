'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Template {
  id: string;
  name: string;
  category: string;
  subject: string;
  emailContent: string;
  landingPageUrl: string;
  educationalContent: string;
}

export default function NewCampaignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    emailContent: '',
    landingPageUrl: '',
    educationalContent: '',
  });

  useEffect(() => {
    // Charger les templates
    fetch('/api/templates')
      .then((res) => res.json())
      .then((data) => setTemplates(data))
      .catch(() => {});

    // Vérifier si un template est passé en paramètre
    const templateParam = searchParams.get('template');
    if (templateParam) {
      try {
        const templateData = JSON.parse(decodeURIComponent(templateParam));
        setFormData({
          name: templateData.name || '',
          description: '',
          subject: templateData.subject || '',
          emailContent: templateData.emailContent || '',
          landingPageUrl: templateData.landingPageUrl || '',
          educationalContent: templateData.educationalContent || '',
        });
      } catch (e) {
        console.error('Erreur lors du chargement du template:', e);
      }
    }
  }, [searchParams]);

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

  const handleTemplateSelect = (template: Template) => {
    setFormData({
      name: `Campagne - ${template.name}`,
      description: '',
      subject: template.subject,
      emailContent: template.emailContent,
      landingPageUrl: template.landingPageUrl,
      educationalContent: template.educationalContent,
    });
    setShowTemplateSelector(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Nouvelle campagne</h1>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setShowTemplateSelector(!showTemplateSelector)}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition"
          >
            {showTemplateSelector ? 'Masquer' : 'Choisir un template'}
          </button>
          <Link
            href="/admin/templates"
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
          >
            Gérer les templates
          </Link>
        </div>
      </div>

      {showTemplateSelector && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Sélectionner un template</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-pink-600 transition cursor-pointer"
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">{template.name}</h3>
                  {template.category === 'BANCAIRE' && (
                    <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">Bancaire</span>
                  )}
                  {template.category === 'ENTREPRISE' && (
                    <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">Entreprise</span>
                  )}
                  {template.category === 'LIVRAISON' && (
                    <span className="text-xs bg-orange-600/20 text-orange-400 px-2 py-1 rounded">Livraison</span>
                  )}
                </div>
                <p className="text-sm text-slate-400 line-clamp-2">{template.subject}</p>
              </div>
            ))}
          </div>
          {templates.length === 0 && (
            <p className="text-slate-400 text-center py-4">Aucun template disponible</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-950 border border-slate-800 rounded-lg shadow p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Nom de la campagne *
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
            placeholder="Ex: Test de phishing - Banque"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
            placeholder="Description de la campagne..."
          />
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
            placeholder="Ex: Action requise : Vérifiez votre compte"
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
            rows={10}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition font-mono text-sm"
            placeholder="<html>...</html>"
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
            placeholder="https://example.com/login"
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
            placeholder="Contenu éducatif expliquant pourquoi c'était un email de phishing..."
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
            disabled={loading}
            className="px-6 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Création...' : 'Créer la campagne'}
          </button>
        </div>
      </form>
    </div>
  );
}

