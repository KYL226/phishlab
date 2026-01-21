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

    if (target && !target.openedAt) {
      await prisma.campaignTarget.update({
        where: { id: target.id },
        data: { openedAt: new Date() },
      });

      await prisma.interaction.create({
        data: {
          campaignId: target.campaignId,
          targetId: target.id,
          type: 'EMAIL_OPENED',
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
      });
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

