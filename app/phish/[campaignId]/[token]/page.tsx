'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Campaign {
  id: string;
  landingPageUrl: string;
  educationalContent: string;
}

export default function PhishingLandingPage() {
  const params = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    // Enregistrer la visite de la page
    fetch(`/api/track/page-view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId: params.campaignId,
        token: params.token,
      }),
    });

    // Charger le contenu éducatif
    fetch(`/api/campaigns/${params.campaignId}`)
      .then((res) => res.json())
      .then((data) => setCampaign(data))
      .catch(() => {});
  }, [params.campaignId, params.token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch('/api/track/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: params.token,
          formData: formData,
        }),
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (submitted && campaign) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full bg-slate-950 border border-slate-800 rounded-lg shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-600/20 border border-pink-800 mb-4">
              <svg
                className="w-8 h-8 text-pink-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              ⚠️ Attention : Ceci était un test de phishing !
            </h1>
          </div>

          <div className="prose prose-invert max-w-none mb-6 text-slate-300 whitespace-pre-line">
            {campaign.educationalContent}
          </div>

          <div className="bg-pink-950/30 border-l-4 border-pink-600 p-4 mb-6 rounded-r">
            <p className="text-sm text-pink-200">
              <strong className="text-pink-400">Rappel important :</strong> Les vraies entreprises ne vous demanderont jamais vos identifiants par email. 
              Si vous avez des doutes sur un email, contactez directement l'entreprise par un canal officiel.
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={() => window.location.href = '/'}
              className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Landing page simulée - formulaire de connexion
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Connexion</h1>
          <p className="text-slate-400">Veuillez vous connecter pour continuer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

