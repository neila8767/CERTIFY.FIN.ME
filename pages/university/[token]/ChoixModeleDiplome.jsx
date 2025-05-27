import { useEffect, useState } from 'react'
import axios from 'axios'
import  Header  from '../../../components/HeaderUniversity';
import { useRouter } from "next/router";
import { motion } from 'framer-motion';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ChoixModeleDiplome() {
  const [modeles, setModeles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
   const router = useRouter();
  const { token } = router.query;
  
  useEffect(() => {
      console.log("Token reçu dans l'URL:", token); 
      const universityId = localStorage.getItem('university_id');
      console.log("universityId récupéré :", universityId);
     }, [token]);
  
    
  useEffect(() => {
    const url = `${API_BASE_URL}/universities/modeles`;
    console.log("➡️ Requête GET envoyée à :", url);

    axios.get(url)
      .then(res => {
        console.log("✅ Données reçues :", res.data);
        setModeles(res.data);
      })
      .catch(err => {
        console.error("❌ Erreur lors du GET /universities/modeles :", err);
        if (err.response) {
          console.error("🧾 Code HTTP :", err.response.status);
          console.error("📨 Message :", err.response.data);
        }
      });
  }, []);

      
  const choisirModele = async (modeleId) => {
     const universityId = localStorage.getItem('university_id');
    try {
       await axios.put(`${API_BASE_URL}/universities/${universityId}/choix-modele`, { modeleId })
      setSelected(modeleId)
      alert("Modèle sélectionné avec succès !")
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la sélection du modèle")
    }
  }

 const colors = {
  primary: '#1E3A8A',       // Bleu roi profond
  secondary: '#2D3748',     // Gris anthracite
  accent: '#2563EB',        // Bleu vif pour les interactions
  lightBg: '#F9FAFB',       // Fond clair neutre
  darkBg: '#1A202C',        // Fond sombre élégant
  textDark: '#111827',      // Noir profond
  textLight: '#6B7280',     // Gris doux
  border: '#E5E7EB',        // Bordure très légère
  success: '#16A34A',       // Vert émeraude
  error: '#DC2626',         // Rouge vif mais contrôlé
  warning: '#F59E0B'        // Or moderne
};



return (
  <div style={{
    backgroundColor: '#FFFFFF',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, sans-serif",
    position: 'relative'
  }}>
    
    {/* Fullscreen Preview avec flou */}
  {fullscreenImage && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2000,
    backdropFilter: 'blur(12px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px' // Ajout de padding pour que l'image ne touche pas les bords
  }}>
    <div style={{
      width: '95%', // Augmentation de la largeur
      maxWidth: '900px', // Légère augmentation
      height: '80vh', // Augmentation de la hauteur
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <button 
        onClick={() => setFullscreenImage(null)}
        style={{
          position: 'absolute',
          top: '-40px',
          right: 0,
          backgroundColor: 'rgba(255,255,255,0.9)',
          color: colors.textDark,
          border: `1px solid ${colors.border}`,
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 18L18 6M6 6l12 12"/>
        </svg>
        Fermer
      </button>
      
      {/* Conteneur d'image sans fond blanc */}
       <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: '10px' // Réduction de l'espace avec le nom
      }}>
        <img
          src={`${API_BASE_URL}${fullscreenImage.cheminModele}`}
          alt={fullscreenImage.nomModele}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            maxHeight: 'none' // Suppression de la limite de hauteur
          }}
        />
      </div>
      
      {/* Nom du modèle centré en bas */}
     
    </div>
  </div>
)}

    <Header token={token} />
  
    <div style={{
      maxWidth: '1200px',
      margin: '30px auto',
      padding: '0 30px'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: colors.textDark,
          marginBottom: '12px'
        }}>
          Modèles de Diplômes
        </h1>
        <p style={{
          fontSize: '15px',
          color: colors.textLight,
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Sélectionnez le modèle officiel pour la génération des diplômes
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {modeles.map((modele) => (
          <div
            key={modele.idModele}
            style={{
              backgroundColor: '#FFF',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 3px 10px rgba(0,0,0,0.04)',
              border: `1px solid ${colors.border}`,
              transition: 'all 0.3s ease',
              ...(selected === modele.idModele && {
                borderColor: colors.primary,
                boxShadow: `0 5px 15px ${colors.primary}15`
              })
            }}
          >
            <div 
              style={{
                height: '180px',
                position: 'relative',
                cursor: 'pointer'
              }}
              onClick={() => setFullscreenImage(modele)}
            >
              <img
                src={`${API_BASE_URL}${modele.cheminModele}`}
                alt={modele.nomModele}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '6px 10px',
                borderRadius: '4px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path d="M12 19c-7 0-11-7-11-7s4-7 11-7 11 7 11 7-4 7-11 7z"/>
                </svg>
                Aperçu
              </div>
            </div>
            
            <div style={{ 
              padding: '16px',
              borderTop: `1px solid ${colors.border}`
            }}>
              <h3 style={{ 
                fontSize: '15px',
                fontWeight: '500',
                color: colors.textDark,
                margin: '0 0 12px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {modele.nomModele}
              </h3>
              
              <button
                onClick={() => choisirModele(modele.idModele)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: selected === modele.idModele ? colors.primary : 'transparent',
                  color: selected === modele.idModele ? 'white' : colors.primary,
                  border: `1px solid ${selected === modele.idModele ? colors.primary : colors.border}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {selected === modele.idModele ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Sélectionné
                  </>
                ) : (
                  'Sélectionner'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}
