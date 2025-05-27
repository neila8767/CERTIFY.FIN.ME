import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from '../../../components/HeaderUniversity';
import { FiAward, FiClock ,  FiCheckCircle,   FiLoader, FiBook, FiRefreshCw,  FiSearch , FiArrowLeft,  FiPlus, FiTrash2 , FiChevronDown, FiLayers, FiHome, FiUsers,  FaSignOutAlt, FiX, FiEyeOff, FiUser, FiLock, FiCamera, FiCreditCard, FiImage, FiKey, FiEye,   FiBell, FiShield, FiLink, FiUpload , FiDollarSign , FiLogOut , FiInfo , FiEdit2, FiSave} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const  ListeDiplomeUni = () =>  {
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
  const router = useRouter();
  const { token } = router.query;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  // États
   const [showDiplomeForm, setShowDiplomeForm] = useState(false);
 
const [currentDiplome, setcurrentDiplome] = useState(false);
    const [loading, setLoading] = useState(true);
  const [diplomes, setDiplomes] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filters, setFilters] = useState({
    statut: 'TOUS', // 'TOUS', 'VALIDES', 'EN_ATTENTE'
    annee: ''
  });

  // Récupérer l'ID de l'université
  const universityId = typeof window !== 'undefined' ? localStorage.getItem('university_id') : null;

  // Charger les diplômes
  useEffect(() => {
    const chargerDiplomes = async () => {
  try {
    setLoading(true);
    setError(null);
    
    if (!universityId) {
      throw new Error("ID de l'université non trouvé");
    }

    // Toujours utiliser le même endpoint
    const response = await axios.get(`${API_BASE_URL}/universites/${universityId}/diplomes`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { annee: filters.annee || undefined }
    });

    // Filtrer côté client en fonction du statut
    let filteredDiplomes = response.data || [];
    
    if (filters.statut === 'VALIDES') {
      filteredDiplomes = filteredDiplomes.filter(d => d.complete);
    } else if (filters.statut === 'EN_ATTENTE') {
      filteredDiplomes = filteredDiplomes.filter(d => !d.complete);
    }

    setDiplomes(filteredDiplomes);
  } catch (err) {
    setError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};

    if (universityId && token) {
      chargerDiplomes();
    }
  }, [universityId, token, filters.statut, filters.annee]);

  // Supprimer un diplôme
  const supprimerDiplome = async (diplomeId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce diplôme ? Cette action est irréversible.")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.delete(`${API_BASE_URL}/universites/${universityId}/diplomes/${diplomeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSuccessMessage("Diplôme supprimé avec succès");
        // Recharger la liste
        setDiplomes(prev => prev.filter(d => d.id !== diplomeId));
      } else {
        throw new Error(response.data.message || "Erreur lors de la suppression");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  // Formater la date
  const formaterDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };



  return (
<div style={{ 
  flex: 1,
  padding: '3rem',
  paddingTop: '2rem',
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
    padding : '1rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
      border: `1px solid ${colors.border}`
    }}
  >
    {/* En-tête avec titre et bouton */}
    <div style={{
      padding: '1.5rem',
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
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
          <FiAward size={24} color={colors.primary} />
        </div>
        <div>
          <h2 style={{ 
            fontSize: '1.75rem',
            fontWeight: '500',
            margin: 0,
            color: colors.textDark
          }}>
            Gestion des diplômes
          </h2>
          <p style={{ 
            fontSize: '0.9rem',
            color: colors.textLight,
            margin: 0
          }}>
            Liste complète des diplômes délivrés
          </p>
        </div>
      </div>
      
    
    </div>

    {/* Filtres et recherche */}
    <div style={{
      padding: '1.5rem',
      borderBottom: `1px solid ${colors.border}`,
      backgroundColor: colors.lightBg,
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: colors.textDark
        }}>
          Statut
        </label>
        <select
          value={filters.statut}
          onChange={(e) => setFilters({...filters, statut: e.target.value})}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'all 0.2s ease',
            backgroundColor: 'white'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = colors.primary;
            e.target.style.boxShadow = `0 0 0 2px ${colors.primary}20`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = colors.border;
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="TOUS">Tous les statuts</option>
          <option value="VALIDES">Validés</option>
          <option value="EN_ATTENTE">En attente</option>
        </select>
      </div>
      
      <div style={{ flex: 1, minWidth: '200px' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: colors.textDark
        }}>
          Année
        </label>
        <input
          type="text"
          placeholder="Filtrer par année (ex: 2023)"
          value={filters.annee}
          onChange={(e) => setFilters({...filters, annee: e.target.value})}
          style={{
            width: '90%',
            padding: '0.75rem',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'all 0.2s ease'
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
      </div>
      
     
    </div>

    {/* Messages */}
    

    {/* Liste des diplômes */}
    <div style={{ padding: '1.5rem' }}>
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            color: colors.textLight
          }}>
            <FiLoader className="animate-spin" size={20} />
            <span>Chargement en cours...</span>
          </div>
        </div>
      ) : diplomes.length === 0 ? (
        <motion.div
          style={{
            backgroundColor: colors.lightBg,
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            border: `1px dashed ${colors.border}`
          }}
        >
          <FiFileText size={48} style={{ color: colors.textLight, marginBottom: '1rem', opacity: 0.7 }} />
          <h3 style={{ 
            color: colors.textDark, 
            marginBottom: '0.5rem',
            fontSize: '1.25rem'
          }}>
            Aucun diplôme trouvé
          </h3>
          <p style={{ 
            color: colors.textLight,
            marginBottom: '1.5rem'
          }}>
            {filters.statut === 'TOUS' 
              ? 'Commencez par créer un nouveau diplôme'
              : 'Aucun diplôme ne correspond à vos critères'}
          </p>
          
        </motion.div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: `1px solid ${colors.border}`,
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              minWidth: '800px'
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: colors.lightBg,
                  borderBottom: `1px solid ${colors.border}`
                }}>
                  <th style={{ 
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    color: colors.textDark
                  }}>
                    Étudiant
                  </th>
                  <th style={{ 
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    color: colors.textDark
                  }}>
                    Type de diplôme
                  </th>
                  <th style={{ 
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    color: colors.textDark
                  }}>
                    Spécialité
                  </th>
                  <th style={{ 
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    color: colors.textDark
                  }}>
                    Date
                  </th>
                  <th style={{ 
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    color: colors.textDark
                  }}>
                    Statut
                  </th>
                  <th style={{ 
                    padding: '1rem',
                    textAlign: 'right',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    color: colors.textDark
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {diplomes.map(diplome => (
                  <motion.tr 
                    key={diplome.id}
                     style={{ 
                      borderBottom: `1px solid ${colors.border}`,
                      '&:last-child': { borderBottom: 'none' }
                    }}
                  >
                    <td style={{ 
                      padding: '1rem',
                      fontSize: '0.875rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        
                        <div>
                          <div style={{ fontWeight: '500' }}>{diplome.studentName}</div>
                          <div style={{ 
                            fontSize: '0.75rem',
                            color: colors.textLight
                          }}>
                            {diplome.studentId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ 
                      padding: '1rem',
                      fontSize: '0.875rem'
                    }}>
                      {diplome.diplomaTitle}
                    </td>
                    <td style={{ 
                      padding: '1rem',
                      fontSize: '0.875rem'
                    }}>
                      {diplome.speciality}
                    </td>
                    <td style={{ 
                      padding: '1rem',
                      fontSize: '0.875rem',
                      color: colors.textLight
                    }}>
                      {formaterDate(diplome.dateOfIssue)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.35rem 0.7rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: diplome.complete ? `${colors.success}10` : `${colors.warning}10`,
                        color: diplome.complete ? colors.success : colors.warning,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        {diplome.complete ? (
                          <>
                            <FiCheckCircle size={12} />
                            Validé
                          </>
                        ) : (
                          <>
                            <FiClock size={12} />
                            En attente
                          </>
                        )}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '1rem',
                      textAlign: 'right'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        gap: '0.5rem', 
                        justifyContent: 'flex-end'
                      }}>
                       
                        
                        {!diplome.complete && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => supprimerDiplome(diplome.id)}
                            disabled={loading}
                            style={{
                              padding: '0.5rem 0.75rem',
                              backgroundColor: `${colors.error}10`,
                              color: colors.error,
                              border: `1px solid ${colors.error}`,
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            <FiTrash2 size={14} />
                            Supprimer
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  </motion.div>

</div>
    
  );
}

export default ListeDiplomeUni;