# Guide de Test des Campagnes PhishLab

Ce guide vous explique comment créer et tester des campagnes de phishing simulées avec des exemples concrets.

## 📋 Exemple 1 : Email de Banque (Simple)

### Nom de la campagne
```
Test Phishing - Banque ABC
```

### Description
```
Campagne de test pour sensibiliser les employés aux emails de phishing bancaires
```

### Sujet de l'email
```
Action requise : Vérifiez votre compte bancaire
```

### Contenu de l'email (HTML)
```html
<!DOCTYPE html>
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
</html>
```

### URL de la landing page simulée
```
https://www.example-bank.com/login
```

### Contenu éducatif (affiché après interaction)
```
⚠️ ATTENTION : Ceci était un test de phishing !

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
- Vérifiez toujours l'URL du site avant de saisir vos informations

📚 RESSOURCES :
- Guide de sécurité : https://www.cybermalveillance.gouv.fr
- Signaler un email suspect : spam-signalement@pm.gouv.fr
```

---

## 📋 Exemple 2 : Email d'Entreprise IT (Support Technique)

### Nom de la campagne
```
Test Phishing - Support IT
```

### Description
```
Simulation d'un email de support technique pour sensibiliser aux attaques par phishing d'entreprise
```

### Sujet de l'email
```
Votre compte sera suspendu dans 24h - Action requise
```

### Contenu de l'email (HTML)
```html
<!DOCTYPE html>
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
</html>
```

### URL de la landing page simulée
```
https://support.company.com/verify
```

### Contenu éducatif
```
🔒 ALERTE PHISHING DÉTECTÉ !

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
- Menaces ou pressions

💡 EN CAS DE DOUTE :
Contactez toujours votre service IT directement via les canaux officiels de votre entreprise.
```

---

## 📋 Exemple 3 : Email de Livraison (Amazon/Colis)

### Nom de la campagne
```
Test Phishing - Colis Amazon
```

### Description
```
Simulation d'un email de livraison pour sensibiliser aux arnaques de colis
```

### Sujet de l'email
```
Votre colis Amazon ne peut pas être livré
```

### Contenu de l'email (HTML)
```html
<!DOCTYPE html>
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
</html>
```

### URL de la landing page simulée
```
https://amazon-delivery.com/track
```

### Contenu éducatif
```
📦 ATTENTION : SIMULATION DE PHISHING DÉTECTÉE

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
- En cas de doute, accédez au site directement via votre navigateur

📱 VÉRIFICATION :
Allez sur amazon.fr, connectez-vous et vérifiez vos commandes directement sur le site officiel.
```

---

## 🧪 Comment Tester une Campagne

### Étape 1 : Créer la campagne
1. Connectez-vous à l'interface admin : `http://localhost:3000/admin/campaigns/new`
2. Copiez-collez les exemples ci-dessus dans les champs correspondants
3. Cliquez sur "Créer la campagne"

### Étape 2 : Envoyer la campagne
1. Ouvrez la campagne créée
2. Cliquez sur "Envoyer la campagne"
3. Entrez votre adresse email de test (une par ligne) :
   ```
   votre.email@example.com
   test@example.com
   ```
4. Cliquez sur "Envoyer"

### Étape 3 : Tester l'ouverture
1. **Ouvrez votre boîte email**
2. **Ouvrez l'email reçu** (important : les images doivent être chargées pour que le tracking fonctionne)
   - Gmail : Cliquez sur "Afficher les images" si demandé
   - Outlook : Autorisez le chargement des images
   - Autres clients : Activez le chargement des images
3. **Attendez quelques secondes** pour que le pixel de tracking se charge

### Étape 4 : Vérifier le tracking
1. Retournez sur le dashboard admin : `http://localhost:3000/admin/dashboard`
2. Ouvrez votre campagne
3. Vérifiez que :
   - ✅ "Emails ouverts" devrait être > 0
   - ✅ Votre email apparaît dans la liste avec une coche "Ouvert"

### Étape 5 : Tester le clic
1. Dans l'email, **cliquez sur le lien/bouton**
2. Vous serez redirigé vers la page de phishing simulée
3. Vérifiez sur le dashboard :
   - ✅ "Clics" devrait être > 0
   - ✅ Votre email devrait avoir une coche "Cliqué"

### Étape 6 : Tester la soumission
1. Sur la page de phishing, **remplissez le formulaire** (n'importe quelles données de test)
2. Cliquez sur "Se connecter"
3. **Le contenu éducatif devrait s'afficher**
4. Vérifiez sur le dashboard :
   - ✅ "Formulaires soumis" devrait être > 0
   - ✅ Votre email devrait avoir une coche "Soumis"

---

## ⚠️ Notes Importantes

### Tracking d'ouverture
- Le tracking fonctionne via un pixel invisible dans l'email
- **Certains clients email bloquent les images par défaut** :
  - Gmail : Autorisez le chargement des images
  - Outlook : Activez les images dans les paramètres
  - Apple Mail : Activez le chargement automatique des images
- Le pixel est chargé automatiquement quand l'email est ouvert **ET que les images sont chargées**

### Conseils pour les tests
1. **Utilisez votre vraie adresse email** pour recevoir l'email
2. **Activez le chargement des images** dans votre client email
3. **Attendez 5-10 secondes** après ouverture pour que le tracking se mette à jour
4. **Actualisez la page** du dashboard admin pour voir les mises à jour

### Structure HTML requise
- L'email HTML doit avoir une structure valide avec `<html>`, `<head>`, `<body>`
- Si vous copiez un exemple, assurez-vous que toutes les balises sont présentes
- Le pixel de tracking sera automatiquement ajouté avant `</body>`

---

## 🔧 Dépannage

### Le tracking d'ouverture ne fonctionne pas
- ✅ Vérifiez que les images sont autorisées dans votre client email
- ✅ Vérifiez que l'URL de base (`NEXTAUTH_URL`) est correcte dans `.env.local`
- ✅ Vérifiez les logs du serveur pour voir si le pixel est appelé
- ✅ Essayez d'ouvrir l'URL du pixel directement dans le navigateur : `http://localhost:3000/api/track/open/[TOKEN]`

### L'email n'est pas reçu
- ✅ Vérifiez votre configuration SMTP dans `.env.local`
- ✅ Vérifiez les spams/courrier indésirable
- ✅ Testez avec un compte Gmail (plus fiable pour les tests)

### Les clics ne sont pas trackés
- ✅ Vérifiez que le lien dans l'email pointe bien vers `/api/track/click/...`
- ✅ Vérifiez les logs du serveur

