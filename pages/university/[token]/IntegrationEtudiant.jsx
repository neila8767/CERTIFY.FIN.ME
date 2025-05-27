import React, { useState, useEffect } from "react";
import axios from "axios";
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

const IntegrationEtudiant = () => {
   const [showStudentExample, setShowStudentExample] = useState(false);

  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [academicYearInput, setAcademicYearInput] = useState("");
 const [academicYearError, setAcademicYearError] = useState("");
   const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
 const { token } = router.query;

  useEffect(() => {
    const universityId = localStorage.getItem('university_id');
    if (!universityId) return;

    const fetchFaculties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/faculties-by-university`, { 
          params: { universityId } 
        });
        setFaculties(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des facultés:", error);
      }
    };

    fetchFaculties();
  }, []);

  const handleFacultyChange = async (event) => {
    const facultyId = event.target.value;
    setSelectedFaculty(facultyId);
    setSelectedDepartment("");
    
    if (facultyId) {
      try {
        const response = await axios.get(`${API_BASE_URL}/departments/${facultyId}`, { 
          params: { facultyId } 
        });
        setDepartments(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des départements:", error);
      }
    }
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };
    
  const handleAcademicYearInput = async (e) => {
    const inputValue = e.target.value;
    setAcademicYearInput(inputValue);
    setAcademicYearError("");

    if (!/^\d{4}\/\d{4}$/.test(inputValue)) {
      setAcademicYearError("Le format doit être AAAA/AAAA");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/annee-universitaire`, { 
        annee: inputValue 
      });
      setSelectedAcademicYear(response.data.data.idAnnee);
    } catch (err) {
      setAcademicYearError(
        err.response?.data?.error || "Erreur serveur. Veuillez réessayer."
      );
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file || !selectedFaculty || !selectedDepartment || !selectedAcademicYear) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("facultyId", selectedFaculty);
    formData.append("departmentId", selectedDepartment);
    formData.append("anneeId", selectedAcademicYear);

    setIsUploading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/students/upload`, formData, 
          { headers: { Authorization: `Bearer ${token}` } }
      );
      setUploadResult(response.data);
    } catch (error) {
      console.error("Erreur lors de l'upload du fichier:", error);
      setUploadResult({ 
        status: "fail", 
        message: "Erreur lors de l'upload du fichier." 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleGoBack = () => {
    const token = localStorage.getItem('uni_token');
    if (token) {
      const safeToken = encodeURIComponent(token);
      router.push(`/university/${safeToken}`);
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
           marginTop :'5rem',
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.primary}>
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 style={{ 
              fontSize: '1.75rem',
              fontWeight: '500',
              margin: 0,
              color: colors.textDark
            }}>
              Intégration des étudiants
            </h1>
            <p style={{ 
              fontSize: '0.9rem',
              color: colors.textLight,
              margin: 0
            }}>
              Importation des données étudiantes
            </p>
          </div>
        </div>

        {/* Formulaire d'import */}
        <form onSubmit={handleUpload}>
        
        {/* Section d'import des étudiants */}
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
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="8.5" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 8v6M23 11h-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Importation des étudiants
    </h2>
    
    <button 
      type="button"
      onClick={() => setShowStudentExample(!showStudentExample)}
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
      {showStudentExample ? 'Masquer l\'exemple' : 'Voir l\'exemple'}
    </button>
  </div>

  {showStudentExample && (
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
        whiteSpace: 'pre',
        lineHeight: '1.5'
      }}>
        <span style={{ color: colors.primary, fontWeight: '500' }}>nom,prenom,email,matricule,telephone,dateNaissance,lieuNaissance,section,groupe,filiere,specialite,niveau,moyenneAnnuelle</span>{'\n'}
        Sow,Abdou,abdou.sow@email.com,MAT20230006,699000006,2003-05-10,Dakar,B,1,Informatique,Développement,1,18.5{'\n'}
        Ndiaye,Sana,sana.ndiaye@email.com,MAT20230007,699000007,2002-06-25,Dakar,A,2,Physique,Optique,2,19.0{'\n'}
        Zahra,Yasmina,yasmina.zahra@email.com,MAT20230008,699000008,2001-12-14,Alger,B,3,Chimie,Analytique,3,17.5{'\n'}
        Diop,Mamadou,mamadou.diop@email.com,MAT20230009,699000009,2000-11-02,Dakar,A,4,Economie,Finance,4,16.8{'\n'}
        Bamba,Ousmane,ousmane.bamba@email.com,MAT20230010,699000010,2002-02-19,Abidjan,B,1,Mathématiques,Algèbre,1,20.0{'\n'}
        Toure,Aissatou,aissatou.toure@email.com,MAT20230011,699000011,2003-03-23,Conakry,A,2,Informatique,Systèmes,2,19.5
      </div>
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: colors.textLight }}>
        Votre fichier CSV doit contenir ces colonnes exactement dans cet ordre.
      </p>
    </div>
  )}

  {/* Sélection de la faculté */}
  <div style={{ marginBottom: '1.5rem' }}>
    <label style={{
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: colors.textDark
    }}>
      Faculté
    </label>
    <select
      value={selectedFaculty}
      onChange={handleFacultyChange}
      required
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
      {faculties.length > 0 ? (
        faculties.map((fac) => (
          <option key={fac.idFaculty} value={fac.idFaculty}>
            {fac.nomFaculty}
          </option>
        ))
      ) : (
        <option value="">Aucune faculté disponible</option>
      )}
    </select>
  </div>

  {/* Sélection du département */}
  <div style={{ marginBottom: '1.5rem' }}>
    <label style={{
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: colors.textDark
    }}>
      Département
    </label>
    <select
      value={selectedDepartment}
      onChange={handleDepartmentChange}
      disabled={!selectedFaculty}
      required
      style={{
        width: '100%',
        padding: '0.75rem',
        border: `1px solid ${!selectedFaculty ? `${colors.border}80` : colors.border}`,
        borderRadius: '6px',
        fontSize: '0.875rem',
        outline: 'none',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23718096'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0.75rem center',
        backgroundSize: '16px',
        transition: 'all 0.2s ease',
        backgroundColor: !selectedFaculty ? `${colors.lightBg}80` : 'white'
      }}
    >
      <option value="">{selectedFaculty ? '-- Choisir un département --' : '-- Choisir d\'abord une faculté --'}</option>
      {departments.map((dept) => (
        <option key={dept.idDepart} value={dept.idDepart}>
          {dept.nomDepart}
        </option>
      ))}
    </select>
  </div>

  {/* Année académique */}
  <div style={{ marginBottom: '1.5rem' }}>
    <label style={{
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: colors.textDark
    }}>
      Année académique
    </label>
    <input
      type="text"
      value={academicYearInput}
      onChange={handleAcademicYearInput}
      placeholder="ex: 2024/2025"
      required
      style={{
        width: '100%',
        padding: '0.75rem',
        border: `1px solid ${academicYearError ? colors.error : colors.border}`,
        borderRadius: '6px',
        fontSize: '0.875rem',
        outline: 'none',
        transition: 'all 0.2s ease'
      }}
      onFocus={(e) => {
        e.target.style.borderColor = colors.primary;
        e.target.style.boxShadow = `0 0 0 2px ${colors.primary}20`;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = academicYearError ? colors.error : colors.border;
        e.target.style.boxShadow = 'none';
      }}
    />
    {academicYearError && (
      <p style={{ 
        fontSize: '0.75rem',
        color: colors.error,
        margin: '0.25rem 0 0',
        fontStyle: 'italic'
      }}>
        {academicYearError}
      </p>
    )}
  </div>

  {/* Upload de fichier */}
  <div style={{ marginBottom: '1.5rem' }}>
    <label style={{
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: colors.textDark
    }}>
      Fichier CSV des étudiants
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
        name="file"
        accept=".csv"
        onChange={handleFileChange}
        required
        style={{
          display: 'none'
        }}
        id="student-file-upload"
      />
      <label
        htmlFor="student-file-upload"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.textLight} style={{ marginBottom: '0.5rem' }}>
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
          Format CSV uniquement (max 5MB) - Voir l'exemple pour le format requis
        </div>
      </label>
    </div>
  </div>
  
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
     type="submit"
    disabled={isUploading}
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
    {isUploading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Import en cours...
                </>
              ) : (
      <>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Importer les étudiants
      </>
    )}
  </motion.button>

  {uploadResult && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      style={{
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '6px',
        border: `1px solid ${uploadResult.error ? colors.error : colors.success}`,
        marginTop: '1rem',
        color: uploadResult.error ? colors.error : colors.textDark
      }}
    >
      <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
        {uploadResult.error ? '❌ ' : '✅ '}
        {uploadResult.message}
      </p>
      {uploadResult.count && (
        <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
          <strong>Étudiants importés:</strong> {uploadResult.count}
        </p>
      )}
      {uploadResult.errors && uploadResult.errors.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.25rem', fontWeight: '500' }}>
            Erreurs détectées ({uploadResult.errors.length}):
          </p>
          <div style={{ 
            maxHeight: '200px',
            overflowY: 'auto',
            fontSize: '0.75rem',
            border: `1px solid ${colors.border}`,
            borderRadius: '4px',
            padding: '0.5rem'
          }}>
            {uploadResult.errors.map((err, index) => (
              <p key={index} style={{ margin: '0.15rem 0', color: colors.error }}>
                Ligne {err.line}: {err.message}
              </p>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )}
</motion.div>

          {/* Boutons d'action */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            gap: '1rem',
            marginTop: '2rem'
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
            
           
          </div>
        </form>

        
         
      </motion.div>
    </div>
  );
};

export default IntegrationEtudiant;