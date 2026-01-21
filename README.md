# PhishLab - Plateforme de Sensibilisation au Phishing

Plateforme web de sensibilisation au phishing permettant aux administrateurs de créer et d'envoyer des emails de phishing simulés pour éduquer les utilisateurs sur les risques de sécurité.

## Fonctionnalités

- ✅ **Gestion de campagnes** : Création et gestion de campagnes de phishing simulées
- ✅ **Envoi d'emails** : Envoi automatique d'emails de phishing simulés aux utilisateurs cibles
- ✅ **Tracking avancé** : Suivi des clics, ouvertures d'emails et soumissions de formulaires
- ✅ **Pages de simulation** : Landing pages réalistes pour simuler des attaques de phishing
- ✅ **Contenu éducatif** : Affichage automatique de contenu éducatif après interaction
- ✅ **Tableau de bord** : Statistiques détaillées sur les performances des campagnes
- ✅ **Interface d'administration** : Interface intuitive pour gérer les campagnes

## Technologies utilisées

- **Next.js 16** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Prisma** - ORM pour MySQL
- **NextAuth.js** - Authentification
- **Tailwind CSS** - Styles
- **Nodemailer** - Envoi d'emails
- **MySQL** - Base de données

## Installation

### Prérequis

- Node.js 18+ 
- MySQL 8+
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet et installer les dépendances**

```bash
npm install
```

2. **Configurer la base de données**

Créez un fichier `.env.local` à la racine du projet :

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/phishlab"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-key-aleatoire-ici"

# Email (pour l'envoi d'emails)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="votre-email@gmail.com"
SMTP_PASSWORD="votre-mot-de-passe-application"
SMTP_FROM="PhishLab <noreply@phishlab.com>"

# Admin par défaut (optionnel)
ADMIN_EMAIL="admin@phishlab.com"
ADMIN_PASSWORD="admin123"
```

3. **Créer la base de données MySQL**

```bash
mysql -u root -p
CREATE DATABASE phishlab;
EXIT;
```

4. **Générer le client Prisma et créer les tables**

```bash
npm run db:generate
npm run db:push
```

5. **Initialiser la base de données avec un utilisateur admin**

```bash
npm run db:init
```

6. **Lancer le serveur de développement**

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Utilisation

### Connexion

1. Accédez à `/auth/signin`
2. Connectez-vous avec les identifiants admin :
   - Email : `admin@phishlab.com` (ou celui défini dans `.env.local`)
   - Mot de passe : `admin123` (ou celui défini dans `.env.local`)

⚠️ **Important** : Changez le mot de passe après la première connexion !

### Créer une campagne

1. Accédez au tableau de bord (`/admin/dashboard`)
2. Cliquez sur "Nouvelle campagne"
3. Remplissez les informations :
   - Nom de la campagne
   - Sujet de l'email
   - Contenu HTML de l'email
   - URL de la landing page simulée
   - Contenu éducatif (affiché après interaction)
4. Enregistrez la campagne

### Envoyer une campagne

1. Ouvrez la campagne créée
2. Cliquez sur "Envoyer la campagne"
3. Entrez les adresses email des cibles (une par ligne)
4. Cliquez sur "Envoyer"

### Suivre les résultats

- Consultez le tableau de bord pour voir les statistiques globales
- Ouvrez une campagne pour voir les détails :
  - Nombre d'emails ouverts
  - Nombre de clics sur les liens
  - Nombre de formulaires soumis
  - Détails par cible

## Structure du projet

```
phishlab/
├── app/
│   ├── admin/              # Pages d'administration
│   ├── api/                # Routes API
│   ├── auth/               # Pages d'authentification
│   ├── phish/              # Landing pages de phishing simulées
│   └── layout.tsx
├── components/             # Composants React
├── lib/                    # Utilitaires et helpers
├── prisma/                 # Schéma Prisma
└── scripts/                # Scripts utilitaires
```

## Sécurité

⚠️ **Important** : Cette plateforme est destinée uniquement à des fins éducatives et de sensibilisation. Elle doit être utilisée uniquement dans un environnement contrôlé avec le consentement des participants.

- Ne pas utiliser pour des attaques réelles
- Obtenir toujours le consentement avant d'envoyer des emails de test
- Respecter les lois locales sur la cybersécurité et la vie privée

## Développement

### Commandes disponibles

- `npm run dev` - Lancer le serveur de développement
- `npm run build` - Construire pour la production
- `npm run start` - Lancer le serveur de production
- `npm run lint` - Lancer ESLint
- `npm run db:generate` - Générer le client Prisma
- `npm run db:push` - Pousser le schéma vers la base de données
- `npm run db:migrate` - Créer une migration
- `npm run db:init` - Initialiser la base de données

## Licence

MIT

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur le repository.
