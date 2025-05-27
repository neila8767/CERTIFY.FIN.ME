import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import {FaEnvelope, FaPhone  ,  FaGraduationCap  , FaUniversity, FaSearch, FaChartLine, FaUserGraduate, FaCheckCircle, FaSchool } from 'react-icons/fa';
import Header from "../../../components/HeaderMinistry.jsx";
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import axios from 'axios';

function App() {
  const router = useRouter();
  const { token } = router.query;
  const safeToken = encodeURIComponent(token || ''); 


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

  
  const [ministryInfo, setMinistryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('universities');

  useEffect(() => {
    console.log("Token from URL:", token);
  }, [token]);

  useEffect(() => {
    const verifyTokenAndLoadData = async () => {
      try {
        setLoading(true);
        setAuthError(null);

         if (!token) {
          const storedToken = localStorage.getItem('ministere_token');
          console.log("[DEBUG] No token in URL, checking localStorage...");
          if (storedToken) {
            console.log("[DEBUG] Found token in localStorage, redirecting...");
            router.push(`/ministry/${storedToken}`);
            return;
          }
          throw new Error("Token manquant");
        }

        
        console.log("[DEBUG] Decoding token...");
        const decoded = jwt.decode(token);
        console.log("[DEBUG] Token décodé:", decoded);

        if (!decoded || decoded.role?.trim().toUpperCase() !== 'MINISTERE') {
          console.error("[ERROR] Accès non autorisé - Role invalide");
          throw new Error("Accès non autorisé");
        }

        console.log(`[DEBUG] Ministère connecté: ID=${decoded.ministereId}, Type=${decoded.ministereType}`);
        setMinistryInfo({
          id: decoded.ministereId,
          name: decoded.ministereName,
          type: decoded.ministereType
        });

        if (decoded.ministereType === 'ENSEIGNEMENT_SUPERIEUR') {
          console.log("[DEBUG] Chargement des données pour ENSEIGNEMENT_SUPERIEUR...");
          try {
   const role = 'ECOLE_SUPERIEURE'; // Par exemple

const [universitiesRes, schoolsRes] = await Promise.all([
  axios.get('http://localhost:5000/universites-with-account'),
  axios.get('http://localhost:5000/ecoles-acc', {
    params: { role }
  }) 
]);

  
  console.log("Universités:", universitiesRes.data);
  console.log("Écoles supérieures:", schoolsRes.data);
  
  setUniversities(universitiesRes.data);
  setSchools(schoolsRes.data || []);
   console.log ("VOIR ESSAIE:", schoolsRes.data );
 
} catch (error) {
  console.error("Erreur de chargement:", error);
  if (error.response) {
    // Erreur provenant du serveur
    console.error("Détails de l'erreur:", {
      status: error.response.status,
      data: error.response.data
    });
  } else if (error.request) {
    // La requête a été faite mais aucune réponse n'a été reçue
    console.error("Pas de réponse du serveur");
  } else {
    // Erreur lors de la configuration de la requête
    console.error("Erreur de configuration:", error.message);
  }
  
  setAuthError("Erreur de chargement des données. Veuillez réessayer.");
}
        } 
          else if (decoded.ministereType === 'FORMATION_PROFESSIONNELLE') {
          console.log("[DEBUG] Chargement des données pour FORMATION_PROFESSIONNELLE...");
      const role = 'ECOLE_FORMATION'; // Par exemple
     const schoolResponse = await axios.get('http://localhost:5000/ecoles-acc', {
  params: { role }
});

console.log("Réponse complète écoles formation:", schoolResponse.data);
// Extraire le tableau du champ 'data' de la réponse
setSchools(schoolResponse.data.data || []);
          setActiveTab('schools');
          setUniversities([]);
        }

        console.log("[DEBUG] Chargement des données terminé");
      } catch (error) {
        console.error("[ERROR] Erreur lors du chargement:", error);
        setAuthError(error.message);
        localStorage.removeItem('ministere_token');
      } finally {
        setLoading(false);
      }
    };

    verifyTokenAndLoadData();
  }, [token, router]);

  useEffect(() => {
  console.log("Schools (état):", schools);
}, [schools]);
 


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

  const filteredUniversities = universities.filter(uni =>
    uni.nomUni.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSchools = schools.filter(school =>
    school.nomEcole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
const renderInstitutionCard = (institution, isSchool = false) => (
  <motion.div
    key={isSchool ? institution.idEcole : institution.idUni}
    whileHover={{ y: -5, boxShadow: `0 10px 25px ${colors.primary}10` }}
    style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      border: `1px solid ${colors.border}`,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
     }}
  >
    {/* Header avec icône - partie haute avec hauteur fixe */}
    <div style={{ 
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
       minHeight: '72px' // Hauteur minimale pour le header
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '10px',
        background: `linear-gradient(135deg, ${colors.lightBg}, ${colors.border})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {isSchool ? (
          <FaSchool size={18} color={colors.primary} />
        ) : (
          <FaUniversity size={18} color={colors.primary} />
        )}
      </div>
      
      <div style={{ flex: 1, minWidth: 0}}> {/* minWidth: 0 pour éviter le débordement */}
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '500',
          color: colors.textDark,
          margin: '0 0 0.25rem 0',
          lineHeight: 1.4,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {isSchool ? institution.nomEcole : institution.nomUni}
        </h3>
        <p style={{
          color: colors.textLight,
          fontSize: '0.8rem',
          margin: 0,
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {isSchool ? institution.adresseEcole : institution.adresseUni}
        </p>
      </div>
    </div>


    {/* Badge de statut */}
    

    {/* Informations de contact - partie centrale avec hauteur flexible */}
    <div style={{
      marginBottom: '1.25rem',
      flex: 1,
      minHeight: '60px'
    }}>
      <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      backgroundColor: `${colors.primary}08`,
      padding: '0.35rem 0.8rem',
      borderRadius: '6px',
      marginBottom: '0.5rem',
      width: 'fit-content'
    }}>
      <FaCheckCircle size={12} color={colors.primary} />
      <span style={{
        fontSize: '0.75rem',
        fontWeight: '500',
        color: colors.primary
      }}>
        Compte actif
      </span>
    </div>
    
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.5rem'
      }}>
        
        <FaEnvelope size={12} color={colors.textLight} />
        <span style={{
          fontSize: '0.75rem',
          color: colors.textLight,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {isSchool ? institution.emailEcole : institution.emailUni}
        </span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <FaPhone size={12} color={colors.textLight} />
        <span style={{
          fontSize: '0.75rem',
          color: colors.textLight
        }}>
          {isSchool ? institution.telephoneEcole : institution.telephoneUni}
        </span>
      </div>
    </div>

    {/* Bouton Voir diplômes - partie fixe en bas */}
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={(e) => {
        e.stopPropagation();
        if (isSchool) {
          router.push(`/ministry/${token}/DiplomeEcole?ecoleId=${institution.idEcole}&token=${safeToken}`);
        } else {
          router.push(`/ministry/${token}/DiplomeUniversite?universityId=${institution.idUni}&token=${safeToken}`);
        }
      }}
      style={{
        width: '80%',
          backgroundColor: "white",
              color: colors.accent,
              border: `1px solid ${colors.accent}`,
            borderRadius: '8px',
        padding: '0.6rem',
        fontSize: '0.8rem',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        marginTop: 'auto',
         margin: '0 auto' 
      }}
    >
      <FaGraduationCap size={14} />
      Voir les diplômes
    </motion.button>
  </motion.div>
);

return (
  <div style={{ 
    flex: 1,
    padding: '3rem',
    paddingTop: '5rem',
    backgroundColor: colors.lightBg,
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, sans-serif"
  }}>
    <Header token={token} />
  
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Carte principale - taille proportionnelle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          marginBottom: '2rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          border: `1px solid ${colors.border}`,
          padding: '1.5rem',
          minHeight: 'calc(100vh - 10rem)' // Ajuste selon tes besoins
        }}
      >
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
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
            <FaUniversity color={colors.primary} size={24} />
          </div>
          <div>
            <h1 style={{ 
              fontSize: '1.5rem',
              fontWeight: '500',
              margin: 0,
              color: colors.textDark
            }}>
              {activeTab === 'universities' ? 'Gestion des Universités' : 'Gestion des Écoles'}
            </h1>
            <p style={{ 
              fontSize: '0.9rem',
              color: colors.textLight,
              margin: '0.3rem 0 0'
            }}>
              {activeTab === 'universities' 
                ? 'Liste complète des universités enregistrées' 
                : 'Liste complète des écoles enregistrées'}
            </p>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          marginBottom: '1.5rem',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('universities')}
            style={{
              padding: '0.6rem 1.2rem',
              border: 'none',
              background: activeTab === 'universities' ? colors.primary : colors.lightBg,
              color: activeTab === 'universities' ? 'white' : colors.textDark,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaUniversity size={14} />
            Universités
          </button>

          <button
            onClick={() => setActiveTab('schools')}
            style={{
              padding: '0.6rem 1.2rem',
              border: 'none',
              background: activeTab === 'schools' ? colors.primary : colors.lightBg,
              color: activeTab === 'schools' ? 'white' : colors.textDark,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaSchool size={14} />
            {ministryInfo?.type === 'FORMATION_PROFESSIONNELLE' ? 'Écoles de Formation' : 'Écoles Supérieures'}
          </button>

          <div style={{
            position: 'relative',
            flex: 1,
            minWidth: '250px'
          }}>
            <FaSearch style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.textLight,
              fontSize: '0.9rem'
            }} />
            <input
              type="text"
              placeholder={activeTab === 'universities' ? "Rechercher une université..." : "Rechercher une école..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '90%',
                padding: '0.6rem 1rem 0.6rem 36px',
                borderRadius: '8px',
                border: `1px solid ${colors.border}`,
                fontSize: '0.9rem',
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
            />
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginTop: '1.5rem'
        }}>
          {activeTab === 'universities' 
            ? filteredUniversities.map(uni => renderInstitutionCard(uni, false))
            : filteredSchools.map(school => renderInstitutionCard(school, true))
          }
        </div>
      </motion.div>
    </div>
  </div>
);
}

export default App;