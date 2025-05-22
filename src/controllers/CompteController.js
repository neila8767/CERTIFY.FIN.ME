import Compte from '../models/Compte.js';  // Importation du modèle avec syntaxe ES6

export default {
    async  updateMinistereController(req, res) {
 const accountId = req.user?.accountId;
 // Assume you use a middleware to inject user from JWT/session
  const { username, email, numeroTelephone } = req.body;

  if (!accountId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await Compte.updateMinistereProfile(accountId, {
      username,
      email,
      numeroTelephone,
    });

    return res.status(200).json({ message: 'Profile updated successfully', data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
}, 
// Contrôleur pour obtenir le profil du ministère
async getMinistereController(req, res) {
 const accountId = req.user?.accountId;

  if (!accountId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const profile = await Compte.getMinistereProfile(accountId);

    if (!profile || !profile.ministere) {
      return res.status(404).json({ error: 'Ministere profile not found' });
    }

    return res.status(200).json({
      username: profile.username,
      email: profile.email,
      telephone: profile.ministere.numeroTelephone,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil du ministère:', error);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
}
, 
async  changePasswordController(req, res) {
 const accountId = req.user?.accountId;
 const { currentPassword, newPassword } = req.body;

  if (!accountId) {
    return res.status(401).json({ 
      success: false,
      error: "Non autorisé" 
    });
  }

  try {
    await Compte.changePassword(accountId, currentPassword, newPassword);

    return res.status(200).json({
      success: true,
      message: "Mot de passe mis à jour avec succès"
    });

  } catch (error) {
    console.error("Erreur changement mot de passe:", error);

    const isAuthError = error.message === "Mot de passe actuel incorrect" || error.message === "Compte non trouvé";

    return res.status(isAuthError ? 401 : 500).json({
      success: false,
      error: error.message
    });
  }
}, 

 async  updateUniController(req, res) {
 const accountId = req.user?.accountId;
 // Assume you use a middleware to inject user from JWT/session
  const { username, email , adresseUni, nomUni, telephoneUni} = req.body;
   
  if (!accountId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await Compte.updateUniProfile(accountId, {
      username, email , 
     adresseUni, nomUni, telephoneUni
    });

    return res.status(200).json({ message: 'Profile updated successfully', data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
}, 
// Contrôleur pour obtenir le profil du ministère
async getUniController(req, res) {
 const accountId = req.user?.accountId;

  if (!accountId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const profile = await Compte.getUniProfile(accountId);

    if (!profile || !profile.university) {
      return res.status(404).json({ error: 'Uni profile not found' });
    }

    return res.status(200).json({
      username: profile.username,
      email: profile.email,
         telephone : profile.university.telephoneUni
      ,  nom:profile.university.nomUni,
      
      adresse: profile.university.adresseUni,
       });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil du ministère:', error);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

}
