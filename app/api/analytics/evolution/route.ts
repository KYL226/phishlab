import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth('ADMIN');
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Récupérer les interactions groupées par jour
    const interactions = await prisma.interaction.findMany({
      where: {
        campaign: { createdBy: user.id },
        timestamp: { gte: startDate },
      },
      select: {
        type: true,
        timestamp: true,
      },
      orderBy: { timestamp: 'asc' },
    });

    // Grouper par jour et par type
    const dailyData: Record<string, { date: string; ouvert: number; clic: number; soumis: number }> = {};

    interactions.forEach((interaction) => {
      const date = new Date(interaction.timestamp).toISOString().split('T')[0];
      
      if (!dailyData[date]) {
        dailyData[date] = { date, ouvert: 0, clic: 0, soumis: 0 };
      }

      if (interaction.type === 'EMAIL_OPENED') {
        dailyData[date].ouvert++;
      } else if (interaction.type === 'LINK_CLICKED') {
        dailyData[date].clic++;
      } else if (interaction.type === 'FORM_SUBMITTED') {
        dailyData[date].soumis++;
      }
    });

    // Remplir les jours manquants avec 0
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      result.push({
        date: dateStr,
        ouvert: dailyData[dateStr]?.ouvert || 0,
        clic: dailyData[dateStr]?.clic || 0,
        soumis: dailyData[dateStr]?.soumis || 0,
      });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

