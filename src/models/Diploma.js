import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import web3 from '../../Hyperledger_Besu1/web3.js';
import gestionDiplomeInstance from '../../Hyperledger_Besu1/diplome.js';
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
                console.log("Les infos reçues sont de le bd sont :");
console.log(`Nom : ${infosEtudiant.nom}`);
console.log(`Prénom :${infosEtudiant.prenom}`);
console.log(`Date de naissance : ${infosEtudiant.dateNaissance.toISOString().split("T")[0]}`);
console.log(`Lieu de naissance : ${infosEtudiant.lieuNaissance}`);
console.log(`Titre du diplôme : ${titreDiplome}`);
console.log(`Spécialité : ${specialite}`);
 

    
     
        if (existingDiploma) {
          console.warn(`📛 Diplôme déjà existant pour l'étudiant ${idEtudiant} avec ce titre/type/spécialité.`);
          continue;
        }
       
        console.log("🎓 ESSAIE 4 ");
   
         
        const  diplomaHash = `$${titreDiplome.toLowerCase()}|${infosEtudiant.lieuNaissance.toLowerCase()}|${infosEtudiant.nom.toLowerCase()}${infosEtudiant.prenom.toLowerCase()}|${infosEtudiant.dateNaissance.toISOString().split("T")[0]}|${specialite.toLowerCase()}`;
        const hash = crypto.createHash('sha256').update(diplomaHash).digest('hex');
    
        // Préparer les données pour la blockchain
      const txData = gestionDiplomeInstance.methods.createDiploma(
       hash,
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
         const ministereAccount = await prisma.account.findFirst({
  where: {
    role: "MINISTERE",
    ministere: {
     typeMinistere: "ENSEIGNEMENT_SUPERIEUR",
    },
  },
});

        if (ministereAccount) {
  await prisma.notification.create({
    data: {
      title: "Nouveau diplôme à valider",
      message: `Nouveau diplôme de ${universityName} à valider.`,
      type: "NOUVELLE_DEMANDE",
      receiverId: ministereAccount.id,
    }
  });}
        
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
  const university = await prisma.university.findUnique({
    where: { idUni: parseInt(universityId) },
    select: { nomUni: true }
  });

  if (!university) {
    throw new Error("Université non trouvée");
  }

  const diplomes = await prisma.diplome.findMany({
    where: {
      complete: true,
      etablissement: university.nomUni
    }
  });

  return diplomes;

} , 
async getDiplomasToValidateService(universityId) {
  const university = await prisma.university.findUnique({
    where: { idUni: parseInt(universityId) },
    select: { nomUni: true }
  });

  if (!university) {
    throw new Error("Université non trouvée");
  }

  const diplomes = await prisma.diplome.findMany({
    where: {
      complete: false,
      etablissement: university.nomUni
    }
  });

  return diplomes;
}
, 

async validateDiplomaService(diplomaId, accountId) {
  try {
    console.log(`[validateDiplomaService] Début validation diplôme id=${diplomaId} pour compte=${accountId}`);

    // 1. Trouver le ministère lié à ce compte
    const ministere = await prisma.ministere.findFirst({
      where: { accountId: accountId }
    });

    if (!ministere) {
      console.error("[validateDiplomaService] Aucun ministère trouvé pour ce compte.");
      throw new Error("Aucun ministère trouvé pour ce compte.");
    }

    if (!ministere.walletPrivateKey || !ministere.walletIV) {
      console.error("[validateDiplomaService] Clé privée ou IV manquants pour ministère.");
      throw new Error("Informations de sécurité manquantes pour le ministère.");
    }

    // 2. Trouver le diplôme
    const diplome = await prisma.diplome.findUnique({
      where: { id: parseInt(diplomaId) }
    });

    if (!diplome) {
      console.error(`[validateDiplomaService] Diplôme id=${diplomaId} non trouvé.`);
      throw new Error("Diplôme non trouvé.");
    }

    if (diplome.complete) {
      console.log(`[validateDiplomaService] Diplôme id=${diplomaId} est déjà validé.`);
      return diplome; // Ou throw selon le besoin
    }

    const diplomaHash = diplome.diplomaHash;
    console.log(`[validateDiplomaService] Hash du diplôme : ${diplomaHash}`);

  
    // 3. Déchiffrer la clé privée
    let privateKey;
    try {
      privateKey = decrypt(ministere.walletPrivateKey, ministere.walletIV);
      console.log("[validateDiplomaService] Clé privée déchiffrée avec succès.");
    } catch (error) {
      console.error("[validateDiplomaService] Erreur lors du déchiffrement de la clé privée :", error);
      throw new Error("Impossible de déchiffrer la clé privée du ministère.");
    }

    // 4. Préparer la transaction blockchain
    const txData = gestionDiplomeInstance.methods.approveDiploma(diplomaHash).encodeABI();
    

    const tx = {
      from: ministere.walletAddress,
      to: gestionDiplomeInstance.options.address,
      data: txData,
      gas: 200000,
      gasPrice: '0',
    };

    console.log("[validateDiplomaService] Signature de la transaction...");
    const signed = await web3.eth.accounts.signTransaction(tx, privateKey);
   
  
    console.log("[validateDiplomaService] Envoi de la transaction signée...");
    const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
     
    console.log("[validateDiplomaService] Transaction minée avec succès. Receipt :", receipt.transactionHash);

    // 5. Mise à jour du diplôme en base
    const updatedDiplome = await prisma.diplome.update({
      where: { id: parseInt(diplomaId) },
      data: { complete: true }
    });
    
    
    console.log(`[validateDiplomaService] Diplôme id=${diplomaId} validé en base.`);
   
    const university = await prisma.university.findFirst({
  where: {
    nomUni: diplome.etablissement,
    account: {
      role: "UNIVERSITY",
    },
  },
  include: {
    account: true,
  },
});  

        if (university) {
  await prisma.notification.create({
    data: {
      title: "Nouveau Diplôme validé",
      message: `Nouveau diplôme validé`,
      type: "NOUVELLE_DEMANDE",
      receiverId: university.account.id,
    }
  });
}
    return updatedDiplome;

  } catch (error) {
    console.error("[validateDiplomaService] Erreur :", error.message);
    throw error; // Propager l'erreur pour la gestion plus haut dans la chaîne
  }
}

,

async validateAllDiplomasService(universityId , accountId) {
  const university = await prisma.university.findUnique({
    where: { idUni: parseInt(universityId) },
    select: { nomUni: true }
  });

  if (!university) {
    throw new Error("Université non trouvée");
  }

  // Récupérer les diplômes non-validés pour cette université
  const diplomesNonValides = await prisma.diplome.findMany({
    where: {
      complete: false,
      etablissement: university.nomUni
    }
  });

  // Valider chaque diplôme un par un
  const diplomesValides = [];

 
    // 1. Trouver le ministère lié à ce compte
    const ministere = await prisma.ministere.findFirst({
      where: { accountId: accountId }
    });

    if (!ministere) {
      console.error("[validateDiplomaService] Aucun ministère trouvé pour ce compte.");
      throw new Error("Aucun ministère trouvé pour ce compte.");
    }

    if (!ministere.walletPrivateKey || !ministere.walletIV) {
      console.error("[validateDiplomaService] Clé privée ou IV manquants pour ministère.");
      throw new Error("Informations de sécurité manquantes pour le ministère.");
    }


      for (const diploma of diplomesNonValides) {
        const diplomaId = diploma.id
  
    // 2. Trouver le diplôme
    const diplome = await prisma.diplome.findUnique({
      where: { id: parseInt(diplomaId) }
    });

    if (!diplome) {
      console.error(`[validateDiplomaService] Diplôme id=${diplomaId} non trouvé.`);
      throw new Error("Diplôme non trouvé.");
    }

    if (diplome.complete) {
      console.log(`[validateDiplomaService] Diplôme id=${diplomaId} est déjà validé.`);
      return diplome; // Ou throw selon le besoin
    }

    const diplomaHash = diplome.diplomaHash;
    console.log(`[validateDiplomaService] Hash du diplôme : ${diplomaHash}`);

  
    // 3. Déchiffrer la clé privée
    let privateKey;
    try {
      privateKey = decrypt(ministere.walletPrivateKey, ministere.walletIV);
      console.log("[validateDiplomaService] Clé privée déchiffrée avec succès.");
    } catch (error) {
      console.error("[validateDiplomaService] Erreur lors du déchiffrement de la clé privée :", error);
      throw new Error("Impossible de déchiffrer la clé privée du ministère.");
    }

    // 4. Préparer la transaction blockchain
    const txData = gestionDiplomeInstance.methods.approveDiploma(diplomaHash).encodeABI();
    

    const tx = {
      from: ministere.walletAddress,
      to: gestionDiplomeInstance.options.address,
      data: txData,
      gas: 200000,
      gasPrice: '0',
    };

    console.log("[validateDiplomaService] Signature de la transaction...");
    const signed = await web3.eth.accounts.signTransaction(tx, privateKey);
   
  
    console.log("[validateDiplomaService] Envoi de la transaction signée...");
    const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
     
    console.log("[validateDiplomaService] Transaction minée avec succès. Receipt :", receipt.transactionHash);

    // 5. Mise à jour du diplôme en base
    const updatedDiplome = await prisma.diplome.update({
      where: { id: parseInt(diplomaId) },
      data: { complete: true }
    });
    
    
    console.log(`[validateDiplomaService] Diplôme id=${diplomaId} validé en base.`);


    const university = await prisma.university.findFirst({
  where: {
    nomUni: diplome.etablissement,
    account: {
      role: "UNIVERSITY",
    },
  },
  include: {
    account: true,
  },
});  

        if (university) {
  await prisma.notification.create({
    data: {
      title: "Nouveau Diplôme validé",
      message: `Nouveau diplôme validé`,
      type: "NOUVELLE_DEMANDE",
      receiverId: university.account.id,
    }
  });
}

    diplomesValides.push(updatedDiplome);
    }

  return diplomesValides;
}

,

async deleteDiplomaById  (diplomaId)  {
  return await prisma.diplome.delete({
    where: {
      id: parseInt(diplomaId)
    }
  });
}, 
async deleteDiplomaByIdECOLE (diplomaId)  {
  return await prisma.diplomeEcole.delete({
    where: {
      id: parseInt(diplomaId)
    }
  });
}, 
async  verifierDiplomeModele(hash) {
  try {
    const diplomaOnChain = await gestionDiplomeInstance.methods.getDiplome(hash).call();
    console.log("✅ Diplôme trouvé sur la blockchain :", diplomaOnChain);

    const etablissement = diplomaOnChain[1];
    console.log("LE NOM D'ÉTABLISSEMENT TROUVÉ :", etablissement);

    // Recherche dans les universités
    let typeEtablissement = null;
    let etablissementTrouve = await prisma.university.findFirst({
      where: {
        nomUni: {
          contains: etablissement,
          mode: 'insensitive',
        }
      },
      select: {
        idUni: true,
        nomUni: true,
        modeleDiplomeId: true
      }
    });

    let modeleDiplome = null;
    if (etablissementTrouve) {
      typeEtablissement = 'universite';
      console.log("✅ Université trouvée :", etablissementTrouve);
      modeleDiplome = await prisma.modeleDiplome.findUnique({
        where: { idModele: etablissementTrouve.modeleDiplomeId },
        select: { cheminModele: true }
      });
    } else {
      // Si ce n'est pas une université, on cherche dans les écoles
      etablissementTrouve = await prisma.ecole.findFirst({
        where: {
          nomEcole: {
            contains: etablissement,
            mode: 'insensitive',
          }
        },
        select: {
          idEcole: true,
          nomEcole: true,
          modeleDiplomeId: true
        }
      });

      if (etablissementTrouve) {
        typeEtablissement = 'ecole';
        console.log("✅ École trouvée :", etablissementTrouve);
        modeleDiplome = await prisma.modeleDiplomeECOLE.findUnique({
          where: { idModele: etablissementTrouve.modeleDiplomeId },
          select: { cheminModele: true }
        });
      }
    }

    if (!etablissementTrouve) {
      console.warn("⚠️ Établissement non trouvé :", etablissement);
      return { success: false, message: "Établissement introuvable" };
    }

    const cheminModele = modeleDiplome?.cheminModele;

    if (!cheminModele) {
      console.warn("⚠️ Modèle non trouvé pour l'établissement.");
    }

    console.log("CHEMIN MODÈLE TROUVÉ :", cheminModele);

    return {
      success: true,
      diplomaOnChain,
      typeEtablissement,
      etablissement: etablissementTrouve,
      cheminModele
    };

  } catch (error) {
    console.error("❌ Erreur dans verifierDiplomeModele :", error);
    return {
      success: false,
      message: "Erreur serveur ou données introuvables",
      error: error.message,
    };
  }
}
,


// Récupérer les diplômes  validés d'une université
async getValidatedDiplomasServiceECOLE(ecoleId) {
  const ecole = await prisma.ecole.findUnique({
    where: { idEcole: parseInt(ecoleId) },
    select: { nomEcole : true }
  });

  if (!ecole) {
    throw new Error("ecole non trouvée");
  }

  const diplomes = await prisma.diplomeEcole.findMany({
    where: {
      complete: true,
      etablissement: ecole.nomEcole
    }
  });

  return diplomes;

} , 
async getDiplomasToValidateServiceECOLE(ecoleId) {
 const ecole = await prisma.ecole.findUnique({
    where: { idEcole: parseInt(ecoleId) },
    select: { nomEcole : true }
  });


  if (!ecole) {
    throw new Error("Ecole non trouvée");
  }

  const diplomes = await prisma.diplomeEcole.findMany({
    where: {
      complete: false,
      etablissement: ecole.nomEcole
    }
  });

  
  return diplomes;
}
, 

async validateDiplomaServiceECOLE(diplomaId, accountId) {
  try {
    console.log(`[validateDiplomaService] Début validation diplôme id=${diplomaId} pour compte=${accountId}`);

    // 1. Trouver le ministère lié à ce compte
    const ministere = await prisma.ministere.findFirst({
      where: { accountId: accountId }
    });

    if (!ministere) {
      console.error("[validateDiplomaService] Aucun ministère trouvé pour ce compte.");
      throw new Error("Aucun ministère trouvé pour ce compte.");
    }

    if (!ministere.walletPrivateKey || !ministere.walletIV) {
      console.error("[validateDiplomaService] Clé privée ou IV manquants pour ministère.");
      throw new Error("Informations de sécurité manquantes pour le ministère.");
    }

    // 2. Trouver le diplôme
    const diplome = await prisma.diplomeEcole.findUnique({
      where: { id: parseInt(diplomaId) }
    });

    if (!diplome) {
      console.error(`[validateDiplomaService] Diplôme id=${diplomaId} non trouvé.`);
      throw new Error("Diplôme non trouvé.");
    }

    if (diplome.complete) {
      console.log(`[validateDiplomaService] Diplôme id=${diplomaId} est déjà validé.`);
      return diplome; // Ou throw selon le besoin
    }

    const diplomaHash = diplome.diplomaHash;
    console.log(`[validateDiplomaService] Hash du diplôme : ${diplomaHash}`);

  
    // 3. Déchiffrer la clé privée
    let privateKey;
    try {
      privateKey = decrypt(ministere.walletPrivateKey, ministere.walletIV);
      console.log("[validateDiplomaService] Clé privée déchiffrée avec succès.");
    } catch (error) {
      console.error("[validateDiplomaService] Erreur lors du déchiffrement de la clé privée :", error);
      throw new Error("Impossible de déchiffrer la clé privée du ministère.");
    }

    // 4. Préparer la transaction blockchain
    const txData = gestionDiplomeInstance.methods.approveDiploma(diplomaHash).encodeABI();
    

    const tx = {
      from: ministere.walletAddress,
      to: gestionDiplomeInstance.options.address,
      data: txData,
      gas: 200000,
      gasPrice: '0',
    };

    console.log("[validateDiplomaService] Signature de la transaction...");
    const signed = await web3.eth.accounts.signTransaction(tx, privateKey);
   
  
    console.log("[validateDiplomaService] Envoi de la transaction signée...");
    const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
     
    console.log("[validateDiplomaService] Transaction minée avec succès. Receipt :", receipt.transactionHash);

    // 5. Mise à jour du diplôme en base
    const updatedDiplome = await prisma.diplomeEcole.update({
      where: { id: parseInt(diplomaId) },
      data: { complete: true }
    });
    
    
    console.log(`[validateDiplomaService] Diplôme id=${diplomaId} validé en base.`);
     
  const ecole = await prisma.ecole.findFirst({
  where: {
    nomEcole: diplome.etablissement,
    account: {
      role: "ECOLE",
    },
  },
  include: {
    account: true,
  },
});  

        if (ecole) {
  await prisma.notification.create({
    data: {
      title: "Nouveau Diplôme validé",
      message: `Nouveau diplôme validé`,
      type: "NOUVELLE_DEMANDE",
      receiverId: ecole.account.id,
    }
  });
}
    return updatedDiplome;

  } catch (error) {
    console.error("[validateDiplomaService] Erreur :", error.message);
    throw error; // Propager l'erreur pour la gestion plus haut dans la chaîne
  }
}

,

async validateAllDiplomasServiceECOLE(ecoleId , accountId) {
 const ecole = await prisma.ecole.findUnique({
    where: { idEcole: parseInt(ecoleId) },
    select: { nomEcole : true }
  });


  if (!ecole) {
    throw new Error("ecole non trouvée");
  }



  // Récupérer les diplômes non-validés pour cette université
  const diplomesNonValides = await prisma.diplomeEcole.findMany({
    where: {
      complete: false,
      etablissement: ecole.nomEcole
    }
  });

  // Valider chaque diplôme un par un
  const diplomesValides = [];

 
    // 1. Trouver le ministère lié à ce compte
    const ministere = await prisma.ministere.findFirst({
      where: { accountId: accountId }
    });

    if (!ministere) {
      console.error("[validateDiplomaService] Aucun ministère trouvé pour ce compte.");
      throw new Error("Aucun ministère trouvé pour ce compte.");
    }

    if (!ministere.walletPrivateKey || !ministere.walletIV) {
      console.error("[validateDiplomaService] Clé privée ou IV manquants pour ministère.");
      throw new Error("Informations de sécurité manquantes pour le ministère.");
    }


      for (const diploma of diplomesNonValides) {
        const diplomaId = diploma.id


  
    // 2. Trouver le diplôme
    const diplome = await prisma.diplomeEcole.findUnique({
      where: { id: parseInt(diplomaId) }
    });

    if (!diplome) {
      console.error(`[validateDiplomaService] Diplôme id=${diplomaId} non trouvé.`);
      throw new Error("Diplôme non trouvé.");
    }

    if (diplome.complete) {
      console.log(`[validateDiplomaService] Diplôme id=${diplomaId} est déjà validé.`);
      return diplome; // Ou throw selon le besoin
    }

    const diplomaHash = diplome.diplomaHash;
    console.log(`[validateDiplomaService] Hash du diplôme : ${diplomaHash}`);

  
    // 3. Déchiffrer la clé privée
    let privateKey;
    try {
      privateKey = decrypt(ministere.walletPrivateKey, ministere.walletIV);
      console.log("[validateDiplomaService] Clé privée déchiffrée avec succès.");
    } catch (error) {
      console.error("[validateDiplomaService] Erreur lors du déchiffrement de la clé privée :", error);
      throw new Error("Impossible de déchiffrer la clé privée du ministère.");
    }

    // 4. Préparer la transaction blockchain
    const txData = gestionDiplomeInstance.methods.approveDiploma(diplomaHash).encodeABI();
    

    const tx = {
      from: ministere.walletAddress,
      to: gestionDiplomeInstance.options.address,
      data: txData,
      gas: 200000,
      gasPrice: '0',
    };

    console.log("[validateDiplomaService] Signature de la transaction...");
    const signed = await web3.eth.accounts.signTransaction(tx, privateKey);
   
  
    console.log("[validateDiplomaService] Envoi de la transaction signée...");
    const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
     
    console.log("[validateDiplomaService] Transaction minée avec succès. Receipt :", receipt.transactionHash);

    // 5. Mise à jour du diplôme en base
    const updatedDiplome = await prisma.diplomeEcole.update({
      where: { id: parseInt(diplomaId) },
      data: { complete: true }
    });
    
    
    console.log(`[validateDiplomaService] Diplôme id=${diplomaId} validé en base.`);
    
     const ecole = await prisma.ecole.findFirst({
  where: {
    nomEcole: diplome.etablissement,
    account: {
      role: "ECOLE",
    },
  },
  include: {
    account: true,
  },
});  

        if (ecole) {
  await prisma.notification.create({
    data: {
      title: "Nouveau Diplôme validé",
      message: `Nouveau diplôme validé`,
      type: "NOUVELLE_DEMANDE",
      receiverId: ecole.account.id,
    }
  });
}
    diplomesValides.push(updatedDiplome);
    }

  return diplomesValides;
}, 
 async creerDiplomesPourEtudiantsECOLE( anneeId, titreDiplome, typeDiplome, etudiants , EcoleName) {
  console.log("Infos création diplome:",anneeId);
  console.log("Infos titre:",titreDiplome);
   console.log("Infos type:", typeDiplome);
    console.log("Infos etudiants", etudiants);
     console.log("Infos n diplome:",  EcoleName);

    const diplomesCrees = [];

    const ecole= await prisma.ecole.findFirst({
      where: { nomEcole :EcoleName }
    });
  
    if (!ecole || !ecole.walletAddress || !ecole.walletPrivateKey || !ecole.walletIV) {
      throw new Error("❌ ecole introuvable ou informations de wallet manquantes.");
    }
  
    const privateKey = decrypt(ecole.walletPrivateKey, ecole.walletIV);
  
  
    for (const etudiant of etudiants) {
      const idEtudiant = etudiant.idEtudiant;
  
      try {
        console.log("🎓 Création du diplôme pour :", idEtudiant);
  
        const infosEtudiant = await prisma.etudiantEcole.findUnique({
          where: { idEtudiantEcole :idEtudiant }
        });
  
        if (!infosEtudiant || !infosEtudiant.nom || !infosEtudiant.prenom || !infosEtudiant.dateNaissance) {
          console.warn(`⛔ Données manquantes pour l'étudiant ${idEtudiant}.`);
          continue;
        }

        console.log("🎓 ESSAIE 1 ");
  
       const cursus = await prisma.cursusEcole.findFirst({
  where: {
    etudiantId: idEtudiant,
    anneeId: parseInt(anneeId, 10)
  },
  select: {
    formationId: true,
    Formation: {
      select: {
        nomFormation: true,
      }
    }
}});

        console.log("🎓 ESSAIE 2 ");
  
     
        const specialite = cursus?.Formation?.nomFormation || "Inconnue";

        const existingDiploma = await prisma.diplomeEcole.findFirst({
          where: {
 etudiantEcoleId: idEtudiant,
            diplomaTitle: titreDiplome,
            diplomaType: typeDiplome,
            specialite:specialite
          }
        });
     
        console.log("🎓 ESSAIE 3 ");
                console.log("Les infos reçues sont de le bd sont :");
console.log(`Nom : ${infosEtudiant.nom.toLowerCase()}`);
console.log(`Prénom :${infosEtudiant.prenom.toLowerCase()}`);
console.log(`Date de naissance : ${infosEtudiant.dateNaissance.toISOString().split("T")[0]}`);
console.log(`Lieu de naissance : ${infosEtudiant.lieuNaissance.toLowerCase()}`);
console.log(`Titre du diplôme : ${titreDiplome.toLowerCase()}`);
console.log(`Spécialité : ${specialite.toLowerCase()}`);
 

    
     
        if (existingDiploma) {
          console.warn(`📛 Diplôme déjà existant pour l'étudiant ${idEtudiant} avec ce titre/type/spécialité.`);
          continue;
        }
       
        console.log("🎓 ESSAIE 4 ");
   
           
        const  diplomaHash = `$${titreDiplome.toLowerCase()}|${infosEtudiant.lieuNaissance.toLowerCase()}|${infosEtudiant.nom.toLowerCase()}${infosEtudiant.prenom.toLowerCase()}|${infosEtudiant.dateNaissance.toISOString().split("T")[0]}|${specialite.toLowerCase()}`;
        const hash = crypto.createHash('sha256').update(diplomaHash).digest('hex');
    
        // Préparer les données pour la blockchain
      const txData = gestionDiplomeInstance.methods.createDiploma(
       hash,
       ecole.nomEcole,
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
        from: ecole.walletAddress,
        to: gestionDiplomeInstance.options.address,
        data: txData,
        gas: 3000000,
        gasPrice: '0',
      };
     
      console.log("🎓 ESSAIE 6 ");
  
     
      const signed = await web3.eth.accounts.signTransaction(tx, privateKey);
      await web3.eth.sendSignedTransaction(signed.rawTransaction);
      
      console.log("🎓 ESSAIE 7 ");
  
        const newDiplome = await prisma.diplomeEcole.create({
          data: {
            diplomaHash: hash,
            etablissement: EcoleName, 
            studentName: `${infosEtudiant.nom} ${infosEtudiant.prenom}`,
            birthDate: infosEtudiant.dateNaissance,
            diplomaTitle: titreDiplome,
            diplomaType: typeDiplome,
            dateOfIssue: new Date(),
            specialite: specialite,
            complete: false,
            etudiantEcoleId : idEtudiant 
                 }
        });
   
        if (ecole.role === "ECOLE_SUPERIEURE") {
  const ministereAccount = await prisma.account.findFirst({
  where: {
    role: "MINISTERE",
    ministere: {
     typeMinistere: "ENSEIGNEMENT_SUPERIEUR",
    },
  },
});

        if (ministereAccount) {
  await prisma.notification.create({
    data: {
      title: "Nouveau diplôme à valider",
      message: `Nouveau diplôme de  ${EcoleName} à valider.`,
      type: "NOUVELLE_DEMANDE",
      receiverId: ministereAccount.id,
    }
  });
}
} else if (ecole.role === "ECOLE_FORMATION") {
 const ministereAccount = await prisma.account.findFirst({
  where: {
    role: "MINISTERE",
    ministere: {
     typeMinistere: "FORMATION_PROFESSIONNELLE",
    },
  },
});

        if (ministereAccount) {
  await prisma.notification.create({
    data: {
      title: "Nouveau diplôme à valider",
      message: `Nouveau diplôme de ${EcoleName} à valider.`,
      type: "NOUVELLE_DEMANDE",
      receiverId: ministereAccount.id,
    }
  });
}
}
  

        diplomesCrees.push(newDiplome);


  
      } catch (err) {
        console.error(`💥 Erreur pour l'étudiant ${idEtudiant} :`, err);
      }
    }


    console.log("🎓 ESSAIE 8 ");
  
    return diplomesCrees;
  }, 
  

};

