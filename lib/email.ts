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
  // Format optimisé pour la compatibilité maximale avec les clients email
  const trackingPixel = `
    <img src="${openTrackingUrl}" 
         width="1" 
         height="1" 
         style="display:none;width:1px;height:1px;border:0;position:absolute;opacity:0;pointer-events:none;visibility:hidden;" 
         alt="" 
         border="0" 
         loading="lazy" />
    <!-- Tracking pixel -->`;
  
  // Essayer d'insérer dans le body de manière plus robuste
  // Utiliser replace avec flag 'g' pour remplacer toutes les occurrences si nécessaire
  if (trackedContent.includes('</body>')) {
    // Insérer juste avant la balise fermante </body> (dernière occurrence)
    const lastBodyIndex = trackedContent.lastIndexOf('</body>');
    trackedContent = trackedContent.substring(0, lastBodyIndex) + trackingPixel + trackedContent.substring(lastBodyIndex);
  } else if (trackedContent.includes('</html>')) {
    // Insérer avant la balise fermante </html>
    const lastHtmlIndex = trackedContent.lastIndexOf('</html>');
    trackedContent = trackedContent.substring(0, lastHtmlIndex) + trackingPixel + trackedContent.substring(lastHtmlIndex);
  } else if (trackedContent.includes('<body')) {
    // Si body existe mais pas de balise fermante, ajouter juste après <body>
    trackedContent = trackedContent.replace(/<body([^>]*)>/i, `$&${trackingPixel}`);
  } else {
    // Si pas de structure HTML, ajouter au début et à la fin pour maximiser les chances
    trackedContent = trackingPixel + trackedContent + trackingPixel;
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

