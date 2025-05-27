import { prisma } from "../prismaClient.js"; // Mets Prisma dans un fichier séparé
import bcrypt from "bcrypt";

async function checkUniqueEmailUsername(email, username, accountId, tx) {
  const existingAccount = await tx.account.findFirst({
    where: {
      AND: [
        { OR: [{ email }, { username }] },
        { id: { not: accountId } }
      ]
    }
  });
  if (existingAccount) {
    throw new Error('Email ou nom d\'utilisateur déjà utilisé');
  }
}

export default {
  async updateMinistereProfile(accountId, data) {
    return await prisma.$transaction(async (tx) => {
      await checkUniqueEmailUsername(data.email, data.username, accountId, tx);

      const updatedAccount = await tx.account.update({
        where: { id: accountId },
        data: { username: data.username, email: data.email },
      });

      const updatedMinistere = await tx.ministere.update({
        where: { accountId },
        data: {
          emailMinistere: data.email,
          numeroTelephone: data.numeroTelephone,
          nomMinistere: data.nom,
          
        },
      });

      return { updatedAccount, updatedMinistere };
    });
  },

  async getMinistereProfile(accountId) {
    try {
      return await prisma.account.findUnique({
        where: { id: accountId },
        include: { ministere: true },
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du profil du ministère:", error);
      throw new Error('Erreur lors de la récupération du profil');
    }
  },

  async changePassword(accountId, currentPassword, newPassword) {
    const account = await prisma.account.findUnique({ where: { id: accountId } });
    if (!account) throw new Error("Compte non trouvé");

    const isPasswordValid = await bcrypt.compare(currentPassword, account.password);
    if (!isPasswordValid) throw new Error("Mot de passe actuel incorrect");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.account.update({
      where: { id: accountId },
      data: { password: hashedPassword },
    });

    return true;
  },

  async updateUniProfile(accountId, data) {
    return await prisma.$transaction(async (tx) => {
      await checkUniqueEmailUsername(data.email, data.username, accountId, tx);

      const updatedAccount = await tx.account.update({
        where: { id: accountId },
        data: { username: data.username, email: data.email },
      });

      const updatedUni = await tx.university.update({
        where: { accountId },
        data: {
          adresseUni: data.adresseUni,
          nomUni: data.nomUni,
          telephoneUni: data.telephoneUni,
          emailUni: data.email,
        },
      });

      return { updatedAccount, updatedUni };
    });
  },

  async getUniProfile(accountId) {
    try {
      return await prisma.account.findUnique({
        where: { id: accountId },
        include: { university: true },
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du profil du uni:", error);
      throw new Error('Erreur lors de la récupération du profil');
    }
  },

  async updateECOLEProfile(accountId, data) {
    return await prisma.$transaction(async (tx) => {
      await checkUniqueEmailUsername(data.email, data.username, accountId, tx);

      const updatedAccount = await tx.account.update({
        where: { id: accountId },
        data: { username: data.username, email: data.email },
      });

      const updatedECOLE = await tx.ecole.update({
        where: { accountId },
        data: {
          adresseEcole: data.adresseEcole,
          nomEcole: data.nomEcole,
          telephoneEcole: data.telephoneEcole,
          emailEcole: data.email,
        },
      });

      return { updatedAccount, updatedECOLE };
    });
  },

  async getECOLEProfile(accountId) {
    try {
      return await prisma.account.findUnique({
        where: { id: accountId },
        include: { ecole: true },
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du profil du ecole:", error);
      throw new Error('Erreur lors de la récupération du profil');
    }
  },

  async updateSTUDENTProfile(accountId, data) {
    return await prisma.$transaction(async (tx) => {
      await checkUniqueEmailUsername(data.email, data.username, accountId, tx);

      const updatedAccount = await tx.account.update({
        where: { id: accountId },
        data: { username: data.username, email: data.email },
      });

      const updatedSTUDENT = await tx.etudiant_account.update({
        where: { accountId },
        data: {
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          telephone: data.telephone,
        },
      });

      return { updatedAccount, updatedSTUDENT };
    });
  },

  async getSTUDENTProfile(accountId) {
    try {
      return await prisma.account.findUnique({
        where: { id: accountId },
        include: { etudiant: true },
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du profil du student :", error);
      throw new Error('Erreur lors de la récupération du profil');
    }
  }
};
