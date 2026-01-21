import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Initialisation de la base de données...');

  // Créer un utilisateur admin par défaut
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@phishlab.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Administrateur',
      role: 'ADMIN',
    },
  });

  console.log('✅ Utilisateur admin créé:');
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Mot de passe: ${adminPassword}`);
  console.log('\n⚠️  IMPORTANT: Changez le mot de passe après la première connexion!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

