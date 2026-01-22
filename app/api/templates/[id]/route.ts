import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth('ADMIN');
    const { id } = await params;

    const template = await prisma.emailTemplate.findFirst({
      where: {
        id,
        OR: [
          { isDefault: true },
          { createdBy: user.id },
        ],
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth('ADMIN');
    const { id } = await params;
    const body = await request.json();

    const template = await prisma.emailTemplate.updateMany({
      where: {
        id,
        createdBy: user.id,
        isDefault: false, // Ne pas modifier les templates par défaut
      },
      data: {
        name: body.name,
        category: body.category,
        subject: body.subject,
        emailContent: body.emailContent,
        landingPageUrl: body.landingPageUrl,
        educationalContent: body.educationalContent,
      },
    });

    return NextResponse.json(template);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth('ADMIN');
    const { id } = await params;

    await prisma.emailTemplate.deleteMany({
      where: {
        id,
        createdBy: user.id,
        isDefault: false, // Ne pas supprimer les templates par défaut
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

