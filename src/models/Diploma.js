import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import web3 from '../../Hyperledger_Besu/web3.js';
import gestionDiplomeInstance from '../../Hyperledger_Besu/diplome.js';
import { decrypt } from '../controllers/encryptUtils.js'; // ta fonction de déchiffrement



const prisma = new PrismaClient();
export default {
  async creerDiplomesPourEtudiants( anneeId, titreDiplome, typeDiplome, etudiants , universityName) {
    const diplomesCrees = [];

    const university = await prisma.university.findFirst({
      where: { nomUni: universityName }
    });
  
    if (!university || !university.walletAddress || !university.walletPrivateKey || !university.walletIV) {
      throw new Error("❌ Université introuvable ou informations de wallet manquantes.");
    }
  
    const privateKey = decrypt(university.walletPrivateKey, university.walletIV);
  
  
    for (const etudiant of etudiants) {
      const idEtudiant = etudiant.idEtudiant;
  
      try {
        console.log("🎓 Création du diplôme pour :", idEtudiant);
  
        const infosEtudiant = await prisma.etudiant.findUnique({
          where: { idEtudiant }
        });
  
        if (!infosEtudiant || !infosEtudiant.nom || !infosEtudiant.prenom || !infosEtudiant.dateNaissance) {
          console.warn(`⛔ Données manquantes pour l'étudiant ${idEtudiant}.`);
          continue;
        }

        console.log("🎓 ESSAIE 1 ");
  
        const cursus = await prisma.cursusUniversitaire.findFirst({
          where: {
            idEtudiant,
            idAnnee: parseInt(anneeId, 10)
          },
          select: {
            specialite: true
          }
        });
        console.log("🎓 ESSAIE 2 ");
  
     
        const specialite = cursus?.specialite || "Inconnue";
  
        const existingDiploma = await prisma.diplome.findFirst({
          where: {
            etudiantId: idEtudiant,
            diplomaTitle: titreDiplome,
            diplomaType: typeDiplome,
            speciality: specialite
          }
        });
     
        console.log("🎓 ESSAIE 3 ");
  
     
        if (existingDiploma) {
          console.warn(`📛 Diplôme déjà existant pour l'étudiant ${idEtudiant} avec ce titre/type/spécialité.`);
          continue;
        }
       
        console.log("🎓 ESSAIE 4 ");
  
     
        const  diplomaHash = `${idEtudiant}|${titreDiplome}|${typeDiplome}|${infosEtudiant.nom} ${infosEtudiant.prenom}|${infosEtudiant.dateNaissance.toISOString()}|${specialite}`;
        const hash = crypto.createHash('sha256').update(diplomaHash).digest('hex');
    
        // Préparer les données pour la blockchain
      const txData = gestionDiplomeInstance.methods.createDiploma(
        diplomaHash,
        university.nomUni,
        `${infosEtudiant.nom} ${infosEtudiant.prenom}`,
        infosEtudiant.dateNaissance.toISOString().split("T")[0],
        infosEtudiant.lieuNaissance,
        titreDiplome,
        new Date().toISOString().split("T")[0],
        specialite,
        typeDiplome
      ).encodeABI();
     
      console.log("🎓 ESSAIE 5 ");
  
     
      const tx = {
        from: university.walletAddress,
        to: gestionDiplomeInstance.options.address,
        data: txData,
        gas: 3000000,
        gasPrice: '0',
      };
     
      console.log("🎓 ESSAIE 6 ");
  
     
      const signed = await web3.eth.accounts.signTransaction(tx, privateKey);
      await web3.eth.sendSignedTransaction(signed.rawTransaction);
      
      console.log("🎓 ESSAIE 7 ");
  
      console.log("voici le nom : ~~~é~~", universityName);
        const newDiplome = await prisma.diplome.create({
          data: {
            diplomaHash: hash,
            etablissement: universityName, 
            studentName: `${infosEtudiant.nom} ${infosEtudiant.prenom}`,
            birthDate: infosEtudiant.dateNaissance,
            diplomaTitle: titreDiplome,
            diplomaType: typeDiplome,
            dateOfIssue: new Date(),
            speciality: specialite,
            complete: false,
            etudiantId: idEtudiant
          }
        });
  
        diplomesCrees.push(newDiplome);


  
      } catch (err) {
        console.error(`💥 Erreur pour l'étudiant ${idEtudiant} :`, err);
      }
    }


    console.log("🎓 ESSAIE 8 ");
  
    return diplomesCrees;
  }
  
  
, // Récupérer les diplômes  validés d'une université
async getValidatedDiplomasService(universityId) {
  return await prisma.diplome.findMany({
    where: {
      complete: true ,
      etudiant: {
        CursusUniversitaire: {
          some: { // Utilisation de `some` pour vérifier la relation
            faculty: { // Si le champ dans `CursusUniversitaire` est `faculty` (faculté)
              idUni: parseInt(universityId)
            }
          }
        }
      }
    }
  });
} // Récupérer les diplômes non validés d'une université
,async getDiplomasToValidateService(universityId) {
  return await prisma.diplome.findMany({
    where: {
      complete: false,
      etudiant: {
        CursusUniversitaire: {
          some: { // Utilisation de `some` pour vérifier la relation
            faculty: { 
              idUni: parseInt(universityId)
            }
          }
        }
      }
    }
  });
}, 

// Valider un diplôme spécifique
async  validateDiplomaService(diplomaId) {
  return await prisma.diplome.update({
    where: { id: parseInt(diplomaId) },
    data: { complete: true }
  });
},

// Valider TOUS les diplômes non-validés d'une université
async validateAllDiplomasService(universityId) {
  return await prisma.diplome.updateMany({
    where: {
      complete: false,
      etudiant: {
        CursusUniversitaire: {
          some: { // Vérifier au moins un `CursusUniversitaire` correspondant
            faculty: { // Vérifier l'association avec `Faculty`
              idUni: parseInt(universityId)
            }
          }
        }
      }
    },
    data: { complete: true }
  });
}
,

async deleteDiplomaById  (diplomaId)  {
  return await prisma.diplome.delete({
    where: {
      id: parseInt(diplomaId)
    }
  });
}
};

