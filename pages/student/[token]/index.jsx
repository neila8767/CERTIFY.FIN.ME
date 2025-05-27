import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import Header from "../../../components/HeaderStudent.jsx"
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import axios from 'axios';

import { 
  FaLink,
  FaPrint, 
  FaShare ,
  FaExternalLinkAlt,
  FaCertificate,
  FaBook , 
  FaFlask,
  FaHashtag,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaArrowLeft,
  FaCheckCircle, 
  FaGraduationCap, 
  FaUniversity, 
  FaSchool, 
  FaSpinner, 
  FaCopy,
  FaInfoCircle
} from 'react-icons/fa';



function App() {
 
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
  const safeToken = encodeURIComponent(token || ''); 
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [step, setStep] = useState(1); // 1: Choix type, 2: Choix établissement, 3: Formulaire
  const [diplomaType, setDiplomaType] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [ecoles, setEcoles] = useState([]); 
  const [selectedUniversity, setSelectedUniversity] = useState(null);
   const [selectedEcole, setSelectedEcole] = useState(null);
    const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    studentName: '',
    email : '',
    birthDate: '',
    diplomaTitle: '',
    diplomaType: '',
    dateOfIssue: '',
    speciality: '',
    lieuNaissance : '',
    etablissement: '', 
    matricule : '',
    telephone : '', 
  });

  // Récupérer les universités avec compte
  useEffect(() => {
    if (step === 2 && diplomaType === 'Universite') {
      const fetchUniversities = async () => {
        try {
          const response = await axios.get('http://localhost:5000/universites-with-account');
          setUniversities(response.data);
        } catch (err) {
          console.error('Erreur lors de la récupération des universités:', err);
          setError('Impossible de charger les universités');
        }
      };
      fetchUniversities();
    }
     if (step === 2 && diplomaType === 'Ecole') {
      const fetchEcoles = async () => {
        try {
          const response = await axios.get('http://localhost:5000/ecoles-with-account');
         setEcoles(response.data);
         console.log("ecoles account ", response.data)
        } catch (err) {
          console.error('Erreur lors de la récupération des ecoles:', err);
          setError('Impossible de charger les ecooles');
        }
      };
      fetchEcoles();
    }

  }, [step, diplomaType]);

  const handleTypeSelection = (type) => {
    setDiplomaType(type);
    setFormData(prev => ({
      ...prev,
      diplomaType: type // Mise à jour du type de diplôme
    }));
    setStep(2);
  };

  const handleUniversitySelect = (university) => {
    setSelectedUniversity(university);
    setFormData(prev => ({
      ...prev,
      etablissement: university.nomUni
    }));
    setStep(3);
  };


  const handleEcoleSelect = (ecole) => {
    setSelectedEcole(ecole); 
    setFormData(prev => ({
      ...prev,
      etablissement: ecole.nomEcole
    }));
    setStep(3);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const formatDateForBackend = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Formatage des données avant envoi
      const formattedData = {
        ...formData,
        birthDate: formatDateForBackend(formData.birthDate),
        dateOfIssue: formatDateForBackend(formData.dateOfIssue)
      };

      console.log('Données envoyées:', formattedData); // Log pour débogage
       if (diplomaType === 'Universite') {
      const response = await axios.post('http://localhost:5000/demande-diplome', formattedData, {
           headers: { Authorization: `Bearer ${token}` }
      
      }) 
    if (response.data.success) {
        setSuccess({
          message: response.data.message,
          verificationMessage: response.data.verificationMessage,
          verificationLink: response.data.verificationLink,
          verificationRemarque: response.data.verificationRemarque,
          diplomaInfo: response.data.diplomaInfo
        });
      } else {
        setSuccess({
          message: response.data.message || 'Votre demande a été enregistrée',
          suggestion: response.data.suggestion
        });
      }};
       if (diplomaType === 'Ecole') {
      const response = await axios.post('http://localhost:5000/ecoles/demande-diplome', formattedData, {
           headers: { Authorization: `Bearer ${token}` }
      })
    if (response.data.success) {
        setSuccess({
          message: response.data.message,
          verificationMessage: response.data.verificationMessage,
          verificationLink: response.data.verificationLink,
          verificationRemarque: response.data.verificationRemarque,
          diplomaInfo: response.data.diplomaInfo
        });
      } else {
        setSuccess({
          message: response.data.message || 'Votre demande a été enregistrée',
          suggestion: response.data.suggestion
        });
      }}

    } catch (err) {
      console.error('Erreur:', err.response?.data || err);
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Chargement trop long, vérifiez la connexion");
        setAuthError("Timeout de chargement");
        setLoading(false);
      }
    }, 50000); // 10 secondes
  
    return () => clearTimeout(timeout);
  }, [loading]);
useEffect(() => {
  console.log("Token from URL:", token); // Debug
}, [token]);

  

  useEffect(() => {
    const verifyTokenAndLoadData = async () => {
      try {
        setLoading(true); // Commence le chargement
        setAuthError(null); // Reset les erreurs
  
        // 1. Vérification du token
        if (!token) {
          const storedToken = localStorage.getItem('student_token');
          if (storedToken) {
            router.push(`/student/${storedToken}`);
            return;
          }
          throw new Error("Token manquant");
        }
  
        // 2. Décodage et vérification
        const decoded = jwt.decode(token);
        console.log("Token décodé:", decoded);
  
        if (!decoded || decoded.role?.trim().toUpperCase() !== 'STUDENT') {
          throw new Error("Accès non autorisé");
        }
  
        // 3. Mise à jour du state et localStorage
        setStudentInfo({
          id: decoded.studentId,
          name: decoded.studentName,
          email : decoded.studentEmail , 
          prenom : decoded.studentPrenom
        });
  
        localStorage.setItem('student_token', token);
        localStorage.setItem('student_id', decoded.studentId);
        localStorage.setItem('student_name', decoded.studentName);
        localStorage.setItem('student_email', decoded.studentEmail);
        localStorage.setItem('student_prenom', decoded.studentPrenom);
  
      
      } catch (error) {
        console.error("Erreur:", error);
        setAuthError(error.message);
        localStorage.removeItem('student_token'); // Nettoyage
      } finally {
        setLoading(false); // <-- IMPORTANT: Toujours désactiver le loading
      }
    };
  
    verifyTokenAndLoadData();
  }, [token, router]);
  
  if (loading) return (
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

  if (authError) return (
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
      <h2 style={{ color: colors.accent }}>Erreur d'authentification</h2>
      <p>{authError}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/PageAcceuil/Login')}
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
        Retour à la connexion
      </motion.button>
    </div>
  );

if (success) {
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
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          maxWidth: '900px',
          margin: '2rem auto',
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
          border: `1px solid ${colors.border}`
        }}
      >
        {/* Titre avec icône animée */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: `1px solid ${colors.border}`
          }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 0.3,
              type: "spring",
              damping: 10,
              stiffness: 100
            }}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${colors.lightBg}, ${colors.border})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 12px ${colors.primary}20`
            }}
          >
            <FaCheckCircle size={28} color={colors.primary} />
          </motion.div>
          <div>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ 
                fontSize: '1.5rem',
                fontWeight: '550',
                margin: 0,
                color: colors.textDark,
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                width: 'fit-content'
              }}
            >
              Diplôme trouvé !
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ 
                fontSize: '1rem',
                color: colors.textLight,
                margin: '0.5rem 0 0',
                maxWidth: '80%'
              }}
            >
              Votre diplôme a été validé avec succès dans notre système.
            </motion.p>
          </div>
        </motion.div>

        {/* Section du lien de vérification */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            marginBottom: '2.5rem',
            padding: '2rem',
            backgroundColor: colors.lightBg,
            borderRadius: '16px',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}
        >
          <h2 style={{ 
            fontSize: '1.25rem',
            fontWeight: '600',
            margin: '0 0 1.5rem 0',
            color: colors.textDark,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <FaLink size={20} color={colors.primary} />
            Lien de vérification permanent
          </h2>

          <p style={{ 
            marginBottom: '1.5rem', 
            color: colors.textDark,
            lineHeight: '1.6'
          }}>
            Ce lien unique permet de vérifier l'authenticité de votre diplôme à tout moment.
            Partagez-le avec des employeurs ou des institutions pour validation instantanée.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.005 }}
            style={{
              backgroundColor: 'white',
              padding: '1.25rem',
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              wordBreak: 'break-all',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '4px',
              background: `linear-gradient(to bottom, ${colors.primary}, ${colors.accent})`
            }} />
            <a 
              href={success.verificationLink} 
              style={{
                color: colors.primary,
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '0.95rem',
                paddingLeft: '1rem',
                display: 'block'
              }}
             onClick={(e) => {
  e.preventDefault();
  navigator.clipboard.writeText(success.verificationLink);
  alert('Lien copié dans le presse-papiers !');
}}

            >
              {success.verificationLink}
            </a>
          </motion.div>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <motion.button
              whileHover={{ 
                scale: 1.03,
                boxShadow: `0 4px 12px ${colors.primary}30`
              }}
              whileTap={{ scale: 0.98 }}
             onClick={(e) => {
  e.preventDefault();
  navigator.clipboard.writeText(success.verificationLink);
  alert('Lien copié dans le presse-papiers !');
}}

              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: colors.primary,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flex: 1,
                maxWidth: '250px',
                boxShadow: `0 2px 8px ${colors.primary}20`
              }}
            >
              <FaCopy size={16} /> Copier le lien
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.03,
                boxShadow: `0 4px 12px ${colors.border}`
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open(success.verificationLink, '_blank')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'white',
                color: colors.textDark,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flex: 1,
                maxWidth: '250px'
              }}
            >
              <FaExternalLinkAlt size={14} /> Ouvrir
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              color: colors.error,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: `${colors.error}08`,
              borderRadius: '8px',
              border: `1px solid ${colors.error}20`
            }}
          >
            <FaInfoCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Usage sécurisé</strong>
              Ce lien contient des informations sensibles. Ne le partagez qu'avec des parties de confiance via notre plateforme sécurisée CertifyMe.
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Partie formulaire améliorée
return (
  <div style={{ 
    flex: 1,
    padding: '3rem',
    paddingTop: '0.25rem',
    backgroundColor: '#FFFF',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, sans-serif"
  }}>
    <Header token={token} />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        maxWidth: '1000px',
        margin: '2rem auto',
        padding: '3rem',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
        border: `1px solid ${colors.border}`
      }}
    >
      {/* Titre avec icône animée */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '2.5rem',
          paddingBottom: '1.5rem',
          borderBottom: `1px solid ${colors.border}`
        }}
      >
        <motion.div
          initial={{ rotate: -15, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ 
            type: "spring",
            damping: 10,
            stiffness: 100
          }}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${colors.lightBg}, ${colors.border})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 12px ${colors.primary}20`
          }}
        >
          <FaGraduationCap size={28} color={colors.primary} />
        </motion.div>
        <div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ 
              fontSize: '1.75rem',
              fontWeight: '500',
              margin: 0,
              color: colors.textDark,
              background: `linear-gradient(90deg, ${colors.textDark}, ${colors.textLight})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Demande de diplôme
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ 
              fontSize: '1rem',
              color: colors.textLight,
              margin: '0.5rem 0 0'
            }}
          >
            Suivez les étapes pour demander votre diplôme
          </motion.p>
        </div>
      </motion.div>

      {/* Indicateur d'étapes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '20px',
          right: '20px',
          height: '2px',
          backgroundColor: colors.border,
          zIndex: 1
        }} />
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 2
          }}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: step <= stepNumber ? colors.primary : colors.lightBg,
                color: step <= stepNumber ? 'white' : colors.textLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                border: `2px solid ${step <= stepNumber ? colors.primary : colors.border}`,
                marginBottom: '0.5rem'
              }}
            >
              {stepNumber}
            </motion.div>
            <span style={{
              fontSize: '0.8rem',
              color: step <= stepNumber ? colors.textDark : colors.textLight,
              fontWeight: step <= stepNumber ? '600' : '400'
            }}>
              {stepNumber === 1 ? 'Type' : stepNumber === 2 ? 'Établissement' : 'Informations'}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Étape 1: Choix du type de diplôme */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 style={{ 
            fontSize: '1.25rem',
            fontWeight: '500',
            margin: '0 0 2rem 0',
            color: colors.textDark,
            textAlign: 'center'
          }}>
            Sélectionnez le type du diplôme
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1.5rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <motion.button
              whileHover={{ 
                scale: 1.03,
                boxShadow: `0 8px 20px ${colors.primary}20`
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTypeSelection('Universite')}
              style={{
                padding: '2rem 1.5rem',
                backgroundColor: 'white',
                border: `2px solid ${colors.border}`,
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <motion.div
                whileHover={{ rotate: 5 }}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}40)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px ${colors.primary}20`
                }}
              >
                <FaUniversity size={32} color={colors.primary} />
              </motion.div>
              <div>
                <span style={{ 
                  fontWeight: '600', 
                  color: colors.textDark,
                  fontSize: '1.1rem',
                  display: 'block',
                  marginBottom: '0.25rem'
                }}>
                  Université
                </span>
                <span style={{
                  fontSize: '0.85rem',
                  color: colors.textLight
                }}>
                  Diplôme universitaire
                </span>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.03,
                boxShadow: `0 8px 20px ${colors.accent}20`
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTypeSelection('Ecole')}
              style={{
                padding: '2rem 1.5rem',
                backgroundColor: 'white',
                border: `2px solid ${colors.border}`,
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <motion.div
                whileHover={{ rotate: 5 }}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${colors.accent}20, ${colors.accent}40)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px ${colors.accent}20`
                }}
              >
                <FaSchool size={32} color={colors.accent} />
              </motion.div>
              <div>
                <span style={{ 
                  fontWeight: '600', 
                  color: colors.textDark,
                  fontSize: '1.1rem',
                  display: 'block',
                  marginBottom: '0.25rem'
                }}>
                  École
                </span>
                <span style={{
                  fontSize: '0.85rem',
                  color: colors.textLight
                }}>
                  Diplôme d'école
                </span>
              </div>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Étape 2: Choix de l'établissement */}
      {(step === 2 && (diplomaType === 'Universite' || diplomaType === 'Ecole')) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setStep(1)}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: colors.lightBg,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <FaArrowLeft size={16} />
            </motion.button>
            <h2 style={{ 
              fontSize: '1.25rem',
              fontWeight: '500',
              margin: 0,
              color: colors.textDark
            }}>
              Sélectionnez votre {diplomaType === 'Universite' ? 'université' : 'école'}
            </h2>
          </div>

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '3rem',
                color: colors.textLight
              }}
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  width: '60px',
                  height: '60px',
                  marginBottom: '1.5rem'
                }}
              >
                <FaSpinner size={60} />
              </motion.div>
              <p>Chargement des établissements...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ 
                padding: '1.5rem',
                backgroundColor: `${colors.error}08`,
                color: colors.error,
                borderRadius: '12px',
                border: `1px solid ${colors.error}30`,
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem'
              }}
            >
              <FaExclamationTriangle size={20} style={{ marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Erreur de chargement</strong>
                {error}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {(diplomaType === 'Universite' ? universities : ecoles).map((establishment, index) => (
                <motion.div
                  key={establishment.idUni || establishment.IdEcole}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: `0 10px 20px ${colors.border}`
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => diplomaType === 'Universite' ? 
                    handleUniversitySelect(establishment) : 
                    handleEcoleSelect(establishment)}
                  style={{
                    padding: '1.75rem',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '16px',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '4px',
                    background: `linear-gradient(to bottom, ${colors.primary}, ${colors.accent})`
                  }} />
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      backgroundColor: `${colors.primary}10`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {diplomaType === 'Universite' ? 
                        <FaUniversity size={22} color={colors.primary} /> : 
                        <FaSchool size={22} color={colors.accent} />}
                    </div>
                    <h4 style={{ 
                      margin: 0, 
                      color: colors.textDark,
                      fontSize: '1.1rem',
                      fontWeight: '600'
                    }}>
                      {establishment.nomUni || establishment.nomEcole}
                    </h4>
                  </div>
                  <p style={{ 
                    margin: 0, 
                    color: colors.textLight,
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    paddingLeft: '4.5rem'
                  }}>
                    {establishment.adresseUni || establishment.adresseEcole}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}

            
               
      {/* Étape 3: Formulaire de demande */}
      {step === 3 && (
        <form onSubmit={handleSubmit}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setStep(2)}
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: colors.lightBg,
                border: `1px solid ${colors.border}`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              &larr;
            </motion.button>
            <h2 style={{ 
              fontSize: '1.1rem',
              fontWeight: '600',
              margin: 0,
              color: colors.textDark
            }}>
              Informations du diplôme
            </h2>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            {/* Colonne 1 */}
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: colors.textDark,
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  Établissement
                </label>
                <input
                  type="text"
                  name="etablissement"
                  value={formData.etablissement}
                  readOnly
                  style={{
                    width: '95%',
                    padding: '0.8rem',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: colors.lightBg,
                    color: colors.textLight,
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: colors.textDark,
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  Nom complet
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '95%',
                    padding: '0.8rem',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: colors.textDark,
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '95%',
                    padding: '0.8rem',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: colors.textDark,
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  Date de naissance
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '95%',
                    padding: '0.8rem',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: colors.textDark,
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  Lieu de Naissance
                </label>
                <input
                  type="text"
                  name="lieuNaissance"
                  value={formData.lieuNaissance}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '95%',
                    padding: '0.8rem',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
            </div>

            {/* Colonne 2 */}
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: colors.textDark,
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  Titre du diplôme
                </label>
                <input
                  type="text"
                  name="diplomaTitle"
                  value={formData.diplomaTitle}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '95%',
                    padding: '0.8rem',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: colors.textDark,
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  Spécialité
                </label>
                <input
                  type="text"
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '95%',
                    padding: '0.8rem',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: colors.textDark,
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  Date d'obtention
                </label>
                <input
                  type="date"
                  name="dateOfIssue"
                  value={formData.dateOfIssue}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '95%',
                    padding: '0.8rem',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: colors.textDark,
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  Numéro de matricule
                </label>
                <input
                  type="text"
                  name="matricule"
                  value={formData.matricule}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '95%',
                    padding: '0.8rem',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: colors.textDark,
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '95%',
                    padding: '0.8rem',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                padding: '1rem',
                backgroundColor: `${colors.error}10`,
                color: colors.error,
                borderRadius: '6px',
                border: `1px solid ${colors.error}`,
                marginBottom: '1.5rem',
                fontSize: '0.875rem'
              }}
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {loading ? (
              <>
                <FaSpinner className="spin" size={16} /> Envoi en cours...
              </>
            ) : (
              'Soumettre la demande'
            )}
          </motion.button>
        </form>
      )}
    </motion.div>
  </div>
);
};

export default App;