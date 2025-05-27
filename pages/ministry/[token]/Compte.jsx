import { useRouter } from 'next/router';
 import axios from 'axios';
 import Header from '../../../components/HeaderMinistry.jsx';
import React, { useState, useRef, useEffect  } from 'react';
import { MdLogout } from "react-icons/md"; // Icône Material Design
import { motion } from 'framer-motion';
import { FiCheck , FiCheckCircle , FiLoader , FaSignOutAlt, FiX, FiEyeOff, FiUser, FiLock, FiCamera, FiCreditCard, FiImage, FiKey, FiEye,   FiBell, FiShield, FiLink, FiUpload , FiDollarSign , FiLogOut , FiInfo , FiEdit2, FiSave} from 'react-icons/fi';

const Compte = () => {
    const router = useRouter();
   const { token } = router.query;
  
   
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

     const handleLogout = () => {
    localStorage.removeItem('ministere_token');
    localStorage.removeItem('ministere_id');
    router.push('/PageAcceuil/Login');
  };

    const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    telephone: '',
    originalData: {}
  });
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: value
      };

      const hasChanges = Object.keys(prev.originalData).some(
        key => prev.originalData[key] !== newFormData[key]
      );
      
      setIsEditing(hasChanges);
      return newFormData;
    });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/infoMinistere', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setFormData({
          username: response.data.username,
          email: response.data.email,
            nom : response.data.nom,
          telephone: response.data.telephone,
          originalData: {
            username: response.data.username,
            email: response.data.email,
              nom : response.data.nomMinistere,
            telephone: response.data.telephone
          }
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await axios.put(`http://localhost:5000/profileMinistere`, {
        username: formData.username,
        email: formData.email,
        numeroTelephone: formData.telephone, 
        nom : formData.nom
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFormData(prev => ({
        ...prev,
        originalData: {
          username: prev.username,
          email: prev.email,
          telephone: prev.telephone,
          nom : prev.nom
        }
      }));
      
      setIsEditing(false);
      setSuccessMessage('Modification effectuée avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.error || 'Échec de la modification');
    } finally {
      setIsLoading(false);
    }
  };


  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profilePhoto: file,
          photoPreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhoto = () => {
    if (formData.profilePhoto) {
      console.log('Uploading photo:', formData.profilePhoto.name);
      alert('Photo uploaded successfully!');
    } else {
      alert('Please select a photo first!');
    }
  };

    const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    error: '',
    success: ''
  });

    const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

 const handlePasswordChange = (e) => {
  const { name, value } = e.target;

  // Mise à jour du state
  setPasswordForm(prev => ({
    ...prev,
    [name]: value,
    error: '' // Réinitialise l'erreur pendant la saisie
  }));

  // Utilise l'état actuel + le champ en cours de modification
  const updatedForm = {
    ...passwordForm,
    [name]: value
  };

  const allFieldsFilled = (
    updatedForm.currentPassword &&
    updatedForm.newPassword &&
    updatedForm.confirmPassword
  );

  setIsPasswordEditing(allFieldsFilled);
};


  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validation côté client
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordForm(prev => ({
        ...prev,
        error: "Les nouveaux mots de passe ne correspondent pas"
      }));
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordForm(prev => ({
        ...prev,
        error: "Le mot de passe doit contenir au moins 8 caractères"
      }));
      return;
    }

    try {
      setIsPasswordLoading(true);
      
      const response = await axios.put(
        'http://localhost:5000/change-password', 
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        error: '',
        success: 'Mot de passe changé avec succès!'
      });
      
      setIsPasswordEditing(false);
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        setPasswordForm(prev => ({ ...prev, success: '' }));
      }, 3000);

    } catch (error) {
      console.error('Password change error:', error);
      setPasswordForm(prev => ({
        ...prev,
        error: error.response?.data?.error || "Échec du changement de mot de passe",
        currentPassword: '' // Reset current password field for security
      }));
    } finally {
      setIsPasswordLoading(false);
    }
  };

 const renderTabContent = () => {
  switch(activeTab) {
    case 'profile':
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '2rem',
                paddingBottom: '1.5rem',
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
                  <FiUser size={24} color={colors.primary} />
                </div>
                <div>
                  <h2 style={{ 
                    fontSize: '1.75rem',
                    fontWeight: '500',
                    margin: 0,
                    color: colors.textDark
                  }}>
                    Profil Utilisateur
                  </h2>
                  <p style={{ 
                    fontSize: '0.9rem',
                    color: colors.textLight,
                    margin: 0
                  }}>
                    Gérer vos informations personnelles
                  </p>
                </div>
              </div>

              <div style={{ 
                backgroundColor: colors.lightBg,
                borderRadius: '8px',
                padding: '1.5rem',
                border: `1px solid ${colors.border}`,
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ 
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  margin: '0 0 1rem 0',
                  color: colors.textDark,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FiInfo size={18} color={colors.primary} />
                  Informations de base
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontSize: '0.875rem',
                      fontWeight: '500', 
                      color: colors.textDark 
                    }}>
                      Nom d'utilisateur
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      style={{ 
                        width: '90%',
                        padding: '0.75rem', 
                        border: `1px solid ${isEditing ? colors.primary : colors.border}`,
                        borderRadius: '6px', 
                        fontSize: '0.95rem',
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
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontSize: '0.875rem',
                      fontWeight: '500', 
                      color: colors.textDark 
                    }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{ 
                        width: '90%',
                        padding: '0.75rem', 
                        border: `1px solid ${isEditing ? colors.primary : colors.border}`,
                        borderRadius: '6px', 
                        fontSize: '0.95rem',
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
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontSize: '0.875rem',
                      fontWeight: '500', 
                      color: colors.textDark 
                    }}>
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      style={{ 
                        width: '90%',
                        padding: '0.75rem', 
                        border: `1px solid ${isEditing ? colors.primary : colors.border}`,
                        borderRadius: '6px', 
                        fontSize: '0.95rem',
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
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontSize: '0.875rem',
                      fontWeight: '500', 
                      color: colors.textDark 
                    }}>
                      Nom du Ministère
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      style={{ 
                        width: '90%',
                        padding: '0.75rem', 
                        border: `1px solid ${isEditing ? colors.primary : colors.border}`,
                        borderRadius: '6px', 
                        fontSize: '0.95rem',
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
              </div>
              
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{
                    padding: '1rem',
                    backgroundColor: `${colors.success}10`,
                    borderRadius: '6px',
                    border: `1px solid ${colors.success}`,
                    marginBottom: '1.5rem',
                    color: colors.textDark
                  }}
                >
                  <p style={{ margin: '0', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiCheckCircle color={colors.success} /> {successMessage}
                  </p>
                </motion.div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'white',
                    color: colors.textDark,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FiEdit2 size={16} />
                  {isEditing ? 'Annuler' : 'Modifier'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!isEditing || isLoading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: isEditing ? colors.primary : `${colors.primary}80`,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isEditing ? 'pointer' : 'not-allowed',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  {isLoading ? (
                    <>
                      <FiLoader className="animate-spin" size={16} />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <FiSave size={16} />
                      Sauvegarder
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>
      );

    case 'photo':
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem',
              paddingBottom: '1.5rem',
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
                <FiCamera size={24} color={colors.primary} />
              </div>
              <div>
                <h2 style={{ 
                  fontSize: '1.75rem',
                  fontWeight: '500',
                  margin: 0,
                  color: colors.textDark
                }}>
                  Photo de profil
                </h2>
                <p style={{ 
                  fontSize: '0.9rem',
                  color: colors.textLight,
                  margin: 0
                }}>
                  Mettez à jour votre photo de profil
                </p>
              </div>
            </div>

            <div style={{ 
              backgroundColor: colors.lightBg,
              borderRadius: '8px',
              padding: '1.5rem',
              border: `1px solid ${colors.border}`,
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ 
                fontSize: '1.1rem',
                fontWeight: '600',
                margin: '0 0 1rem 0',
                color: colors.textDark,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FiImage size={18} color={colors.primary} />
                Prévisualisation
              </h3>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '2rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  backgroundColor: colors.lightBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: `1px dashed ${colors.border}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  {formData.photoPreview ? (
                    <img 
                      src={formData.photoPreview} 
                      alt="Preview" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }} 
                    />
                  ) : (
                    <FiUser size={48} color={colors.textLight} />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: 'white',
                        color: colors.accent,
                        border: `1px solid ${colors.accent}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoChange}
                        style={{ display: 'none' }} 
                        ref={fileInputRef}
                      />
                      <FiUpload size={16} />
                      Choisir une image
                    </motion.label>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUploadPhoto}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: colors.primary,
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                      disabled={!formData.profilePhoto}
                    >
                      <FiUpload size={16} />
                      Téléverser
                    </motion.button>
                  </div>
                  
                  <p style={{ 
                    color: colors.textLight, 
                    fontSize: '0.85rem', 
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {formData.profilePhoto ? (
                      <>
                        <FiFile size={14} />
                        {formData.profilePhoto.name}
                      </>
                    ) : (
                      'Aucun fichier sélectionné'
                    )}
                  </p>
                </div>
              </div>
              
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '6px',
                padding: '1rem',
                border: `1px solid ${colors.border}`
              }}>
                <h4 style={{ 
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  margin: '0 0 0.5rem 0',
                  color: colors.textDark
                }}>
                  Recommandations
                </h4>
                <ul style={{ 
                  fontSize: '0.85rem',
                  color: colors.textLight,
                  margin: 0,
                  paddingLeft: '1.25rem'
                }}>
                  <li>Format JPG, PNG ou GIF</li>
                  <li>Taille minimale de 200x200 pixels</li>
                  <li>Taille maximale de 5MB</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      );

    case 'security':
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem',
              paddingBottom: '1.5rem',
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
                <FiLock size={24} color={colors.primary} />
              </div>
              <div>
                <h2 style={{ 
                  fontSize: '1.75rem',
                  fontWeight: '500',
                  margin: 0,
                  color: colors.textDark
                }}>
                  Sécurité du compte
                </h2>
                <p style={{ 
                  fontSize: '0.9rem',
                  color: colors.textLight,
                  margin: 0
                }}>
                  Gérer votre mot de passe et sécurité
                </p>
              </div>
            </div>

            <div style={{ 
              backgroundColor: colors.lightBg,
              borderRadius: '8px',
              padding: '1.5rem',
              border: `1px solid ${colors.border}`,
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ 
                fontSize: '1.1rem',
                fontWeight: '600',
                margin: '0 0 1rem 0',
                color: colors.textDark,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FiKey size={18} color={colors.primary} />
                Changer le mot de passe
              </h3>
              
              {passwordForm.error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{
                    padding: '1rem',
                    backgroundColor: `${colors.error}10`,
                    borderRadius: '6px',
                    border: `1px solid ${colors.error}`,
                    marginBottom: '1.5rem',
                    color: colors.textDark
                  }}
                >
                  <p style={{ margin: '0', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiAlertCircle color={colors.error} /> {passwordForm.error}
                  </p>
                </motion.div>
              )}
              
              {passwordForm.success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{
                    padding: '1rem',
                    backgroundColor: `${colors.success}10`,
                    borderRadius: '6px',
                    border: `1px solid ${colors.success}`,
                    marginBottom: '1.5rem',
                    color: colors.textDark
                  }}
                >
                  <p style={{ margin: '0', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiCheckCircle color={colors.success} /> {passwordForm.success}
                  </p>
                </motion.div>
              )}
              
              <form onSubmit={handlePasswordSubmit}>
                <div  style={{ 
                      marginBottom: '0.5rem',}}>
                
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontSize: '0.875rem',
                      fontWeight: '500', 
                      color: colors.textDark 
                    }}>
                      Mot de passe actuel
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        style={{ 
                          width: '80%',
                          padding: '0.75rem', 
                          border: `1px solid ${colors.border}`,
                          borderRadius: '6px', 
                          fontSize: '0.95rem',
                          paddingRight: '1rem',
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
                        required
                      />
                      
                    </div>
                  </div>
                   
                    <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontSize: '0.875rem',
                      fontWeight: '500', 
                      color: colors.textDark 
                    }}>
                      Nouveau mot de passe
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        style={{ 
                          width: '80%',
                          padding: '0.75rem', 
                          border: `1px solid ${colors.border}`,
                          borderRadius: '6px', 
                          fontSize: '0.95rem',
                          paddingRight: '1rem',
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
                        minLength="8"
                        required
                      />
                     
                    </div>
                  </div>
                 
                  
                  <div>
                    
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontSize: '0.875rem',
                      fontWeight: '500', 
                      color: colors.textDark 
                    }}>
                      Confirmer le mot de passe
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        style={{ 
                          width: '80%',
                          padding: '0.75rem', 
                          border: `1px solid ${colors.border}`,
                          borderRadius: '6px', 
                          fontSize: '0.95rem',
                          paddingRight: '1rem',
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
                        required
                      />
                      
                    </div>
                  </div>
                  
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ 
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      padding: '1rem',
                      border: `1px solid ${colors.border}`
                    }}>
                      <h4 style={{ 
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        margin: '0 0 0.5rem 0',
                        color: colors.textDark
                      }}>
                        Exigences du mot de passe
                      </h4>
                      <ul style={{ 
                        fontSize: '0.85rem',
                        color: colors.textLight,
                        margin: 0,
                        paddingLeft: '1.25rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.5rem'
                      }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {passwordForm.newPassword?.length >= 8 ? (
                            <FiCheck color={colors.success} size={14} />
                          ) : (
                            <FiX color={colors.error} size={14} />
                          )}
                          Minimum 8 caractères
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {/[A-Z]/.test(passwordForm.newPassword) ? (
                            <FiCheck color={colors.success} size={14} />
                          ) : (
                            <FiX color={colors.error} size={14} />
                          )}
                          Une majuscule
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {/[a-z]/.test(passwordForm.newPassword) ? (
                            <FiCheck color={colors.success} size={14} />
                          ) : (
                            <FiX color={colors.error} size={14} />
                          )}
                          Une minuscule
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {/\d/.test(passwordForm.newPassword) ? (
                            <FiCheck color={colors.success} size={14} />
                          ) : (
                            <FiX color={colors.error} size={14} />
                          )}
                          Un chiffre
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!isPasswordEditing || isPasswordLoading}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: isPasswordEditing ? colors.primary : `${colors.primary}80`,
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: isPasswordEditing ? 'pointer' : 'not-allowed',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      opacity: isPasswordLoading ? 0.7 : 1
                    }}
                  >
                    {isPasswordLoading ? (
                      <>
                        <FiLoader className="animate-spin" size={16} />
                        En cours...
                      </>
                    ) : (
                      <>
                        <FiKey size={16} />
                        Changer le mot de passe
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      );

    default:
      return <div>Contenu non disponible</div>;
  }
};

return (
  <div style={{ 
    flex: 1,
    padding: '3rem',
    paddingTop: '0.25rem',
    marginTop: '3.5rem',
    backgroundColor: '#FFFF',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, sans-serif"
  }}>
    <Header token={token} />
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        border: `1px solid ${colors.border}`
      }}
    >
      <div style={{ 
        display: 'flex',
        gap: '2rem'
      }}>
        <nav style={{ 
          width: '240px',
          flexShrink: 0
        }}>
          <div style={{ 
            padding: '1rem',
            marginBottom: '1.5rem',
            borderBottom: `1px solid ${colors.border}`
          }}>
            <h3 style={{ 
              fontSize: '0.875rem',
              fontWeight: '600',
              color: colors.textLight,
              margin: '0 0 0.5rem 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Paramètres du compte
            </h3>
            <p style={{ 
              fontSize: '1.25rem',
              fontWeight: '600',
              color: colors.textDark,
              margin: 0
            }}>
              { formData.username ||'Mon compte'}
            </p>
          </div>
          
          {[
            { id: 'profile', icon: <FiUser size={18} />, label: 'Profil' },
            { id: 'photo', icon: <FiCamera size={18} />, label: 'Photo' },
            { id: 'security', icon: <FiLock size={18} />, label: 'Sécurité' },
            { id: 'subscriptions', icon: <FiCreditCard size={18} />, label: 'Abonnements' },
            { id: 'payments', icon: <FiDollarSign size={18} />, label: 'Paiements' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '0.75rem 1rem',
                marginBottom: '0.25rem',
                border: 'none',
                background: activeTab === tab.id ? `${colors.primary}10` : 'none',
                textAlign: 'left',
                cursor: 'pointer',
                color: activeTab === tab.id ? colors.primary : colors.textDark,
                borderRadius: '6px',
                fontWeight: activeTab === tab.id ? '600' : 'normal',
                transition: 'all 0.2s'
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={{ 
                marginRight: '0.75rem',
                opacity: activeTab === tab.id ? 1 : 0.7
              }}>
                {tab.icon}
              </span>
              {tab.label}
            </motion.button>
          ))}
          
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${colors.border}` }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                color: colors.error,
                borderRadius: '6px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onClick={handleLogout}
            >
              <span style={{ marginRight: '0.75rem' }}>
                <FiLogOut size={18} />
              </span>
              Déconnexion
            </motion.button>
          </div>
        </nav>
        
        <main style={{ 
          flex: 1,
          padding: '0.5rem'
        }}>
          {renderTabContent()}
        </main>
      </div>
    </motion.div>
  </div>
);
};

export default Compte;