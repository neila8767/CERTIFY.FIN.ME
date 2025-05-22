import { prisma } from "../prismaClient.js"; // Mets Prisma dans un fichier séparé
import bcrypt from "bcrypt";

export default {
     async  updateMinistereProfile(accountId, data) {
  return await prisma.$transaction(async (tx) => {
    // Update Account
    const updatedAccount = await tx.account.update({
      where: { id: accountId },
      data: {
        username: data.username,
        email: data.email,
      },
    });

    // Update Ministere
    const updatedMinistere = await tx.ministere.update({
      where: { accountId: accountId },
      data: {
        emailMinistere: data.email,
        numeroTelephone: data.numeroTelephone,
      },
    });

    return { updatedAccount, updatedMinistere };
  });
},
// Fonction pour récupérer le profil du ministère
async getMinistereProfile(accountId) {
  try {
    const profile = await prisma.account.findUnique({
      where: { id: accountId },
      include: {
        ministere: true, // Inclure les informations du ministère
      },
    });

    return profile; // Retourner les informations du profil
  } catch (error) {
    console.error("Erreur lors de la récupération du profil du ministère:", error);
    throw new Error('Erreur lors de la récupération du profil');
  }
}
, 
 async changePassword(accountId, currentPassword, newPassword) {
  // 1. Récupérer le compte
  const account = await prisma.account.findUnique({
    where: { id: accountId },
  });

  if (!account) {
    throw new Error("Compte non trouvé");
  }
    console.log("ACCOUNT ESSAI", account);
  
  // 2. Vérifier l'ancien mot de passe
  const isPasswordValid = await bcrypt.compare(currentPassword, account.password);
  if (!isPasswordValid) {
    throw new Error("Mot de passe actuel incorrect");
  }
     console.log("MDP ESSAI", isPasswordValid);
  // 3. Hacher le nouveau mot de passe
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // 4. Mettre à jour le mot de passe
  await prisma.account.update({
    where: { id: accountId },
    data: { password: hashedPassword },
  });

  return true;
}
, 

 async  updateUniProfile(accountId, data) {
  return await prisma.$transaction(async (tx) => {
    // Update Account
    const updatedAccount = await tx.account.update({
      where: { id: accountId },
      data: {
        username: data.username,
        email: data.email,
      },
    });

    // Update Ministere
    const updatedUni = await tx.university.update({
      where: { accountId: accountId },
      data: {
        adresseUni: data.adresseUni,
        nomUni : data.nomUni,
        telephoneUni: data.telephoneUni,
      },
    });

    return { updatedAccount, updatedUni };
  });
},

async getUniProfile(accountId) {
  try {
    const profile = await prisma.account.findUnique({
      where: { id: accountId },
      include: {
        university: true, 
      },
    });

    return profile; // Retourner les informations du profil
  } catch (error) {
    console.error("Erreur lors de la récupération du profil du uni:", error);
    throw new Error('Erreur lors de la récupération du profil');
  }
}

}