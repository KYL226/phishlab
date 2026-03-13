import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe sont obligatoires.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cet email.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        // Laisse le rôle par défaut (TARGET) défini dans Prisma
      },
    });

    return NextResponse.json(
      { message: 'Compte créé avec succès.' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erreur inscription:', error);

    // En développement, renvoyer plus de détails pour le debug
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        {
          error: 'Erreur serveur (DEV)',
          message: error?.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer plus tard.' },
      { status: 500 }
    );
  }
}


