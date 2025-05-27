import University from '../models/University.js';  // Importation du modèle avec syntaxe ES6
import ModeleDiplomeModel from '../models/ModeleDiplome.js';

export default {
  async verifierModeleDiplome(req, res) {
  const { id } = req.params;
  console.log("Requête reçue pour vérifier le modèle avec l'id :", id);

  try {
    const hasModele = await University.hasModele(id);
    console.log("Résultat de University.hasModele :", hasModele);

    res.status(200).json({ hasModele });
  } catch (error) {
    console.error("Erreur lors de la vérification du modèle :", error);
    res.status(500).json({ 
      error: 'Erreur lors de la vérification du modèle',
      details: error.message 
    });
  }
}
,
  async getUniversities(req, res) {
    try {
      // Appel à la méthode getAll() du modèle pour obtenir les universités
      const universities = await University.getAll();
      res.json(universities);  // Réponse avec les universités récupérées
    } catch (error) {
      res.status(500).json({ error: error.message });  // Gestion des erreurs
    }
  }, 
 async getAllUniversitiesWithAccount  (req, res) {
    try {
      const universities = await University.getUniversitiesWithAccount();
      res.status(200).json(universities);
    } catch (error) {
      console.error("Erreur dans le contrôleur :", error);
      res.status(500).json({ error: "Erreur lors de la récupération des universités." });
    }
  }, 
  async getUniversityById  (req, res) {
    const { universityId } = req.params;
  
    try {
      const university = await University.findUniversityById(universityId);
  
      if (!university) {
        return res.status(404).json({ error: 'Université non trouvée' });
      }
  
      res.status(200).json(university);
    } catch (error) {
      console.error('Erreur lors de la récupération de l’université :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },
    async getModelesDiplomes(req, res) {
    try {
      const modeles = await  ModeleDiplomeModel.getAll()
      console.log("MODELES", modeles);
      res.status(200).json(modeles)
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération des modèles', details: err.message })
    }
  },

  async choisirModele(req, res) {
    const { id } = req.params
    const { modeleId } = req.body

    if (!modeleId) {
      return res.status(400).json({ error: 'modeleId requis' })
    }

    try {
      const updated = await University.setModeleDiplome(id, modeleId)
      res.status(200).json(updated)
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour', details: err.message })
    }
  }  
 
};

  