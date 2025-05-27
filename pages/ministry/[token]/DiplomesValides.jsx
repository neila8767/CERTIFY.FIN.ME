import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import HeaderMinistry from '../../../components/HeaderMinistry.jsx';

import { utils, writeFile } from 'xlsx/xlsx.mjs';

const exportToExcel = (diplomasData) => {
  const dataToExport = diplomasData.map(diploma => ({
    'Étudiant': diploma.studentName,
    'Naissance': new Date(diploma.birthDate).toLocaleDateString('fr-FR'),
    'Diplôme': diploma.diplomaType,
    'Spécialité': diploma.specialite,
    'Validation': new Date(diploma.dateOfIssue).toLocaleDateString('fr-FR')
  }));

  const ws = utils.json_to_sheet(dataToExport);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Diplômes');
  
  writeFile(wb, `Diplomes_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

import {
  FaBookmark, 
  FaFileExport, 
  FaUniversity,
  FaUserGraduate,
  FaCalendarAlt,
  FaBook,
  FaIdCard,
  FaCheckCircle,
  FaChevronLeft
} from 'react-icons/fa';

const DiplomeValidés = () => {

    // Dans DiplomesValidés.jsx
  const router = useRouter();
    const { universityId , token} = router.query;
  
 
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


  const [diplomas, setDiplomas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [universityInfo, setUniversityInfo] = useState(null);

  // Couleurs par type de diplôme
  const diplomaTypeColors = {
    'DIPLOME DE MASTER': colors.primary,
    'DIPLOME DE LICENCE': colors.secondary,
    'DIPLOME DE DOCTORAT': colors.accent,
    'DIPLOME D\'INGENIEUR': colors.lightBlue
  };

  const diplomaTypeIcons = {
    'DIPLOME DE MASTER': <FaBook />,
    'DIPLOME DE LICENCE': <FaUserGraduate />,
    'DIPLOME DE DOCTORAT': <FaUniversity />,
    'DIPLOME D\'INGENIEUR': <FaIdCard />
  };

  useEffect(() => {
    if (!universityId) return;

    const fetchData = async () => {
      try {
        // Récupérer les informations de l'université
        const uniResponse = await axios.get(`http://localhost:5000/universites/${universityId}`);
        setUniversityInfo(uniResponse.data);

        // Récupérer les diplômes validés
        const diplomasResponse = await axios.get(`http://localhost:5000/${universityId}/diplomes-valides`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDiplomas(diplomasResponse.data);
        console.log("voir data ", diplomasResponse.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [universityId, token]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: colors.lightBg
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: `5px solid ${colors.primary}`,
            borderTopColor: 'transparent'
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: colors.textDark,
        background: colors.lightBg,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h2 style={{ color: colors.accent }}>Erreur</h2>
        <p>{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          style={{
            marginTop: '1rem',
            padding: '0.8rem 1.5rem',
            background: colors.primary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Retour
        </motion.button>
      </div>
    );
  }

  return (
    <div style={{
      marginTop :'5rem',
        
      backgroundColor: colors.lightBg,
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      paddingBottom: '3rem'
    }}>
      <HeaderMinistry token={token}/>

      {/* Contenu principal */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
    
        {/* Barre d'actions */}
        <div style={{
           display: 'flex',
           justifyContent: 'space-between',
           padding: '1rem 0.3rem',
           margin: '1rem 0',
          }}>

          {/* Titre université */}
          {universityInfo && (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
           
             }}>
             {/* Bouton Retour - Version améliorée */}
       <motion.button
  whileHover={{
    backgroundColor: `${colors.primary}08`,
    y: -1
  }}
  whileTap={{ scale: 0.98 }}
  onClick={() => router.back()}
  style={{
    backgroundColor: 'transparent',
    color: colors.primary,
    border: `1px solid ${colors.primary}50`,
    borderRadius: '8px',
    padding: '0.5rem 0.6rem',
    fontSize: '0.82rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    transition: 'all 0.2s ease-in-out',
    boxShadow: 'none'
  }}
>
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}
  >
    <path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>

</motion.button>

      <div>
        <div style={{
          fontSize: '0.8rem',
          fontWeight: '500',
          color: colors.textLight,
          opacity: 0.85,
          marginBottom: '0.2rem'
        }}>
                  Diplômes validés pour
                </div>
                <h2 style={{
          fontSize: '1.35rem',
          fontWeight: '520',
          color: colors.textDark,
          margin: 0,
          letterSpacing: '-0.015em'
        }}>
                  {universityInfo.nomUni}
                </h2>
              </div>
            </div>  </div>
          )}

          {/* Bouton Retour */}
         
        </div>

       {/* Tableau des diplômes validés - Version Professionnelle */}
{diplomas.length === 0 ? (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    style={{
      textAlign: 'center',
      padding: '5rem 2rem',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.05)',
      border: `1px solid ${colors.border}`,
      maxWidth: '600px',
      margin: '0 auto'
    }}
  >
    <div style={{
      width: '100px',
      height: '100px',
      margin: '0 auto 1.8rem',
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${colors.lightBg}, ${colors.border})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 6px 20px ${colors.primary}08`
    }}>
      <FaUniversity size={36} color={colors.primary} />
    </div>
    <h3 style={{ 
      fontSize: '1.6rem',
      fontWeight: '600',
      color: colors.textDark,
      marginBottom: '0.75rem',
      letterSpacing: '-0.015em'
    }}>
      Aucun diplôme validé
    </h3>
    <p style={{ 
      color: colors.textLight,
      maxWidth: '400px',
      margin: '0 auto',
      lineHeight: '1.7',
      fontSize: '1rem',
      opacity: 0.9
    }}>
      Cette université n'a pas encore de diplômes validés dans le système.
    </p>
  </motion.div>
) : (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 15px 50px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      border: `1px solid ${colors.border}`
    }}
  >
    {/* En-tête du tableau - Version améliorée */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr 1fr 160px',
      padding: '1.2rem 2rem',
      backgroundColor: `${colors.lightBg}30`,
      borderBottom: `1px solid ${colors.border}`,
      fontWeight: '600',
      color: colors.textDark,
      fontSize: '0.9rem',
      letterSpacing: '0.01em',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{ paddingLeft: '1rem' }}>Étudiant</div>
      <div>Type de diplôme</div>
      <div>Spécialité</div>
      <div style={{ textAlign: 'right', paddingRight: '1rem' }}>Validation</div>
    </div>

    {/* Lignes du tableau - Design premium */}
    <AnimatePresence>
      {diplomas.map((diploma, index) => (
        <motion.div
          key={diploma.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.02, duration: 0.3 }}
          whileHover={{ 
            backgroundColor: `${colors.lightBg}15`,
            transform: 'translateY(-1px)'
          }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 160px',
            padding: '1.2rem 2rem',
            borderBottom: `1px solid ${colors.border}`,
            alignItems: 'center',
            transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          {/* Nom étudiant avec avatar */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            paddingLeft: '1rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${colors.lightBg}, ${colors.border})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              overflow: 'hidden'
            }}>
              {diploma.studentPhoto ? (
                <img 
                  src={diploma.studentPhoto} 
                  alt={diploma.studentName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <FaUserGraduate size={18} color={colors.primary} />
              )}
            </div>
            <div>
              <div style={{ 
                fontWeight: '500',
                color: colors.textDark,
                marginBottom: '0.15rem',
                fontSize: '0.95rem'
              }}>
                {diploma.studentName}
              </div>
              <div style={{ 
                fontSize: '0.8rem',
                color: colors.textLight,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FaIdCard size={10} />
                {diploma.studentId}
              </div>
            </div>
          </div>

          {/* Type de diplôme avec badge premium */}
          <div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                background: `${diplomaTypeColors[diploma.diplomaTitle]}08`,
                color: diplomaTypeColors[diploma.diplomaTitle],
                fontWeight: '500',
                fontSize: '0.85rem',
                border: `1px solid ${diplomaTypeColors[diploma.diplomaTitle]}15`,
                boxShadow: `0 2px 8px ${diplomaTypeColors[diploma.diplomaTitle]}05`,
                cursor: 'default'
              }}
            >
              {diplomaTypeIcons[diploma.diplomaTitle]}
              <span style={{ 
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '150px'
              }}>
                {diploma.diplomaTitle}
              </span>
            </motion.div>
          </div>

          {/* Spécialité avec icône */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FaBookmark size={12} color={colors.textLight} style={{ opacity: 0.7 }} />
            <span style={{
              fontWeight: '500',
              color: colors.textDark,
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {diploma.speciality}
            </span>
          </div>

          {/* Date de validation avec badge de succès */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.7rem',
            paddingRight: '1rem'
          }}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                background: `${colors.success}08`,
                color: colors.success,
                fontWeight: '500',
                fontSize: '0.85rem',
                border: `1px solid ${colors.success}20`,
                boxShadow: `0 2px 8px ${colors.success}05`,
                cursor: 'default'
              }}
            >
              <FaCheckCircle size={12} />
              <span>
                {new Date(diploma.validationDate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>

    {/* Pied de tableau avec statistiques */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.2rem 2rem',
      backgroundColor: `${colors.lightBg}30`,
      borderTop: `1px solid ${colors.border}`
    }}>
      <div style={{
        fontSize: '0.85rem',
        color: colors.textLight
      }}>
        {diplomas.length} diplôme{diplomas.length > 1 ? 's' : ''} validé{diplomas.length > 1 ? 's' : ''}
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <button
          onClick={() => exportToExcel(diplomas)}
          style={{
            backgroundColor: 'transparent',
            color: colors.primary,
            border: `1px solid ${colors.primary}30`,
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            fontSize: '0.85rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <FaFileExport size={14} />
          Exporter
        </button>
      </div>
    </div>
  </motion.div>
)}
      </div>
    </div>
  );
};

export default DiplomeValidés;