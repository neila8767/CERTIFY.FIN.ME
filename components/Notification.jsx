import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaBell, 
  FaBellSlash, 
  FaCheck, 
  FaFileAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaChevronRight
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';



const Notification = ({ token, colors }) => {
 const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


 useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: { 
          Authorization: `Bearer ${token}`
         }
      });
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error("Erreur récupération notifications:", error);
      
      if (error.response?.status === 403) {
        console.error("Accès refusé - Token peut-être invalide ou expiré");
        // Vous pourriez vouloir déconnecter l'utilisateur ici
        // handleLogout();
      }
    }
  };

  if (token) {
    fetchNotifications();
  } else {
    console.error("Aucun token fourni pour récupérer les notifications");
  }
}, [token]);
  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.isRead);
      await Promise.all(unread.map(n =>
        axios.patch(`${API_BASE_URL}/notifications/${n.id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ));

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadNotifications(0);
    } catch (error) {
      console.error("Erreur en marquant tout comme lu:", error);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await axios.patch(`${API_BASE_URL}/notifications/${notif.id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setNotifications(prev =>
          prev.map(n =>
            n.id === notif.id ? { ...n, isRead: true } : n
          )
        );
        setUnreadNotifications(prev => Math.max(prev - 1, 0));
      } catch (error) {
        console.error("Erreur en lisant la notif:", error);
      }
    }
  };
 const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };


  const notificationTypes = {
    success: 'Succès',
    error: 'Erreur',
    warning: 'Avertissement',
    info: 'Information',
    default: 'Notification'
  };

  const notificationIcons = {
    success: <FaCheckCircle />,
    error: <FaExclamationCircle />,
    warning: <FaExclamationTriangle />,
    info: <FaFileAlt />,
    default: <FaBell />
  };

 
  
  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          color: colors.textDark,
          border: 'none',
          outline: 'none'
        }}
        whileHover={{ backgroundColor: colors.lightBg }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBell size={18} color={colors.textDark} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            backgroundColor: colors.error,
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.65rem',
            fontWeight: '600',
            border: '2px solid white'
          }}>
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Panneau des notifications */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: `1px solid ${colors.border}`,
              width: '380px',
              maxHeight: '500px',
              overflow: 'hidden',
              zIndex: 50
            }}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {/* En-tête */}
            <div style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: colors.lightBg
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '15px',
                  fontWeight: '600',
                  color: colors.textDark,
                  letterSpacing: '0.2px'
                }}>
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span style={{
                    backgroundColor: colors.primary,
                    color: 'white',
                    borderRadius: '8px',
                    padding: '2px 6px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {unreadCount} non lues
                  </span>
                )}
              </div>
              <button
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: colors.primary,
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = `${colors.primary}10`}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={markAllAsRead}
              >
                <FaCheck size={12} />
                Tout marquer comme lu
              </button>
            </div>
            
            {/* Liste des notifications */}
            <div style={{ 
              maxHeight: '400px', 
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: `${colors.border} transparent`
            }}>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      padding: '16px 20px',
                      borderBottom: `1px solid ${colors.border}`,
                      backgroundColor: notification.isRead ? 'white' : `${colors.primary}03`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => handleNotificationClick(notification)}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = notification.isRead ? colors.lightBg : `${colors.primary}05`}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = notification.isRead ? 'white' : `${colors.primary}03`}
                  >
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start'
                    }}>
                      <div style={{
                        flexShrink: 0,
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: `${colors.info}10`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.info
                      }}>
                        {notificationIcons[notification.type] || notificationIcons.default}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '4px'
                        }}>
                          <h4 style={{
                            margin: 0,
                            fontSize: '14px',
                            fontWeight: notification.isRead ? '500' : '600',
                            color: colors.textDark,
                            lineHeight: '1.4'
                          }}>
                            {notification.title}
                          </h4>
                          <span style={{
                            fontSize: '11px',
                            color: colors.textLight,
                            fontWeight: '400',
                            whiteSpace: 'nowrap',
                            marginLeft: '8px'
                          }}>
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                        <p style={{
                          margin: '0 0 6px 0',
                          color: colors.textDark,
                          fontWeight: notification.isRead ? '400' : '450',
                          fontSize: '13px',
                          lineHeight: '1.4'
                        }}>
                          {notification.message}
                        </p>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{
                            fontSize: '11px',
                            color: colors.info,
                            fontWeight: '500',
                            backgroundColor: `${colors.info}08`,
                            padding: '4px 8px',
                            borderRadius: '6px',
                            lineHeight: '1'
                          }}>
                            {notificationTypes[notification.type] || notificationTypes.default}
                          </span>
                          {!notification.isRead && (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: colors.info,
                              marginLeft: 'auto'
                            }} />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: colors.textLight
                }}>
                  <FaBellSlash size={24} style={{ opacity: 0.5, marginBottom: '12px' }} />
                  <p style={{ 
                    margin: '0', 
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Aucune notification pour le moment
                  </p>
                  <p style={{
                    margin: '4px 0 0 0',
                    fontSize: '13px',
                    opacity: 0.7
                  }}>
                    Nous vous informerons quand il y aura du nouveau
                  </p>
                </div>
              )}
            </div>
            
            {/* Pied de page */}
            {notifications.length > 0 && (
              <div style={{
                padding: '12px 20px',
                borderTop: `1px solid ${colors.border}`,
                textAlign: 'center',
                backgroundColor: colors.lightBg
              }}>
                <button
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: colors.primary,
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    margin: '0 auto'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = `${colors.primary}10`}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Voir toutes les notifications
                  <FaChevronRight size={12} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notification;