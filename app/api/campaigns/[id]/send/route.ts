import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { sendPhishingEmail } from '@/lib/email';
import { generateToken } from '@/lib/utils';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth('ADMIN');
    const body = await request.json();
    const { targets } = body; // Array of { email, name? }

    const campaign = await prisma.campaign.findFirst({
      where: {
        id: params.id,
        createdBy: user.id,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campagne non trouvée' },
        { status: 404 }
      );
    }

    // Créer les cibles avec des tokens uniques
    const campaignTargets = await Promise.all(
      targets.map(async (target: { email: string; name?: string }) => {
        const token = generateToken();
        return prisma.campaignTarget.create({
          data: {
            campaignId: campaign.id,
            email: target.email,
            name: target.name,
            token,
          },
        });
      })
    );

    // Envoyer les emails
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const sendResults = await Promise.allSettled(
      campaignTargets.map(async (target) => {
        const trackingUrl = `${baseUrl}/track/click/${target.token}`;
        const success = await sendPhishingEmail(
          target.email,
          campaign.subject,
          campaign.emailContent,
          trackingUrl
        );
        if (success) {
          await prisma.campaignTarget.update({
            where: { id: target.id },
            data: { sentAt: new Date() },
          });
        }
        return success;
      })
    );

    // Mettre à jour le statut de la campagne
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    const successCount = sendResults.filter(
      (r) => r.status === 'fulfilled' && r.value
    ).length;

    return NextResponse.json({
      success: true,
      sent: successCount,
      total: targets.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

