import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("🧹 Suppression des données...")

  // Supprimer d'abord les tables enfants
  await prisma.notification.deleteMany()
  await prisma.university.deleteMany()
  await prisma.etudiant_account.deleteMany()
  await prisma.ecole.deleteMany()
  await prisma.ministere.deleteMany()

  // Ensuite supprimer les comptes
  await prisma.account.deleteMany()

  console.log("✅ Toutes les données ont été supprimées.")
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors de la suppression :", e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
