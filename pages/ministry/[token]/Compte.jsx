import { useRouter } from 'next/router';
 import axios from 'axios';
 import Header from '../../../components/HeaderMinistry.jsx';
import React, { useState, useRef, useEffect  } from 'react';
import { FaSignOutAlt, FiUser, FiLock, FiCamera, FiCreditCard, FiBell, FiShield, FiLink, FiUpload } from 'react-icons/fi';
import { MdLogout } from "react-icons/md"; // Icône Material Design
    
const Compte = () => {
    const router = useRouter();
   const { token } = router.query;
  // Palette de couleurs
  const colors = {
    primary: '#2F855A',
    secondary: '#2D3748',
    accent: '#38A169',
    lightBg: '#F7FAFC',
    darkBg: '#1A202C',
    textDark: '#1C1C1C',
    textLight: '#718096',
    border: '#CBD5E0',
    success: '#2F855A',
    error: '#C53030',
    warning: '#D69E2E'
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
          telephone: response.data.telephone,
          originalData: {
            username: response.data.username,
            email: response.data.email,
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
        numeroTelephone: formData.telephone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFormData(prev => ({
        ...prev,
        originalData: {
          username: prev.username,
          email: prev.email,
          telephone: prev.telephone
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
     <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: colors.secondary }}>Public Profile</h2>
        <p style={{ color: colors.textLight, margin: '0 0 1.5rem 0' }}>Add information about yourself</p>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: colors.secondary }}>Basics</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              style={{ 
                padding: '0.75rem', 
                border: `1px solid ${isEditing ? colors.primary : colors.border}`,
                borderRadius: '4px', 
                fontSize: '1rem', 
                marginBottom: '0.5rem',
                transition: 'border 0.2s'
              }}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              style={{ 
                padding: '0.75rem', 
                border: `1px solid ${isEditing ? colors.primary : colors.border}`,
                borderRadius: '4px', 
                fontSize: '1rem', 
                marginBottom: '0.5rem',
                transition: 'border 0.2s'
              }}
            />
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              placeholder="Telephone"
              style={{ 
                padding: '0.75rem', 
                border: `1px solid ${isEditing ? colors.primary : colors.border}`,
                borderRadius: '4px', 
                fontSize: '1rem', 
                marginBottom: '0.5rem',
                transition: 'border 0.2s'
              }}
            />
          </div>
        </div>
        
        {successMessage && (
          <div style={{ 
            color: colors.success, 
            marginBottom: '1rem',
            padding: '0.5rem',
            backgroundColor: `${colors.success}20`,
            borderRadius: '4px'
          }}>
            {successMessage}
          </div>
        )}
        
         <button 
        type="submit" 
        disabled={!isEditing || isLoading}
        style={{ 
          backgroundColor: isEditing ? colors.primary : colors.accent,
          color: 'white', 
          border: 'none', 
          padding: '0.75rem 1.5rem', 
          borderRadius: '4px', 
          fontSize: '1rem', 
          cursor: isEditing ? 'pointer' : 'not-allowed',
          transition: 'background-color 0.2s',
          opacity: isLoading ? 0.7 : 1
        }}
        onMouseOver={(e) => isEditing && (e.target.style.backgroundColor = colors.primary)}
        onMouseOut={(e) => isEditing && (e.target.style.backgroundColor = colors.primary)}
      >
        {isLoading ? 'Enregistrement...' : 'Sauvegarder'}
      </button>
      </div>
    </form>
        );

      case 'photo':
        return (
          <div>
             <h2 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: colors.secondary }}>Photo</h2>
              <p style={{ color: colors.textLight, margin: '0 0 1.5rem 0' }}> Add a nice photo of yourself for your profile.</p>
            
            <div style={{ 
              borderTop: `1px solid ${colors.border}`, 
              paddingTop: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: colors.secondary }}>Image preview</h2>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '2rem',
                marginBottom: '2rem'
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
                  border: `1px dashed ${colors.border}`
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
                    <FiCamera style={{ fontSize: '2rem', color: colors.textLight }} />
                  )}
                </div>

                <div>
                  <label style={{
                    display: 'inline-block',
                    marginBottom: '0.5rem',
                    fontWeight: '500'
                  }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoChange}
                      style={{ display: 'none' }} 
                      ref={fileInputRef}
                    />
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: colors.accent,
                      cursor: 'pointer'
                    }} onClick={() => fileInputRef.current.click()}>
                      <FiUpload /> Add / Change Image
                    </span>
                  </label>
                  <p style={{ color: colors.textLight, fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {formData.profilePhoto ? formData.profilePhoto.name : 'No file selected'}
                  </p>
                  
                  <button
                    onClick={handleUploadPhoto}
                    style={{
                      backgroundColor: colors.accent,
                      color: 'white',
                      border: 'none',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9rem',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = colors.primary}
                    onMouseOut={(e) => e.target.style.backgroundColor = colors.accent}
                  >
                    <FiUpload /> Upload image
                  </button>
                </div>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              borderTop: `1px solid ${colors.border}`,
              paddingTop: '1.5rem'
            }}>
              <button
                style={{
                  backgroundColor: colors.accent,
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'background-color 0.2s'
                }}
                onClick={handleSubmit}
                onMouseOver={(e) => e.target.style.backgroundColor = colors.primary}
                onMouseOut={(e) => e.target.style.backgroundColor = colors.accent}
              >
                Save
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
         <div >
      <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: colors.secondary }}>Change password</h2>
      
      {passwordForm.error && (
        <div style={{ 
          color: colors.error,
          marginBottom: '1rem',
          padding: '0.75rem',
          backgroundColor: `${colors.error}10`,
          borderRadius: '4px'
        }}>
          {passwordForm.error}
        </div>
      )}
      
      {passwordForm.success && (
        <div style={{ 
          color: colors.success,
          marginBottom: '1rem',
          padding: '0.75rem',
          backgroundColor: `${colors.success}10`,
          borderRadius: '4px'
        }}>
          {passwordForm.success}
        </div>
      )}
      
      <form onSubmit={handlePasswordSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: colors.secondary }}>
            Current password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Enter current password"
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: `1px solid ${colors.border}`, 
              borderRadius: '4px', 
              fontSize: '1rem' 
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: colors.secondary }}>
            New password
          </label>
          <input
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            placeholder="Enter new password (min 8 characters)"
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: `1px solid ${colors.border}`, 
              borderRadius: '4px', 
              fontSize: '1rem' 
            }}
            minLength="8"
            required
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: colors.secondary }}>
            Confirm new password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Re-type new password"
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: `1px solid ${colors.border}`, 
              borderRadius: '4px', 
              fontSize: '1rem' 
            }}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={!isPasswordEditing || isPasswordLoading}
          style={{
            backgroundColor: isPasswordEditing ? colors.primary : colors.accent,
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            cursor: isPasswordEditing ? 'pointer' : 'not-allowed',
            fontSize: '1rem',
            transition: 'background-color 0.2s',
            opacity: isPasswordLoading ? 0.7 : 1
          }}
          onMouseOver={(e) => isPasswordEditing && (e.target.style.backgroundColor = colors.primary)}
          onMouseOut={(e) => isPasswordEditing && (e.target.style.backgroundColor = colors.accent)}
        >
          {isPasswordLoading ? 'Chargement...' : 'Change password'}
        </button>
      </form>
    </div>
        );

      default:
        return <div>Profile Content</div>;
    }
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem', 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: colors.textDark,
      backgroundColor: colors.lightBg
    }}>
     <Header token={token} />
 
      <div style={{ 
        display: 'flex', 
        borderTop: `1px solid ${colors.border}`, 
        paddingTop: '1.5rem',
        marginTop: '3rem'
      }}>
        <nav style={{ 
          width: '250px', 
          paddingRight: '2rem', 
          borderRight: `1px solid ${colors.border}`
        }}>
          <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '0.75rem 1rem',
              marginBottom: '0.5rem',
              border: 'none',
              background: activeTab === 'profile' ? '#E6FFFA' : 'none',
              textAlign: 'left',
              cursor: 'pointer',
              color: activeTab === 'profile' ? colors.primary : colors.textLight,
              borderRadius: '4px',
              fontWeight: activeTab === 'profile' ? '500' : 'normal',
              transition: 'all 0.2s'
            }}
            onClick={() => setActiveTab('profile')}
          >
            <FiUser style={{ marginRight: '0.75rem', fontSize: '1.1rem' }} /> Profile
          </button>
          <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '0.75rem 1rem',
              marginBottom: '0.5rem',
              border: 'none',
              background: activeTab === 'photo' ? '#E6FFFA' : 'none',
              textAlign: 'left',
              cursor: 'pointer',
              color: activeTab === 'photo' ? colors.primary : colors.textLight,
              borderRadius: '4px',
              fontWeight: activeTab === 'photo' ? '500' : 'normal',
              transition: 'all 0.2s'
            }}
            onClick={() => setActiveTab('photo')}
          >
            <FiCamera style={{ marginRight: '0.75rem', fontSize: '1.1rem' }} /> Photo
          </button>
          <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '0.75rem 1rem',
              marginBottom: '0.5rem',
              border: 'none',
              background: activeTab === 'security' ? '#E6FFFA' : 'none',
              textAlign: 'left',
              cursor: 'pointer',
              color: activeTab === 'security' ? colors.primary : colors.textLight,
              borderRadius: '4px',
              fontWeight: activeTab === 'security' ? '500' : 'normal',
              transition: 'all 0.2s'
            }}
            onClick={() => setActiveTab('security')}
          >
            <FiLock style={{ marginRight: '0.75rem', fontSize: '1.1rem' }} /> Account Security
          </button>
          <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '0.75rem 1rem',
              marginBottom: '0.5rem',
              border: 'none',
              background: activeTab === 'subscriptions' ? '#E6FFFA' : 'none',
              textAlign: 'left',
              cursor: 'pointer',
              color: activeTab === 'subscriptions' ? colors.primary : colors.textLight,
              borderRadius: '4px',
              fontWeight: activeTab === 'subscriptions' ? '500' : 'normal',
              transition: 'all 0.2s'
            }}
            onClick={() => setActiveTab('subscriptions')}
          >
            <FiCreditCard style={{ marginRight: '0.75rem', fontSize: '1.1rem' }} /> Subscriptions
          </button>
          <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '0.75rem 1rem',
              marginBottom: '0.5rem',
              border: 'none',
              background: activeTab === 'payments' ? '#E6FFFA' : 'none',
              textAlign: 'left',
              cursor: 'pointer',
              color: activeTab === 'payments' ? colors.primary : colors.textLight,
              borderRadius: '4px',
              fontWeight: activeTab === 'payments' ? '500' : 'normal',
              transition: 'all 0.2s'
            }}
            onClick={() => setActiveTab('payments')}
          >
            <FiCreditCard style={{ marginRight: '0.75rem', fontSize: '1.1rem' }} /> Payment methods
          </button>

          <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '0.75rem 1rem',
              marginBottom: '0.5rem',
              border: 'none',
              background: activeTab === 'Deconnexion' ? '#E6FFFA' : 'none',
              textAlign: 'left',
              cursor: 'pointer',
              color: activeTab === 'Deconnexion' ? colors.error : colors.error,
              borderRadius: '4px',
              fontWeight: activeTab === 'Deconnexion' ? '500' : 'normal',
              transition: 'all 0.2s'
            }}
            onClick={handleLogout}
          >     <MdLogout style={{ marginRight: '0.75rem', fontSize: '1.1rem' }}/>
                    Déconnexion
                   </button>
         
        </nav>
        
        <main style={{ flex: 1, paddingLeft: '2rem', backgroundColor: 'white', borderRadius: '8px', padding: '2rem' }}>
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default Compte;