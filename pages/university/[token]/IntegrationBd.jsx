import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/HeaderUniversity.jsx';
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

const API_BASE_URL = "http://localhost:5000";

const IntegrationBd = () => {
   const [showDeptExample, setShowDeptExample] = useState(false);
  
  const [showExample, setShowExample] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [uploadingFaculties, setUploadingFaculties] = useState(false);
  const [uploadingDepartments, setUploadingDepartments] = useState(false);
  const [resultFaculties, setResultFaculties] = useState(null);
  const [resultDepartments, setResultDepartments] = useState(null);
  const router = useRouter();
  const { token } = router.query;


  useEffect(() => {
    async function loadUniversities() {
      try {
        const response = await axios.get(`${API_BASE_URL}/universities`);
        setUniversities(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    loadUniversities();
  }, []);

  useEffect(() => {
    const fetchFaculties = async () => {
      const universityId = localStorage.getItem('university_id');
      if (!universityId) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/faculties/${universityId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('uni_token')}`,
          },
        });
        if (response.data.success) {
          setFaculties(response.data.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des facultés:", error);
      }
    };
    fetchFaculties();
  }, []);

  const handleFacultiesSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier est trop volumineux (max 5 Mo).');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    const universityId = localStorage.getItem('university_id');
    formData.append('universityId', universityId);
    setUploadingFaculties(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/faculties/upload`, formData);
      setResultFaculties(response.data);
      const facultiesResponse = await axios.get(`${API_BASE_URL}/faculties/${universityId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('uni_token')}`,
        }
      });
      setFaculties(facultiesResponse.data.data);
    } catch (error) {
      console.error('Erreur lors de l\'upload :', error.response ? error.response.data : error.message);
    } finally {
      setUploadingFaculties(false);
    }
  };

  const handleDepartmentsSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier est trop volumineux (max 5 Mo).');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('facultyId', selectedFaculty);
    setUploadingDepartments(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/departments/upload`, formData);
      setResultDepartments(response.data);
    } catch (error) {
      console.error('Erreur lors de l\'upload des départements :', error.response ? error.response.data : error.message);
    } finally {
      setUploadingDepartments(false);
    }
  };

  const handleGoBack = () => {
    const token = localStorage.getItem('uni_token');
    if (token) {
      const safeToken = encodeURIComponent(token);
      router.push(`/university/${safeToken}`);
    }
  };

  const handleGoGestion = () => {
    const token = localStorage.getItem('uni_token');
    if (token) {
      const safeToken = encodeURIComponent(token);
      router.push(`/university/${token}/GestionFacuDept?token=${safeToken}`);
    }
  };

  return (
    <div style={{ 
       flex: 1,
       padding: '3rem',
      paddingTop: '0.25rem',
      marginTop :'3.5rem',
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
           margin: '2rem auto',
          padding: '3rem',
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke= {colors.primary} >
              <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 style={{ 
              fontSize: '1.75rem',
              fontWeight: '500',
              margin: 0,
              color: colors.textDark
            }}>
              Intégration des données
            </h1>
            <p style={{ 
              fontSize: '0.9rem',
              color: colors.textLight,
              margin: 0
            }}>
              Importation des facultés et départements
            </p>
          </div>
        </div>

        {/* Section d'import des facultés */}
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
      Importation des facultés
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
        <span style={{ color: colors.primary, fontWeight: '500' }}>nomFaculty</span>{'\n'}
        Faculté des Sciences{'\n'}
        Faculté de Médecine{'\n'}
        Faculté des Lettres{'\n'}
        Faculté d'Ingénierie{'\n'}
        Faculté de Droit{'\n'}
        Faculté d'Économie
      </div>
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: colors.textLight }}>
        Votre fichier CSV doit contenir une colonne "nomFaculty" avec une faculté par ligne.
      </p>
    </div>
  )}

  <form onSubmit={handleFacultiesSubmit}>
    <div style={{ marginBottom: '1rem' }}>
      <label style={{
        display: 'block',
        marginBottom: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: colors.textDark
      }}>
        Fichier CSV des facultés
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
        Seuls les fichiers CSV (UTF-8) sont acceptés
      </p>
    </div>
    
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={uploadingFaculties}
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
      {uploadingFaculties ? (
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
          Importer les facultés
        </>
      )}
    </motion.button>
  </form>

  {resultFaculties && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      style={{
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '6px',
        border: `1px solid ${resultFaculties.error ? colors.error : colors.success}`,
        marginTop: '1rem',
        color: resultFaculties.error ? colors.error : colors.textDark
      }}
    >
      <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
        {resultFaculties.error ? '❌ ' : '✅ '}
        {resultFaculties.message}
      </p>
      {resultFaculties.count && (
        <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
          <strong>Facultés importées:</strong> {resultFaculties.count}
        </p>
      )}
    </motion.div>
  )}
</motion.div>

        {/* Section d'import des départements */}
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
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 22V12h6v10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Importation des départements
    </h2>
    
    <button 
      type="button"
      onClick={() => setShowDeptExample(!showDeptExample)}
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
      {showDeptExample ? 'Masquer l\'exemple' : 'Voir l\'exemple'}
    </button>
  </div>

  {showDeptExample && (
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
        <span style={{ color: colors.primary, fontWeight: '500' }}>nomDepartment</span>{'\n'}
        Département d'Informatique{'\n'}
        Département de Mathématiques{'\n'}
        Département de Physique{'\n'}
        Département de Chimie{'\n'}
        Département de Biologie
      </div>
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: colors.textLight }}>
        Votre fichier CSV doit contenir une colonne "nomDepartment" avec un département par ligne.
      </p>
    </div>
  )}

  <div style={{ marginBottom: '1.5rem' }}>
    <label style={{
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: colors.textDark
    }}>
      Sélectionnez une faculté
    </label>
    <select
      value={selectedFaculty}
      onChange={(e) => setSelectedFaculty(e.target.value)}
      style={{
        width: '100%',
        padding: '0.75rem',
        border: `1px solid ${colors.border}`,
        borderRadius: '6px',
        fontSize: '0.875rem',
        outline: 'none',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23718096'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0.75rem center',
        backgroundSize: '16px',
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
    >
      <option value="">-- Choisir une faculté --</option>
      {faculties.map((fac) => (
        <option key={fac.idFaculty} value={fac.idFaculty}>{fac.nomFaculty}</option>
      ))}
    </select>
  </div>

  <form onSubmit={handleDepartmentsSubmit}>
    <div style={{ marginBottom: '1rem' }}>
      <label style={{
        display: 'block',
        marginBottom: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: colors.textDark
      }}>
        Fichier CSV des départements
      </label>
      <input
        type="file"
        name="file"
        accept=".csv"
        required
        disabled={!selectedFaculty}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: `1px solid ${!selectedFaculty ? `${colors.border}80` : colors.border}`,
          borderRadius: '6px',
          fontSize: '0.875rem',
          outline: 'none',
          transition: 'all 0.2s ease',
          marginBottom: '0.5rem',
          backgroundColor: !selectedFaculty ? `${colors.lightBg}80` : 'white'
        }}
        onFocus={(e) => {
          if (selectedFaculty) {
            e.target.style.borderColor = colors.primary;
            e.target.style.boxShadow = `0 0 0 2px ${colors.primary}20`;
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = !selectedFaculty ? `${colors.border}80` : colors.border;
          e.target.style.boxShadow = 'none';
        }}
      />
      {!selectedFaculty && (
        <p style={{ margin: '0', fontSize: '0.8rem', color: colors.textLight }}>
          Veuillez d'abord sélectionner une faculté
        </p>
      )}
    </div>
    
    <motion.button
      whileHover={{ scale: selectedFaculty ? 1.03 : 1 }}
      whileTap={{ scale: selectedFaculty ? 0.98 : 1 }}
      type="submit"
      disabled={uploadingDepartments || !selectedFaculty}
      style={{
        padding: "0.5rem 1rem",
        backgroundColor: "white",
        color: colors.accent,
        border: `1px solid ${colors.accent}`,
        borderRadius: "6px",
        cursor: (uploadingDepartments || !selectedFaculty) ? 'not-allowed' : 'pointer',
        fontSize: "0.85rem",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}
    >
      {uploadingDepartments ? (
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
          Importer les départements
        </>
      )}
    </motion.button>
  </form>

  {resultDepartments && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      style={{
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '6px',
        border: `1px solid ${resultDepartments.error ? colors.error : colors.success}`,
        marginTop: '1rem',
        color: resultDepartments.error ? colors.error : colors.textDark
      }}
    >
      <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
        {resultDepartments.error ? '❌ ' : '✅ '}
        {resultDepartments.message}
      </p>
      {resultDepartments.count && (
        <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
          <strong>Départements importés:</strong> {resultDepartments.count}
        </p>
      )}
    </motion.div>
  )}
</motion.div>

        {/* Boutons d'action */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
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
              flex: 1
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Retour
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoGestion}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flex: 1
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 21v-4a2 2 0 012-2h4a2 2 0 012 2v4M3 10v-4a2 2 0 012-2h4a2 2 0 012 2v4M14 21v-4a2 2 0 012-2h4a2 2 0 012 2v4M14 10v-4a2 2 0 012-2h4a2 2 0 012 2v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Gestion
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default IntegrationBd;