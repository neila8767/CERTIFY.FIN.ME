// DocumentProcessor.js
import React, { useState } from 'react';
import DiplomaDisplay from '../../../components/DiplomaDisplay.jsx';
import Header from '../../../components/HeaderStudent.jsx';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

 const colors = {
   primary: '#1E3A8A',       // Bleu roi – confiance, autorité, prestige
   secondary: '#2D3748',     // Gris foncé – modernité, sobriété
   accent: '#1E3A8A',        // Bleu clair – boutons, interactions (hover/CTA)
   lightBg: '#F9FAFB',       // Fond clair – propre, neutre
   darkBg: '#1A202C',        // Fond sombre – header, footer, élégance
   textDark: '#111827',      // Texte principal – lisible, sérieux
   textLight: '#6B7280',     // Texte secondaire – descriptions, placeholders
   border: '#E5E7EB',        // Bordures discrètes – pour structurer sans surcharger
   success: '#16A34A',       // Vert succès – confirmation d’action réussie
   error: '#DC2626',         // Rouge erreur – sérieux sans être agressif
   warning: '#F59E0B'        // Jaune doux – signal d’attention maîtrisé
 };



function DocumentProcessor() {
  const router = useRouter();
  const { token } = router.query;
  
  const [verificationResult, setVerificationResult] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Étape 1 : Extraction OCR + traduction + parsing
      const response = await fetch('http://localhost:5001/api/process-document', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue lors du traitement du document');
        return;
      }

      setResult(data);
      const { diplome, lieu_naissance, nom, prenom, date_naissance, speciality } = data.translated_info;

      // Étape 2 : Génération du hash
      const hashRes = await fetch('http://localhost:5000/generate-hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titreDiplome: diplome,
          lieuNaissance: lieu_naissance,
          nom,
          prenom,
          dateNaissance: date_naissance,
          specialite: speciality
        })
      });

      const hashData = await hashRes.json();

      if (!hashRes.ok) {
        setError(hashData.error || 'Erreur lors de la génération du hash');
        return;
      }

      const { hash } = hashData;

      // Étape 3 : Vérification du diplôme
      const verifRes = await fetch(`http://localhost:5000/verifier-diplome/${hash}`);
      const verifData = await verifRes.json();

      setVerificationResult({
        success: verifRes.ok,
        data: verifData,
      });

    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      flex: 1,
      padding: '3rem',
      paddingTop: '0.25rem',
      marginTop: '3.5rem',
      backgroundColor: '#FFFF',
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      <Header token={token} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: '900px',
          marginTop: '5rem',
          margin: '2rem auto',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: `1px solid ${colors.border}`
        }}
      >
        {/* Titre avec icône */}
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: `1px solid ${colors.border}`
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${colors.lightBg}, ${colors.border})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.primary}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 style={{ 
              fontSize: '1.75rem',
              fontWeight: '500',
              margin: 0,
              color: colors.textDark
            }}>
              Traitement de documents
            </h1>
            <p style={{ 
              fontSize: '0.9rem',
              color: colors.textLight,
              margin: 0
            }}>
              Extraction et vérification de diplômes
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section d'upload */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              marginBottom: '2rem',
              padding: '1.5rem',
              backgroundColor: colors.lightBg,
              borderRadius: '8px',
              border: `1px solid ${colors.border}`
            }}
          >
            <h2 style={{ 
              fontSize: '1.1rem',
              fontWeight: '600',
              margin: '0 0 1rem 0',
              color: colors.textDark,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.primary}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Téléversement du document
            </h2>

            {/* Upload de fichier */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: colors.textDark
              }}>
                Document du diplôme (PDF ou image)
              </label>
              <div style={{
                border: `1px dashed ${colors.border}`,
                borderRadius: '6px',
                padding: '1.5rem',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                backgroundColor: file ? `${colors.lightBg}80` : 'white'
              }}>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  required
                  style={{ display: 'none' }}
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.textLight} style={{ marginBottom: '0.5rem' }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div style={{ 
                    fontSize: '0.875rem',
                    color: colors.textLight
                  }}>
                    {file ? (
                      <span style={{ color: colors.primary, fontWeight: '500' }}>
                        {file.name}
                      </span>
                    ) : (
                      <>
                        <span style={{ textDecoration: 'underline', color: colors.accent }}>Choisir un fichier</span> 
                        <span> ou glisser-déposer ici</span>
                      </>
                    )}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem',
                    color: colors.textLight,
                    marginTop: '0.25rem'
                  }}>
                    Formats acceptés: PDF, JPG, JPEG, PNG (max 5MB)
                  </div>
                </label>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!file || loading}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: colors.primary,
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                opacity: !file ? 0.6 : 1
              }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Traitement en cours...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Traiter le document
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Affichage des résultats */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                padding: '1rem',
                backgroundColor: '#FEF2F2',
                borderRadius: '6px',
                border: `1px solid ${colors.error}`,
                marginBottom: '1.5rem',
                color: colors.error
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 9v4M12 17h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p style={{ margin: 0 }}>{error}</p>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                padding: '1.5rem',
                backgroundColor: colors.lightBg,
                borderRadius: '8px',
                border: `1px solid ${colors.border}`,
                marginBottom: '2rem'
              }}
            >
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                margin: '0 0 1rem 0',
                color: colors.textDark,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.primary}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Résultats du traitement
              </h3>

              {verificationResult && (
                <DiplomaDisplay verificationResult={verificationResult} />
              )}
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
}

export default DocumentProcessor;