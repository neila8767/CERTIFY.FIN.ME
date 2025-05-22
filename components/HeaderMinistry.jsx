import React, { useState, useEffect } from 'react';
import { FaLock, FaBell, FaUserCircle, FaGraduationCap, FaChevronDown, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { SiBlockchaindotcom } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Notification from './Notification';
import axios from 'axios';

const colors = {
  primary: '#2F855A',
  secondary: '#2D3748',
  accent: '#38A169',
  darkBg: '#1A202C',
  lightBg: '#F7FAFC',
  textDark: '#1C1C1C',
  textLight: '#718096',
  border: '#CBD5E0',
  blockchain: '#5F6FF9',
  error: '#C53030'
};

const Header = ({ token }) => {
  console.log("token header", token);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [networkStatus, setNetworkStatus] = useState('mainnet');

  const handleLogout = () => {
    localStorage.removeItem('ministere_token');
    localStorage.removeItem('ministere_id');
    router.push('/PageAcceuil/Login');
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const safeToken = encodeURIComponent(token);

  const menuItems = [
    {
      id: 'blockchain',
      label: 'Explorateur Blockchain',
      icon: <SiBlockchaindotcom />,
      subItems: [
        /* { label: 'Transactions', action: () => router.push('/blockchain/transactions') },
        { label: 'Smart Contracts', action: () => router.push('/blockchain/contracts') },
        { label: 'Certificats NFT', action: () => router.push('/blockchain/nfts') }
        */
      ]
    },
  ];

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
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: isScrolled ? 'rgba(255,255,255,0.98)' : 'white',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
      borderBottom: `1px solid ${colors.border}`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      height: '72px'
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
        {/* Logo et Navigation Principale */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push(`/ministry?token=${safeToken}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              cursor: 'pointer'
            }}
          >
            <div style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              width: '45px',
              height: '45px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 12px ${colors.primary}40`
            }}>
              <FaGraduationCap color="white" size={20} />
            </div>
            <span style={{
              fontSize: '1.6rem',
              fontWeight: '800',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}>CertifyMe</span>
          </motion.div>

          {/* Menu Principal */}
          <nav style={{ display: 'flex', gap: '0.5rem' }}>
            {menuItems.map((item) => (
              <div key={item.id} style={{ position: 'relative' }}>
                <motion.button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeMenu === item.id ? colors.lightBg : 'transparent',
                    color: activeMenu === item.id ? colors.primary : colors.textDark,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  whileHover={{ backgroundColor: colors.lightBg }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => item.subItems ? setActiveMenu(activeMenu === item.id ? null : item.id) : handleMenuAction(item)}
                >
                  <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                  {item.label}
                  {item.subItems && (
                    <motion.span
                      animate={{ rotate: activeMenu === item.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaChevronDown size={12} />
                    </motion.span>
                  )}
                </motion.button>

                {/* Sous-menu */}
                {item.subItems && (
                  <AnimatePresence>
                    {activeMenu === item.id && (
                      <motion.div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                          border: `1px solid ${colors.border}`,
                          minWidth: '220px',
                          padding: '0.5rem 0',
                          zIndex: 20,
                          overflow: 'hidden'
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      >
                        {item.subItems.map((subItem, index) => (
                          <motion.button
                            key={index}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '0.75rem 1.5rem',
                              border: 'none',
                              backgroundColor: 'transparent',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              color: colors.textDark,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem'
                            }}
                            whileHover={{ backgroundColor: colors.lightBg }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleMenuAction(subItem)}
                          >
                            {subItem.label}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Côté Droit - Utilisateur et Notifications */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Composant Notification */}
          <Notification token={token} colors={colors} />

          {/* Menu Utilisateur */}
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

          {/* Account Dropdown */}
         <AnimatePresence>
  {showAccountMenu && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute',
        top: '80px',
        right: '20px',
        width: '280px',
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        zIndex: 1001,
        overflow: 'hidden',
        border: `1px solid ${colors.primary}20`
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header avec infos du compte */}
      <div style={{
        padding: '1.2rem',
        borderBottom: `1px solid ${colors.lightBg}`,
        display: 'flex',
        gap: '0.8rem',
        alignItems: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          <FaUserCircle size={20} />
        </div>
        <div>
          <h4 style={{ 
            fontSize: '0.95rem',
            fontWeight: '600',
            margin: '0 0 0.1rem',
            color: colors.textDark
          }}>
            {userData?.username || 'Utilisateur'}
          </h4>
          <p style={{ 
            fontSize: '0.85rem',
            margin: 0,
            color: colors.textLight,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            maxWidth: '200px'
          }}>
            {userData?.email || 'email@exemple.com'}
          </p>
        </div>
      </div>
      
      {/* Section principale */}
      <div style={{ padding: '0.5rem 0' }}>
        <motion.button
          whileHover={{ backgroundColor: colors.lightBg }}
          onClick={() => router.push(`/ministry/${token}/Compte`)}
         style={{
            width: '100%',
            padding: '0.8rem 1.2rem',
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            cursor: 'pointer',
            color: colors.textDark,
            fontSize: '0.95rem',
            textAlign: 'left'
          }}
        >
          <FaLock color={colors.textLight} />
          Mon profil
        </motion.button>
        
        <motion.button
          whileHover={{ backgroundColor: colors.lightBg }}
         onClick={() => router.push(`/ministry/${token}`)}
          style={{
            width: '100%',
            padding: '0.8rem 1.2rem',
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            cursor: 'pointer',
            color: colors.textDark,
            fontSize: '0.95rem',
            textAlign: 'left'
          }}
        >
           <FaUserCircle color={colors.textLight} />
         Ma Page
        </motion.button>

       
      </div>
      
      {/* Section déconnexion */}
      <div style={{
        padding: '0.5rem 0',
        borderTop: `1px solid ${colors.lightBg}`
      }}>
        <motion.button
          whileHover={{ backgroundColor: colors.lightBg }}
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '0.8rem 1.2rem',
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            cursor: 'pointer',
            color: colors.error,
            fontSize: '0.95rem',
            textAlign: 'left'
          }}
        >
          <FaSignOutAlt color={colors.error} />
          Déconnexion
        </motion.button>
      </div>
    </motion.div>
  )}
</AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;