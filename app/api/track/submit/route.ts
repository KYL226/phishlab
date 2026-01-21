import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, formData } = body;

    const target = await prisma.campaignTarget.findUnique({
      where: { token },
      include: { campaign: true },
    });

    if (!target) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 404 }
      );
    }

    // Enregistrer la soumission
    await prisma.interaction.create({
      data: {
        campaignId: target.campaignId,
        targetId: target.id,
        type: 'FORM_SUBMITTED',
        data: JSON.stringify(formData),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    // Mettre à jour la cible
    if (!target.submittedAt) {
      await prisma.campaignTarget.update({
        where: { id: target.id },
        data: { submittedAt: new Date() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

