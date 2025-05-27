import { PrismaClient } from '@prisma/client';  // Utilisation de l'importation ES6
const prisma = new PrismaClient();

export default {
  async hasModele(ecoleId) {
    const ecole = await prisma.ecole.findUnique({
      where: { idEcole: parseInt(ecoleId) },
      select: { modeleDiplomeId: true },
    });
    return !!ecole?.modeleDiplomeId;
  },
  async getAll() {
    return await prisma.ecole_OFFICIAL.findMany({
      select: { idEcole: true, nomEcole: true }, // Sélection des champs nécessaires
    });
  },
  async getEcolesWithAccount() {
   const ecoles = await prisma.ecole.findMany({
      select: {
        idEcole: true,
        nomEcole: true,
        telephoneEcole: true,
        emailEcole: true,
        adresseEcole : true ,
        account: {
          select: {
            id: true,
            username: true,
            email: true,
            isVerified: true,
            role: true
          }
        }
      }
    });
  console.log("LES ECOLES ", ecoles )
return ecoles },

  async findEcoleById(ecoleId) {
  const id = parseInt(ecoleId);
  if (isNaN(id)) {
    throw new Error('idEcole invalide : ' + ecoleId);
  }

  return await prisma.ecole.findUnique({
    where: {
      idEcole: id
    },
    select: {
      idEcole: true,
      nomEcole: true,
      telephoneEcole: true,
      emailEcole: true,
      account: {
        select: {
          id: true,
          username: true,
          email: true,
          isVerified: true,
          role: true
        }
      }
    }
  });
}
,
  // Dans le fichier Ecole.js
async getEcolesByRole(role) {
  return await prisma.ecole_OFFICIAL.findMany({
    where: {
      roleEcole: role // This should match your database field name
    },
    select: {
      idEcole: true,
      nomEcole: true,
      telephoneEcole: true,
      emailEcole: true,
      roleEcole: true
    }
  });
}
, 

// Dans Ecole.js
async getEcolesWithAccountByRole(role) {
  return await prisma.ecole.findMany({
    where: {
      role : role
    },
    select: {
      idEcole: true,
      nomEcole: true,
      telephoneEcole: true,
      emailEcole: true,
      role: true,
      account: {
        select: {
          id: true,
          username: true,
          email: true,
          isVerified: true,
          role: true
        }
      }
    }
  });
}, 

      async setModeleDiplome(idEcole, modeleId) {
      return await prisma.ecole.update({
      where: { idEcole: parseInt(idEcole) },
      data: { modeleDiplomeId: modeleId },
    })
  }

};
