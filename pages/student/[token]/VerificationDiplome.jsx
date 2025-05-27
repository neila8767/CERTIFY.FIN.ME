import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaCheckCircle, FaTimesCircle, FaSpinner, FaCopy } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/router';
import Header from "../../../components/HeaderStudent.jsx"
import DiplomaDisplay from '../../../components/DiplomaDisplay.jsx';
import { 
  FaLink , FaSearch } from 'react-icons/fa';


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

const VerificationDiplome = () => {
  const router = useRouter();
  const [verificationUrl, setVerificationUrl] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = router.query;
   

  const handleVerifyDiploma = async () => {
  setLoading(true);
  setError(null);
  setVerificationResult(null);

  try {
    const hash = verificationUrl.split('/verifier-diplome/').pop().split('/')[0].split('?')[0];

    if (!hash) throw new Error("Le format de l'URL est invalide");

    const response = await axios.get(`http://localhost:5000/verifier-diplome/${hash}`);

    setVerificationResult({
      success: true,
      data: response.data,
    });

     console.log("DiplomaOnChain reçu:", response.data.diplomaOnChain);
 
  } catch (err) {
    console.error('Erreur vérification:', err);
    setError(err.response?.data?.message || "Le diplôme n'a pas été trouvé ou le lien est invalide");
  } finally {
    setLoading(false);
  }
};

  const handleCopyExample = () => {
    navigator.clipboard.writeText('https://certifyme.com/verifier-diplome/eb5e065768f5cc...');
    alert('Exemple copié dans le presse-papiers');
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
        maxWidth: '1000px',
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
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
          <FaShieldAlt size="24" color={colors.primary} />
        </div>
        <div>
          <h1 style={{ 
            fontSize: '1.75rem',
            fontWeight: '500',
            margin: 0,
            color: colors.textDark
          }}>
            Vérification de diplôme
          </h1>
          <p style={{ 
            fontSize: '0.9rem',
            color: colors.textLight,
            margin: 0
          }}>
            Valider l'authenticité d'un diplôme
          </p>
        </div>
      </div>

      {/* Champ de saisie */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.75rem',
          fontSize: '0.95rem',
          fontWeight: '500',
          color: colors.textDark,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <FaLink size="16" color={colors.textLight} />
          Lien de vérification
        </label>
        
        <input
          type="text"
          value={verificationUrl}
          onChange={(e) => setVerificationUrl(e.target.value)}
          placeholder="https://certifyme.com/verifier-diplome/abc123..."
          style={{
            width: '100%',
            padding: '0.9rem 1rem',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            fontSize: '0.95rem',
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = colors.primary;
            e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = colors.border;
            e.target.style.boxShadow = 'none';
          }}
        />
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginTop: '0.5rem'
        }}>
          <p style={{ 
            fontSize: '0.85rem',
            color: colors.textLight,
            margin: 0,
            fontStyle: 'italic'
          }}>
            Ex: https://certifyme.com/verifier-diplome/eb5e065768f5cc...
          </p>
          
          <button 
            onClick={handleCopyExample}
            style={{
              background: 'none',
              border: 'none',
              color: colors.primary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.85rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px'
            }}
          >
            <FaCopy size="14" />
            Copier l'exemple
          </button>
        </div>
      </div>

      {/* Bouton de vérification */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleVerifyDiploma}
        disabled={loading || !verificationUrl}
       style={{
  width: '90%',
  padding: '1rem',
  backgroundColor: loading || !verificationUrl ? colors.border : colors.primary,
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: loading || !verificationUrl ? 'not-allowed' : 'pointer',
  fontWeight: '600',
  fontSize: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.75rem',
  margin: '0 auto 2rem auto'  // ← Centré horizontalement
}}

      >
        {loading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <FaSpinner size="18" />
            </motion.span>
            Vérification en cours...
          </>
        ) : (
          <>
            <FaSearch size="16" />
            Vérifier le diplôme
          </>
        )}
      </motion.button>

      {/* Message d'erreur */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            color: colors.error,
            padding: '1rem',
            backgroundColor: `${colors.error}10`,
            borderRadius: '8px',
            border: `1px solid ${colors.error}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '2rem'
          }}
        >
          <FaTimesCircle size="20" />
          <div>
            <p style={{ margin: 0, fontWeight: '500' }}>Erreur de vérification</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>{error}</p>
          </div>
        </motion.div>
      )}

      {/* Résultat */}
      {verificationResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <DiplomaDisplay verificationResult={verificationResult} />
        </motion.div>
      )}
    </motion.div>
  </div>
);
};

export default VerificationDiplome;