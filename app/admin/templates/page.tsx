import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import Link from 'next/link';
import { FileText, Building2, Truck, Settings } from 'lucide-react';

const categoryIcons: Record<string, any> = {
  BANCAIRE: FileText,
  ENTREPRISE: Building2,
  LIVRAISON: Truck,
  CUSTOM: Settings,
};

const categoryLabels: Record<string, string> = {
  BANCAIRE: 'Bancaire',
  ENTREPRISE: 'Entreprise',
  LIVRAISON: 'Livraison',
  CUSTOM: 'Personnalisé',
};

export default async function TemplatesPage() {
  const user = await requireAuth('ADMIN');

  const templates = await prisma.emailTemplate.findMany({
    where: {
      OR: [
        { isDefault: true },
        { createdBy: user.id },
      ],
    },
    orderBy: [
      { category: 'asc' },
      { isDefault: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  const templatesByCategory = templates.reduce((acc: any, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Templates d'emails</h1>
        <Link
          href="/admin/templates/new"
          className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
        >
          Créer un template
        </Link>
      </div>

      <div className="space-y-8">
        {Object.entries(templatesByCategory).map(([category, categoryTemplates]: [string, any]) => {
          const Icon = categoryIcons[category] || FileText;
          return (
            <div key={category} className="bg-slate-950 border border-slate-800 rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-6">
                <Icon className="text-pink-500" size={24} />
                <h2 className="text-2xl font-semibold text-white">
                  {categoryLabels[category]}
                </h2>
                <span className="text-sm text-slate-400">
                  ({categoryTemplates.length} template{categoryTemplates.length > 1 ? 's' : ''})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTemplates.map((template: any) => (
                  <div
                    key={template.id}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-pink-600 transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-white">{template.name}</h3>
                      {template.isDefault && (
                        <span className="text-xs bg-pink-600/20 text-pink-400 px-2 py-1 rounded border border-pink-800">
                          Défaut
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-2 line-clamp-2">
                      {template.subject}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Link
                        href={`/admin/templates/${template.id}`}
                        className="flex-1 text-center text-sm bg-slate-800 text-slate-300 px-3 py-2 rounded hover:bg-slate-700 transition"
                      >
                        Voir
                      </Link>
                      {!template.isDefault && (
                        <Link
                          href={`/admin/templates/${template.id}/edit`}
                          className="flex-1 text-center text-sm bg-pink-600 text-white px-3 py-2 rounded hover:bg-pink-700 transition"
                        >
                          Modifier
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12 bg-slate-950 border border-slate-800 rounded-lg">
          <p className="text-slate-400 mb-4">Aucun template disponible</p>
          <Link
            href="/admin/templates/new"
            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            Créer le premier template
          </Link>
        </div>
      )}
    </div>
  );
}

