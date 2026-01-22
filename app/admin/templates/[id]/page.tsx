'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [using, setUsing] = useState(false);

  useEffect(() => {
    fetchTemplate();
  }, [params.id]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/templates/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setTemplate(data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = () => {
    if (!template) return;
    
    setUsing(true);
    // Rediriger vers la création de campagne avec les données du template
    const data = encodeURIComponent(JSON.stringify({
      name: `Campagne - ${template.name}`,
      subject: template.subject,
      emailContent: template.emailContent,
      landingPageUrl: template.landingPageUrl,
      educationalContent: template.educationalContent,
    }));
    
    router.push(`/admin/campaigns/new?template=${data}`);
  };

  if (loading) {
    return <div className="text-center py-12 text-white">Chargement...</div>;
  }

  if (!template) {
    return <div className="text-center py-12 text-white">Template non trouvé</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin/templates" className="text-pink-600 hover:text-pink-500 mb-2 inline-block transition">
            ← Retour aux templates
          </Link>
          <h1 className="text-3xl font-bold text-white">{template.name}</h1>
          {template.isDefault && (
            <span className="inline-block mt-2 text-xs bg-pink-600/20 text-pink-400 px-3 py-1 rounded border border-pink-800">
              Template par défaut
            </span>
          )}
        </div>
        <button
          onClick={handleUseTemplate}
          disabled={using}
          className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition disabled:opacity-50"
        >
          {using ? 'Redirection...' : 'Utiliser ce template'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-950 border border-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Détails du template</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-400">Catégorie</label>
              <p className="text-white">{template.category}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400">Sujet</label>
              <p className="text-white">{template.subject}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400">URL Landing Page</label>
              <p className="text-white break-all">{template.landingPageUrl}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Aperçu de l'email</h2>
          <div className="bg-slate-900 rounded p-4 max-h-96 overflow-auto">
            <div dangerouslySetInnerHTML={{ __html: template.emailContent }} />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-slate-950 border border-slate-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Contenu éducatif</h2>
        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-line">
          {template.educationalContent}
        </div>
      </div>
    </div>
  );
}

