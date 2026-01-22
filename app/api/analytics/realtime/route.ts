import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth('ADMIN');
    const { searchParams } = new URL(request.url);
    const minutes = parseInt(searchParams.get('minutes') || '60');

    const startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() - minutes);

    // Interactions récentes
    const recentInteractions = await prisma.interaction.findMany({
      where: {
        campaign: { createdBy: user.id },
        timestamp: { gte: startDate },
      },
      include: {
        campaign: {
          select: { name: true },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    // Statistiques des dernières minutes
    const stats = {
      ouvert: recentInteractions.filter((i) => i.type === 'EMAIL_OPENED').length,
      clic: recentInteractions.filter((i) => i.type === 'LINK_CLICKED').length,
      soumis: recentInteractions.filter((i) => i.type === 'FORM_SUBMITTED').length,
    };

    return NextResponse.json({
      stats,
      interactions: recentInteractions.map((i) => ({
        id: i.id,
        type: i.type,
        timestamp: i.timestamp,
        campaignName: i.campaign.name,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

