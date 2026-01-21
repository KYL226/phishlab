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
  clickTrackingUrl: string,
  openTrackingUrl: string
) {
  // Remplacez les liens dans le contenu par des liens de tracking
  let trackedContent = htmlContent.replace(
    /href="([^"]+)"/g,
    (match, url) => {
      return `href="${clickTrackingUrl}?redirect=${encodeURIComponent(url)}"`;
    }
  );

  // Ajouter un pixel de tracking invisible pour l'ouverture de l'email
  // Utiliser plusieurs formats pour maximiser la compatibilité
  const trackingPixel = `<img src="${openTrackingUrl}" width="1" height="1" style="display:none !important;width:1px !important;height:1px !important;border:0 !important;position:absolute !important;opacity:0 !important;pointer-events:none !important;" alt="" border="0" />`;
  
  // Essayer d'insérer dans le body, sinon dans html, sinon à la fin
  if (trackedContent.includes('</body>')) {
    // Insérer avant la balise fermante </body>
    trackedContent = trackedContent.replace('</body>', `${trackingPixel}</body>`);
  } else if (trackedContent.includes('</html>')) {
    // Insérer avant la balise fermante </html>
    trackedContent = trackedContent.replace('</html>', `${trackingPixel}</html>`);
  } else if (trackedContent.includes('<body')) {
    // Si body existe mais pas de balise fermante, ajouter juste après <body>
    trackedContent = trackedContent.replace(/<body([^>]*)>/i, `$&${trackingPixel}`);
  } else {
    // Si pas de structure HTML, ajouter à la fin
    trackedContent += trackingPixel;
  }

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

