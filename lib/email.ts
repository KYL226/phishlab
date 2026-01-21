import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendPhishingEmail(
  to: string,
  subject: string,
  htmlContent: string,
  trackingUrl: string
) {
  // Remplacez les liens dans le contenu par des liens de tracking
  const trackedContent = htmlContent.replace(
    /href="([^"]+)"/g,
    (match, url) => {
      return `href="${trackingUrl}?redirect=${encodeURIComponent(url)}"`;
    }
  );

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'PhishLab <noreply@phishlab.com>',
      to,
      subject,
      html: trackedContent,
    });
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
}

