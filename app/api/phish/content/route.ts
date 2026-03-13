import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API publique pour la page phishing : retourne le contenu éducatif de la campagne
 * uniquement si le token est valide pour cette campagne (pas d'auth admin requise).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');
    const token = searchParams.get('token');

    if (!campaignId || !token) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    const target = await prisma.campaignTarget.findUnique({
      where: { token },
      include: { campaign: true },
    });

    if (!target || target.campaignId !== campaignId) {
      return NextResponse.json(
        { error: 'Lien invalide' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      educationalContent: target.campaign.educationalContent ?? '',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
