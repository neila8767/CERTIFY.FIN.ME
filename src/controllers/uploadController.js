// ───── Importations ─────────────────────────────────────────────────────────────
import sharp from 'sharp';
import { createWorker, PSM } from 'tesseract.js';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

// ───── Constantes ───────────────────────────────────────────────────────────────
const TRANSLATE_API_URL = 'http://127.0.0.1:8000/translate';
const OCR_TIMEOUT = 30000;         // Timeout pour l'OCR (30 sec)
const PREPROCESS_TIMEOUT = 5000;   // Timeout pour le prétraitement (5 sec)

// ───── Utilitaires ──────────────────────────────────────────────────────────────
const getTempPath = (filename) => path.join(process.cwd(), 'temp', filename);

// ───── Prétraitement de l'image ─────────────────────────────────────────────────
async function preprocessImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .grayscale()
      .normalize()
      .linear(1.1, -10)
      .sharpen()
      .threshold(150)
      .resize(1200, null, { withoutEnlargement: true })
      .toFile(outputPath);
    return outputPath;
  } catch (error) {
    console.error('Erreur prétraitement image:', error);
    throw error;
  }
}

// ───── Traduction du texte ──────────────────────────────────────────────────────
async function translateTextRemote(text) {
  if (!text || text.trim().length === 0) return text;

  try {
    const response = await axios.post(TRANSLATE_API_URL, { text }, {
      timeout: 3000
    });
    return response.data?.translation || text;
  } catch (error) {
    console.error('Erreur traduction:', error.message);
    return text;
  }
}

// ───── Extraction des champs à partir du texte ──────────────────────────────────
function extractFieldsFromText(text) {
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const fields = {};
  const patterns = {
    titre: /^(?:titre|dipl[oô]me|certificat)\s*[:.]?\s*(.*)/i,
    nom: /^(?:nom\s*(?:de\s*famille)?)\s*[:.]?\s*(.*)/i,
    prenom: /^(?:pr[ée]nom)\s*[:.]?\s*(.*)/i,
    date_naissance: /^(?:date\s*(?:de\s*)?naissance|n[ée]\s*le)\s*[:.]?\s*(.*)/i,
    lieu_naissance: /^(?:lieu\s*(?:de\s*)?naissance|n[ée]\s*[àa])\s*[:.]?\s*(.*)/i,
  };

  lines.forEach(line => {
    Object.entries(patterns).forEach(([key, regex]) => {
      const match = line.match(regex);
      if (match && match[1]) {
        fields[key] = match[1].trim();
      }
    });
  });

  return fields;
}

// ───── Fonction principale : extraction + traduction ─────────────────────────────
export async function extractAndTranslate(imagePath) {
  const preprocessedPath = getTempPath('preprocessed.png');
  let worker;

  try {
    // Étape 1 : Prétraitement de l'image avec timeout
    await Promise.race([
      preprocessImage(imagePath, preprocessedPath),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout prétraitement')), PREPROCESS_TIMEOUT)
      )
    ]);

    // Étape 2 : Initialisation du worker Tesseract
    worker = await createWorker({
      logger: m => console.log(`OCR: ${m.status} ${m.progress * 100}%`),
      cachePath: getTempPath('tesseract-cache'),
      workerPath: path.join(process.cwd(), 'node_modules', 'tesseract.js', 'dist', 'worker.min.js'),
    });

    // Étape 3 : Configuration OCR
    await worker.loadLanguage('fra+eng+ara');
    await worker.initialize('fra+eng+ara');
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.AUTO_OSD,
      tessedit_ocr_engine_mode: '1',
      preserve_interword_spaces: '1',
      tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZéèêàçïîôùÂÊÎÔÛÄËÏÖÜÀÆæÇÉÈŒœÙñ.-/\\ ',
    });

    // Étape 4 : Reconnaissance OCR avec timeout
    const { data: { text } } = await Promise.race([
      worker.recognize(preprocessedPath),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout OCR')), OCR_TIMEOUT)
      )
    ]);

    console.log('Texte extrait:', text);

    // Étape 5 : Extraction des champs
    const extractedFields = extractFieldsFromText(text);

    // Étape 6 : Traduction des champs
    const translatedFields = {};
    for (const [key, value] of Object.entries(extractedFields)) {
      translatedFields[key] = await translateTextRemote(value);
    }

    return translatedFields;

  } catch (error) {
    console.error('Erreur traitement:', error);
    throw error;
  } finally {
    // Nettoyage
    if (worker) {
      await worker.terminate().catch(e => console.error('Erreur termination worker:', e));
    }
    try {
      await fs.unlink(preprocessedPath);
    } catch (e) {
      console.error('Erreur suppression fichier temporaire:', e);
    }
  }
}
