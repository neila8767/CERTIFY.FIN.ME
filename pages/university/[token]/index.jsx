// Importation des dépendances nécessaires
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import jwt from 'jsonwebtoken';
import Header from '../../../components/HeaderUniversity.jsx';
import { motion, AnimatePresence } from 'framer-motion';

function UniversityPage() {
  const router = useRouter();
  const { token } = router.query;

  // États d'authentification
  const [universityInfo, setUniversityInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // États des données
  const [faculties, setFaculties] = useState([]);
 
  const [departments, setDepartments] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [levels, setLevels] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [annees, setAnnees] = useState([]);
  
  // États de l'interface
  const [etudiantsSelectionnes, setEtudiantsSelectionnes] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [titreDiplome, setTitreDiplome] = useState("");
  const [searchError, setSearchError] = useState(null);
  const [searchMatricule, setSearchMatricule] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [customDiplomaName, setCustomDiplomaName] = useState("");
  const [showRedirectionMessage, setShowRedirectionMessage] = useState(false);   

  // Filtres
  const [filters, setFilters] = useState({
    anneeId: "",
    facultyId: "",
    departmentId: "",
    specialty: "",
    level: "",
    section: "",
  });

  // URL de base de l'API
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  // Vérification du token et chargement des données initiales
  useEffect(() => {
    const verifyTokenAndLoadData = async () => {
      if (!token) {
        setAuthError("Token manquant");
        setLoading(false);
        return;
      }

      try {
        const decoded = jwt.decode(token);
        console.log("Token décodé :", decoded);
        // Vérification et décodage du token
        console.log("Decoded token role :", decoded?.role);
console.log("Type de role :", typeof decoded?.role);

        
        
        if (!decoded || (decoded.role?.trim().toUpperCase() !== 'UNIVERSITY')) {
          throw new Error("Accès non autorisé");
        }
        
        // Stockage des infos de l'université
        setUniversityInfo({
          id: decoded.universityId,
          name: decoded.universityName,
          walletAddress: decoded.walletAddress
        });
           // Stockage local de l'ID
          localStorage.setItem('university_id', decoded.universityId);
          localStorage.setItem('university_name', decoded.universityName);


        // Chargement des données initiales
        await Promise.all([
          loadUniversityData(decoded.universityId),
          loadAnneesUniversitaire()
        ]);

      } catch (error) {
        console.error("Erreur d'authentification:", error);
        setAuthError(error.message);
        router.push('/PageAcceuil/Login');
      } finally {
        setLoading(false);
      }
    };

    verifyTokenAndLoadData();
  }, [token]);
     
  useEffect(() => {
    console.log("Token reçu dans l'URL:", token); 
    const universityId = localStorage.getItem('university_id');
    console.log("universityId récupéré :", universityId);
   }, [token]);
    
  // Chargement des données de l'université
  const loadUniversityData = async (universityId) => {
    try {
        console.log("URL complète appelée :", `${API_BASE_URL}/faculties/${universityId}`);
      console.log("Token utilisé pour la requête:", token); // Debug
      
        const response = await axios.get(`${API_BASE_URL}/faculties/${universityId}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
    
        // Gestion des réponses vides
        if (response.data.success) {
          setFaculties(response.data.data);
          if (response.data.data.length === 0) {
            console.warn("Aucune faculté trouvée");
          }
        }
    
      } catch (error) {
        if (error.response?.status === 404) {
          // Cas où l'API retourne volontairement 404
          setFaculties([]); // Réinitialise à un tableau vide
          console.warn(error.response.data.message);
        } else {
          console.error("Erreur:", error);
          if (error.response?.status === 401) {
            router.push('/PageAcceuil/Login');
          }
        }
      }
    };
  
    //stockage 

  useEffect(() => {
    if (!token && typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('uni_token');
      if (storedToken) {
        router.push(`/university/${storedToken}`);
      }
    }
  }, []);

  // Chargement des années universitaires
  const loadAnneesUniversitaire = async () => {
    const universityId = localStorage.getItem('university_id');
   
    try {
      const response = await axios.get(`${API_BASE_URL}/annee-uniID/${universityId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.data) {
        setAnnees(response.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des années de l’université :", error);
    }
  };

  
  // Chargement des étudiants par année
  useEffect(() => {
    const fetchStudents = async () => {
      if (!filters.anneeId) {
        setStudents([]);
        setAllStudents([]);
        return;
      }

      try {
        const res = await axios.get(
          `${API_BASE_URL}/students-by-annee/${filters.anneeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setStudents(res.data || []);
        setAllStudents(res.data || []);
      } catch (error) {
        console.error("Erreur de chargement des étudiants:", error);
        setStudents([]);
        setAllStudents([]);
      }
    };

    fetchStudents();
  }, [filters.anneeId, token]);

  // Chargement des départements lorsque la faculté change
  useEffect(() => {
    if (filters.facultyId) {
      const fetchDepartments = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/departments/${filters.facultyId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setDepartments(response.data || []);
        } catch (error) {
          console.error("Erreur de chargement des départements:", error);
          setDepartments([]);
        }
      };

      fetchDepartments();
    } else {
      setDepartments([]);
    }
  }, [filters.facultyId, token]);

  // Chargement des filtres dynamiques
  useEffect(() => {
    const loadDynamicFilters = async () => {
      try {
        const requests = [];
        
        if (filters.facultyId) {
          requests.push(axios.get(
            `${API_BASE_URL}/departments/${filters.facultyId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ));
        }
        if (filters.departmentId) {
          requests.push(axios.get(
            `${API_BASE_URL}/specialties/${filters.departmentId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ));
        }
        if (filters.specialty) {
          requests.push(axios.get(
            `${API_BASE_URL}/levels/${filters.specialty}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ));
        }
        if (filters.level) {
          requests.push(axios.get(
            `${API_BASE_URL}/sections/${filters.level}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ));
        }

        const responses = await Promise.all(requests);
        
        // Mise à jour des états en fonction des réponses
        if (filters.facultyId) setDepartments(responses[0]?.data || []);
        if (filters.departmentId) setSpecialties(responses[1]?.data.map(s => ({ specialite: s.specialite })) || []);
        if (filters.specialty) setLevels(responses[2]?.data.map(l => ({ niveau: l.niveau })) || []);
        if (filters.level) setSections(responses[3]?.data.map(sec => ({ section: sec.section })) || []);
        
      } catch (error) {
        console.error("Erreur de chargement des filtres:", error);
      }
    };

    loadDynamicFilters();
  }, [filters.facultyId, filters.departmentId, filters.specialty, filters.level, token]);

  // Filtrage des étudiants
  useEffect(() => {
    if (allStudents.length === 0) return;

    const filteredStudents = allStudents.filter(student => {
      if (!student.CursusUniversitaire || student.CursusUniversitaire.length === 0) {
        return false;
      }

      const cursus = filters.anneeId 
        ? student.CursusUniversitaire.find(c => c.idAnnee === Number(filters.anneeId))
        : student.CursusUniversitaire[0];

      if (!cursus) return false;

      return (
        (!filters.anneeId || cursus.idAnnee === Number(filters.anneeId)) &&
        (!filters.facultyId || cursus.idFaculty === Number(filters.facultyId)) &&
        (!filters.departmentId || cursus.idDepart === Number(filters.departmentId)) &&
        (!filters.specialty || cursus.specialite === filters.specialty) &&
        (!filters.level || cursus.niveau === Number(filters.level)) &&
        (!filters.section || cursus.section === filters.section)
      );
    });

    setStudents(filteredStudents);
  }, [filters, allStudents]);

  // Gestion de la recherche par matricule
  const handleSearch = async () => {
    if (!filters.anneeId) {
      setSearchError("Veuillez sélectionner une année universitaire");
      return;
    }

    try {
      setSearchError(null);
      const response = await axios.get(
        `${API_BASE_URL}/students/${searchMatricule}?anneeId=${filters.anneeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const result = Array.isArray(response.data) ? response.data : [response.data];
      setStudents(result);
      setSearchMode(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setSearchError("Aucun étudiant trouvé avec ce matricule");
      } else {
        console.error("Erreur de recherche:", err);
        setSearchError("Erreur lors de la recherche");
      }
      setStudents([]);
    }
  };

  // Gestion du retour en arrière dans les filtres
  const handleBack = () => {
    if (searchMode) {
      setStudents(allStudents);
      setSearchMode(false);
      setSearchMatricule("");
      return;
    }

    const activeFilters = {
      section: () => setFilters(prev => ({ ...prev, section: "" })),
      level: () => setFilters(prev => ({ ...prev, level: "", section: "" })),
      specialty: () => setFilters(prev => ({ ...prev, specialty: "", level: "", section: "" })),
      departmentId: () => setFilters(prev => ({ ...prev, departmentId: "", specialty: "", level: "", section: "" })),
      facultyId: () => setFilters(prev => ({ ...prev, facultyId: "", departmentId: "", specialty: "", level: "", section: "" })),
      anneeId: () => setFilters({ anneeId: "", facultyId: "", departmentId: "", specialty: "", level: "", section: "" })
    };

    const filterOrder = ['section', 'level', 'specialty', 'departmentId', 'facultyId', 'anneeId'];
    for (const filter of filterOrder) {
      if (filters[filter]) {
        activeFilters[filter]();
        return;
      }
    }
  };

  // Gestion du changement de filtre
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filterName]: value };
      
      // Réinitialisation en cascade
      if (filterName === 'anneeId') {
        newFilters.facultyId = "";
        newFilters.departmentId = "";
        newFilters.specialty = "";
        newFilters.level = "";
        newFilters.section = "";
      } else if (filterName === 'facultyId') {
        newFilters.departmentId = "";
        newFilters.specialty = "";
        newFilters.level = "";
        newFilters.section = "";
      } else if (filterName === 'departmentId') {
        newFilters.specialty = "";
        newFilters.level = "";
        newFilters.section = "";
      } else if (filterName === 'specialty') {
        newFilters.level = "";
        newFilters.section = "";
      } else if (filterName === 'level') {
        newFilters.section = "";
      }
      
      return newFilters;
    });
  };

  // Gestion de la sélection des étudiants
  const handleCheckboxChange = (id) => {
    setEtudiantsSelectionnes(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allIds = students.map(student => student.idEtudiant);
    setEtudiantsSelectionnes(allIds);
  };

  // Gestion de la création de diplômes
  const handleCreationDiplomes = () => {
    setFormVisible(true);
  };

 const closeModal = () => {
  setFormVisible(false);
  setTitreDiplome("");
  setCustomDiplomaName("");
};

const confirmerCreationDiplomes = async () => {
  try {
    const universityName = localStorage.getItem('university_name');
    const universityId = localStorage.getItem('university_id');
    console.log("Université nom :", universityName);
    console.log("Université ID :", universityId);

    // === Vérification de l'existence du modèle de diplôme ===
    let hasModele = false;
    try {
      const checkRes = await axios.get(`${API_BASE_URL}/universities/${universityId}/verifier-modele`);
      console.log("Résultat de vérification du modèle :", checkRes.data);
      hasModele = checkRes.data.hasModele;
    } catch (modelError) {
      console.error("Erreur lors de la vérification du modèle :", modelError);
      alert("Erreur lors de la vérification du modèle de diplôme.");
      return;
    }

    if (!hasModele) {
      setShowRedirectionMessage(true);
      return;
    }

    // Déterminez le nom final du diplôme
    const finalDiplomaName = titreDiplome === "AUTRE DIPLOME" 
      ? customDiplomaName 
      : titreDiplome;

    // === Vérification des étudiants ===
    const response = await axios.post(
      `${API_BASE_URL}/verifier-etudiants`,
      etudiantsSelectionnes,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      const payload = {
        anneeId: filters.anneeId,
        titreDiplome: finalDiplomaName,
        typeDiplome: "Universite",
        etudiants: etudiantsSelectionnes.map(id => ({ idEtudiant: id })),
        universityName: universityName
      };

      const creation = await axios.post(
        `${API_BASE_URL}/creer-diplomes`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (creation.data.success) {
        alert("🎓 Diplômes créés avec succès !");
        closeModal();
      } else {
        alert("❌ Une erreur est survenue lors de la création.");
      }
    }
  } catch (error) {
    if (error.response?.status === 404) {
      const nonTrouves = error.response.data.etudiantsNonTrouves;
      alert(`⚠️ Certains étudiants ne sont pas reconnus:\n${nonTrouves.map(e => `${e.prenom} ${e.nom}`).join('\n')}`);
    } else {
      console.error("Erreur globale :", error);
      alert("Erreur serveur");
    }
  }
};


  // Récupération du cursus pour l'année sélectionnée
  const getCursusForSelectedYear = (student) => {
    if (!filters.anneeId || !student.CursusUniversitaire) return null;
    return student.CursusUniversitaire.find(c => c.idAnnee === Number(filters.anneeId));
  };

  // Variables d'état de l'interface
  const hasActiveFilters = Object.values(filters).some(val => val !== "" && val !== null);
  const shouldShowEmptyState = !filters.anneeId || students.length === 0;

  if (loading) return <div>Chargement...</div>;
  if (authError) return <div>Erreur d'authentification: {authError}</div>;
  if (!universityInfo) return <div>Accès non autorisé</div>;


 
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

return (
   <>
{showRedirectionMessage && (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 9999
  }}>
    <div style={{
      background: 'white', padding: '2rem', borderRadius: '8px',
      maxWidth: '500px', textAlign: 'center'
    }}>
      <h3>⚠️ Modèle de diplôme manquant</h3>
      <p>Vous devez d'abord choisir un modèle de diplôme afin que vous puissiez créer des diplômes aux étudiants.</p>
      <button
          onClick={() => router.push(`/university/${token}/ChoixModeleDiplome`)}
         style={{
          marginTop: '1rem',
          backgroundColor: '#3498db',
          color: 'white',
          padding: '0.6rem 1.2rem',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Aller au choix du modèle
      </button>
    </div>
  </div>
)}


  <div className="App" style={{ 
    backgroundColor: "#FFFF"
,    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    display: "flex",
    flexDirection: "column"
  }}>
    <Header token={token} />
    
    <main style={{
      flex: 1,
       padding: '3rem',
      paddingTop: '6rem'
    }}>
     {/* Section principale - Version raffinée */}
 {/* Section principale - Version luxe & élégante raffinée */}
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  style={{
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    overflow: "hidden",
    marginBottom: "1rem",
    border: `1px solid ${colors.border}30`,
    position: "relative",
    background: "linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%)",
    ":before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "4px",
      background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
      zIndex: 1
    }
  }}
>
  {/* En-tête prestige raffiné */}
  <div style={{
    padding: "0.75rem 2.5rem",
    borderBottom: `1px solid ${colors.darkBg}30`,
    background: "linear-gradient(135deg, rgba(250,250,252,1) 0%, rgba(245,246,248,1) 100%)",
    position: "relative",
    overflow: "hidden",
    ":after": {
      content: '""',
      position: "absolute",
      bottom: "-50px",
      right: "-50px",
      width: "120px",
      height: "120px",
      background: `radial-gradient(circle, ${colors.primary}05 0%, transparent 70%)`,
      borderRadius: "50%"
    }
  }}>
    {/* Titre avec effet prestige raffiné */}
    <div style={{ 
      marginBottom: "1.25rem",
      textAlign: "left",
      position: "relative",
      zIndex: 2
    }}>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        marginBottom: "1.25rem",
        gap: "0.75rem"
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
        
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={colors.primary}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
        
        <div>
          <h1 style={{ 
            fontSize: "2rem",
            fontWeight: "550",
            margin: "0 0 0.25rem 0",
            textAlign: "left",
            color: colors.textDark,
            letterSpacing: "-0.5px",
            background: `linear-gradient(90deg, ${colors.textDark} 0%, ${colors.primary} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Création de Diplômes 
          </h1>
          <p style={{ 
            fontSize: "0.875rem",
            color: colors.textLight,
            margin: 0,
            fontStyle: "italic",
            opacity: 0.8
          }}>
            Recherche avancée et édition des étudiants par critères académiques
          </p>
        </div>
      </div>
    </div>

    {/* Barre de recherche prestige raffinée */}
    <div style={{
      display: "flex",
      gap: "0.75rem",
      alignItems: "center",
      width: "100%",
      position: "relative",
      zIndex: 2
    }}>
      {/* Barre de recherche élégante */}
      <div style={{
        position: "relative",
        flex: 1,
        minWidth: "250px"
      }}>
        <input
          type="text"
          placeholder="Rechercher par matricule..."
          value={searchMatricule}
          onChange={(e) => setSearchMatricule(e.target.value)}
          style={{
            padding: "0.75rem 1rem 0.75rem 3rem",
            borderRadius: "8px",
            border: `1px solid ${colors.primary}30`,
            width: "100%",
            fontSize: "0.9375rem",
            outline: "none",
            backgroundColor: "rgba(255,255,255,0.9)",
            color: colors.textDark,
            height: "48px",
            boxSizing: "border-box",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
            transition: "all 0.3s ease",
            ":focus": {
              borderColor: `${colors.primary}60`,
              boxShadow: `0 0 0 2px ${colors.primary}15`
            }
          }}
        />
        <div style={{
          position: "absolute",
          left: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
          color: colors.textLight,
          pointerEvents: "none",
          opacity: 0.6
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"/>
            <path d="M21 21L16.65 16.65"/>
          </svg>
        </div>
      </div>
    
      {/* Bouton Retour - version prestige raffinée */}
      {(searchMode || filters.facultyId) && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleBack}
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "white",
            color: colors.textDark,
            border: `1px solid ${colors.border}20`,
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            transition: "all 0.2s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
        </motion.button>
      )}

      {/* Bouton Rechercher - version prestige raffinée */}
      <motion.button
        whileHover={{ scale: 1.02, boxShadow: `0 4px 12px ${colors.accent}20` }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSearch}
        style={{
          padding: "0 0.5rem",
          backgroundColor: "white",
              color: colors.accent,
              border: `1px solid ${colors.accent}`,
    
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "0.75rem",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          height: "48px",
          transition: "all 0.2s ease",
          textTransform: "uppercase",
          letterSpacing: "0.5px"
           
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        Rechercher
      </motion.button>
    </div>
  </div>

  {/* Section des filtres - version prestige raffinée */}
  {!searchMode && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        padding: "0.25rem 2.5rem",
        borderBottom: `3px solid ${colors.border}15`,
        background: "white",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Dégradé décoratif subtil */}
      <div style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "200px",
        height: "200px",
        background: `radial-gradient(circle at 70% 30%, ${colors.primary}03 0%, transparent 70%)`,
        zIndex: 0
      }}></div>
      
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: "1rem",
        position: "relative",
        zIndex: 1
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "0.75rem",
          background: "rgba(255,255,255,0.8)",
          padding: "0.75rem 1rem",
        
          borderRadius: "50px",
          backdropFilter: "blur(4px)",
          border: `1px solid ${colors.border}15`,
          boxShadow: "0 1px 4px rgba(0,0,0,0.02)"
        }}>
          <div style={{
            width: "26px",
            height: "26px",
            borderRadius: "10px",
            background: "#FFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2.2" strokeLinecap="round">
              <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
          </div>
          <h3 style={{
  color: colors.textDark,
  fontSize: "1.125rem",
  fontWeight: 500,
  margin: 0,
  letterSpacing: "0.3px",
  fontFamily: "'Inter', 'Poppins', 'Segoe UI', 'Roboto', sans-serif"
}}>
            Critères académiques
          </h3> 
        </div>

        {(hasActiveFilters && !searchMode) && (
          <motion.button
            whileHover={{ scale: 1.01, boxShadow: `0 2px 6px ${colors.error}15` }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilters({
              anneeId: '',
              facultyId: '',
              departmentId: '',
              specialty: '',
              level: '',
              section: ''
            })}
            style={{
              padding: "0.65rem 1.25rem",
              backgroundColor: "white",
              color: colors.error,
              border: `1px solid ${colors.error}30`,
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: `0 1px 3px ${colors.error}05`,
              transition: "all 0.2s ease"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Réinitialiser
          </motion.button>
        )}
      </div>

      {/* Grille de filtres améliorée */}
      <div style={{
        display: "grid",
         marginBottom: "1.5rem",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "1.25rem",
        position: "relative",
        zIndex: 1
      }}>
        {/* Filtre Année Universitaire - version prestige raffinée */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "0.5rem",
            color: colors.textDark,
            fontSize: "0.875rem",
            fontWeight: "500",
            paddingLeft: "0.25rem"
          }}>
            Année universitaire
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={filters.anneeId || ""}
              onChange={(e) => handleFilterChange("anneeId", e.target.value)}
              style={{ 
                padding: "0.75rem 1rem 0.75rem 2.75rem",
                borderRadius: "8px",
                border: `1px solid ${colors.darkBg}30`,
                width: "100%",
                backgroundColor: "rgba(255,255,255,0.9)",
                color: colors.textDark,
                fontSize: "0.9375rem",
                cursor: "pointer",
                appearance: "none",
                outline: "none",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                ":hover": {
                  borderColor: `${colors.border}40`
                },
                ":focus": {
                  borderColor: `${colors.primary}60`,
                  boxShadow: `0 0 0 2px ${colors.primary}15`
                }
              }}
            >
              <option value="">Sélectionnez une année</option>
              {annees.map((annee) => (
                <option key={annee.idAnnee} value={annee.idAnnee}>
                  {annee.annee} {annee.isCurrent && "(actuelle)"}
                </option>
              ))}
            </select>
            <div style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: colors.textLight,
              pointerEvents: "none",
              opacity: 0.6
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              opacity: 0.4
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Filtres conditionnels - version prestige raffinée */}
        {filters.anneeId && (
          <>
            <div>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                color: colors.textDark,
                fontSize: "0.875rem",
                fontWeight: "500",
                paddingLeft: "0.25rem"
              }}>
                Faculté
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={filters.facultyId}
                  onChange={(e) => handleFilterChange("facultyId", e.target.value)}
                  style={{ 
                    padding: "0.75rem 1rem 0.75rem 2.75rem",
                    borderRadius: "8px",
                    border: `1px solid ${colors.primary}30`,
                    width: "100%",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    color: colors.textDark,
                    fontSize: "0.9375rem",
                    cursor: "pointer",
                    appearance: "none",
                    outline: "none",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
                  }}
                >
                  <option value="">Toutes facultés</option>
                  {faculties.map((f) => (
                    <option key={f.idFaculty} value={f.idFaculty}>
                      {f.nomFaculty}
                    </option>
                  ))}
                </select>
                <div style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: colors.textLight,
                  pointerEvents: "none",
                  opacity: 0.6
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                  </svg>
                </div>
                 <div style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              opacity: 0.4
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
            
              </div>
            </div>

            {filters.facultyId && (
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: colors.textDark,
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  paddingLeft: "0.25rem"
                }}>
                  Département
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={filters.departmentId}
                    onChange={(e) => handleFilterChange("departmentId", e.target.value)}
                    style={{ 
                      padding: "0.75rem 1rem 0.75rem 2.75rem",
                      borderRadius: "8px",
                      border: `1px solid ${colors.primary}30`,
                      width: "100%",
                      backgroundColor: "rgba(255,255,255,0.9)",
                      color: colors.textDark,
                      fontSize: "0.9375rem",
                      cursor: "pointer",
                      appearance: "none",
                      outline: "none",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <option value="">Tous départements</option>
                    {departments.map((d) => (
                      <option key={d.idDepart} value={d.idDepart}>
                        {d.nomDepart}
                      </option>
                    ))}
                  </select>
                  <div style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: colors.textLight,
                    pointerEvents: "none",
                    opacity: 0.6
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                   <div style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              opacity: 0.4
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
                </div>
              </div>
            )}

            {filters.departmentId && (
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: colors.textDark,
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  paddingLeft: "0.25rem"
                }}>
                  Spécialité
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={filters.specialty}
                    onChange={(e) => handleFilterChange("specialty", e.target.value)}
                    style={{ 
                      padding: "0.75rem 1rem 0.75rem 2.75rem",
                      borderRadius: "8px",
                      border: `1px solid ${colors.primary}30`,
                      width: "100%",
                      backgroundColor: "rgba(255,255,255,0.9)",
                      color: colors.textDark,
                      fontSize: "0.9375rem",
                      cursor: "pointer",
                      appearance: "none",
                      outline: "none",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <option value="">Toutes spécialités</option>
                    {specialties.map((s) => (
                      <option key={s.specialite} value={s.specialite}>
                        {s.specialite}
                      </option>
                    ))}
                  </select>
                  <div style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: colors.textLight,
                    pointerEvents: "none",
                    opacity: 0.6
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                   <div style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              opacity: 0.4
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
                </div>
              </div>
            )}

            {filters.specialty && (
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: colors.textDark,
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  paddingLeft: "0.25rem"
                }}>
                  Niveau
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={filters.level}
                    onChange={(e) => handleFilterChange("level", e.target.value)}
                    style={{ 
                      padding: "0.75rem 1rem 0.75rem 2.75rem",
                      borderRadius: "8px",
                      border: `1px solid ${colors.primary}30`,
                      width: "100%",
                      backgroundColor: "rgba(255,255,255,0.9)",
                      color: colors.textDark,
                      fontSize: "0.9375rem",
                      cursor: "pointer",
                      appearance: "none",
                      outline: "none",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <option value="">Tous niveaux</option>
                    {levels.map((lvl) => (
                      <option key={lvl.niveau} value={lvl.niveau}>
                        {lvl.niveau}
                      </option>
                    ))}
                  </select>
                  <div style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: colors.textLight,
                    pointerEvents: "none",
                    opacity: 0.6
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                      <path d="M16 3.13a4 4 0 010 7.75"/>
                    </svg>
                  </div>
                   <div style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              opacity: 0.4
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
                </div>
              </div>
            )}

            {filters.level && (
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: colors.textDark,
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  paddingLeft: "0.25rem"
                }}>
                  Section
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={filters.section}
                    onChange={(e) => handleFilterChange("section", e.target.value)}
                    style={{ 
                      padding: "0.75rem 1rem 0.75rem 2.75rem",
                      borderRadius: "8px",
                      border: `1px solid ${colors.primary}30`,
                      width: "100%",
                      backgroundColor: "rgba(255,255,255,0.9)",
                      color: colors.textDark,
                      fontSize: "0.9375rem",
                      cursor: "pointer",
                      appearance: "none",
                      outline: "none",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <option value="">Toutes sections</option>
                    {sections.map((sec) => (
                      <option key={sec.section} value={sec.section}>
                        {sec.section}
                      </option>
                    ))}
                  </select>
                  <div style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: colors.textLight,
                    pointerEvents: "none",
                    opacity: 0.6
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                      <path d="M16 3.13a4 4 0 010 7.75"/>
                    </svg>
                  </div>
                   <div style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              opacity: 0.4
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )}
</motion.div>


      {/* Section des étudiants */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{
          //boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
          //border: `1px solid ${colors.primary}20`,
          border: `1px solid ${colors.border}`,
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          overflowX: 'hidden',
  overflowY: 'auto' , // tu peux scroller verticalement
 
          marginBottom: "1rem",
          }}
      >
        {/* En-tête du tableau */}
        <div style={{  
          padding: "1.5rem 2rem",
          borderBottom: `1px solid ${colors.lightBg}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
           
            <h2 style={{ 
              color: colors.darkBlue,
              fontSize: "1.4rem",
              fontWeight: "520",
              margin: 0
            }}>
           
           Liste des Étudiants
            </h2>
            
            <span style={{
              backgroundColor: colors.lightBg,
              color: colors.accent,
              padding: "0.3rem 0.8rem",
              borderRadius: "20px",
              fontSize: "0.85rem",
              fontWeight: "500"
            }}>
              {filters.anneeId ? `${students.length} ${students.length !== 1 ? "étudiants" : "étudiant"}` : "0 étudiant"}
            </span>
          </div>

          {etudiantsSelectionnes.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreationDiplomes}
              style={{
                padding: "0.7rem 1.5rem",
                backgroundColor: "white",
              color: colors.accent,
              border: `1px solid ${colors.accent}`,
      borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
               }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Créer diplôme(s) ({etudiantsSelectionnes.length})
            </motion.button>
          )}
        </div>

        {/* Contrôles de sélection */}
        <div style={{
          padding: "0.8rem 2rem",
          backgroundColor: colors.lightBg,
          borderBottom: `1px solid ${colors.lightBg}`,
          display: "flex",
          gap: "1rem"
        }}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSelectAll}
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.accent}>
              <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tout sélectionner
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setEtudiantsSelectionnes([])}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "white",
              color: colors.textLight,
              border: `1px solid ${colors.textLight}50`,
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.textLight}>
              <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tout désélectionner
          </motion.button>
        </div>

        {/* Tableau des étudiants */}
        <div style={{ overflowX: "auto", padding: "0 2rem" }}>
          {shouldShowEmptyState ? (
            <div style={{ 
              padding: "4rem 2rem",
              textAlign: "center",
              color: colors.textLight
            }}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                maxWidth: "400px",
                margin: "0 auto"
              }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={colors.textLight} style={{ opacity: 0.5 }}>
                  <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 style={{ 
                  color: colors.textDark,
                  fontSize: "1.2rem",
                  fontWeight: "500",
                  margin: 0
                }}>
                  {searchError || "Aucun étudiant trouvé"}
                </h3>
                <p style={{ 
                  fontSize: "0.9rem",
                  margin: 0,
                  lineHeight: "1.5"
                }}>
                  {!filters.anneeId
                    ? "Veuillez sélectionner une année universitaire"
                    : "Essayez de modifier vos critères de recherche"}
                </p>
              </div>
            </div>
          ) : (
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              margin: "1rem 0"
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: "#F0F6FF",
                  }}>
                  <th style={{ 
                    padding: "0.5rem",
                    textAlign: "left",
                    fontWeight: "500",
                    fontSize: "0.85rem",
                    minWidth: "90px"
                  }}>Nom</th>
                  <th style={{ 
                     padding: "0.5rem",
                    textAlign: "left",
                    fontWeight: "500",
                    fontSize: "0.85rem",
                    minWidth: "90px"
                  }}>Prénom</th>
                  
                  <th style={{ 
                     padding: "0.5rem",
                    textAlign: "left",
                    fontWeight: "500",
                    fontSize: "0.85rem",
                    minWidth: "120px"
                  }}>Matricule</th>
                  <th style={{ 
                     padding: "0.5rem",
                    textAlign: "left",
                    fontWeight: "500",
                    fontSize: "0.85rem",
                    minWidth: "120px"
                  }}>Filière</th>
                  <th style={{ 
                   padding: "0.5rem",
                    textAlign: "left",
                    fontWeight: "500",
                    fontSize: "0.85rem",
                    minWidth: "120px"
                  }}>Spécialité</th>
                  <th style={{ 
                    padding: "0.5rem",
                    textAlign: "left",
                    fontWeight: "500",
                    fontSize: "0.85rem",
                    minWidth: "70px"
                  }}>Niveau</th>
                  <th style={{ 
                     padding: "0.5rem",
                    textAlign: "left",
                    fontWeight: "500",
                    fontSize: "0.85rem",
                    minWidth: "70px"
                  }}>Section</th>
                 
                  <th style={{ 
                    padding: "0.5rem",
                    textAlign: "left",
                    fontWeight: "500",
                    fontSize: "0.85rem",
                    minWidth: "80px"
                  }}>Moyenne</th>
                  <th style={{ 
                    padding: "0.5rem",
                    textAlign: "center",
                    fontWeight: "500",
                    fontSize: "0.85rem",
                    width: "80px"
                  }}>Sélection</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr 
                    key={student.matricule}
                    style={{ 
                      borderBottom: `1px solid ${colors.lightBg}`,
                      transition: "background-color 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.lightBg}50`}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <td style={{ 
                      padding: "0.5rem",
                      color: colors.textDark,
                      fontSize: "0.9rem"
                    }}>{student.nom}</td>
                    <td style={{ 
                       padding: "0.5rem",
                      color: colors.textDark,
                      fontSize: "0.9rem"
                    }}>{student.prenom}</td>
                    
                    <td style={{ 
                      padding: "0.5rem",
                      color: colors.textDark,
                      fontSize: "0.9rem",
                      fontWeight: "500"
                    }}>{student.matricule}</td>
                    <td style={{ 
                       padding: "0.5rem",
                      color: colors.textDark,
                      fontSize: "0.9rem"
                    }}>
                      {getCursusForSelectedYear(student)?.filiere || "-"}
                    </td>
                    <td style={{ 
                       padding: "0.5rem",
                      color: colors.textDark,
                      fontSize: "0.9rem"
                    }}>
                      {getCursusForSelectedYear(student)?.specialite || "-"}
                    </td>
                    <td style={{ 
                      padding: "0.5rem",
                      color: colors.textDark,
                      fontSize: "0.9rem"
                    }}>
                      {getCursusForSelectedYear(student)?.niveau || "-"}
                    </td>
                    <td style={{ 
                       padding: "0.5rem",
                      color: colors.textDark,
                      fontSize: "0.9rem"
                    }}>
                      {getCursusForSelectedYear(student)?.section || "-"}
                    </td>
                    
                    <td style={{ 
                      padding: "0.5rem",
                      color: colors.textDark,
                      fontSize: "0.9rem"
                    }}>
                      {getCursusForSelectedYear(student)?.moyenneAnnuelle ? (
                        <span style={{
                          backgroundColor: parseFloat(getCursusForSelectedYear(student).moyenneAnnuelle) >= 10 ? "#e6f7e6" : "#ffebee",
                          color: parseFloat(getCursusForSelectedYear(student).moyenneAnnuelle) >= 10 ? "#2e7d32" : "#c62828",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "12px",
                          fontSize: "0.8rem",
                          fontWeight: "500",
                          display: "inline-block",
                          minWidth: "40px",
                          textAlign: "center"
                        }}>
                          {getCursusForSelectedYear(student).moyenneAnnuelle}
                        </span>
                      ) : "-"}
                    </td>
                    <td style={{ 
                       padding: "0.5rem",
                      textAlign: "center"
                    }}>
                      <input
                        type="checkbox"
                        checked={etudiantsSelectionnes.includes(student.idEtudiant)}
                        onChange={() => handleCheckboxChange(student.idEtudiant)}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                          accentColor: colors.accent
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </main>

    {/* Modal de création de diplôme */}
   {formVisible && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  }}>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "2rem",
        width: "100%",
        maxWidth: "500px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
      }}
    >
      <h2 style={{
        color: colors.darkBlue,
        fontSize: "1.4rem",
        fontWeight: "600",
        marginBottom: "1.5rem"
      }}>
        Création de Diplôme Universitaire
      </h2>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{
          display: "block",
          marginBottom: "0.5rem",
          color: colors.textDark,
          fontSize: "0.9rem",
          fontWeight: "500"
        }}>
          Type de diplôme pour {etudiantsSelectionnes.length} étudiant(s)
        </label>
        <select
          value={titreDiplome}
          onChange={(e) => setTitreDiplome(e.target.value)}
          style={{
            width: "100%",
            padding: "0.8rem 1rem",
            borderRadius: "8px",
            border: `1px solid ${colors.border}`,
            backgroundColor: "white",
            color: colors.textDark,
            fontSize: "0.9rem",
            outline: "none",
            transition: "all 0.2s ease",
            cursor: "pointer"
          }}
        >
          <option value="">Sélectionnez un diplôme</option>
          
          {/* Diplômes LMD */}
          <optgroup label="Système LMD">
            <option value="DIPLOME DE LICENCE">LICENCE</option>
            <option value="DIPLOME DE MASTER">MASTER</option>
            <option value="DIPLOME DE DOCTORAT">DOCTORAT</option>
          </optgroup>
          
          {/* Diplômes d'ingénierie */}
          <optgroup label="Diplômes d'Ingénierie">
            <option value="DIPLOME D'INGENIEUR D'ETAT">INGENIEUR D'ETAT</option>
          </optgroup>
          
          {/* Diplômes médicaux */}
          <optgroup label="Diplômes Médicaux">
            <option value="DIPLOME DEFINITIF GENERALISTE">DIPLÔME DÉFINITIF DE GÉNÉRALISTE</option>
            <option value="DOCTEUR EN MEDECINE">DOCTEUR EN MEDECINE</option>
            <option value="DOCTEUR EN PHARMACIE">DOCTEUR EN PHARMACIE</option>
            <option value="DOCTEUR EN MEDECINE DENTAIRE">DOCTEUR EN MEDECINE DENTAIRE</option>
            <option value="DIPLOME DE SPECIALITE EN MEDECINE">SPECIALITE EN MEDECINE (DESM)</option>
            <option value="DIPLOME DE SPECIALITE EN PHARMACIE">SPECIALITE EN PHARMACIE</option>
            <option value="DIPLOME DE SPECIALITE EN MEDECINE DENTAIRE">SPECIALITE EN MEDECINE DENTAIRE</option>
            <option value="DIPLOME DEFINITIF DE DESM">DIPLOME DEFINITIF DE DESM</option>
            <option value="DIPLOME D'ETUDES MEDICALES SPECIALISEES">DIPLOME DEFINITIF DE DEMS</option>
            <option value="DIPLOME DE MAITRISE EN SCIENCES MEDICALES">MAITRISE EN SCIENCES MEDICALES</option>
          </optgroup>
          
          <option value="AUTRE DIPLOME">Autre (à préciser)</option>
        </select>
      </div>

      {/* Champ pour diplôme personnalisé */}
{titreDiplome === "AUTRE DIPLOME" && (
  <div style={{ 
    marginTop: "1.5rem",
    padding: "1.5rem",
    backgroundColor: colors.lightBg,
    borderRadius: "8px",
    border: `1px solid ${colors.border}`
  }}>
    <label style={{
      display: "block",
      marginBottom: "0.75rem",
      color: colors.textDark,
      fontSize: "1rem",
      fontWeight: "500"
    }}>
      Nom du diplôme personnalisé
    </label>
    <input
      type="text"
      value={customDiplomaName}
      onChange={(e) => setCustomDiplomaName(e.target.value)}
      placeholder="Entrez le nom officiel du diplôme"
      style={{
        width: "90%",
        padding: "0.9rem",
        borderRadius: "8px",
        border: `1px solid ${colors.textLight}30`,
        backgroundColor: "white",
        color: colors.textDark,
        fontSize: "1rem",
        outline: "none",
        transition: "all 0.2s ease"
      }}
    />
    <p style={{
      fontSize: "0.9rem",
      color: colors.textLight,
      marginTop: "0.75rem",
      fontStyle: "italic"
    }}>
      Ce diplôme doit être préalablement reconnu par le Ministère de l'Enseignement Supérieur
    </p>
  </div>
)}

      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "1rem"
      }}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={closeModal}
          style={{
            padding: "0.7rem 1.5rem",
            backgroundColor: "transparent",
            color: colors.textLight,
            border: `1px solid ${colors.textLight}30`,
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "500"
          }}
        >
          Annuler
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={confirmerCreationDiplomes}
          disabled={!titreDiplome || (titreDiplome === "AUTRE DIPLOME" && !customDiplomaName)}
          style={{
            padding: "0.7rem 1.5rem",
            backgroundColor: !titreDiplome || (titreDiplome === "AUTRE DIPLOME" && !customDiplomaName) 
              ? `${colors.textLight}50` 
              : colors.accent,
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: !titreDiplome || (titreDiplome === "AUTRE DIPLOME" && !customDiplomaName) 
              ? "not-allowed" 
              : "pointer",
            fontSize: "0.9rem",
            fontWeight: "500",
            opacity: !titreDiplome || (titreDiplome === "AUTRE DIPLOME" && !customDiplomaName) 
              ? 0.7 
              : 1
          }}
        >
          Confirmer
        </motion.button>
      </div>
    </motion.div>
  </div>
)}
  </div>
    </>
);
}

export default UniversityPage;