import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaBell, 
  FaTimes,
  FaBellSlash, 
  FaCheck, 
  FaCopy , 
  FaFileAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaChevronRight
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

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
 

const notificationColors = {
  success: colors.success,
  error: colors.error,
  warning: colors.warning,
  info: colors.info,
  default: colors.info
};


const Notification = ({ token, colors }) => {

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


    // Définir les couleurs pour chaque type de notification
  const notificationColors = {
    success: colors.success || '#10B981',
    error: colors.error || '#EF4444',
    warning: colors.warning || '#F59E0B',
    info: colors.info || '#3B82F6',
    default: colors.info || '#3B82F6'
  };

  // Fonction pour regrouper les notifications similaires
  const groupSimilarNotifications = (notifs) => {
    const grouped = {};
    
    notifs.forEach(notif => {
      // On crée une clé unique basée sur le titre et le début du message
      const key = `${notif.title}-${notif.message.substring(0, 30)}`;
      
      if (!grouped[key]) {
        grouped[key] = {
          ...notif,
          count: 1,
          ids: [notif.id],
          isRead: notif.isRead,
          latestDate: new Date(notif.createdAt)
        };
      } else {
        grouped[key].count += 1;
        grouped[key].ids.push(notif.id);
        grouped[key].isRead = grouped[key].isRead && notif.isRead;
        
        const currentDate = new Date(notif.createdAt);
        if (currentDate > grouped[key].latestDate) {
          grouped[key].latestDate = currentDate;
        }
      }
    });
    
    return Object.values(grouped);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // On ne regroupe pas ici pour garder les notifications individuelles en base
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.isRead).length);
      } catch (error) {
        console.error("Erreur récupération notifications:", error);
        if (error.response?.status === 403) {
          console.error("Accès refusé - Token peut-être invalide ou expiré");
        }
      }
    };

    if (token) fetchNotifications();
    else console.error("Aucun token fourni pour récupérer les notifications");
  }, [token]);

  const markAsRead = async (notificationIds) => {
    try {
      await Promise.all(notificationIds.map(id =>
        axios.patch(`${API_BASE_URL}/notifications/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ));

      setNotifications(prev => 
        prev.map(n => 
          notificationIds.includes(n.id) ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(prev - notificationIds.length, 0));
    } catch (error) {
      console.error("Erreur en marquant comme lu:", error);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    if (unreadIds.length > 0) {
      await markAsRead(unreadIds);
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

  // Formatage spécial pour les messages de diplôme
  const formatMessage = (message, count) => {
    if (message.includes('diplôme') || message.includes('diplome')) {
      return count > 1 
        ? `${count} nouveaux diplômes de ${message.split('de ')[1] || ''}`
        : message;
    }
    return message;
  };

  // Notifications groupées pour l'affichage
  const groupedNotifications = groupSimilarNotifications(notifications);

  return (
    <div style={{ position: 'relative' }}>
      {/* Bouton de notification avec badge */}
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
          outline: 'none',
          padding: '8px',
          borderRadius: '50%'
        }}
        whileHover={{ 
          backgroundColor: colors.lightBg,
          scale: 1.05
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              backgroundColor: colors.error,
              color: 'white',
              borderRadius: '50%',
              minWidth: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: '700',
              border: `2px solid white`,
              boxShadow: `0 2px 8px rgba(0,0,0,0.1)`
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Panneau des notifications */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={{
              position: 'absolute',
              top: 'calc(100% + 12px)',
              right: -120,
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              border: `1px solid ${colors.border}`,
              width: '390px',
              maxHeight: '80vh',
              overflow: 'hidden',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column'
            }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {/* En-tête */}
            <div style={{
              padding: '18px 24px',
              borderBottom: `1px solid ${colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: colors.lightBg
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '700',
                  color: colors.textDark,
                  letterSpacing: '0.2px'
                }}>
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span style={{
                    backgroundColor: colors.primary,
                    color: 'white',
                    borderRadius: '12px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    {unreadCount} non lues
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: colors.primary,
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: unreadCount === 0 ? 0.5 : 1,
                    pointerEvents: unreadCount === 0 ? 'none' : 'auto'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = `${colors.primary}10`}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={markAllAsRead}
                >
                  <FaCheck size={14} />
                  Tout lire
                </button>
                <button
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: colors.textLight,
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    padding: '6px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = `${colors.border}20`}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => setIsOpen(false)}
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>
            
            {/* Liste des notifications */}
            <div style={{ 
              flex: 1,
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: `${colors.border} transparent`
            }}>
              {groupedNotifications.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {groupedNotifications.map((notification) => (
                    <motion.div
                      key={notification.ids.join('-')}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        padding: '18px 24px',
                        borderBottom: `1px solid ${colors.border}`,
                        backgroundColor: notification.isRead ? 'white' : `${colors.primary}03`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                      onClick={() => markAsRead(notification.ids)}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = notification.isRead ? colors.lightBg : `${colors.primary}05`}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = notification.isRead ? 'white' : `${colors.primary}03`}
                    >
                      {!notification.isRead && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          bottom: 0,
                          width: '4px',
                          backgroundColor: colors.primary,
                          borderTopLeftRadius: '12px',
                          borderBottomLeftRadius: '12px'
                        }} />
                      )}
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'flex-start'
                      }}>
                        <div style={{
                          flexShrink: 0,
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          backgroundColor: `${notificationColors[notification.type] || colors.info}10`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: notificationColors[notification.type] || colors.info,
                          fontSize: '18px'
                        }}>
                          {notificationIcons[notification.type] || notificationIcons.default}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '6px'
                          }}>
                            <h4 style={{
                              margin: 0,
                              fontSize: '15px',
                              fontWeight: notification.isRead ? '500' : '600',
                              color: colors.textDark,
                              lineHeight: '1.4'
                            }}>
                              {notification.title}
                            </h4>
                            <span style={{
                              fontSize: '12px',
                              color: colors.textLight,
                              fontWeight: '400',
                              whiteSpace: 'nowrap',
                              marginLeft: '12px'
                            }}>
                              {formatDate(notification.latestDate)}
                            </span>
                          </div>
                          <p style={{
                            margin: '0 0 8px 0',
                            color: colors.textDark,
                            fontWeight: notification.isRead ? '400' : '450',
                            fontSize: '14px',
                            lineHeight: '1.5'
                          }}>
                            {formatMessage(notification.message, notification.count)}
                          </p>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            flexWrap: 'wrap'
                          }}>
                            <span style={{
                              fontSize: '12px',
                              color: notificationColors[notification.type] || colors.info,
                              fontWeight: '600',
                              backgroundColor: `${notificationColors[notification.type] || colors.info}08`,
                              padding: '6px 10px',
                              borderRadius: '8px',
                              lineHeight: '1'
                            }}>
                              {notificationTypes[notification.type] || notificationTypes.default}
                            </span>
                            {notification.count > 1 && (
                              <span style={{
                                fontSize: '12px',
                                color: colors.textLight,
                                fontWeight: '600',
                                backgroundColor: `${colors.border}15`,
                                padding: '6px 10px',
                                borderRadius: '8px',
                                lineHeight: '1',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <FaCopy size={10} />
                                {notification.count} envois
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  style={{
                    padding: '48px 24px',
                    textAlign: 'center',
                    color: colors.textLight,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: `${colors.border}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    color: colors.textLight
                  }}>
                    <FaBellSlash size={32} />
                  </div>
                  <h4 style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '16px',
                    fontWeight: '600',
                    color: colors.textDark
                  }}>
                    Aucune notification
                  </h4>
                  <p style={{
                    margin: '0',
                    fontSize: '14px',
                    opacity: 0.8,
                    maxWidth: '300px'
                  }}>
                    Vous n'avez aucune notification pour le moment
                  </p>
                </motion.div>
              )}
            </div>
            
            {/* Pied de page */}
            {groupedNotifications.length > 0 && (
              <div style={{
                padding: '16px 24px',
                borderTop: `1px solid ${colors.border}`,
                backgroundColor: colors.lightBg,
                display: 'flex',
                justifyContent: 'center'
              }}>
                <button
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: colors.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = `${colors.primary}10`;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  Voir toutes les notifications
                  <FaChevronRight size={14} />
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