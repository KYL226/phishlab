import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const target = await prisma.campaignTarget.findUnique({
      where: { token },
    });

    if (target) {
      // Toujours créer une interaction même si déjà ouvert (pour statistiques)
      const isFirstOpen = !target.openedAt;
      
      if (isFirstOpen) {
        await prisma.campaignTarget.update({
          where: { id: target.id },
          data: { openedAt: new Date() },
        });
      }

      // Enregistrer l'interaction d'ouverture
      await prisma.interaction.create({
        data: {
          campaignId: target.campaignId,
          targetId: target.id,
          type: 'EMAIL_OPENED',
          ipAddress: request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
      });

      console.log(`Email ouvert tracké - Token: ${token}, Première ouverture: ${isFirstOpen}`);
    } else {
      console.warn(`Tentative de tracking avec token invalide: ${token}`);
    }

    // Retourner une image transparente de 1x1 pixel pour le tracking
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );

    return new NextResponse(pixel, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Erreur de tracking:', error);
    return new NextResponse(null, { status: 204 });
  }
}

