import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/router';
import Header from "../../../components/HeaderEcole.jsx";
import { motion } from 'framer-motion';



const IntegrationEtudiantEcole = () => {
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
      const [showStudentExample, setShowStudentExample] = useState(false);
      const [formations, setFormations] = useState([]);
  const [selectedFormation, setSelectedFormation] = useState("");
  const [academicYearInput, setAcademicYearInput] = useState("");
  const [academicYearError, setAcademicYearError] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
   const router = useRouter();
  const [state, setState] = useState({
    ecoleId: '',
    formations: [],
    selectedFormation: '',
    anneeScolaire: ``,
    file: null,
    isLoading: false,
    progress: 0,
    result: null
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = typeof window !== 'undefined' ? localStorage.getItem('ecole_token') : null;

  // Charger les formations au montage
  useEffect(() => {
    const loadData = async () => {
      const id = localStorage.getItem('ecole_id');
      if (!id) return;

      try {
        const [formationsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/ecoles/${id}/formations`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setState(prev => ({
          ...prev,
          ecoleId: id,
          formations: formationsRes.data
        }));
      } catch (error) {
        console.error("Erreur de chargement:", error);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setState(prev => ({
      ...prev,
      file: e.target.files[0],
      result: null
    }));
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
      const response = await axios.post(`${API_BASE_URL}/annee-ecole`, { 
        annee: inputValue 
      },  {
        headers: { Authorization: `Bearer ${token}` } 
         ,  validateStatus: function (status) {
    return status >= 200 && status < 300; // accepte tous les 2xx
  }
     } );
      setState(prev => ({
          ...prev,
          anneeScolaire : response.data.data.id
        }));
      console.log("hellooo", response.data.data.id)
    }  catch (err) {
  console.error("Erreur Axios complète :", err); // 👈 très utile
  setAcademicYearError(
    err.response?.data?.error || "Erreur serveur. Veuillez réessayer."
  );
}

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!state.file || !state.selectedFormation) {
      setState(prev => ({
        ...prev,
        result: {
          status: 'error',
          message: 'Veuillez sélectionner une formation et un fichier CSV'
        }
      }));
      return;
    }


    setState(prev => ({ ...prev, isLoading: true, progress: 0 }));

    const formData = new FormData();
    formData.append('file', state.file);
    formData.append('formationId', state.selectedFormation);
    formData.append('annee',  state.anneeScolaire );
    formData.append('ecoleId', state.ecoleId);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/etudiants-ecole/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setState(prev => ({ ...prev, progress: percentCompleted }));
        }
      });

      setState(prev => ({
        ...prev,
        result: {
          status: 'success',
          message: `Import réussi : ${response.data.count} étudiants`,
          details: response.data
        },
        file: null
      }));

    } catch (error) {
      console.error('Erreur upload:', error);
      setState(prev => ({
        ...prev,
        result: {
          status: 'error',
          message: error.response?.data?.message || 'Erreur lors de l\'import',
          details: error.response?.data
        }
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
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
    }}

    const handleGoBack = () => {
    router.push(`/ecole/${token}`);
 
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
          marginTop: '5rem',
          margin: '2rem auto',
          padding: '2rem',
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
        <form onSubmit={handleSubmit}>
        
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
                  <span style={{ color: colors.primary, fontWeight: '500' }}>nom,prenom,email,matricule,moyenne,dateInscription,telephone,dateNaissance,lieuNaissance</span>{'\n'}
                  Collin,Patricia,patricia.collin@email.com,MAT202300001,19.1,2025-05-20T18:57:22.343006,020487647,2004-05-05,Bodin{'\n'}
                  Joly,Roland,roland.joly@email.com,MAT202300002,18.5,2025-05-20T18:57:22.343192,+33119489,2000-01-04,Georges{'\n'}
                  Vaillant,Eugène,eugène.vaillant@email.com,MAT202300003,16.5,2025-05-20T18:57:22.343323,066593877,2001-08-06,Saint Éric{'\n'}
                  Fouquet,Zoé,zoé.fouquet@email.com,MAT202300004,15.6,2025-05-20T18:57:22.343404,010975351,2004-03-17,Dupuis{'\n'}
                  Blanchard,Suzanne,suzanne.blanchard@email.com,MAT202300005,17.1,2025-05-20T18:57:22.343484,041158714,2001-11-09,Sainte Sylvie-sur-Mer
                </div>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: colors.textLight }}>
                  Votre fichier CSV doit contenir ces colonnes exactement dans cet ordre.
                </p>
              </div>
            )}

            {/* Sélection de la formation */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: colors.textDark
              }}>
                Formation
              </label>
              <select
                name="selectedFormation"
                value={state.selectedFormation}
                onChange={handleInputChange}
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
                <option value="">-- Choisir une formation --</option>
                {state.formations.map((formation) => (
                  <option key={formation.idFormation} value={formation.idFormation}>
                    {formation.nomFormation} ({formation.typeFormation})
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
                backgroundColor: state.file ? `${colors.lightBg}80` : 'white'
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
                    {state.file ? (
                      <span style={{ color: colors.primary, fontWeight: '500' }}>
                        {state.file.name}
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
              disabled={state.isLoading}
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
              {state.isLoading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Import en cours... {state.progress}%
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

            {state.result && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{
                  padding: '1rem',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  border: `1px solid ${state.result.status === 'error' ? colors.error : colors.success}`,
                  marginTop: '1rem',
                  color: state.result.status === 'error' ? colors.error : colors.textDark
                }}
              >
                <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
                  {state.result.status === 'error' ? '❌ ' : '✅ '}
                  {state.result.message}
                </p>
                {state.result.count && (
                  <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
                    <strong>Étudiants importés:</strong> {state.result.count}
                  </p>
                )}
                {state.result.details?.errors && state.result.details.errors.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '0.25rem', fontWeight: '500' }}>
                      Erreurs détectées ({state.result.details.errors.length}):
                    </p>
                    <div style={{ 
                      maxHeight: '200px',
                      overflowY: 'auto',
                      fontSize: '0.75rem',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '4px',
                      padding: '0.5rem'
                    }}>
                      {state.result.details.errors.map((err, index) => (
                        <p key={index} style={{ margin: '0.15rem 0', color: colors.error }}>
                          {err}
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

export default IntegrationEtudiantEcole;