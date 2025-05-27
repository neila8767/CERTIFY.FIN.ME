import EcoleAnnee from '../models/ecoleAnnee.js';
import { prisma } from "../prismaClient.js"; 

export default {
   async addAnneeEcole(req, res) {
        try {
          const accountId = req.user?.accountId;
          console.log("ID ACCOUNT", accountId );
         
  const ecole = await prisma.ecole.findUnique({
  where: { accountId: accountId },
  select: { idEcole: true } 
});

         console.log("ID ECOLE", ecole.idEcole );

          const { annee } = req.body;
          const result = await EcoleAnnee.addAnnee(annee , ecole.idEcole );
      
          if (result.alreadyExists) {
            return res.status(200).json({ message: "Année déjà existante", data: result.data });
          }
      
          res.status(201).json({ message: "Nouvelle année ajoutée avec succès", data: result.data });
        } catch (error) {
          console.error("Erreur dans addAnnee :", error);  // 👈 log pour voir l'erreur exacte
          const status = error.status || 500;
          const message = error.message || "Erreur serveur";
          res.status(status).json({ error: message });
        }
      },
  async create(req, res) {
    try {
      const { annee, ecoleId } = req.body;
      const result = await EcoleAnnee.addAnnee(annee, parseInt(ecoleId));

      if (result.alreadyExists) {
        return res.status(200).json({ 
          message: "Année déjà existante pour cette école", 
          data: result.data 
        });
      }

      res.status(201).json({ 
        message: "Nouvelle année scolaire ajoutée", 
        data: result.data 
      });
    } catch (error) {
      console.error("Erreur création année école:", error);
      const status = error.status || 500;
      res.status(status).json({ error: error.message });
    }
  },

  async getByEcole(req, res) {
    try {
      const annees = await EcoleAnnee.getAnneesByEcole(parseInt(req.params.ecoleId));
      res.json(annees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async setCurrent(req, res) {
    try {
      const annee = await EcoleAnnee.setCurrentAnnee(
        parseInt(req.params.id),
        parseInt(req.body.ecoleId)
      );
      res.json({ message: "Année courante mise à jour", data: annee });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      await EcoleAnnee.deleteAnnee(parseInt(req.params.id));
      res.json({ message: "Année scolaire supprimée" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};