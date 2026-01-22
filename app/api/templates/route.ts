import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth('ADMIN');
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where: any = {
      OR: [
        { isDefault: true },
        { createdBy: user.id },
      ],
    };

    if (category) {
      where.category = category;
    }

    const templates = await prisma.emailTemplate.findMany({
      where,
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(templates);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth('ADMIN');
    const body = await request.json();

    const template = await prisma.emailTemplate.create({
      data: {
        name: body.name,
        category: body.category,
        subject: body.subject,
        emailContent: body.emailContent,
        landingPageUrl: body.landingPageUrl,
        educationalContent: body.educationalContent,
        createdBy: user.id,
        isDefault: false,
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
