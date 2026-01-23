import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth('ADMIN');

    // Récupérer toutes les interactions
    const interactions = await prisma.interaction.findMany({
      where: {
        campaign: { createdBy: user.id },
        type: { in: ['EMAIL_OPENED', 'LINK_CLICKED', 'FORM_SUBMITTED'] },
      },
      select: {
        timestamp: true,
        type: true,
      },
    });

    // Grouper par jour de la semaine (0-6) et heure (0-23)
    const heatmapData: Record<string, number> = {};

    interactions.forEach((interaction) => {
      const date = new Date(interaction.timestamp);
      const dayOfWeek = date.getDay(); // 0 = Dimanche, 6 = Samedi
      const hour = date.getHours();

      const key = `${dayOfWeek}-${hour}`;
      heatmapData[key] = (heatmapData[key] || 0) + 1;
    });

    // Créer la structure pour la heatmap
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const result = [];

    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const key = `${day}-${hour}`;
        result.push({
          jour: days[day],
          heure: hour,
          valeur: heatmapData[key] || 0,
        });
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

