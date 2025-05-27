// controllers/DiplomaController.js
import diplomaModel from '../models/Diploma.js';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import crypto from 'crypto';
import gestionDiplomeInstance from '../../Hyperledger_Besu1/diplome.js';


const DiplomasController = {
  async creerDiplomes (req, res)  {
    try {
const token = req.headers.authorization?.split(" ")[1];
if (!token) return res.status(401).json({ success: false, message: "Token manquant" });    
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const senderId = decoded.id;

      
      const {  anneeId, titreDiplome, typeDiplome, etudiants , universityName } = req.body;
      console.log("partie Controller: ");
      console.log("📩 Requête reçue avec :", req.body);
      console.log("Type de etudiants:", typeof etudiants);
      console.log("Contenu de etudiants:", etudiants);
      console.log("Premier élément:", etudiants[0]);
      console.log("university name",universityName);
      if (!anneeId || !titreDiplome || !typeDiplome || !etudiants || !universityName) {
        return res.status(400).json({ success: false, message: "Champs requis manquants" });
      }

      const result = await diplomaModel.creerDiplomesPourEtudiants(anneeId, titreDiplome, typeDiplome, etudiants,  universityName);

      if (result.length === 0) {
        return res.status(400).json({ success: false, message: "Aucun diplôme n'a pu être créé. Vérifiez les données des étudiants." });
      }
      
      res.status(200).json({ success: true, diplomeIds: result.map(d => d.id) });

    } catch (error) {
      console.error("Erreur création diplômes:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }, 
 // Récupérer les diplômes NON validés pour une université
async  getDiplomasToValidate(req, res) {
  try {
    const { universityId } = req.params;
    const diplomas = await diplomaModel.getDiplomasToValidateService(universityId);
    console.log("les diplomes trouve : ", diplomas);
 res.json(diplomas);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des diplômes.' });
  }
}
,
// Valider un diplôme spécifique
async  validateDiploma(req, res) {
  try {
     const accountId = req.user?.accountId;
    const { diplomaId } = req.params;
    const diploma = await diplomaModel.validateDiplomaService(diplomaId,  accountId);
    res.json({
      message: `Diplôme ${diploma.nom} validé avec succès !`,
      diploma
    });
  } catch (error) {
    console.error('Erreur de validation:', error);
    res.status(500).json({ message: 'Erreur lors de la validation du diplôme.' });
  }
}
,
// Valider TOUS les diplômes d'une université
async validateAllDiplomas(req, res) {
  try {
     const accountId = req.user?.accountId;
    const { universityId } = req.params;
    const result = await diplomaModel.validateAllDiplomasService(universityId , accountId);
    res.json({ message: `${result.count} diplômes validés avec succès !` });
  } catch (error) {
    console.error('Erreur bulk validation:', error);
    res.status(500).json({ message: 'Erreur lors de la validation de tous les diplômes.' });
  }
}
,
// Récupérer les diplômes VALIDÉS d'une université
async  getValidatedDiplomas(req, res) {
  try {
    const { universityId } = req.params;
    const diplomas = await diplomaModel.getValidatedDiplomasService(universityId);
    res.json(diplomas);
  } catch (error) {
    console.error('Erreur diplômes validés:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des diplômes validés.' });
  }
}, 

async rejectDiploma  (req, res) {
  const { diplomaId } = req.params;

  try {
    const diploma = await diplomaModel.deleteDiplomaById(diplomaId);

    if (!diploma) {
      return res.status(404).json({ error: 'Diplôme non trouvé' });
    }

    res.status(200).json({ message: 'Diplôme rejeté avec succès' });
  } catch (error) {
    console.error('Erreur lors du rejet du diplôme :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}, 
async rejectDiplomaECOLE  (req, res) {
  const { diplomaId } = req.params;

  try {
    const diploma = await diplomaModel.deleteDiplomaByIdECOLE(diplomaId);

    if (!diploma) {
      return res.status(404).json({ error: 'Diplôme non trouvé' });
    }

    res.status(200).json({ message: 'Diplôme rejeté avec succès' });
  } catch (error) {
    console.error('Erreur lors du rejet du diplôme :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}, 

 // 🆕 Demander un diplôme (par étudiant connecté)
 async demanderDiplome(req, res) {
    try {
       const accountId = req.user?.accountId;

      // 1. Trouver l'étudiant correspondant
      const etudiant = await prisma.etudiant.findFirst({
        where: {
          OR: [
            { nom: { contains: req.body.studentName.split(' ')[0] } },
            { prenom: { contains: req.body.studentName.split(' ')[1] } }
          ]
        }
      });
  
      if (!etudiant) {
        return res.status(404).json({ message: "Étudiant non trouvé" });
      }
  
     // 1. Trouver l'université par son nom
const universite = await prisma.university.findFirst({
  where: {
    nomUni: req.body.etablissement 
  },
  select: {
    idUni: true
  }
});
 console.log("UNIVERSITE", universite)
if (!universite) {
  return res.status(404).json({ message: "Université non trouvée." });
}
 console.log("cursus~~~~~~~~~~~~~~~~~~~~",etudiant.idEtudiant )
 console.log("cursus~~~~~~~~~~~~~~~~~~~~",req.body.speciality)
 
  
// 2. Trouver le cursus universitaire lié à l'étudiant et à une faculté de cette université
const cursus = await prisma.cursusUniversitaire.findFirst({
  where: {
    idEtudiant: etudiant.idEtudiant,
    specialite: req.body.speciality,
 faculty: {
  is: {
    idUni: universite.idUni
  }
}

  }
});

    const diplome = await prisma.diplome.findFirst({
  where: { etudiantId : etudiant.idEtudiant , 
    diplomaTitle : req.body.diplomaTitle , 
    speciality : req.body.speciality
  }})


     
       
     console.log("cursus~~~~~~~~~~~~~~~~~~~~", cursus)
   console.log("titre", req.body.diplomaTitle);
   console.log("lieu", req.body.lieuNaissance);
   console.log("nom", req.body.studentName.split(' ')[0]);
   console.log("prenom", req.body.studentName.split(' ')[1]);
   console.log("date", req.body.birthDate);
   console.log("specialite", req.body.speciality);

   const diplomaHash = `$${req.body.diplomaTitle.toLowerCase()}|${req.body.lieuNaissance.toLowerCase()}|${req.body.studentName.split(' ')[0].toLowerCase()}${req.body.studentName.split(' ')[1].toLowerCase()}|${req.body.birthDate}|${req.body.speciality.toLowerCase()}`;
      const hash = crypto.createHash('sha256').update(diplomaHash).digest('hex');
   console.log("HASH", hash);

    const diplomaOnChain = await gestionDiplomeInstance.methods.getDiplome(hash).call();
  console.log("✅ Diplôme trouvé sur blockchain:", diplomaOnChain);

  if(!diplomaOnChain){
      return res.status(404).json({ message: "diplome non trouvé sur blockchain." });}
  

      // 7. Si diplôme trouvé localement
    if (diplome) {
      const verificationLink = `https://CertifyMe.com/verifier-diplome/${diplome.diplomaHash}`;


         console.log(
  "idEtudiant:", etudiant.idEtudiant,
  "| idCompte:", accountId,
  "| nom complet:", `${etudiant.nom} ${etudiant.prenom}`,
  "| lien de vérification:", verificationLink,
  "| titre du diplôme:", diplome.diplomaTitle,
  "| établissement:", diplome.etablissement,
  "| date de demande:", new Date(),
  "| dernier accès:", new Date()
);


      const historiqueData = {
        idEtudiant: etudiant.idEtudiant,
        idCompte: accountId,
        nomEtudiant: `${etudiant.nom} ${etudiant.prenom}`,
        lienVerification: verificationLink,
        titreDiplome: diplome.diplomaTitle,
        etablissement: diplome.etablissement,
        dateDemande: new Date(),
        dateDernierAcces: new Date()
      };

      console.log("📝 Données à insérer dans l'historique :", historiqueData);

      await prisma.historiqueVerification.create({
        data: historiqueData
      });

        return res.json({
          success: true,
          message: "Diplôme trouvé dans notre système!",
          verificationMessage: `Pour vérifier la validité de votre diplôme à tout moment, voici votre lien permanent:`,
          verificationLink: verificationLink,
          verificationRemarque: `ce lien doit être vérifié sur la plateforme CertifyMe . un clic sur ce lien n'accédera à aucune page de vérification`,
          diplomaInfo: {
            title: diplome.diplomaTitle,
            date: diplome.dateOfIssue,
            establishment: diplome.etablissement
          }
        });
      }
  
      return res.status(404).json({
        success: false,
        message: "Aucun diplôme trouvé avec ces informations.",
        suggestion: "Votre demande a été enregistrée. Vous recevrez une notification lorsque le diplôme sera disponible."
      });
  
    } catch (error) {
      console.error('Erreur lors de la vérification du diplôme:', {
        error: error.message,
        stack: error.stack,
        requestBody: req.body
      });
      res.status(500).json({ 
        success: false,
        message: "Erreur serveur lors de la vérification",
        technicalDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
 async getHistorique(req, res) {
  try {
    const idCompte = req.user?.accountId;

    if (!idCompte) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentification requise" 
      });
    }

    const historique = await prisma.historiqueVerification.findMany({
      where: { idCompte }, // <-- maintenant on filtre par l’utilisateur connecté
      orderBy: { dateDemande: 'desc' }
    });

    res.status(200).json({
      success: true,
      historique: historique.map(item => ({
        id: item.id,
        titreDiplome: item.titreDiplome,
        lienVerification: item.lienVerification,
        etablissement: item.etablissement,
        dateDemande: item.dateDemande
      }))
    });

  } catch (error) {
    console.error('Erreur getHistorique:', error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
}
 , 
async  verifierDiplome(req, res) {
  try {
    const { hash } = req.params;
    console.log("🔎 Vérification du diplôme pour hash :", hash);

    const result = await diplomaModel.verifierDiplomeModele(hash);

    if (!result || !result.success) {
      return res.status(404).json({
        success: false,
        message: result?.message || "Aucun diplôme trouvé avec cet identifiant",
      });
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error("❌ Erreur lors de la vérification du diplôme :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
} , 
async generateHash (req, res)  {
    try {
   const { titreDiplome, lieuNaissance, nom, prenom, dateNaissance, specialite } = req.body;

console.log("Les infos reçues sont :");
console.log(`Nom : ${nom}`);
console.log(`Prénom : ${prenom}`);
console.log(`Date de naissance : ${dateNaissance}`);
console.log(`Lieu de naissance : ${lieuNaissance}`);
console.log(`Titre du diplôme : ${titreDiplome}`);
console.log(`Spécialité : ${specialite}`);
    if (!titreDiplome || !lieuNaissance || !nom || !prenom || !dateNaissance || !specialite) {
        return res.status(400).json({ error: 'Données manquantes' });
      }     
      const diplomaHash = `$${titreDiplome}|${lieuNaissance}|${nom}${prenom}|${dateNaissance}|${specialite}`;
      const hash = crypto.createHash('sha256').update(diplomaHash).digest('hex');

      return res.json({ hash });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erreur serveur lors de la génération du hash' });
    }
  },

   async creerDiplomesECOLE (req, res)  {
    try {
const token = req.headers.authorization?.split(" ")[1];
if (!token) return res.status(401).json({ success: false, message: "Token manquant" });    
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const senderId = decoded.id;

      const {  anneeId, titreDiplome, typeDiplome, etudiants , EcoleName } = req.body;
      console.log("partie Controller: ");
      console.log("📩 Requête reçue avec :", req.body);
      console.log("Type de etudiants:", typeof etudiants);
      console.log("Contenu de etudiants:", etudiants);
      console.log("Premier élément:", etudiants[0]);
      console.log("ecole name",EcoleName);
      if (!anneeId || !titreDiplome || !typeDiplome || !etudiants || !EcoleName) {
        return res.status(400).json({ success: false, message: "Champs requis manquants" });
      }

      const result = await diplomaModel.creerDiplomesPourEtudiantsECOLE(anneeId, titreDiplome, typeDiplome, etudiants,  EcoleName);

      if (result.length === 0) {
        return res.status(400).json({ success: false, message: "Aucun diplôme n'a pu être créé. Vérifiez les données des étudiants." });
      }
      
      res.status(200).json({ success: true, diplomeIds: result.map(d => d.id) });

    } catch (error) {
      console.error("Erreur création diplômes:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }, 
 // Récupérer les diplômes NON validés pour une université
async  getDiplomasToValidateECOLE(req, res) {
  try {
    const { ecoleId } = req.params;
    const diplomas = await diplomaModel.getDiplomasToValidateServiceECOLE(ecoleId);
    console.log("les diplomes trouve : ", diplomas);
 res.json(diplomas);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des diplômes.' });
  }
}
,
// Valider un diplôme spécifique
async  validateDiplomaECOLE(req, res) {
  try {
     const accountId = req.user?.accountId;
    const { diplomaId } = req.params;
    const diploma = await diplomaModel.validateDiplomaServiceECOLE(diplomaId,  accountId);
    res.json({
      message: `Diplôme ${diploma.nom} validé avec succès !`,
      diploma
    });
  } catch (error) {
    console.error('Erreur de validation:', error);
    res.status(500).json({ message: 'Erreur lors de la validation du diplôme.' });
  }
}
,
// Valider TOUS les diplômes d'une université
async validateAllDiplomasECOLE(req, res) {
  try {
     const accountId = req.user?.accountId;
    const { ecoleId } = req.params;
    const result = await diplomaModel.validateAllDiplomasServiceECOLE(ecoleId , accountId);
    res.json({ message: `${result.count} diplômes validés avec succès !` });
  } catch (error) {
    console.error('Erreur bulk validation:', error);
    res.status(500).json({ message: 'Erreur lors de la validation de tous les diplômes.' });
  }
}
,
// Récupérer les diplômes VALIDÉS d'une université
async  getValidatedDiplomasECOLE(req, res) {
  try {
    const { ecoleId } = req.params;
    const diplomas = await diplomaModel.getValidatedDiplomasServiceECOLE(ecoleId);
    res.json(diplomas);
  } catch (error) {
    console.error('Erreur diplômes validés:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des diplômes validés.' });
  }
}, 
// 🆕 Demander un diplôme (par étudiant connecté)
  async demanderDiplomeECOLE(req, res) {
    try {
        const accountId = req.user?.accountId;

    // 1. Trouver l'étudiant correspondant
      const etudiant = await prisma.etudiantEcole.findFirst({
        where: {
          OR: [
            { nom: { contains: req.body.studentName.split(' ')[0] } },
            { prenom: { contains: req.body.studentName.split(' ')[1] } }
          ]
        }
      });
  
      if (!etudiant) {
        return res.status(404).json({ message: "Étudiant non trouvé" });
      }
  
     // 1. Trouver l'université par son nom
const ecole = await prisma.ecole.findFirst({
  where: {
    nomEcole: req.body.etablissement 
  },
  select: {
    idEcole: true
  }
});
 console.log("ecole trouve", ecole)
if (!ecole) {
  return res.status(404).json({ message: "ecole non trouvée." });
}
 console.log("cursus~~~~~~~~~~~~~~~~~~~~",etudiant.idEtudiantEcole )
 console.log("cursus~~~~~~~~~~~~~~~~~~~~",req.body.speciality)
 
  
// 2. Trouver le cursus universitaire lié à l'étudiant et à une faculté de cette université
const cursus = await prisma.cursusEcole.findFirst({
  where: {
    etudiantId: etudiant.idEtudiantEcole,
    Formation: {
      nomFormation: req.body.speciality, // ou un autre champ selon ton besoin
      Ecole: {
        idEcole: ecole.idEcole
      }
    }
  }
});


    const diplome = await prisma.diplomeEcole.findFirst({
  where: { etudiantEcoleId : etudiant.idEtudiantEcole , 
    diplomaTitle : req.body.diplomaTitle , 
    specialite : req.body.speciality
  }})

   console.log("cursus~~~~~~~~~~~~~~~~~~~~", cursus)
   console.log("titre", req.body.diplomaTitle.toLowerCase());
   console.log("lieu", req.body.lieuNaissance.toLowerCase());
   console.log("nom", req.body.studentName.split(' ')[0].toLowerCase());
   console.log("prenom", req.body.studentName.split(' ')[1].toLowerCase());
   console.log("date", req.body.birthDate);
   console.log("specialite", req.body.speciality.toLowerCase());
   
   const diplomaHash = `$${req.body.diplomaTitle.toLowerCase()}|${req.body.lieuNaissance.toLowerCase()}|${req.body.studentName.split(' ')[0].toLowerCase()}${req.body.studentName.split(' ')[1].toLowerCase()}|${req.body.birthDate}|${req.body.speciality.toLowerCase()}`;
      const hash = crypto.createHash('sha256').update(diplomaHash).digest('hex');
   console.log("HASH", hash);

    const diplomaOnChain = await gestionDiplomeInstance.methods.getDiplome(hash).call();
  console.log("✅ Diplôme trouvé sur blockchain:", diplomaOnChain);

     if(!diplomaOnChain){
      return res.status(404).json({ message: "diplome non trouvé sur blockchain." });}
  
      if (diplomaOnChain) {
        const verificationLink = `https://CertifyMe.com/verifier-diplome/${hash}`;

    console.log("TITRE DIPLOME", req.body.diplomaTitle);

           const historiqueData = {
        idEtudiant: etudiant.idEtudiantEcole,
        idCompte: req.user?.accountId,
        nomEtudiant: `${etudiant.nom} ${etudiant.prenom}`,
        lienVerification: verificationLink,
        titreDiplome: req.body.diplomaTitle,
        etablissement: req.body.etablissement,
        dateDemande: new Date(),
        dateDernierAcces: new Date()
      };

      console.log("📝 Données à insérer dans l'historique :", historiqueData);

      await prisma.historiqueVerification.create({
        data: historiqueData
      });

   return res.json({
          success: true,
          message: "Diplôme trouvé dans notre système!",
          verificationMessage: `Pour vérifier la validité de votre diplôme à tout moment, voici votre lien permanent:`,
          verificationLink: verificationLink,
          verificationRemarque: `ce lien doit être vérifié sur la plateforme CertifyMe . un clic sur ce lien n'accédera à aucune page de vérification`,
          diplomaInfo: {
            title:  req.body.diplomaTitle,
            date:  req.body.dateOfIssue,
            establishment:  req.body.etablissement
          }
        });
      }
  
      return res.status(404).json({
        success: false,
        message: "Aucun diplôme trouvé avec ces informations.",
        suggestion: "Votre demande a été enregistrée. Vous recevrez une notification lorsque le diplôme sera disponible."
      });
  
    } catch (error) {
      console.error('Erreur lors de la vérification du diplôme:', {
        error: error.message,
        stack: error.stack,
        requestBody: req.body
      });
      res.status(500).json({ 
        success: false,
        message: "Erreur serveur lors de la vérification",
        technicalDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }, 

      
  async  verifierDiplomeECOLE(req, res) {
  try {
    const { hash } = req.params;
    console.log("🔎 Vérification du diplôme pour hash :", hash);

    const result = await diplomaModel.verifierDiplomeModele(hash);

    if (!result || !result.success) {
      return res.status(404).json({
        success: false,
        message: result?.message || "Aucun diplôme trouvé avec cet identifiant",
      });
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error("❌ Erreur lors de la vérification du diplôme :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
} , 


async getEcoleDiplomes(req, res) {
  try {
    const { ecoleId } = req.params;
    const { annee } = req.query;

    const whereClause = {
      etudiantEcole: {
        cursus: {
          some: {
            annee: {
              ecoleId: parseInt(ecoleId)
            }
          }
        }
      }
    };

    if (annee) {
      whereClause.dateOfIssue = {
        gte: new Date(`${annee}-01-01`),
        lte: new Date(`${annee}-12-31`)
      };
    }

    const diplomes = await prisma.diplomeEcole.findMany({
      where: whereClause,
      orderBy: { dateOfIssue: 'desc' },
      include: {
        etudiantEcole: {
          select: {
            nom: true,
            prenom: true,
            matricule: true
          }
        }
      }
    });

    res.json(diplomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},


async deleteEcoleDiploma(req, res) {
  try {
    const { diplomaId } = req.params;

    // Vérifier si le diplôme existe et n'est pas encore validé
    const diplome = await prisma.diplomeEcole.findUnique({
      where: { id: parseInt(diplomaId) }
    });

    if (!diplome) {
      return res.status(404).json({ success: false, message: "Diplôme non trouvé" });
    }

    if (diplome.complete) {
      return res.status(400).json({ 
        success: false, 
        message: "Impossible de supprimer un diplôme déjà validé par le ministère" 
      });
    }

    // Supprimer le diplôme
    await prisma.diplomeEcole.delete({
      where: { id: parseInt(diplomaId) }
    });

    res.json({ success: true, message: "Diplôme supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
,
async getUniversityDiplomas(req, res) {
  try {
    const { universityId } = req.params;
    const { annee, statut } = req.query;

    // Construction de la clause where de base
    const where = {
      etudiant: {
        CursusUniversitaire: {
          some: {
            faculty: {
              idUni: parseInt(universityId)
            }
          }
        }
      }
    };

    // Ajout du filtre par statut si spécifié
    if (statut === 'VALIDES') {
      where.complete = true;
    } else if (statut === 'EN_ATTENTE') {
      where.complete = false;
    }

    // Ajout du filtre par année si spécifié
    if (annee) {
      where.dateOfIssue = {
        gte: new Date(`${annee}-01-01`),
        lte: new Date(`${annee}-12-31`)
      };
    }

    const diplomes = await prisma.diplome.findMany({
      where,
      orderBy: { dateOfIssue: 'desc' },
      include: {
        etudiant: {
          select: {
            nom: true,
            prenom: true,
            matricule: true
          }
        }
      }
    });

    res.json(diplomes);
  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
},
// Nouvelle route pour supprimer un diplôme d'université
async deleteUniversityDiploma(req, res) {
  try {
    const { diplomaId } = req.params;

    // Vérifier si le diplôme existe et n'est pas encore validé
    const diplome = await prisma.diplome.findUnique({
      where: { id: parseInt(diplomaId) }
    });

    if (!diplome) {
      return res.status(404).json({ success: false, message: "Diplôme non trouvé" });
    }

    if (diplome.complete) {
      return res.status(400).json({ 
        success: false, 
        message: "Impossible de supprimer un diplôme déjà validé" 
      });
    }

    // Supprimer le diplôme
    await prisma.diplome.delete({
      where: { id: parseInt(diplomaId) }
    });

    res.json({ success: true, message: "Diplôme supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}, 
async getEcoleDiplomes(req, res) {
  try {
    const { ecoleId } = req.params;
    const { annee } = req.query;

    const whereClause = {
      EtudiantEcole: {
        CursusEcole: {
          some: {
            EcoleAnnee: {
              ecoleId: parseInt(ecoleId)
            }
          }
        }
      }
    };

    if (annee) {
      whereClause.dateOfIssue = {
        gte: new Date(`${annee}-01-01`),
        lte: new Date(`${annee}-12-31`)
      };
    }

    const diplomes = await prisma.diplomeEcole.findMany({
      where: whereClause,
      orderBy: { dateOfIssue: 'desc' },
      include: {
        EtudiantEcole: {
          select: {
            nom: true,
            prenom: true,
            matricule: true
          }
        }
      }
    });

    res.json(diplomes);
  } catch (error) {
    console.error('Erreur getEcoleDiplomes:', error);
    res.status(500).json({ message: error.message });
  }
}


}

export default DiplomasController;
