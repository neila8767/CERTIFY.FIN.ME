
import { motion } from 'framer-motion';
import { FaChevronDown, FaArrowLeft, FaUser, FaLock, FaUniversity, FaShieldAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useAuth } from './AuthContext';
import Header from "../../components/Header.jsx";
import Footer from '../../components/Footer.jsx'; 
import LoginAnimation from '../../public/animations/login.json';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });


const UniversityPage = () => {
  const {
    universities,
    selectedUniversity,
    handleUniversitySelect,
    formData,
    handleChange,
    errors,
    handleSubmit
  } = useAuth();

  const router = useRouter();
  
  const colors = {
    primary: '#1E3A8A',
    secondary: '#2D3748',
    accent: '#1E3A8A',
    lightBg: '#F9FAFB',
    darkBg: '#1A202C',
    textDark: '#111827',
    textLight: '#6B7280',
    border: '#D1D5DB',
    success: '#16A34A',
    error: '#DC2626',
    warning: '#F59E0B'
  };

  return (
    <div style={{ backgroundColor: colors.lightBg, minHeight: '100vh' }}>
      <header className="bg-white border-b border-gray-200">
        <Header />
      </header>

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
  paddingTop: '2rem',
}}>
  <div style={{ 
    width: '100%',
    maxWidth: '400px'
  }}>
    {/* Titre discret */}
    <div style={{ 
      textAlign: 'center',
      marginBottom: '2.5rem',
    }}>
      <h1 style={{ 
        fontSize: '1.5rem',
        fontWeight: '500',
        color: colors.textDark,
        marginBottom: '0.25rem'
      }}>Accès Université</h1>
      <p style={{ 
        color: colors.textLight,
        fontSize: '0.875rem'
      }}>Identifiez votre établissement</p>
    </div>

    {/* Formulaire ultra-minimaliste */}
    <form onSubmit={handleSubmit}>
      {/* Liste déroulante améliorée */}
      <div style={{ 
        marginBottom: '1.5rem',
        position: 'relative'
      }}>
        <select
          onChange={handleUniversitySelect}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: `1px solid ${colors.border}`,
            borderRadius: '6px',
            backgroundColor: 'white',
            fontSize: '0.875rem',
            color: colors.textDark,
            appearance: 'none',
            paddingRight: '2rem', // Espace pour l'icône
            boxShadow: `0 2px 8px ${colors.border}20`,
            transition: 'all 0.3s ease',
            ':hover': {
              borderColor: colors.primary
            }
          }}
          required
        >
          <option value="">Sélectionner une université</option>
          {universities.map((uni) => (
            <option key={uni.idUni} value={uni.idUni}>{uni.nomUni}</option>
          ))}
        </select>
        {/* Icône de chevron */}
        <div style={{
          position: 'absolute',
          right: '0.75rem',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: colors.textLight
        }}>
          <FaChevronDown size={14} />
        </div>
      </div>

      {selectedUniversity && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          style={{ overflow: 'hidden' }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.8125rem',
              color: colors.textDark,
              fontWeight: '500'
            }}>Identifiant admin</label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${colors.border}`,
                borderRadius: '6px',
                fontSize: '0.875rem',
                boxShadow: `0 2px 8px ${colors.border}10`,
                transition: 'all 0.3s ease',
                ':focus': {
                  borderColor: colors.primary,
                  outline: 'none'
                }
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.8125rem',
              color: colors.textDark,
              fontWeight: '500'
            }}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.password 
                    ? `1px solid ${colors.error}` 
                    : `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  boxShadow: `0 2px 8px ${colors.border}10`,
                  transition: 'all 0.3s ease',
                  ':focus': {
                    borderColor: errors.password ? colors.error : colors.primary,
                    outline: 'none'
                  }
                }}
                required
              />
            </div>
            {errors.password && (
              <p style={{
                color: colors.error,
                fontSize: '0.75rem',
                marginTop: '0.25rem'
              }}>{errors.password}</p>
            )}
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontWeight: '500',
              boxShadow: `0 4px 12px ${colors.primary}30`,
              transition: 'all 0.3s ease'
            }}
          >
            Continuer
          </motion.button>
        </motion.div>
      )}
    </form>

    <div style={{ 
      marginTop: '1.5rem',
      textAlign: 'center'
    }}>
      <a 
        onClick={() => router.push('/PageAcceuil/Login')}
        style={{
          color: colors.primary,
          fontSize: '0.8125rem',
          cursor: 'pointer',
          textDecoration: 'none',
          fontWeight: '500',
          transition: 'all 0.2s ease',
          ':hover': {
            textDecoration: 'underline'
          }
        }}
      >
        Déjà un compte ? Se connecter
      </a>
    </div>
  </div>
</div>
   
          </div>
           </div>
      </main>
      <Footer />
      
    </div>
  );
};

UniversityPage.getInitialProps = async () => ({});
export default UniversityPage;