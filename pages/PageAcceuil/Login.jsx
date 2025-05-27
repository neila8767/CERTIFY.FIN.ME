
import React, { useState } from "react";
import axios from "axios";
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaArrowLeft, FaSpinner, FaEnvelope, FaLock , FaUserCircle, FaSignInAlt, FaUserPlus, FaShieldAlt} from 'react-icons/fa';
import { useRouter } from 'next/router';
import Header from "../../components/Header.jsx";
import ScrollToTopButton from '../../components/ScrollToTopButton'; 
import LoginAnimation from '../../public/animations/login.json';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });


const Login = () => {
  const router = useRouter();
 const [formData, setFormData] = useState({
  emailOrUsername: "",  // au lieu de "email"
  password: ""
});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        formData
      );
      
      // Stockage du token dans le localStorage (optionnel)
      localStorage.setItem('token', response.data.token);
    
      // Redirection DYNAMIQUE avec le token
// Redirection DYNAMIQUE avec le token
switch(response.data.account.role) {
  case 'UNIVERSITY': {
    const safeToken = encodeURIComponent(response.data.token);
    localStorage.setItem('uni_token', response.data.token);
    router.push(`/university/${safeToken}`);
    break;
  }
  case 'MINISTERE': {
    const safeToken = encodeURIComponent(response.data.token);
    localStorage.setItem('ministere_token', response.data.token); 
    router.push(`/ministry/${safeToken}`);
    break;
  }
   
  case 'ECOLE': {
  const safeToken = encodeURIComponent(response.data.token);
  localStorage.setItem('ecole_token', response.data.token);
  console.log("Token reçu:", response.data.token); // Pour débogage
  router.push(`/ecole/${safeToken}`);
  break;
}
  case 'STUDENT':
    const safeToken = encodeURIComponent(response.data.token);
    localStorage.setItem('student_token', response.data.token); 
    router.push(`/student/${safeToken}`);
  
    break;
  default:
    router.push('/');
}

    } catch (error) {
      setError(error.response?.data?.error || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };
 
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
     <div>

       <header className="bg-white  border-b border-gray-200">
        <Header />
      </header>

    {/* Contenu principal - prend toute la largeur */}
    <main >
   
    <div style={{
  backgroundColor: "#ffffff",
  minHeight: '100vh',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  display: 'flex',
  alignItems: 'center'
}}>
  {/* Conteneur principal */}
  <div style={{
    display: 'flex',
    width: '100%',
    margin: '0 auto',
    padding: '4.2rem',
    gap: '3rem'
  }}>
    {/* Zone d'animation (gauche) - discrète */}
    <div style={{
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: '300px'
    }}>
      {/* Espace réservé pour votre animation réduite */}
      <div style={{
        width: '100%',
        height: '350px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '8px'
      }}>
        <div style={{
          color: colors.textLight,
          fontSize: '0.9rem',
          textAlign: 'center',
          padding: '1rem'
        }}>
        <Lottie
              animationData={LoginAnimation}
              loop
              autoplay
          style={{
          position: "absolute",
          right: "-1%",
          bottom: -10,
          width: "145%",
          height: "115%"
        }}
           />
        </div>
      </div>
    </div>

    {/* Zone de login (droite) */}
    <div style={{
      flex: 1,
      maxWidth: '440px',
      padding: '0 1rem', 
      paddingTop : '2rem',
    }}>
      {/* En-tête discret */}
      <div style={{ 
        marginBottom: '1rem',
        borderBottom: `1px solid ${colors.border}20`,
        paddingBottom: '1rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <h1 style={{ 
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    color: colors.textDark,
                    marginBottom: '0.5rem'
                  }}>Connexion</h1>
                  <p style={{ 
                    color: colors.textLight,
                    fontSize: '0.95rem'
                  }}>Accédez à votre espace sécurisé</p>
                </div>
          
      </div>

      {/* Formulaire ultra-minimaliste */}
       
          <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  color: colors.error, 
                  backgroundColor: '#fff5f5',
                  padding: "1rem",
                  borderRadius: "10px",
                  marginBottom: "1.5rem",
                  textAlign: "center",
                  border: `1px solid ${colors.error}20`,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaExclamationTriangle />
                {error}
              </motion.div>
            )}
  
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ marginBottom: "1.5rem" }}
            >
              <label style={{
                display: "flex",
                alignItems: 'center',
                color: colors.textDark,
                fontSize: "0.9rem",
                fontWeight: "500",
                marginBottom: "0.6rem",
                gap: '0.5rem'
              }}>
                <FaUserCircle color={colors.primary} />
                Identifiant
              </label>
              <div style={{ 
                position: 'relative',
                boxShadow: `0 4px 12px ${colors.primary}10`,
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <input 
  type="text"
  name="emailOrUsername"
  value={formData.emailOrUsername}
  onChange={handleChange}
  placeholder="Email ou nom d'utilisateur"
  style={{
    width: "100%",
    padding: '0.75rem 1rem',
              fontSize: '0.9rem',
              borderRadius: "10px",
    border: `1px solid ${colors.border}`,
    color: colors.textDark,
    transition: "all 0.3s ease",
    backgroundColor: 'white'
  }}
  required
/>
              </div>
            </motion.div>
  
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ marginBottom: "2rem" }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.6rem'
              }}>
                <label style={{
                  display: "flex",
                  alignItems: 'center',
                  color: colors.textDark,
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  gap: '0.5rem'
                }}>
                  <FaLock color={colors.primary} />
                  Mot de passe
                </label>
               
              </div>
              
              <div style={{ 
                position: 'relative',
                boxShadow: `0 4px 12px ${colors.primary}10`,
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                     padding: '0.75rem 1rem',
              fontSize: '0.9rem',
              borderRadius: "10px",
                    border: `1px solid ${colors.border}`,
                     color: colors.textDark,
                    transition: "all 0.3s ease",
                    backgroundColor: 'white'
                  }}
                  required
                />
                
              </div>
            </motion.div>
  
            <motion.button
              whileHover={{ 
                scale: 1.02,
                boxShadow: `0 8px 20px ${colors.primary}40`
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              
              style={{
                width: "100%",
                background: loading ? colors.textLight : `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`,
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: '0.75rem',
            fontSize: '0.95rem',
           fontWeight: "500",
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: `0 6px 16px ${colors.primary}30`,
                transition: "all 0.3s ease",
                display: 'flex',
                alignItems: 'center', 
                marginBottom: '1.5rem',
           
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? (
                <>
                  <FaSpinner className="spin" />
                  <span>Vérification en cours...</span>
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  <span>Se connecter</span>
                </>
              )}
            </motion.button>
               {/* Lien d'inscription */}
        <div style={{ 
          textAlign: 'center',
          fontSize: '0.85rem',
          color: colors.textLight
        }}>
          Nouvel utilisateur ?{' '}
          <a 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              router.push('/PageAcceuil/RolePage');
            }}
            style={{
              color: colors.primary,
              fontWeight: '500',
              textDecoration: 'none'
            }}
          >
            Créer un compte
          </a>
        </div>

          </form>
    </div>
  </div>
</div>
    </main>
    
        {/* Footer */}
              <footer style={{
                backgroundColor: colors.darkBg,
                color: 'white',
                padding: '4rem 2rem 2rem',
                fontSize: '0.9rem'
              }}>
                <div style={{
                  maxWidth: '1200px',
                  margin: '0 auto',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '3rem',
                  marginBottom: '3rem'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      marginBottom: '1.5rem',
                      color: colors.primary
                    }}>CertifyMe</h3>
                    <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
                      La solution ultime contre la fraude académique grâce à la blockchain.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <a href="#" style={{ color: 'white', opacity: 0.7, ':hover': { opacity: 1 } }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" strokeWidth="2"/>
                        </svg>
                      </a>
                      <a href="#" style={{ color: 'white', opacity: 0.7, ':hover': { opacity: 1 } }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" strokeWidth="2"/>
                        </svg>
                      </a>
                      <a href="#" style={{ color: 'white', opacity: 0.7, ':hover': { opacity: 1 } }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" strokeWidth="2"/>
                          <circle cx="4" cy="4" r="2" strokeWidth="2"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '1.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      opacity: 0.7
                    }}>Solutions</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Pour les universités</a></li>
                      <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Pour les entreprises</a></li>
                      <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Pour les étudiants</a></li>
                      <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>API d'intégration</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '1.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      opacity: 0.7
                    }}>Ressources</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Documentation</a></li>
                      <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Centre d'aide</a></li>
                      <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Blog</a></li>
                      <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Presse</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '1.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      opacity: 0.7
                    }}>Entreprise</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>À propos</a></li>
                      <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Carrières</a></li>
                      <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Contact</a></li>
                      <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Partenaires</a></li>
                    </ul>
                  </div>
                </div>
                
                <div style={{
                  maxWidth: '1200px',
                  margin: '0 auto',
                  paddingTop: '2rem',
                  borderTop: `1px solid ${colors.textLight}20`,
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '0.8rem',
                  opacity: 0.7
                }}>
                  <div>© 2025 CertifyMe. Tous droits réservés.</div>
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Confidentialité</a>
                    <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Conditions</a>
                    <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Cookies</a>
                  </div>
                </div>
                
              </footer>
                    <ScrollToTopButton />
                    
                    </div>
  );
};

export default Login;