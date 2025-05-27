import { useAuth } from './AuthContext';
import { motion } from 'framer-motion';
import { FaChevronRight, FaArrowLeft, FaUserGraduate, FaUniversity, FaSchool, FaShieldAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Header from "../../components/Header.jsx";
import Footer from '../../components/Footer'; 
import SignAnimation from '../../public/animations/SignIn.json';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import {useState, useEffect } from 'react';

const RolePage = () => {
  const { setRole } = useAuth();
  const router = useRouter();
  const [clickedIndex, setClickedIndex] = useState(null);

  // Version simplifiée de la gestion des clics
  const handleRoleSelection = (role, index) => {
    setClickedIndex(index);
    setRole(role);
    
    // Redirections
    const routes = {
      UNIVERSITY: "/PageAcceuil/UniversityAuth",
      ECOLE: "/PageAcceuil/EcoleAuth",
      STUDENT: "/PageAcceuil/FormPage"
    };
    
    if (routes[role]) {
      router.push(routes[role]);
    }
  };

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

  const roleOptions = [
    {
      title: 'Étudiant',
      description: 'Gérer mes diplômes et certifications',
      role: 'STUDENT'
    },
    {
      title: 'Université',
      description: 'Émettre des diplômes sécurisés',
      role: 'UNIVERSITY'
    },
    {
      title: 'École',
      description: 'Créer des certifications professionnelles',
      role: 'ECOLE'
    }
  ];

  return (
    <div style={{ backgroundColor: colors.lightBg, minHeight: '100vh' }}>
      <header className="bg-white border-b border-gray-200">
        <Header />
      </header>

      <main>
        <div style={{
          display: 'flex',
          width: '100%',
          margin: '0 auto',
          padding: '4.2rem',
          gap: '3rem'
        }}>
          {/* Zone d'animation */}
          <div style={{ flex: 1 }}>
            <div style={{
              width: '110%',
              height: '490px',
              borderRadius: '8px',
              position: 'relative',
              overflow: 'hidden', 
              
            }}>
              <Lottie
                animationData={SignAnimation}
                loop
                autoplay
                style={{
                   position: "absolute",
                  width: "105%",
                  height: "155%",
                  bottom: -100,
                  right: "5%"
                }}
              />
            </div>
          </div>
          
          {/* Zone de sélection de rôle */}
          <div style={{
            flex: 1,
            maxWidth: '450px',
            paddingTop: '2rem'
          }}>
            <div style={{ 
              backgroundColor: colors.lightBg, 
              fontFamily: "'Inter', -apple-system, sans-serif"
            }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%', maxWidth: '500px' }}
              >
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <h1 style={{ 
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    color: colors.textDark,
                    marginBottom: '0.5rem'
                  }}>Nouveau compte</h1>
                  <p style={{ 
                    color: colors.textLight,
                    fontSize: '0.95rem'
                  }}>Sélectionnez votre profil pour continuer</p>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  {roleOptions.map((option, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRoleSelection(option.role, index)}
                      style={{
                        backgroundColor: clickedIndex === index ? `${colors.primary}20` : 'white',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        padding: '1rem 1.5rem',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{
                            fontWeight: '500',
                            color: colors.textDark,
                            marginBottom: '0.25rem'
                          }}>
                            {option.title}
                          </div>
                          <div style={{
                            fontSize: '0.85rem',
                            color: colors.textLight
                          }}>
                            {option.description}
                          </div>
                        </div>
                        <FaChevronRight color={colors.textLight} size={14} />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div style={{ 
                  textAlign: 'center',
                  color: colors.textLight,
                  fontSize: '0.9rem'
                }}>
                  Vous avez déjà un compte ?{' '}
                  <a 
                    onClick={() => router.push('/login')}
                    style={{
                      color: colors.primary,
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Se connecter
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

RolePage.getInitialProps = async () => ({});
export default RolePage;