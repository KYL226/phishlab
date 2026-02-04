import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth('ADMIN');
    
    const campaigns = await prisma.campaign.findMany({
      where: { createdBy: user.id },
      include: {
        _count: {
          select: {
            targets: true,
            interactions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(campaigns);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth('ADMIN');
    const userId = (user as { id: string }).id;
    const body = await request.json();

    const campaign = await prisma.campaign.create({
      data: {
        name: body.name,
        description: body.description,
        subject: body.subject,
        emailContent: body.emailContent,
        landingPageUrl: body.landingPageUrl,
        educationalContent: body.educationalContent,
        createdBy: userId,
        status: 'DRAFT',
      },
    });

    return NextResponse.json(campaign);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

