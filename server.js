import express from 'express';
import cors from 'cors';
import apiRoutes from './src/routes/api.js';
import './src/controllers/cleanupExpiredAccounts.js';
import { prisma } from "./src/prismaClient.js"; // Mets Prisma dans un fichier séparé

const app = express();
const port = 5000;

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

// ✅ ROUTES API
app.use('/', apiRoutes);

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
