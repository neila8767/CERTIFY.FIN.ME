import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import jwt from 'jsonwebtoken';
import Header from '../../../components/HeaderEcole.jsx';
import { motion, AnimatePresence } from 'framer-motion';

function EcolePage() {
  const router = useRouter();
  const { token } = router.query;

  // États d'authentification
  const [ecoleInfo, setEcoleInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [ecoleType, setEcoleType] = useState(null);

  // États des données
  const [formations, setFormations] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  
  // États de l'interface
  const [etudiantsSelectionnes, setEtudiantsSelectionnes] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [titreDiplome, setTitreDiplome] = useState("");
  const [diplomeTypes, setDiplomeTypes] = useState([]);
  const [customDiplomaName, setCustomDiplomaName] = useState("");
  const [showCustomDiplomaInput, setShowCustomDiplomaInput] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchMatricule, setSearchMatricule] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [showRedirectionMessage, setShowRedirectionMessage] = useState(false);

  // Filtres
  const [filters, setFilters] = useState({
    anneeId: "",
    formationId: "",
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
        if (!decoded || decoded.role?.trim().toUpperCase() !== 'ECOLE') {
          throw new Error("Accès non autorisé");
        }
        
        // Stockage des infos de l'école
        setEcoleInfo({
          id: decoded.ecoleId,
          name: decoded.ecoleName,
        });

        // Déterminer le type d'école
        const type = decoded.roleEcole || 'ECOLE_PROFESSIONNELLE';
        setEcoleType(type);

        // Définir les types de diplôme en fonction du type d'école
        if (type === 'ECOLE_SUPERIEURE') {
          setDiplomeTypes([
            'Licence académique',
            'Licence professionnelle',
            'Master académique',
            'Master professionnel',
            'Diplôme d\'Ingénieur d\'État',
            'Diplôme de l\'École Normale Supérieure (ENS)',
            'Diplôme de l\'École Supérieure de Commerce (ESC)',
            'Autre (à préciser)'
          ]);
          setTitreDiplome('Licence académique');
        } else {
          setDiplomeTypes([
            'Certificat de Qualification Professionnelle (CQP)',
            'Certificat d\'Aptitude Professionnelle (CAP)',
            'Brevet de Technicien (BT)',
            'Brevet de Technicien Supérieur (BTS)',
            'Technicien Spécialisé (TS)',
            'Diplôme de Technicien Supérieur (DTS)',
            'Technicien (T)',
            'Agent Technique',
            'Autre (à préciser)'
          ]);
          setTitreDiplome('Brevet de Technicien Supérieur (BTS)');
        }
  
        localStorage.setItem('ecole_token', token);
        localStorage.setItem('ecole_id', decoded.ecoleId);
        localStorage.setItem('ecole_name', decoded.ecoleName);
  
        // Chargement des données initiales
        await loadAnneesScolaires();
  
      } catch (error) {
        console.error("Erreur d'authentification:", error);
        setAuthError(error.message);
        localStorage.removeItem('ecole_token');
      } finally {
        setLoading(false);
      }
    };
  
    verifyTokenAndLoadData();
  }, [token]);

  // Gérer la sélection du diplôme
  const handleDiplomaTypeChange = (e) => {
    const selectedValue = e.target.value;
    setTitreDiplome(selectedValue);
    setShowCustomDiplomaInput(selectedValue === 'Autre (à préciser)');
    if (selectedValue !== 'Autre (à préciser)') {
      setCustomDiplomaName("");
    }
  };
    // Chargement des années scolaires
    const loadAnneesScolaires = async () => {
      try {
        const ecoleId = localStorage.getItem('ecole_id');
        
        const response = await axios.get(`${API_BASE_URL}/ecole/${ecoleId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setAnnees(response.data?.data || response.data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des années:", error);
        setAnnees([]);
      }
    };
  
    // Chargement des formations
    useEffect(() => {
      const loadFormations = async () => {
        if (!filters.anneeId) {
          setFormations([]);
          return;
        }
  
        try {
          const ecoleId = localStorage.getItem('ecole_id');
          
          const response = await axios.get(`${API_BASE_URL}/ecoles/${ecoleId}/formations`, {
            params: { anneeId: filters.anneeId },
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setFormations(response.data?.data || response.data || []);
        } catch (error) {
          console.error("Erreur lors du chargement des formations:", error);
          setFormations([]);
        }
      };
  
      loadFormations();
    }, [filters.anneeId, token]);
  
    // Chargement des étudiants
    useEffect(() => {
      const loadStudents = async () => {
  if (!filters.anneeId) {
    setStudents([]);
    setAllStudents([]);
    return;
  }

  try {
    let endpoint, params = {};

    if (filters.formationId) {
      // Utilisez la nouvelle route combinée
      endpoint = `${API_BASE_URL}/formations/${filters.formationId}/annee/${filters.anneeId}/etudiants`;
    } else {
      endpoint = `${API_BASE_URL}/students-by-anneeEcole/${filters.anneeId}`;
      params = { anneeId: filters.anneeId };
    }

    const response = await axios.get(endpoint, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });

    const studentsData = response.data || [];
    setStudents(studentsData);
    setAllStudents(studentsData);
  } catch (error) {
    console.error("Erreur lors du chargement des étudiants:", error);
    setStudents([]);
    setAllStudents([]);
  }
};
  
      if (!searchMatricule) loadStudents();
    }, [filters.anneeId, filters.formationId, token, searchMatricule]);
  
    // Recherche par matricule
    const rechercherParMatricule = async () => {
      if (!searchMatricule.trim()) {
        setSearchError("Veuillez entrer un matricule");
        return;
      }
  
      try {
        setSearchError(null);
  
        const response = await axios.get(
          `${API_BASE_URL}/cursus-ecole/etudiant/${encodeURIComponent(searchMatricule)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (response.data) {
          const studentData = response.data;
          const formattedStudent = {
            idEtudiantEcole: studentData.id || studentData.idEtudiantEcole,
            nom: studentData.nom,
            prenom: studentData.prenom,
            matricule: studentData.matricule,

          };
          setStudents([formattedStudent]);
          setSearchMode(true);
        } else {
          setSearchError("Aucun étudiant trouvé avec ce matricule");
          setStudents([]);
        }
      } catch (err) {
        console.error("Erreur recherche:", err);
        setSearchError(err.response?.data?.error || err.message || "Erreur lors de la recherche");
        setStudents([]);
      }
    };
  
    // Réinitialiser la recherche
    const resetSearch = () => {
      setSearchMatricule("");
      setSearchError(null);
      setSearchMode(false);
      setStudents(allStudents);
    };
  
    // Gestion des sélections d'étudiants
    const handleCheckboxChange = (id) => {
      setEtudiantsSelectionnes(prev => 
        prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
      );
    };
  
    const handleSelectAll = () => {
      setEtudiantsSelectionnes(prev => 
        prev.length === students.length ? [] : students.map(s => s.idEtudiantEcole)
      );
    };
  
    // Gestion des filtres
    const handleFilterChange = (filterName, value) => {
      setFilters(prev => ({
        ...prev,
        [filterName]: value,
        ...(filterName === 'anneeId' && { formationId: "" })
      }));
    };
  
    // Confirmation création diplômes
      const confirmerCreationDiplomes = async () => {
    try {
      const finalDiplomaName = showCustomDiplomaInput ? customDiplomaName : titreDiplome;
      
      if (!finalDiplomaName) throw new Error("Veuillez sélectionner ou saisir un type de diplôme");
      if (etudiantsSelectionnes.length === 0) throw new Error("Veuillez sélectionner au moins un étudiant");

      const ecoleName = localStorage.getItem('ecole_name');
      const ecoleId = localStorage.getItem('ecole_id');

      // Vérification modèle de diplôme
      const checkRes = await axios.get(`${API_BASE_URL}/ecoles-modeles/${ecoleId}/verifier-modele`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!checkRes.data.hasModele) {
        setShowRedirectionMessage(true);
        return;
      }

      // Vérification des étudiants
      const verification = await axios.post(
        `${API_BASE_URL}/verifier-etudiants`,
        etudiantsSelectionnes,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (verification.data.success) {
        const payload = {
          anneeId: filters.anneeId,
          titreDiplome: finalDiplomaName,
          typeDiplome: ecoleType === 'ECOLE_SUPERIEURE' ? 'SUPERIEUR' : 'PROFESSIONNEL',
          etudiants: etudiantsSelectionnes.map(id => ({ idEtudiant: id })),
          EcoleName: ecoleName
        };

        const creation = await axios.post(
          `${API_BASE_URL}/creer-diplomes-ecoles`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (creation.data.success) {
          alert("🎓 Diplômes créés avec succès !");
          setFormVisible(false);
          setEtudiantsSelectionnes([]);
          setCustomDiplomaName("");
          setShowCustomDiplomaInput(false);
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        const nonTrouves = error.response.data.etudiantsNonTrouves;
        alert(`⚠️ Certains étudiants ne sont pas reconnus:\n${nonTrouves.map(e => `${e.prenom} ${e.nom}`).join('\n')}`);
      } else {
        console.error("Erreur création diplômes:", error);
        alert(error.message || "Erreur lors de la création");
      }
    }
  };

 // Palette de couleurs
const colors = {
    primary: '#1E3A8A',       // Bleu roi
    secondary: '#2D3748',     // Gris foncé
    accent: '#1E3A8A',        // Bleu clair
    lightBg: '#F9FAFB',       // Fond clair
    darkBg: '#1A202C',        // Fond sombre
    textDark: '#111827',      // Texte principal
    textLight: '#6B7280',     // Texte secondaire
    border: '#E5E7EB',        // Bordures
    success: '#16A34A',       // Vert succès
    error: '#DC2626',         // Rouge erreur
    warning: '#F59E0B'        // Jaune attention
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
              onClick={() => router.push(`/ecole/${token}/ChoixModeleDiplome`)}
              style={{
                marginTop: '1rem',
                backgroundColor: colors.primary,
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
        backgroundColor: "#FFFF",
        minHeight: "100vh",
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
    border: `1px solid ${colors.border}`,
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
            fontWeight: "600",
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
            Générez des diplômes pour les étudiants de votre établissement
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
      {searchMode && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setStudents(allStudents);
            setSearchMode(false);
            setSearchMatricule("");
          }}
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
        onClick={rechercherParMatricule}
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

        {(filters.anneeId || filters.formationId) && (
          <motion.button
            whileHover={{ scale: 1.01, boxShadow: `0 2px 6px ${colors.error}15` }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilters({
              anneeId: '',
              formationId: ''
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
        {/* Filtre Année Scolaire */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "0.5rem",
            color: colors.textDark,
            fontSize: "0.875rem",
            fontWeight: "500",
            paddingLeft: "0.25rem"
          }}>
            Année scolaire
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
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
              }}
            >
              <option value="">Sélectionnez une année</option>
              {annees.map((annee) => (
                <option key={annee.id} value={annee.id}>
                  {annee.annee}
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

        {/* Filtre Formation */}
        {filters.anneeId && (
          <div>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              color: colors.textDark,
              fontSize: "0.875rem",
              fontWeight: "500",
              paddingLeft: "0.25rem"
            }}>
              Formation
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={filters.formationId}
                onChange={(e) => handleFilterChange("formationId", e.target.value)}
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
                <option value="">Toutes les formations</option>
                {formations.map((formation) => (
                  <option key={formation.idFormation} value={formation.idFormation}>
                    {formation.nomFormation}
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
    border: `1px solid ${colors.border}`,
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    overflowX: 'hidden',
    overflowY: 'auto',
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
        onClick={() => setFormVisible(true)}
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
    {(!filters.anneeId || students.length === 0) ? (
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
              ? "Veuillez sélectionner une année scolaire"
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
            }}>Formation</th>
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
          {students.map((student) => (
            <tr 
              key={student.idEtudiantEcole}
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
  {student.formations?.map(f => f.nomFormation).join(", ") || "-"}
</td>
              <td style={{ 
                padding: "0.5rem",
                textAlign: "center"
              }}>
                <input
                  type="checkbox"
                  checked={etudiantsSelectionnes.includes(student.idEtudiantEcole)}
                  onChange={() => handleCheckboxChange(student.idEtudiantEcole)}
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
        borderRadius: "8px", // Bordure plus fine
        padding: "5rem", // Réduction du padding
        width: "90%", // Largeur relative
        maxWidth: "400px", // Largeur maximale réduite
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // Ombre plus légère
        maxHeight: "65vh", // Hauteur maximale
        overflowY: "auto" // Défilement si nécessaire
      }}
    >
      <h2 style={{
        color: colors.primary,
        fontSize: "1.25rem", // Réduit de 1.5rem
        fontWeight: "600",
        marginBottom: "1.5rem",
        marginTop: "-3rem" // Réduit de 2rem
      }}>
        Création de Diplôme
      </h2>

      <div style={{ marginBottom: "1.5rem" }}> {/* Réduit de 2rem */}
        <label style={{
          display: "block",
          marginBottom: "0.5rem", // Réduit de 0.75rem
          color: colors.textDark,
          fontSize: "0.9rem", // Réduit de 1rem
          fontWeight: "500"
        }}>
          Titre du diplôme pour {etudiantsSelectionnes.length} étudiant(s)
        </label>
        <select
          value={titreDiplome}
          onChange={handleDiplomaTypeChange}
          style={{
            width: "100%",
            padding: "0.75rem", // Réduit de 1rem
            borderRadius: "8px",
            border: `1px solid ${colors.textLight}30`,
            backgroundColor: "white",
            color: colors.textDark,
            fontSize: "0.9rem", // Réduit de 1rem
            outline: "none",
            transition: "all 0.2s ease",
            marginBottom: "1rem" // Réduit de 1.5rem
          }}
        >
          {diplomeTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {showCustomDiplomaInput && (
          <div style={{ 
            marginTop: "0rem", // Réduit de 1.5rem
            padding: "1rem", // Réduit de 1.5rem
            backgroundColor: colors.lightBg,
            borderRadius: "8px",
            border: `1px solid ${colors.border}`
          }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem", // Réduit de 0.75rem
              color: colors.textDark,
              fontSize: "0.9rem", // Réduit de 1rem
              fontWeight: "500"
            }}>
              Nom du diplôme personnalisé
            </label>
            <input
              type="text"
              value={customDiplomaName}
              onChange={(e) => setCustomDiplomaName(e.target.value)}
              placeholder={`Entrez le nom officiel du diplôme (${ecoleType === 'ECOLE_SUPERIEURE' ? 'Supérieur' : 'Professionnel'})`}
              style={{
                width: "90%",
                padding: "0.75rem", // Réduit de 1rem
                borderRadius: "8px",
                border: `1px solid ${colors.textLight}30`,
                backgroundColor: "white",
                color: colors.textDark,
                fontSize: "0.9rem", // Réduit de 1rem
                outline: "none",
                transition: "all 0.2s ease"
              }}
            />
            <p style={{
              fontSize: "0.8rem", // Réduit de 0.9rem
              color: colors.textLight,
              marginTop: "0.5rem", // Réduit de 0.75rem
              fontStyle: "italic"
            }}>
              Ce diplôme doit être préalablement reconnu par le {ecoleType === 'ECOLE_SUPERIEURE' 
                ? 'Ministère de l\'Enseignement Supérieur' 
                : 'Ministère de la Formation Professionnelle'}
            </p>
          </div>
        )}

        <div style={{ 
          marginTop: "1rem", // Réduit de 1.5rem
          padding: "1rem", // Réduit de 1.5rem
          backgroundColor: colors.lightBg,
          borderRadius: "8px",
          border: `1px solid ${colors.border}`
        }}>
          <label style={{
            display: "block",
            marginBottom: "0.5rem", // Réduit de 0.75rem
            color: colors.textDark,
            fontSize: "0.9rem", // Réduit de 1rem
            fontWeight: "500"
          }}>
            Type d'établissement
          </label>
          <input
            type="text"
            value={ecoleType === 'ECOLE_SUPERIEURE' 
              ? 'Établissement d\'Enseignement Supérieur' 
              : 'Centre de Formation Professionnelle'}
            readOnly
            disabled
            style={{
              width: "95%",
              padding: "0.5rem",
              borderRadius: "8px",
              border: `1px solid ${colors.textLight}30`,
              backgroundColor: colors.lightBg,
              color: colors.textDark,
              fontSize: "0.9rem", // Réduit de 1rem
              outline: "none",
              cursor: "not-allowed"
            }}
          />
        </div>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "1rem",
        marginTop: "0rem", // Réduit de 1.5rem
        marginBottom:"-23 rem"
      }}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setFormVisible(false);
            setCustomDiplomaName("");
            setShowCustomDiplomaInput(false);
          }}
          style={{
            padding: "0.6rem 1.25rem", // Réduit de 0.7rem 1.5rem
            backgroundColor: "transparent",
            color: colors.textDark,
           border: `1px solid ${colors.border}`,
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.85rem", // Réduit de 0.9rem
            fontWeight: "500"



             
          }}
        >
          Annuler
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={confirmerCreationDiplomes}
          disabled={!titreDiplome || (showCustomDiplomaInput && !customDiplomaName)}
          style={{
            padding: "0.6rem 1.25rem", // Réduit de 0.7rem 1.5rem
            backgroundColor: (!titreDiplome || (showCustomDiplomaInput && !customDiplomaName)) 
              ? `${colors.textLight}50` 
              : colors.accent,
            color: "white",
            border: "none",
            borderRadius: "8px",
         
            cursor: (!titreDiplome || (showCustomDiplomaInput && !customDiplomaName)) 
              ? "not-allowed" 
              : "pointer",
            fontSize: "0.85rem", // Réduit de 0.9rem
            fontWeight: "500",
            opacity: (!titreDiplome || (showCustomDiplomaInput && !customDiplomaName)) ? 0.7 : 1
          }}
        >
          Confirmer
        </motion.button>
      </div>
    </motion.div>
  </div>
)}
        </main>
      </div>
    </>
  );
}

export default EcolePage;