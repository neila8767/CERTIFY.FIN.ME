import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from '../../../components/HeaderUniversity.jsx';
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

const API_BASE_URL = "http://localhost:5000";

const IntegrationEtudiant = () => {
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
      const response = await axios.post(`${API_BASE_URL}/students/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
      marginTop :'3.5rem',
      backgroundColor: '#effaf3',
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      <Header />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: '900px',
          marginTop :'5rem',
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
        <form onSubmit={handleUpload}>
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
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
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
                    </>
                  )}
                </div>
                <div style={{ 
                  fontSize: '0.75rem',
                  color: colors.textLight,
                  marginTop: '0.25rem'
                }}>
                  Format CSV uniquement (max 5MB)
                </div>
              </label>
            </div>
          </div>

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
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isUploading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: isUploading ? `${colors.accent}80` : colors.accent,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flex: 1
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
          </div>
        </form>

        {/* Résultat de l'upload */}
        {uploadResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: `1px solid ${uploadResult.status === 'success' ? colors.success : colors.error}`,
              marginTop: '1.5rem'
            }}
          >
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={uploadResult.status === 'success' ? colors.success : colors.error}>
                {uploadResult.status === 'success' ? (
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                )}
                <path d="M22 4L12 14.01l-3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <strong style={{ 
                color: uploadResult.status === 'success' ? colors.success : colors.error 
              }}>
                {uploadResult.status === 'success' ? 'Import réussi' : 'Erreur d\'import'}
              </strong>
            </div>
            <p style={{ 
              margin: '0.25rem 0',
              fontSize: '0.875rem',
              color: colors.textDark
            }}>
              {uploadResult.message}
            </p>
            {uploadResult.count && (
              <p style={{ 
                margin: '0.25rem 0',
                fontSize: '0.875rem',
                color: colors.textDark
              }}>
                <strong>Étudiants importés:</strong> {uploadResult.count}
              </p>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default IntegrationEtudiant;