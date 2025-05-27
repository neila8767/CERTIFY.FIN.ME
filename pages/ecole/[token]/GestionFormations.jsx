import Header from '../../../components/HeaderEcole.jsx';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FiArrowLeft, FiPlus, FiTrash2, FiChevronDown, FiLayers, FiHome, FiUsers, FiEdit2, FiX } from 'react-icons/fi';
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

const GestionFormations = () => {
  const router = useRouter();
  const [formations, setFormations] = useState([]);
  const [students, setStudents] = useState({});
  const [showFormationForm, setShowFormationForm] = useState(false);
const [expandedFormations, setExpandedFormations] = useState({});
  const [selectedFormation, setSelectedFormation] = useState(null);
  
  // États pour les formulaires
  const [formationFormData, setFormationFormData] = useState({
    idFormation: null,
    nomFormation: '',
    typeFormation: 'Certification',
    duree: '',
    ecoleId: null
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [ecoleId, setEcoleId] = useState(null);
  const [token, setToken] = useState(null);
  const [annees, setAnnees] = useState([]);

  useEffect(() => {
    const storedId = localStorage.getItem('ecole_id');
    const storedToken = localStorage.getItem('ecole_token');
    setEcoleId(storedId);
    setToken(storedToken);
    if (storedId) {
      setFormationFormData(prev => ({ ...prev, ecoleId: parseInt(storedId) }));
    }
  }, []);

  // Chargement des formations
  useEffect(() => {
    if (!ecoleId || !token) return;

    const loadFormations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/ecoles/${ecoleId}/formations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormations(response.data);
      } catch (error) {
        console.error('Error loading formations:', error);
      }
    };

    const loadAnnees = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/ecole/${ecoleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnnees(response.data);
      } catch (error) {
        console.error('Error loading academic years:', error);
      }
    };

    loadFormations();
    loadAnnees();
  }, [ecoleId, token]);

  
const loadStudents = async (formationId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/formations/${formationId}/etudiants`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStudents(prev => ({ ...prev, [formationId]: response.data }));
  } catch (error) {
    console.error('Error loading students:', error);
  }
};

const toggleFormationExpansion = async (formationId) => {
  setExpandedFormations(prev => ({ ...prev, [formationId]: !prev[formationId] }));
  if (!expandedFormations[formationId] && !students[formationId]) {
    await loadStudents(formationId);
  }
};

  // Gestion des formulaires
  const openFormationForm = (formation = null) => {
    setFormationFormData({
      idFormation: formation?.idFormation || null,
      nomFormation: formation?.nomFormation || '',
      typeFormation: formation?.typeFormation || 'Certification',
      duree: formation?.duree || '',
      ecoleId: ecoleId
    });
    setShowFormationForm(true);
  };

  // Actions CRUD
  const handleFormationSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formationFormData.idFormation) {
        // Mise à jour
        await axios.put(
          `${API_BASE_URL}/formations/update/${formationFormData.idFormation}`,
          { 
            nomFormation: formationFormData.nomFormation,
            typeFormation: formationFormData.typeFormation,
            duree: formationFormData.duree
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setFormations(prev => prev.map(f => 
          f.idFormation === formationFormData.idFormation 
            ? { ...f, ...formationFormData } 
            : f
        ));
      } else {
        // Création
        const response = await axios.post(
          `${API_BASE_URL}/formations/create`,
          formationFormData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setFormations(prev => [...prev, response.data]);
      }
      
      setShowFormationForm(false);
    } catch (error) {
      console.error('Error saving formation:', error);
    }
  };

  const handleDeleteFormation = async (formationId) => {
    if (!confirm('Supprimer cette formation et tous ses étudiants?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/formations/delete/${formationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setFormations(prev => prev.filter(f => f.idFormation !== formationId));
      setStudents(prev => {
        const newStudents = { ...prev };
        delete newStudents[formationId];
        return newStudents;
      });
    } catch (error) {
      console.error('Error deleting formation:', error);
    }
  };

  const handleGoBack = () => {
    const safeToken = encodeURIComponent(token);
    router.push(`/ecole/IntegrationEcole?token=${safeToken}`);
  };

  useEffect(() => {
    if (selectedFormation) {
      router.push(`/ecole/${token}/StudentManagement?formationId=${selectedFormation}`);
    }
  }, [selectedFormation]);

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
          maxWidth: '1200px',
          margin: '2rem auto',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: `1px solid ${colors.border}`
        }}
      >
        {/* En-tête avec titre et boutons */}
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.primary}>
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 style={{ 
                fontSize: '1.75rem',
                fontWeight: '500',
                margin: 0,
                color: colors.textDark
              }}>
                Gestion des formations
              </h2>
              <p style={{ 
                fontSize: '0.9rem',
                color: colors.textLight,
                margin: 0
              }}>
                Liste complète des formations et étudiants
              </p>
            </div>
          </div>
          
          <div style={{display: "flex", gap: "1rem"}}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/ecole/${token}`)}
    style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: 'white',
            color: colors.textDark,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
            >
              <FiArrowLeft size={16} />
              Retour
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openFormationForm()}
              style={{
                padding: '0.75rem 1.25rem',
                backgroundColor: "white",
                color: colors.accent,
                border: `1px solid ${colors.accent}`,
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              <FiPlus size={16} />
              Nouvelle formation
            </motion.button>
          </div>
        </div>

        {/* Contenu principal */}
        <div style={{ padding: '1.5rem' }}>
          {formations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ 
                textAlign: 'center',
                padding: '3rem',
                color: colors.textLight,
                backgroundColor: colors.lightBg,
                borderRadius: '8px',
                border: `1px dashed ${colors.border}`
              }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.textLight} style={{ opacity: 0.5 }}>
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p style={{ margin: '1rem 0 0', fontSize: '1rem' }}>Aucune formation enregistrée</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openFormationForm()}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginTop: '1.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FiPlus size={16} />
                Ajouter votre première formation
              </motion.button>
            </motion.div>
          ) : (
            <div style={{ 
              display: 'grid',
              gap: '1rem'
            }}>
             {formations.map(formation => (
  <motion.div
    key={formation.idFormation}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    style={{
      border: `1px solid ${colors.border}`,
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      marginBottom: '1rem'
    }}
  >
    {/* En-tête de la formation */}
    <div 
      style={{
        padding: '1.25rem',
        backgroundColor: expandedFormations[formation.idFormation] ? colors.lightBg : 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
      }}
      onClick={() => toggleFormationExpansion(formation.idFormation)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '10px',
          color: colors.primary,
          backgroundColor: colors.lightBg,
          border: `1px dashed ${colors.primary}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '600',
          fontSize: '1.25rem'
        }}>
          {formation.nomFormation.charAt(0).toUpperCase()}
        </div>
        
        <div>
          <span style={{ 
            fontWeight: '600',
            color: colors.textDark,
            fontSize: '1.05rem'
          }}>
            {formation.nomFormation}
          </span>
          <p style={{ 
            fontSize: '0.85rem',
            color: colors.textLight,
            margin: '0.25rem 0 0'
          }}>
            {formation.typeFormation} • {students[formation.idFormation]?.length || 0} étudiant(s)
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            openFormationForm(formation);
          }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: `${colors.primary}10`,
            color: colors.primary,
            border: `1px solid ${colors.primary}`,
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FiEdit2 size={14} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteFormation(formation.idFormation);
          }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: `${colors.lightBg}10`,
            color: colors.error,
            border: `1px solid ${colors.error}`,
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FiTrash2 size={14} />
        </motion.button>
        
        <motion.div
          animate={{ rotate: expandedFormations[formation.idFormation] ? 180 : 0 }}
          style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.textDark
          }}
        >
          <FiChevronDown size={20} />
        </motion.div>
      </div>
    </div>

    {/* Section dépliée */}
    {expandedFormations[formation.idFormation] && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          padding: '1.5rem',
          backgroundColor: colors.lightBg,
          borderTop: `1px solid ${colors.border}`
        }}
      >
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <div>
            <h4 style={{ 
              fontSize: '1rem',
              fontWeight: '600',
              color: colors.textDark,
              marginBottom: '0.5rem'
            }}>
              {formation.nomFormation}
            </h4>
            <p style={{ 
              fontSize: '0.9rem',
              color: colors.textLight,
              margin: 0
            }}>
              {formation.typeFormation} • {students[formation.idFormation]?.length || 0} étudiant(s) inscrits
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFormation(formation.idFormation);
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: "white",
              color: colors.accent,
              border: `1px solid ${colors.accent}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FiUsers size={14} />
            Gérer étudiants
          </motion.button>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '8px',
          border: `1px solid ${colors.border}`
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: colors.textDark,
            margin: 0
          }}>
            <strong>Description :</strong> Formation professionnelle qualifiante en {formation.nomFormation.toLowerCase()}, 
            couvrant les compétences techniques et les normes en vigueur.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <div style={{
              flex: 1,
              backgroundColor: colors.lightBg,
              padding: '0.75rem',
              borderRadius: '6px'
            }}>
              <p style={{
                fontSize: '0.75rem',
                color: colors.textLight,
                margin: '0 0 0.25rem 0'
              }}>
                Durée
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: colors.textDark,
                margin: 0,
                fontWeight: '500'
              }}>
                {formation.duree || '6 mois'}
              </p>
            </div>
            
            <div style={{
              flex: 1,
              backgroundColor: colors.lightBg,
              padding: '0.75rem',
              borderRadius: '6px'
            }}>
              <p style={{
                fontSize: '0.75rem',
                color: colors.textLight,
                margin: '0 0 0.25rem 0'
              }}>
                Prochaine session
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: colors.textDark,
                margin: 0,
                fontWeight: '500'
              }}>
                {new Date().getFullYear() + 1}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    )}
  </motion.div>
))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal pour les formations */}
      {showFormationForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '500px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              border: `1px solid ${colors.border}`
            }}
          >
            <div style={{
              padding: '1.5rem',
              borderBottom: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ 
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: 0,
                color: colors.textDark
              }}>
                {formationFormData.idFormation ? (
                  <>
                    <FiEdit2 style={{ marginRight: '0.5rem' }} />
                    Modifier la formation
                  </>
                ) : (
                  <>
                    <FiPlus style={{ marginRight: '0.5rem' }} />
                    Nouvelle formation
                  </>
                )}
              </h3>
              <button
                onClick={() => setShowFormationForm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.textLight,
                  cursor: 'pointer',
                  fontSize: '1.25rem'
                }}
              >
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleFormationSubmit} style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: colors.textDark,
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Nom de la formation
                </label>
                <input
                  type="text"
                  placeholder="Ex: Formation en Développement Web"
                  value={formationFormData.nomFormation}
                  onChange={(e) => setFormationFormData({
                    ...formationFormData,
                    nomFormation: e.target.value
                  })}
                  style={{
                    width: '92%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
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
                  autoFocus
                  required
                />
              </div>
              
              
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: colors.textDark,
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Durée (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex: 6 mois, 1 an..."
                  value={formationFormData.duree}
                  onChange={(e) => setFormationFormData({
                    ...formationFormData,
                    duree: e.target.value
                  })}
                  style={{
                    width: '92%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                borderTop: `1px solid ${colors.border}`,
                paddingTop: '1.5rem'
              }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowFormationForm(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'white',
                    color: colors.textDark,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  Annuler
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!formationFormData.nomFormation.trim()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: !formationFormData.nomFormation.trim() ? `${colors.primary}80` : colors.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: !formationFormData.nomFormation.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {formationFormData.idFormation ? 'Mettre à jour' : 'Enregistrer'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default GestionFormations;