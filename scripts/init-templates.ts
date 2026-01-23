import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const templates = [
  {
    name: 'Banque - Vérification de compte',
    category: 'BANCAIRE',
    subject: 'Action requise : Vérifiez votre compte bancaire',
    emailContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #003366; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Banque ABC</h1>
        </div>
        <div class="content">
            <p>Bonjour,</p>
            <p>Nous avons détecté une activité suspecte sur votre compte bancaire. Pour votre sécurité, nous vous demandons de vérifier vos informations dès maintenant.</p>
            <p>Cliquez sur le bouton ci-dessous pour accéder à votre compte et vérifier vos informations :</p>
            <p style="text-align: center;">
                <a href="https://www.example-bank.com/login" class="button">Vérifier mon compte</a>
            </p>
            <p>Si vous n'avez pas effectué cette action, veuillez nous contacter immédiatement au 0800-123-456.</p>
            <p>Cordialement,<br>L'équipe de sécurité de la Banque ABC</p>
        </div>
        <div class="footer">
            <p>Ceci est un email automatique, merci de ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>`,
    landingPageUrl: 'https://www.example-bank.com/login',
    educationalContent: `⚠️ ATTENTION : Ceci était un test de phishing !

Vous avez cliqué sur un lien dans un email de phishing simulé. Voici ce que vous devez savoir :

🔍 SIGNES D'ALERTE DANS CET EMAIL :
- Urgence créée artificiellement ("Action requise")
- Lien vers un site externe pour "vérifier" un compte
- Menace de fermeture de compte si vous n'agissez pas

✅ CE QU'IL FALLAIT FAIRE :
1. Ne pas cliquer sur le lien dans l'email
2. Vérifier l'adresse email de l'expéditeur (regardez bien le domaine)
3. Accéder directement au site officiel via votre navigateur
4. Contacter votre banque par téléphone si vous avez des doutes

💡 CONSEILS :
- Les vraies banques ne vous demandent JAMAIS vos identifiants par email
- Si vous recevez un email suspect, contactez directement l'entreprise par un canal officiel
- Méfiez-vous des emails qui créent un sentiment d'urgence
- Vérifiez toujours l'URL du site avant de saisir vos informations`,
    isDefault: true,
  },
  {
    name: 'Support IT - Suspension de compte',
    category: 'ENTREPRISE',
    subject: 'Votre compte sera suspendu dans 24h - Action requise',
    emailContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h2 style="color: #dc3545;">⚠️ ALERTE SÉCURITÉ</h2>
        <p>Bonjour,</p>
        <div class="warning">
            <strong>Votre compte informatique sera suspendu dans 24 heures</strong> si vous ne confirmez pas vos informations de sécurité.
        </div>
        <p>Pour éviter la suspension, veuillez confirmer votre identité en cliquant sur le lien ci-dessous :</p>
        <p style="text-align: center;">
            <a href="https://support.company.com/verify" class="button">Confirmer mon identité</a>
        </p>
        <p><small>Si vous ne confirmez pas vos informations dans les 24 heures, votre accès sera désactivé.</small></p>
        <p>Service IT<br>Support Technique</p>
    </div>
</body>
</html>`,
    landingPageUrl: 'https://support.company.com/verify',
    educationalContent: `🔒 ALERTE PHISHING DÉTECTÉ !

Bien tenté, mais vous avez été piégé par cette simulation ! Voici l'analyse :

🚩 INDIICES DÉCELÉS :
- Menace de suspension dans un délai très court (création d'urgence)
- Lien vers un site de "vérification"
- Peur utilisée comme moyen de pression

✅ BONNES PRATIQUES :
1. Vérifier l'adresse email complète de l'expéditeur
2. Ne jamais cliquer sur les liens dans les emails suspects
3. Contacter directement le service IT par téléphone ou ticket
4. Les services IT ne suspendent jamais sans préavis

📧 COMMENT IDENTIFIER UN EMAIL SUSPECT :
- Adresse email étrange ou imitée
- Fautes d'orthographe
- Demande d'informations sensibles
- Urgence artificielle
- Menaces ou pressions`,
    isDefault: true,
  },
  {
    name: 'Amazon - Problème de livraison',
    category: 'LIVRAISON',
    subject: 'Votre colis Amazon ne peut pas être livré',
    emailContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; background-color: white; padding: 20px; border-radius: 8px; }
        .logo { text-align: center; color: #FF9900; font-size: 24px; font-weight: bold; }
        .alert { background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background-color: #FF9900; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">amazon</div>
        <h2>Problème de livraison</h2>
        <p>Bonjour,</p>
        <div class="alert">
            <strong>Votre colis n'a pas pu être livré</strong> à l'adresse indiquée. Des frais de relivraison sont dus.
        </div>
        <p>Pour réorganiser la livraison, veuillez cliquer sur le lien ci-dessous :</p>
        <p style="text-align: center;">
            <a href="https://amazon-delivery.com/track" class="button">Réorganiser la livraison</a>
        </p>
        <p><small>Numéro de suivi : #AZ123456789</small></p>
        <p>Cordialement,<br>Équipe Amazon</p>
    </div>
</body>
</html>`,
    landingPageUrl: 'https://amazon-delivery.com/track',
    educationalContent: `📦 ATTENTION : SIMULATION DE PHISHING DÉTECTÉE

Vous avez interagi avec un email de phishing simulé. Voici ce qu'il fallait remarquer :

🔍 SIGNES D'ALERTE :
- Domaine suspect dans l'URL (pas amazon.fr ou amazon.com)
- Email créant un faux sentiment d'urgence
- Demande de "frais de relivraison" (Amazon ne fait jamais ça)

✅ CE QU'IL FALLAIT FAIRE :
1. Vérifier vos commandes directement sur amazon.fr
2. Ne jamais cliquer sur les liens dans les emails
3. Vérifier le numéro de suivi dans votre espace client
4. Contacter Amazon via leur site officiel

💡 CONSEILS ANTI-PHISHING :
- Les vraies notifications de livraison apparaissent dans votre compte
- Vérifiez toujours l'URL complète avant de cliquer
- Les entreprises légitimes ne demandent jamais de "frais" par email
- En cas de doute, accédez au site directement via votre navigateur`,
    isDefault: true,
  },
];

async function main() {
  console.log('Initialisation des templates d\'emails...');

  for (const template of templates) {
    // Pour les templates par défaut, on utilise une clé unique basée sur le nom
    const existing = await prisma.emailTemplate.findFirst({
      where: {
        name: template.name,
        isDefault: true,
      },
    });

    if (existing) {
      await prisma.emailTemplate.update({
        where: { id: existing.id },
        data: template,
      });
    } else {
      await prisma.emailTemplate.create({
        data: template,
      });
    }
  }

  console.log(`✅ ${templates.length} templates créés avec succès !`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

