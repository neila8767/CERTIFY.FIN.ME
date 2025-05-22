import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

cron.schedule('0 2 * * *', async () => {
  console.log('🧹 Nettoyage des comptes non vérifiés...');

  const expiredAccounts = await prisma.account.findMany({
    where: {
      isVerified: false,
      createdAt: {
        lt: new Date(Date.now() - 24 * 60 * 60 * 1000) // plus de 24h
      }
    },
    select: {
      id: true,
      role: true
    }
  });

  for (const account of expiredAccounts) {
    try {
      if (account.role === 'UNIVERSITY') {
        await prisma.university.deleteMany({ where: { accountId: account.id } });
      } else if (account.role === 'ECOLE') {
        await prisma.ecole.deleteMany({ where: { accountId: account.id } });
      } else if (account.role === 'STUDENT') {
        await prisma.etudiant_account.deleteMany({ where: { accountId: account.id } });
      }

      await prisma.account.delete({ where: { id: account.id } });
      console.log(`✔️ Compte supprimé: ${account.id}`);
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression du compte ${account.id}`, error);
    }
  }

  console.log('✅ Nettoyage terminé.');
});
