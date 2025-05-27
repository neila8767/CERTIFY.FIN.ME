import express from 'express';
import cors from 'cors';
import apiRoutes from './src/routes/api.js';
import './src/controllers/cleanupExpiredAccounts.js';
import { prisma } from "./src/prismaClient.js";
import errorHandler from './src/controllers/errorHandler.js'; // Mets Prisma dans un fichier séparé
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
const port = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lancer le nettoyage immédiatement au démarrage
setInterval(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Ping DB successful");
  } catch (err) {
    console.warn("Ping DB failed:", err.message);
  }
}, 5 * 60 * 1000); // toutes les 5 minutes

app.use(cors({
  origin: ['http://localhost:3000'], // Autorisez votre frontend
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// 🔧 PATCH AUTOMATIQUE PRISMA : reconnexion si planté
app.use(async (req, res, next) => {
  try {
    if (!prisma._isConnected) {
      await prisma.$connect();
      prisma._isConnected = true;
    }
    next();
  } catch (err) {
    console.error('❌ Connexion DB échouée, tentative de reconnexion...');
    try {
      await prisma.$disconnect();
      await prisma.$connect();
      prisma._isConnected = true;
      next();
    } catch (reconnectErr) {
      console.error('⚠️ Échec de reconnexion à la DB');
      return res.status(500).json({ error: "Impossible de se connecter à la base de données." });
    }
  }
});
app.use('/ModelesDiplome', express.static(path.join(__dirname, 'ModelesDiplome')));
// ✅ ROUTES API
app.use('/', apiRoutes);


// Middleware global de gestion des erreurs

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const errorMessage = err.message || "Erreur interne du serveur";

  if (process.env.NODE_ENV !== 'production') {
    console.error("Erreur backend :", err.message);
  }

  res.status(statusCode).json({ error: errorMessage });
});


app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
