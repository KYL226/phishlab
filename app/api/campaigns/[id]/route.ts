import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth('ADMIN');
    
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: params.id,
        createdBy: user.id,
      },
      include: {
        targets: true,
        interactions: {
          orderBy: { timestamp: 'desc' },
        },
        _count: {
          select: {
            targets: true,
            interactions: true,
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campagne non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(campaign);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 401 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth('ADMIN');
    const body = await request.json();

    const campaign = await prisma.campaign.updateMany({
      where: {
        id: params.id,
        createdBy: user.id,
      },
      data: {
        name: body.name,
        description: body.description,
        subject: body.subject,
        emailContent: body.emailContent,
        landingPageUrl: body.landingPageUrl,
        educationalContent: body.educationalContent,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth('ADMIN');

    await prisma.campaign.deleteMany({
      where: {
        id: params.id,
        createdBy: user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

