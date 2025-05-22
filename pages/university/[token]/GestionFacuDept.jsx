import Header from "../../../components/HeaderUniversity.jsx";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const colors = {
  primary: '#2F855A',
  secondary: '#2D3748',
  accent: '#38A169',
  lightBg: '#F7FAFC',
  darkBg: '#1A202C',
  textDark: '#1C1C1C',
  textLight: '#718096',
  border: '#CBD5E0',
  success: '#2F855A',
  error: '#C53030',
  warning: '#D69E2E'
};

const GestionFacuDept = () => {
  
  const router = useRouter();
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState({});
  const [showFacultyForm, setShowFacultyForm] = useState(false);
  const [newFacultyName, setNewFacultyName] = useState('');
  const [expandedFaculties, setExpandedFaculties] = useState({});
  const [showDeptForms, setShowDeptForms] = useState({});
  const [newDeptNames, setNewDeptNames] = useState({});

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [universityId, setUniversityId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem('university_id');
    const storedToken = localStorage.getItem('uni_token');
    setUniversityId(storedId);
    setToken(storedToken);
  }, []);

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
  const toggleDeptForm = (facultyId) => {
    setShowDeptForms(prev => ({ ...prev, [facultyId]: !prev[facultyId] }));
    setNewDeptNames(prev => ({ ...prev, [facultyId]: '' }));
  };

  // Actions CRUD
  const handleAddFaculty = async (e) => {
    e.preventDefault();
    if (!newFacultyName.trim()) return;

    try {
      await axios.post(`${API_BASE_URL}/facultiescreate`, {
        nomFaculty: newFacultyName,
        idUni: universityId,
      }, { headers: { Authorization: `Bearer ${token}` } });

      const updatedFaculties = await axios.get(`${API_BASE_URL}/faculties/${universityId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaculties(updatedFaculties.data.data);
      setNewFacultyName('');
      setShowFacultyForm(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateFaculty = async (facultyId, currentName) => {
    const newName = prompt('Nouveau nom:', currentName);
    if (!newName || newName.trim() === currentName) return;

    try {
      await axios.put(`${API_BASE_URL}/facultiesupdate/${facultyId}`, {
        nomFaculty: newName.trim(),
      }, { headers: { Authorization: `Bearer ${token}` } });

      setFaculties(prev => prev.map(f => 
        f.idFaculty === facultyId ? { ...f, nomFaculty: newName.trim() } : f
      ));
    } catch (error) {
      console.error('Error updating faculty:', error);
    }
  };

  const handleDeleteFaculty = async (facultyId) => {
    if (!confirm('Supprimer cette faculté?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/facultiesdelete/${facultyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaculties(prev => prev.filter(f => f.idFaculty !== facultyId));
    } catch (error) {
      console.error('Error deleting faculty:', error);
    }
  };

  const handleAddDepartment = async (facultyId) => {
    const deptName = newDeptNames[facultyId]?.trim();
    if (!deptName) return;

    try {
      await axios.post(`${API_BASE_URL}/departmentscreate`, {
        nomDepart: deptName,
        idFaculty: facultyId,
        idUni: universityId,
      }, { headers: { Authorization: `Bearer ${token}` } });

      await loadDepartments(facultyId);
      setShowDeptForms(prev => ({ ...prev, [facultyId]: false }));
      setNewDeptNames(prev => ({ ...prev, [facultyId]: '' }));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateDepartment = async (deptId, currentName) => {
    const newName = prompt('Nouveau nom:', currentName);
    if (!newName || newName.trim() === currentName) return;

    try {
      await axios.put(`${API_BASE_URL}/departmentsupdate/${deptId}`, {
        nomDepart: newName.trim(),
      }, { headers: { Authorization: `Bearer ${token}` } });

      const facultyId = Object.keys(departments).find(fId => 
        departments[fId].some(d => d.idDepart === deptId)
      );

      if (facultyId) {
        setDepartments(prev => ({
          ...prev,
          [facultyId]: prev[facultyId].map(d => 
            d.idDepart === deptId ? { ...d, nomDepart: newName.trim() } : d
          ),
        }));
      }
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  const handleDeleteDepartment = async (deptId) => {
    if (!confirm('Supprimer ce département?')) return;

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

  return (
    <div style={{ 
      backgroundColor: colors.lightBg,
      minHeight: '100vh',
      marginTop : '5rem',
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      {/* Header élégant */}
      <Header token={token} />
    

      {/* Contenu principal */}
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {/* Carte des facultés */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            marginBottom: '2rem',
            border: `1px solid ${colors.border}`
          }}
        >
          {/* En-tête de carte */}
          <div style={{
            padding: '1.5rem',
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem',
              fontWeight: '600',
              margin: 0,
              color: colors.textDark,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.primary}>
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Facultés
            </h2>
            <div style={{display : "flex"}}>
            <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            style={{
              padding: '0.75rem 1.25rem',
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: 'black',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Retour
          </motion.button>
                         <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFacultyForm(true)}
              style={{
                padding: '0.75rem 1.25rem',
                backgroundColor: colors.accent,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Nouvelle faculté
            </motion.button>
            </div>
            
          </div>

          {/* Liste des facultés */}
          <div style={{ padding: '1.5rem' }}>
            {faculties.length === 0 ? (
              <div style={{ 
                textAlign: 'center',
                padding: '2rem',
                color: colors.textLight
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.textLight} style={{ opacity: 0.5 }}>
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p style={{ margin: '1rem 0 0' }}>Aucune faculté enregistrée</p>
              </div>
            ) : (
              <div style={{ 
                display: 'grid',
                gap: '0.75rem'
              }}>
                {faculties.map(faculty => (
                  <div 
                    key={faculty.idFaculty}
                    style={{
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    {/* En-tête de faculté */}
                    <div 
                      style={{
                        padding: '1rem',
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
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: colors.primary,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '600'
                        }}>
                          {faculty.nomFaculty.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ 
                          fontWeight: '500',
                          color: colors.textDark
                        }}>
                          {faculty.nomFaculty}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateFaculty(faculty.idFaculty, faculty.nomFaculty);
                          }}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(56, 161, 105, 0.1)',
                            color: colors.accent,
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFaculty(faculty.idFaculty);
                          }}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(197, 48, 48, 0.1)',
                            color: colors.error,
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.button>
                        
                        <motion.div
                          animate={{ rotate: expandedFaculties[faculty.idFaculty] ? 180 : 0 }}
                          style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textDark}>
                            <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.div>
                      </div>
                    </div>

                    {/* Contenu déroulant - Départements */}
                    {expandedFaculties[faculty.idFaculty] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          padding: '1rem',
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
                          <h3 style={{ 
                            fontSize: '1rem',
                            fontWeight: '600',
                            margin: 0,
                            color: colors.textDark,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.textDark}>
                              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M9 22V12h6v10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Départements
                          </h3>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleDeptForm(faculty.idFaculty)}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: showDeptForms[faculty.idFaculty] ? colors.lightBg : 'white',
                              color: colors.accent,
                              border: `1px solid ${colors.accent}`,
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {showDeptForms[faculty.idFaculty] ? 'Annuler' : 'Ajouter'}
                          </motion.button>
                        </div>

                        {/* Formulaire d'ajout de département */}
                        {showDeptForms[faculty.idFaculty] && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{
                              marginBottom: '1rem',
                              display: 'flex',
                              gap: '0.5rem'
                            }}
                          >
                            <input
                              type="text"
                              placeholder="Nom du département"
                              value={newDeptNames[faculty.idFaculty] || ''}
                              onChange={(e) => setNewDeptNames(prev => ({
                                ...prev,
                                [faculty.idFaculty]: e.target.value
                              }))}
                              style={{
                                flex: 1,
                                padding: '0.75rem 1rem',
                                borderRadius: '6px',
                                border: `1px solid ${colors.border}`,
                                fontSize: '0.875rem',
                                outline: 'none'
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
                            
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAddDepartment(faculty.idFaculty)}
                              disabled={!newDeptNames[faculty.idFaculty]?.trim()}
                              style={{
                                padding: '0 1rem',
                                backgroundColor: colors.accent,
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                opacity: !newDeptNames[faculty.idFaculty]?.trim() ? 0.7 : 1
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M5 12h14M12 5v14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </motion.button>
                          </motion.div>
                        )}

                        {/* Liste des départements */}
                        {departments[faculty.idFaculty] ? (
                          departments[faculty.idFaculty].length === 0 ? (
                            <div style={{ 
                              textAlign: 'center',
                              padding: '1rem',
                              color: colors.textLight,
                              fontSize: '0.875rem'
                            }}>
                              Aucun département enregistré
                            </div>
                          ) : (
                            <div style={{
                              display: 'grid',
                              gap: '0.5rem'
                            }}>
                              {departments[faculty.idFaculty].map(dept => (
                                <div 
                                  key={dept.idDepart}
                                  style={{
                                    padding: '0.75rem 1rem',
                                    backgroundColor: 'white',
                                    borderRadius: '6px',
                                    border: `1px solid ${colors.border}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                  }}
                                >
                                  <span style={{ 
                                    color: colors.textDark,
                                    fontSize: '0.875rem'
                                  }}>
                                    {dept.nomDepart}
                                  </span>
                                  
                                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => handleUpdateDepartment(dept.idDepart, dept.nomDepart)}
                                      style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '6px',
                                        backgroundColor: 'rgba(56, 161, 105, 0.1)',
                                        color: colors.accent,
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </motion.button>
                                    
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => handleDeleteDepartment(dept.idDepart)}
                                      style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '6px',
                                        backgroundColor: 'rgba(197, 48, 48, 0.1)',
                                        color: colors.error,
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </motion.button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        ) : (
                          <div style={{ 
                            textAlign: 'center',
                            padding: '1rem',
                            color: colors.textLight
                          }}>
                            Chargement des départements...
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal d'ajout de faculté */}
      {showFacultyForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '500px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{
              padding: '1.5rem',
              borderBottom: `1px solid ${colors.border}`
            }}>
              <h3 style={{ 
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: 0,
                color: colors.textDark
              }}>
                Nouvelle faculté
              </h3>
            </div>
            
            <form onSubmit={handleAddFaculty} style={{ padding: '1.5rem' }}>
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
                  value={newFacultyName}
                  onChange={(e) => setNewFacultyName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    border: `1px solid ${colors.border}`,
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  autoFocus
                />
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem'
              }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => {
                    setShowFacultyForm(false);
                    setNewFacultyName('');
                  }}
                  style={{
                    padding: '0.75rem 1.25rem',
                    backgroundColor: 'transparent',
                    color: colors.textDark,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Annuler
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!newFacultyName.trim()}
                  style={{
                    padding: '0.75rem 1.25rem',
                    backgroundColor: !newFacultyName.trim() ? `${colors.accent}80` : colors.accent,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: !newFacultyName.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Enregistrer
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GestionFacuDept;