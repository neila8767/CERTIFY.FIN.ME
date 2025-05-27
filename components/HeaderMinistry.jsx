 import React, { useState, useEffect } from 'react';
  import { FaLock, FaUserCircle, FaGraduationCap, FaBell,FaUserCog, FaChevronDown, FaSignOutAlt, FaCog, FaUser, FaShieldAlt } from 'react-icons/fa';
  import { SiBlockchaindotcom } from 'react-icons/si';
  import { MdDashboard, MdStorage, MdPeople, MdSchool } from 'react-icons/md';
  import { motion, AnimatePresence } from 'framer-motion';
  import { useRouter } from 'next/router';
  import Notification from './Notification';
  import axios from 'axios';

  
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
  
  const Header = ({ token }) => {
    const [showAccountMenu, setShowAccountMenu] = useState(false);
     
    const handleLogout = () => {
      localStorage.removeItem('ministere_token');
      localStorage.removeItem('ministere_id');
      router.push('/PageAcceuil/Login');
    };
    const router = useRouter();
    const [activeMenu, setActiveMenu] = useState(null);
    const [unreadNotifications, setUnreadNotifications] = useState(5);
    const [isScrolled, setIsScrolled] = useState(false);
    const [networkStatus, setNetworkStatus] = useState('mainnet');
  
    useEffect(() => {
      const handleScroll = () => setIsScrolled(window.scrollY > 10);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
      const safeToken = encodeURIComponent(token);
      
  
    const handleMenuAction = (item) => {
      if (item.action) {
        item.action();
        setActiveMenu(null);
      } else if (item.component) {
        router.push(item.component);
        setActiveMenu(null);
      }
    };
  
   
     const [userData, setUserData] = useState({
    username: '',
    email: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);

  // Récupération des données utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/infoMinistere', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserData({
          username: response.data.username || 'Utilisateur',
          email: response.data.email || 'email@exemple.com',
         });
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token && showAccountMenu) {
      fetchUserData();
    }
  }, [token, showAccountMenu]);
  
  return (
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm' : 'bg-white/90'}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: isScrolled ? 'rgba(255,255,255,0.98)' : 'white',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
        borderBottom: `1px solid ${colors.border}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '4.25rem'
      }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 2rem',
        height: '100%'
      }}>
       {/* Logo */}
               <motion.div
                 whileHover={{ scale: 1.02 }}
                 onClick={() => router.push('/')}
                 className="flex items-center gap-0 cursor-pointer group"
               >
                 <div className="relative">
                   <FaGraduationCap className="text-3xl text-[#2A3F8F] relative z-10 transition-transform group-hover:rotate-12" />
                   <div className="absolute inset-0 bg-[#00BCD4] rounded-full blur-[8px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                 </div>
                 {/* Logo CertifyMe */}
               <motion.div
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={() => router.push(`/`)}
                 style={{
                   display: 'flex',
                   alignItems: 'center',
                   gap: '0.8rem',
                   cursor: 'pointer',
                   background: 'transparent',
                   padding: '0.5rem 0',
                   fontSize: '1.8rem',
                   fontWeight: '800',
                   fontStyle: 'italic',
                   letterSpacing: '-0.5px',
                   background: `linear-gradient(135deg, 
                     ${colors.primary} 0%, 
                     ${colors.secondary} 30%, 
                     ${colors.accent} 70%, 
                     ${colors.primary} 100%)`,
                   WebkitBackgroundClip: 'text',
                   backgroundClip: 'text',
                   color: 'transparent',
                   textShadow: `0 2px 8px ${colors.primary}30`,
                   position: 'relative',
                   padding: '0 0.5rem'
                 }}
                 animate={{
                   backgroundPosition: ['0% 50%', '100% 50%']
                 }}
                 transition={{
                   duration: 8,
                   repeat: Infinity,
                   ease: "linear"
                 }}
               >
                 CertifyMe
                 <span style={{
                   position: 'absolute',
                   top: '-10%',
                   left: 0,
                   width: '100%',
                   height: '120%',
                   background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)`,
                   transform: 'translateX(-100%)',
                   animation: 'shine 3s infinite'
                 }}/>
                 <style jsx>{`
                   @keyframes shine {
                     0% { transform: translateX(-100%) rotate(10deg); }
                     20% { transform: translateX(100%) rotate(10deg); }
                     100% { transform: translateX(100%) rotate(10deg); }
                   }
                 `}</style>
               </motion.div>
               </motion.div>

        {/* Côté droit : Notification + Account */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
          {/* Notification */}
          <Notification token={token} colors={colors} />

          {/* Bouton Account */}
          <motion.div
                               whileHover={{ scale: 1.05 }}
                               onClick={() => setShowAccountMenu(!showAccountMenu)}
                               style={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 gap: '0.5rem',
                                 cursor: 'pointer',
                                 padding: '0.5rem 1rem',
                                 borderRadius: '10px',
                                 backgroundColor: showAccountMenu ? `${colors.primary}10` : 'transparent',
                                 transition: 'all 0.3s ease'
                               }}
                             >
                               <div style={{
                                 width: '36px',
                                 height: '36px',
                                 borderRadius: '50%',
                                 background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 color: 'white'
                               }}>
                                 <FaUserCircle size={18} />
                               </div>
                               <FaChevronDown size={14} style={{
                                 transition: 'transform 0.3s ease',
                                 transform: showAccountMenu ? 'rotate(180deg)' : 'rotate(0)'
                               }} />
                             </motion.div>

          {/* Menu Account Dropdown */}
          <AnimatePresence>
            {showAccountMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  top: '60px',
                  right: 0,
                  width: '240px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12)',
                  zIndex: 1001,
                  border: `1px solid ${colors.primary}1A`,
                  overflow: 'hidden',
                  userSelect: 'none'
                }}
                onClick={e => e.stopPropagation()}
              >
                {/* Header User Info */}
                <div style={{
                  padding: '1rem 1.2rem',
                  borderBottom: `1px solid ${colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <FaUserCircle size={22} />
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <h4 style={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      margin: 0,
                      color: colors.textDark,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '160px'
                    }}>
                      {userData?.username || 'Utilisateur'}
                    </h4>
                    <p style={{
                      fontSize: '0.82rem',
                      margin: 0,
                      color: colors.textLight,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '160px'
                    }}>
                      {userData?.email || 'email@exemple.com'}
                    </p>
                  </div>
                </div>

                {/* Menu options */}
                <div>
                  <motion.button
                    whileHover={{ backgroundColor: `${colors.primary}0A` }}
                    onClick={() => router.push(`/ministry/${token}/Compte`)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1.2rem',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      color: colors.textDark,
                      fontSize: '0.92rem',
                      textAlign: 'left'
                    }}
                  >
                    <FaLock size={16} color={colors.textLight} />
                    Mon profil
                  </motion.button>

                  <motion.button
                    whileHover={{ backgroundColor: `${colors.primary}0A` }}
                    onClick={() => router.push(`/ministry/${token}`)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1.2rem',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      color: colors.textDark,
                      fontSize: '0.92rem',
                      textAlign: 'left'
                    }}
                  >
                    <FaUserCircle size={16} color={colors.textLight} />
                    Ma page
                  </motion.button>
                </div>

                {/* Logout */}
                <div style={{ padding: '0.4rem 0', borderTop: `1px solid ${colors.border}` }}>
                  <motion.button
                    whileHover={{ backgroundColor: `${colors.error}10` }}
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1.2rem',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      color: colors.error,
                      fontSize: '0.92rem',
                      textAlign: 'left'
                    }}
                  >
                    <FaSignOutAlt size={16} color={colors.error} />
                    Déconnexion
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Barre inférieure dynamique */}
                           <motion.div
                             className="h-0.5 bg-gradient-to-r from-[#2A3F8F] to-[#00BCD4] origin-left"
                             initial={{ scaleX: 0 }}
                             animate={{ scaleX: isScrolled ? 1 : 0.2 }}
                             transition={{ type: 'spring', damping: 10 }}
                             style={{ transformOrigin: 'left' }}
                           />
      
    </header>
  );
};

export default Header;
