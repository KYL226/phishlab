import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/';

    // Trouver la cible
    const target = await prisma.campaignTarget.findUnique({
      where: { token },
      include: { campaign: true },
    });

    if (!target) {
      return NextResponse.redirect(new URL('/error', request.url));
    }

    // Enregistrer le clic
    await prisma.interaction.create({
      data: {
        campaignId: target.campaignId,
        targetId: target.id,
        type: 'LINK_CLICKED',
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    // Mettre à jour la cible
    if (!target.clickedAt) {
      await prisma.campaignTarget.update({
        where: { id: target.id },
        data: { clickedAt: new Date() },
      });
    }

    // Rediriger vers la landing page
    return NextResponse.redirect(new URL(`/phish/${target.campaignId}/${token}`, request.url));
  } catch (error) {
    console.error('Erreur de tracking:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}

