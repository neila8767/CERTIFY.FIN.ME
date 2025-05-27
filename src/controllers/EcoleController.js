import fs from 'fs';
import path from 'path';
import csv from 'fast-csv';
import { fileURLToPath } from 'url';
import { prisma } from '../prismaClient.js';
import Ecole from '../models/Ecole.js';
import Formation from '../models/Formation.js';
import ModeleDiplomeModel from '../models/ModeleDiplome.js';


export default {
  async verifierModeleDiplomeECOLE(req, res) {
    const { id } = req.params;
    console.log("Requête reçue pour vérifier le modèle avec l'id :", id);
  
    try {
      const hasModele = await Ecole.hasModele(id);
      console.log("Résultat de University.hasModele :", hasModele);
  
      res.status(200).json({ hasModele });
    } catch (error) {
      console.error("Erreur lors de la vérification du modèle :", error);
      res.status(500).json({ 
        error: 'Erreur lors de la vérification du modèle',
        details: error.message 
      });
    }
  },
  async getEcoles(req, res) {
    try {
      const ecoles = await Ecole.getAll();
      res.json(ecoles);  // Réponse avec les écoles récupérées
    } catch (error) {
      res.status(500).json({ error: error.message });  // Gestion des erreurs
    }
  },
  
  async getAllEcolesWithAccount(req, res) {
    try {
      const ecoles = await Ecole.getEcolesWithAccount();
      res.status(200).json(ecoles);
    } catch (error) {
      console.error("Erreur dans le contrôleur :", error);
      res.status(500).json({ error: "Erreur lors de la récupération des écoles." });
    }
  },
  
  async getEcoleById(req, res) {
    const { ecoleId } = req.params;

    try {
      const ecole = await Ecole.findEcoleById(ecoleId);

      if (!ecole) {
        return res.status(404).json({ error: 'École non trouvée' });
      }

      res.status(200).json(ecole);
    } catch (error) {
      console.error('Erreur lors de la récupération de l’école :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },
  async getEcolesByRole(req, res) {
  const { role } = req.query;

  try {
    const ecoles = await Ecole.getEcolesByRole(role);
    res.status(200).json(ecoles);
  } catch (error) {
    console.error("Erreur dans le contrôleur :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des écoles." });
  }
}
, 
 async getEcolesAccountByRole(req, res) {
  const { role } = req.query;

  try {
    const ecoles = await Ecole.getEcolesWithAccountByRole(role);
    res.status(200).json(ecoles);
  } catch (error) {
    console.error("Erreur dans le contrôleur :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des écoles." });
  }
}, 

async getModelesDiplomesECOLE(req, res) {
    try {
      console.log ("ESSSSSSSSSSSSSSSSSSSSSSSSSSS")
      const modeles = await  ModeleDiplomeModel.getAllECOLE()
      console.log("MODELES", modeles);
      res.status(200).json(modeles)
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération des modèles', details: err.message })
    }
  },

  async choisirModeleECOLE(req, res) {
    const { id } = req.params
    console.log("id ecole dans modele", id)
    const { modeleId } = req.body
     console.log("id ecole dans modele", id)

    if (!modeleId) {
      return res.status(400).json({ error: 'modeleId requis' })
    }

    try {
      const updated = await Ecole.setModeleDiplome(id, modeleId)
      res.status(200).json(updated)
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour', details: err.message })
    }
  }  

};
