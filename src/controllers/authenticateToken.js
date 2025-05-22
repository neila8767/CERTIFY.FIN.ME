import jwt from 'jsonwebtoken';


export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log("Authorization Header:", authHeader);
  console.log("Token extrait:", token);
  console.log("Secret utilisé pour vérification:", process.env.JWT_SECRET);

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Erreur de vérification JWT:", err.message);
      return res.status(403).json({ message: 'Token invalide' });
    }

    console.log("Token validé avec succès. Utilisateur :", user);
    req.user = user;
    next();
  });
};
