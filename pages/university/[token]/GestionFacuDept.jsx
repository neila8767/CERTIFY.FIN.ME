import Header from '../../../components/HeaderUniversity.jsx' 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FiArrowLeft,  FiPlus, FiTrash2 , FiChevronDown, FiLayers, FiHome, FiUsers,  FaSignOutAlt, FiX, FiEyeOff, FiUser, FiLock, FiCamera, FiCreditCard, FiImage, FiKey, FiEye,   FiBell, FiShield, FiLink, FiUpload , FiDollarSign , FiLogOut , FiInfo , FiEdit2, FiSave} from 'react-icons/fi';

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

const GestionFacuDept = () => {
  const router = useRouter();
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState({});
  const [showFacultyForm, setShowFacultyForm] = useState(false);
  const [expandedFaculties, setExpandedFaculties] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState(null);


  
  
  // États pour les formulaires modaux
  const [facultyFormData, setFacultyFormData] = useState({
    idFaculty: null,
    nomFaculty: '',
    idUni: null
  });
  
  const [departmentFormData, setDepartmentFormData] = useState({
    idDepart: null,
    nomDepart: '',
    idFaculty: null,
    idUni: null
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [universityId, setUniversityId] = useState(null);
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    const storedId = localStorage.getItem('university_id');
    const storedToken = localStorage.getItem('uni_token');
    setUniversityId(storedId);
    setToken(storedToken);
    if (storedId) {
      setFacultyFormData(prev => ({ ...prev, idUni: parseInt(storedId) }));
    }
  }, []);
   

  useEffect(() => {
  if (selectedDepartment) {
    router.push(`/university/${token}/StudentManagement?departmentId=${selectedDepartment}`);
  }
}, [selectedDepartment]);


  // Chargement des facultés
  useEffect(() => {
    if (!universityId || !token) return;

    const loadFaculties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/faculties/${universityId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFaculties(response.data.data);
      } catch (error) {
        console.error('Error loading faculties:', error);
      }
    };

    loadFaculties();
  }, [universityId, token]);



  // Chargement des départements
  const loadDepartments = async (facultyId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/departments/${facultyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(prev => ({ ...prev, [facultyId]: response.data }));
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  // Toggle expansion des facultés
  const toggleFacultyExpansion = async (facultyId) => {
    setExpandedFaculties(prev => ({ ...prev, [facultyId]: !prev[facultyId] }));
    if (!expandedFaculties[facultyId] && !departments[facultyId]) {
      await loadDepartments(facultyId);
    }
  };

  // Gestion des formulaires
  const openFacultyForm = (faculty = null) => {
    setFacultyFormData({
      idFaculty: faculty?.idFaculty || null,
      nomFaculty: faculty?.nomFaculty || '',
      idUni: universityId
    });
    setShowFacultyForm(true);
  };

  const openDepartmentForm = (facultyId, department = null) => {
    setDepartmentFormData({
      idDepart: department?.idDepart || null,
      nomDepart: department?.nomDepart || '',
      idFaculty: department?.idFaculty || facultyId,
      idUni: universityId
    });
  };

  // Actions CRUD
  const handleFacultySubmit = async (e) => {
    e.preventDefault();
    try {
      if (facultyFormData.idFaculty) {
        // Mise à jour
        await axios.put(
          `${API_BASE_URL}/facultiesupdate/${facultyFormData.idFaculty}`,
          { nomFaculty: facultyFormData.nomFaculty },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setFaculties(prev => prev.map(f => 
          f.idFaculty === facultyFormData.idFaculty 
            ? { ...f, nomFaculty: facultyFormData.nomFaculty } 
            : f
        ));
      } else {
        // Création
        const response = await axios.post(
          `${API_BASE_URL}/facultiescreate`,
          facultyFormData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setFaculties(prev => [...prev, response.data]);
      }
      
      setShowFacultyForm(false);
    } catch (error) {
      console.error('Error saving faculty:', error);
    }
  };

  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (departmentFormData.idDepart) {
        // Mise à jour
        await axios.put(
          `${API_BASE_URL}/departmentsupdate/${departmentFormData.idDepart}`,
          { 
            nomDepart: departmentFormData.nomDepart,
            idFaculty: departmentFormData.idFaculty
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Mettre à jour l'état local
        setDepartments(prev => {
          const updatedDepartments = { ...prev };
          
          // Retirer de l'ancienne faculté si nécessaire
          Object.keys(updatedDepartments).forEach(fId => {
            updatedDepartments[fId] = updatedDepartments[fId].filter(
              d => d.idDepart !== departmentFormData.idDepart
            );
          });
          
          // Ajouter à la nouvelle faculté
          if (!updatedDepartments[departmentFormData.idFaculty]) {
            updatedDepartments[departmentFormData.idFaculty] = [];
          }
          
          updatedDepartments[departmentFormData.idFaculty].push({
            idDepart: departmentFormData.idDepart,
            nomDepart: departmentFormData.nomDepart,
            idFaculty: departmentFormData.idFaculty,
            idUni: departmentFormData.idUni
          });
          
          return updatedDepartments;
        });
      } else {
        // Création
        const response = await axios.post(
          `${API_BASE_URL}/departmentscreate`,
          departmentFormData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        await loadDepartments(departmentFormData.idFaculty);
      }
      
      setDepartmentFormData({
        idDepart: null,
        nomDepart: '',
        idFaculty: null,
        idUni: null
      });
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const handleDeleteFaculty = async (facultyId) => {
    if (!confirm('Supprimer cette faculté et tous ses départements?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/facultiesdelete/${facultyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setFaculties(prev => prev.filter(f => f.idFaculty !== facultyId));
      setDepartments(prev => {
        const newDepts = { ...prev };
        delete newDepts[facultyId];
        return newDepts;
      });
    } catch (error) {
      console.error('Error deleting faculty:', error);
    }
  };

  const handleDeleteDepartment = async (deptId) => {
    if (!confirm('Supprimer ce département et tous ses étudiants?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/departmentsdelete/${deptId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const facultyId = Object.keys(departments).find(fId => 
        departments[fId].some(d => d.idDepart === deptId)
      );

      if (facultyId) {
        setDepartments(prev => ({
          ...prev,
          [facultyId]: prev[facultyId].filter(d => d.idDepart !== deptId),
        }));
      }
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const handleGoBack = () => {
    const safeToken = encodeURIComponent(token);
    router.push(`/university/IntegrationBd?token=${safeToken}`);
  };

const getFacultyInitial = (facultyName) => {
  // Supprime "Faculté de " ou "Faculté des " du début du nom
  const specificName = facultyName.replace(/^Faculté (de|des) /i, '');
  // Retourne la première lettre en majuscule
  return specificName.charAt(0).toUpperCase();
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
            Gestion des facultés
          </h2>
          <p style={{ 
            fontSize: '0.9rem',
            color: colors.textLight,
            margin: 0
          }}>
            Liste complète des facultés et départements
          </p>
        </div>
      </div>
      
      <div style={{display: "flex", gap: "1rem"}}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push(`/university/${token}`)}
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
          onClick={() => openFacultyForm()}
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
          Nouvelle faculté
        </motion.button>
      </div>
    </div>

    {/* Contenu principal */}
    <div style={{ padding: '1.5rem' }}>
      {faculties.length === 0 ? (
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
          <p style={{ margin: '1rem 0 0', fontSize: '1rem' }}>Aucune faculté enregistrée</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openFacultyForm()}
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
            Ajouter votre première faculté
          </motion.button>
        </motion.div>
      ) : (
        <div style={{ 
          display: 'grid',
          gap: '1rem'
        }}>
          {faculties.map(faculty => (
            <motion.div
              key={faculty.idFaculty}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div 
                style={{
                  padding: '1.25rem',
                  backgroundColor: expandedFaculties[faculty.idFaculty] ? colors.lightBg : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onClick={() => toggleFacultyExpansion(faculty.idFaculty)}
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
  {getFacultyInitial(faculty.nomFaculty)}
</div>
                  
                  <div>
                    <span style={{ 
                      fontWeight: '600',
                      color: colors.textDark,
                      fontSize: '1.05rem'
                    }}>
                      {faculty.nomFaculty}
                    </span>
                    <p style={{ 
                      fontSize: '0.85rem',
                      color: colors.textLight,
                      margin: '0.25rem 0 0'
                    }}>
                      {departments[faculty.idFaculty]?.length || 0} département(s)
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openFacultyForm(faculty);
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
                      handleDeleteFaculty(faculty.idFaculty);
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
                    animate={{ rotate: expandedFaculties[faculty.idFaculty] ? 180 : 0 }}
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

              {expandedFaculties[faculty.idFaculty] && (
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
                    marginBottom: '1.5rem'
                  }}>
                    <h3 style={{ 
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      margin: 0,
                      color: colors.textDark,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <FiLayers size={20} color={colors.primary} />
                      Départements de {faculty.nomFaculty}
                    </h3>
                    
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        openDepartmentForm(faculty.idFaculty);
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
                      <FiPlus size={14} />
                      Ajouter un département
                    </motion.button>
                  </div>

                  {departments[faculty.idFaculty] ? (
                    departments[faculty.idFaculty].length === 0 ? (
                      <div style={{ 
                        textAlign: 'center',
                        padding: '2rem',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: `1px dashed ${colors.border}`,
                        color: colors.textLight
                      }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={colors.textLight} style={{ opacity: 0.5 }}>
                          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p style={{ margin: '1rem 0 0' }}>Aucun département enregistré</p>
                      </div>
                    ) : (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1rem'
                      }}>
                        {departments[faculty.idFaculty].map(dept => (
                          <motion.div
                            key={dept.idDepart}
                            whileHover={{ y: -2 }}
                            style={{
                              padding: '1.25rem',
                              backgroundColor: 'white',
                              borderRadius: '8px',
                              border: `1px solid ${colors.border}`,
                              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                            }}
                          >
                            <div style={{ 
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              marginBottom: '1rem'
                            }}>
                              <div>
                                <h4 style={{ 
                                  fontSize: '1rem',
                                  fontWeight: '600',
                                  margin: '0 0 0.25rem 0',
                                  color: colors.textDark
                                }}>
                                  {dept.nomDepart}
                                </h4>
                                <p style={{
                                  fontSize: '0.8rem',
                                  color: colors.textLight,
                                  margin: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}>
                                  <FiHome size={12} />
                                  {faculty.nomFaculty}
                                </p>
                              </div>
                              
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDepartmentForm(faculty.idFaculty, dept);
                                  }}
                                  style={{
                                    padding: '0.4rem 0.8rem',
                                    backgroundColor: `${colors.primary}10`,
                                    color: colors.primary,
                                    border: `1px solid ${colors.primary}`,
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                  }}
                                >
                                  <FiEdit2 size={12} />
                               
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteDepartment(dept.idDepart);
                                  }}
                                  style={{
                                    padding: '0.4rem 0.8rem',
                                    backgroundColor: `${colors.lightBg}10`,
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
                                  <FiTrash2 size={12} />
                                 
                                </motion.button>
                              </div>
                            </div>
                            
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDepartment(dept.idDepart);
                              }}
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                backgroundColor: `${colors.primary}10`,
                                color: colors.primary,
                                border: `1px solid ${colors.primary}`,
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                              }}
                            >
                              <FiUsers size={14} />
                              Gérer les étudiants
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    )
                  ) : (
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'center',
                      padding: '2rem'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        border: `3px solid ${colors.border}`,
                        borderTopColor: colors.primary,
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  </motion.div>

  {/* Modal pour les facultés */}
  {showFacultyForm && (
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
            {facultyFormData.idFaculty ? (
              <>
                <FiEdit2 style={{ marginRight: '0.5rem' }} />
                Modifier la faculté
              </>
            ) : (
              <>
                <FiPlus style={{ marginRight: '0.5rem' }} />
                Nouvelle faculté
              </>
            )}
          </h3>
          <button
            onClick={() => setShowFacultyForm(false)}
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
        
        <form onSubmit={handleFacultySubmit} style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: colors.textDark,
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Nom de la faculté
            </label>
            <input
              type="text"
              placeholder="Ex: Faculté des Sciences"
              value={facultyFormData.nomFaculty}
              onChange={(e) => setFacultyFormData({
                ...facultyFormData,
                nomFaculty: e.target.value
              })}
              style={{
                width: '100%',
                padding: '0.75rem 0.2rem',
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
              onClick={() => setShowFacultyForm(false)}
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
              disabled={!facultyFormData.nomFaculty.trim()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: !facultyFormData.nomFaculty.trim() ? `${colors.primary}80` : colors.primary,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: !facultyFormData.nomFaculty.trim() ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              {facultyFormData.idFaculty ? 'Mettre à jour' : 'Enregistrer'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )}

  {/* Modal pour les départements */}
  {departmentFormData.idFaculty && (
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
            {departmentFormData.idDepart ? (
              <>
                <FiEdit2 style={{ marginRight: '0.5rem' }} />
                Modifier le département
              </>
            ) : (
              <>
                <FiPlus style={{ marginRight: '0.5rem' }} />
                Nouveau département
              </>
            )}
          </h3>
          <button
            onClick={() => setDepartmentFormData({
              idDepart: null,
              nomDepart: '',
              idFaculty: null,
              idUni: null
            })}
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
        
        <form onSubmit={handleDepartmentSubmit} style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: colors.textDark,
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Nom du département
            </label>
            <input
              type="text"
              placeholder="Ex: Département d'Informatique"
              value={departmentFormData.nomDepart}
              onChange={(e) => setDepartmentFormData({
                ...departmentFormData,
                nomDepart: e.target.value
              })}
              style={{
                width: '90%',
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
              Faculté associée
            </label>
            <select
              value={departmentFormData.idFaculty}
              onChange={(e) => setDepartmentFormData({
                ...departmentFormData,
                idFaculty: parseInt(e.target.value)
              })}
              style={{
                width: '98%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: `1px solid ${colors.border}`,
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: 'white',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23718096'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '16px'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.boxShadow = `0 0 0 2px ${colors.primary}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.border;
                e.target.style.boxShadow = 'none';
              }}
              required
            >
              <option value="">Sélectionnez une faculté</option>
              {faculties.map(faculty => (
                <option key={faculty.idFaculty} value={faculty.idFaculty}>
                  {faculty.nomFaculty}
                </option>
              ))}
            </select>
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
              onClick={() => setDepartmentFormData({
                idDepart: null,
                nomDepart: '',
                idFaculty: null,
                idUni: null
              })}
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
              disabled={!departmentFormData.nomDepart.trim() || !departmentFormData.idFaculty}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: !departmentFormData.nomDepart.trim() || !departmentFormData.idFaculty ? `${colors.primary}80` : colors.primary,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: !departmentFormData.nomDepart.trim() || !departmentFormData.idFaculty ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              {departmentFormData.idDepart ? 'Mettre à jour' : 'Enregistrer'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )}
</div>
  );
};

export default GestionFacuDept;