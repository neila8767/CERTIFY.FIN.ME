  
import { motion } from 'framer-motion';
import { FaHistory, FaCopy } from 'react-icons/fa';
import Header from '../../../components/HeaderStudent.jsx'
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HistoryPage = () => {
    const router = useRouter();
    const {token} = router.query ; 
  
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [historyItems, setHistoryItems] = useState([]);
 
  // Fonction pour charger l'historique
  useEffect(() => {
    const fetchHistory = async () => {
      try {
            const response = await fetch(`http://localhost:5000/historique`, {
         headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
         console.log(data);
        setHistoryItems(data.historique);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [token]);

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
            <FaHistory size={24} color={colors.primary} />
          </div>
          <div>
            <h1 style={{ 
              fontSize: '1.75rem',
              fontWeight: '500',
              margin: 0,
              color: colors.textDark
            }}>
              Historique des vérifications
            </h1>
            <p style={{ 
              fontSize: '0.9rem',
              color: colors.textLight,
              margin: 0
            }}>
              Liste de tous les diplômes vérifiés
            </p>
          </div>
        </div>

        {/* Contenu de l'historique */}
        {isLoadingHistory ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: '24px',
                height: '24px',
                border: `3px solid ${colors.border}`,
                borderTopColor: colors.primary,
                borderRadius: '50%'
              }}
            />
          </div>
        ) : historyItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '2rem',
              textAlign: 'center',
              border: `1px dashed ${colors.border}`,
              borderRadius: '8px'
            }}
          >
            <p style={{ color: colors.textLight, marginBottom: '1rem' }}>
              Aucun diplôme vérifié récemment
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
                onClick={() =>router.push(`/student/${token}/VerificationDiplome`) }
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: colors.primary,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '500'
              }}
            >
              Effectuer une vérification
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {historyItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -2 }}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  ':hover': {
                    boxShadow: `0 2px 8px ${colors.primary}20`
                  }
                }}
                >
                <h4 style={{ margin: '0 0 0.3rem', color: colors.textDark }}>
                 DIPLOME {item.titreDiplome}
                </h4>
                <p style={{ 
                  margin: '0 0 0.3rem', 
                  fontSize: '0.85rem',
                  color: colors.textLight 
                }}>
                  {item.etablissement}
                </p>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginTop: '0.5rem'
                }}>
                  <span style={{
                    fontSize: '0.8rem',
                    color: colors.textLight
                  }}>
                    {new Date(item.dateDemande).toLocaleDateString()}
                  </span>

            
             <div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: '0.5rem',
  marginLeft: 'auto' // Ceci pousse tout le groupe vers la droite
}}>
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => router.push(`/student/${token}/VerificationDiplome`)}
    style={{
      padding: "0.5rem 1rem",
      backgroundColor: "white",
      color: colors.accent,
      border: `1px solid ${colors.accent}`,
      borderRadius: "6px",
      cursor: 'pointer',
      fontSize: '0.8rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
      minWidth: 'max-content'
    }}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.accent}>
      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    Verifiez
  </motion.button>

  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={(e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(item.lienVerification);
      // Ajouter une notification/toast ici
    }}
    style={{
      background: 'none',
      border: `1px solid ${colors.primary}`,
      color: colors.primary,
      cursor: 'pointer',
      fontSize: '0.8rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
      padding: '0.5rem 1rem',
      borderRadius: "6px",
      minWidth: 'max-content',
      ':hover': {
        backgroundColor: `${colors.primary}10`
      }
    }}
  >
    <FaCopy size={12} />
    Copier le lien
  </motion.button>
</div>
                </div>
                
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default HistoryPage ; 