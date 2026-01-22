import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth('ADMIN');

    // Statistiques par campagne
    const campaigns = await prisma.campaign.findMany({
      where: { createdBy: user.id },
      include: {
        _count: {
          select: {
            targets: true,
            interactions: true,
          },
        },
        targets: {
          select: {
            openedAt: true,
            clickedAt: true,
            submittedAt: true,
          },
        },
      },
    });

    const campaignStats = campaigns.map((campaign) => {
      const opened = campaign.targets.filter((t) => t.openedAt).length;
      const clicked = campaign.targets.filter((t) => t.clickedAt).length;
      const submitted = campaign.targets.filter((t) => t.submittedAt).length;
      const total = campaign._count.targets;

      return {
        nom: campaign.name,
        total,
        ouvert: opened,
        clic: clicked,
        soumis: submitted,
        tauxOuverture: total > 0 ? (opened / total) * 100 : 0,
        tauxClic: total > 0 ? (clicked / total) * 100 : 0,
        tauxSoumission: total > 0 ? (submitted / total) * 100 : 0,
      };
    });

    // Statistiques globales par type d'interaction
    const interactionStats = await prisma.interaction.groupBy({
      by: ['type'],
      where: {
        campaign: { createdBy: user.id },
      },
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      campaigns: campaignStats,
      interactions: interactionStats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

