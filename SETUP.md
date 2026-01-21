# Guide d'installation rapide

## Configuration rapide

### 1. Variables d'environnement

Créez un fichier `.env.local` :

```env
DATABASE_URL="mysql://root:password@localhost:3306/phishlab"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="génerez-une-clé-secrète-aléatoire-ici"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="votre-email@gmail.com"
SMTP_PASSWORD="votre-mot-de-passe-application"
SMTP_FROM="PhishLab <noreply@phishlab.com>"
```

**Pour générer NEXTAUTH_SECRET :**
```bash
openssl rand -base64 32
```

### 2. Configuration SMTP Gmail

Si vous utilisez Gmail, vous devez :
1. Activer la validation en 2 étapes sur votre compte Google
2. Générer un "Mot de passe d'application" : https://myaccount.google.com/apppasswords
3. Utiliser ce mot de passe dans `SMTP_PASSWORD`

### 3. Installation et initialisation

```bash
# Installer les dépendances
npm install

# Créer la base de données
mysql -u root -p -e "CREATE DATABASE phishlab;"

# Générer Prisma Client
npm run db:generate

# Créer les tables
npm run db:push

# Initialiser avec un admin
npm run db:init

# Lancer le serveur
npm run dev
```

### 4. Première connexion

- URL : http://localhost:3000/auth/signin
- Email : `admin@phishlab.com`
- Mot de passe : `admin123`

**Changez le mot de passe immédiatement après la première connexion !**

## Utilisation

### Créer votre première campagne

1. Connectez-vous en tant qu'admin
2. Cliquez sur "Nouvelle campagne"
3. Remplissez :
   - **Nom** : "Test de phishing - Banque"
   - **Sujet** : "Action requise : Vérifiez votre compte"
   - **Contenu email (HTML)** : Copiez un exemple d'email de phishing
   - **URL landing page** : https://example.com (sera remplacée par la page simulée)
   - **Contenu éducatif** : Expliquez pourquoi c'était un phishing

### Envoyer une campagne

1. Ouvrez votre campagne
2. Cliquez sur "Envoyer la campagne"
3. Entrez les emails (un par ligne)
4. Cliquez sur "Envoyer"

### Suivre les résultats

Les statistiques apparaissent automatiquement dans le tableau de bord :
- Nombre d'emails ouverts
- Nombre de clics
- Nombre de formulaires soumis
- Détails par utilisateur

## Structure de base de données

- **User** : Administrateurs et utilisateurs cibles
- **Campaign** : Campagnes de phishing simulées
- **CampaignTarget** : Cibles d'une campagne avec tracking
- **Interaction** : Événements (clic, ouverture, soumission)

## Sécurité

⚠️ **Utilisez cette plateforme uniquement pour des tests éducatifs avec consentement !**

- Changez les mots de passe par défaut
- Utilisez HTTPS en production
- Limitez l'accès à l'interface d'administration
- Sauvegardez régulièrement la base de données

