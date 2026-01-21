import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, token } = body;

    const target = await prisma.campaignTarget.findUnique({
      where: { token },
    });

    if (target && target.campaignId === campaignId) {
      await prisma.interaction.create({
        data: {
          campaignId,
          targetId: target.id,
          type: 'PAGE_VIEWED',
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

