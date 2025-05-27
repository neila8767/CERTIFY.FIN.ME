import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "../../../components/HeaderEcole.jsx";
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
  success: '#16A34A',       // Vert succès – confirmation d'action réussie
  error: '#DC2626',         // Rouge erreur – sérieux sans être agressif
  warning: '#F59E0B'        // Jaune doux – signal d'attention maîtrisé
};

const IntegrationEcole = () => {
  const router = useRouter();
  const [ecoleId, setEcoleId] = useState('');
  const [uploadingFormations, setUploadingFormations] = useState(false);
  const [resultFormations, setResultFormations] = useState(null);
  const [showExample, setShowExample] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
   const { token } = router.query;

  useEffect(() => {
    const id = localStorage.getItem('ecole_id');
    if (id) setEcoleId(id);
  }, []);

  const handleFormationsSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file) {
      alert('Veuillez sélectionner un fichier CSV');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier est trop volumineux (max 5 Mo).');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('ecoleId', ecoleId);
    setUploadingFormations(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/formations/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResultFormations(response.data);
    } catch (error) {
      console.error('Erreur upload:', error);
      setResultFormations({
        status: 'error',
        message: error.response?.data?.message || 'Erreur lors de l\'import'
      });
    } finally {
      setUploadingFormations(false);
    }
  };

  const handleGoBack = () => {
    const token = localStorage.getItem('ecole_token');
    if (token) {
      router.push(`/ecole/${token}`);
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
          margin: '2rem auto',
          padding: '3rem',
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
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 style={{ 
              fontSize: '1.75rem',
              fontWeight: '500',
              margin: 0,
              color: colors.textDark
            }}>
              Intégration des formations
            </h1>
            <p style={{ 
              fontSize: '0.9rem',
              color: colors.textLight,
              margin: 0
            }}>
              Importation des formations de votre école
            </p>
          </div>
        </div>

        {/* Section d'import des formations */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ 
              fontSize: '1.1rem',
              fontWeight: '600',
              margin: 0,
              color: colors.textDark,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.primary}>
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Importation des formations
            </h2>
            
            <button 
              type="button"
              onClick={() => setShowExample(!showExample)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: colors.primary,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.25rem 0.5rem'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 13a2 2 0 100-4 2 2 0 000 4z" strokeWidth="2"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeWidth="2"/>
              </svg>
              {showExample ? 'Masquer l\'exemple' : 'Voir l\'exemple'}
            </button>
          </div>

          {showExample && (
            <div style={{
              backgroundColor: 'white',
              border: `1px solid ${colors.border}`,
              borderRadius: '6px',
              padding: '1rem',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              overflowX: 'auto'
            }}>
              <div style={{ 
                display: 'inline-block',
                minWidth: '100%',
                fontFamily: 'monospace',
                whiteSpace: 'pre'
              }}>
                <span style={{ color: colors.primary, fontWeight: '500' }}>nomFormation,typeFormation,duree</span>{'\n'}
                BTS Informatique,Technique,2 ans{'\n'}
                Licence Mathématiques,Académique,3 ans{'\n'}
                Master Physique,Académique,2 ans{'\n'}
                CAP Cuisine,Professionnel,2 ans{'\n'}
                Bac Pro Électricité,Professionnel,3 ans
              </div>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: colors.textLight }}>
                Votre fichier CSV doit contenir les colonnes "nomFormation", "typeFormation" et optionnellement "duree".
              </p>
            </div>
          )}

          <form onSubmit={handleFormationsSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: colors.textDark
              }}>
                Fichier CSV des formations
              </label>
              <input
                type="file"
                name="file"
                accept=".csv"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  marginBottom: '0.5rem'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.boxShadow = `0 0 0 2px ${colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
              <p style={{ margin: '0', fontSize: '0.8rem', color: colors.textLight }}>
                Seuls les fichiers CSV (UTF-8) sont acceptés (max 5 Mo)
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={uploadingFormations}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "white",
                color: colors.accent,
                border: `1px solid ${colors.accent}`,
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              {uploadingFormations ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  En cours...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Importer les formations
                </>
              )}
            </motion.button>
          </form>

          {resultFormations && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: `1px solid ${resultFormations.status === 'error' ? colors.error : colors.success}`,
                marginTop: '1rem',
                color: resultFormations.status === 'error' ? colors.error : colors.textDark
              }}
            >
              <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
                {resultFormations.status === 'error' ? '❌ ' : '✅ '}
                {resultFormations.message}
              </p>
              {resultFormations.count && (
                <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
                  <strong>Formations importées:</strong> {resultFormations.count}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Bouton de retour */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoBack}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'white',
            color: colors.textDark,
            border: `1px solid ${colors.border}`,
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            width: '100%',
            justifyContent: 'center'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Retour
        </motion.button>
      </motion.div>
    </div>
  );
};

export default IntegrationEcole;