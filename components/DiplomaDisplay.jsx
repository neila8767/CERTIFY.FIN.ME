import { useRef, useState , useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import {FaFilePdf, FaDownload,  FaGlobe, FaFlag, FaCheck, FaGraduationCap,FaPlay, FaEthereum,FaRocket,FaPlayCircle, FaShieldAlt, FaSearch, FaLock, FaUniversity, FaUserTie, FaQrcode, FaLink, FaCertificate } from 'react-icons/fa';


const DiplomaDisplay = ({ verificationResult }) => {
  const diplomaRef = useRef(null);
  const [language, setLanguage] = useState('fr'); // 'fr' ou 'ar'
  const [translatedData, setTranslatedData] = useState(null);
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
   

  useEffect(() => {
  if (!verificationResult || !verificationResult.success) return;
 const translateText = async (text) => {
  if (language !== 'en') return text;
  try {
    const response = await fetch('http://localhost:5001/translate-english', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, to: 'en' })
    });
    const result = await response.json();
    return result.translatedText;
  } catch (err) {
    console.error('Erreur de traduction', err);
    return text;
  }
};

  

  const translateAll = async () => {
    const data = verificationResult.data.diplomaOnChain;

    const translations = {
       university: await translateText( data.nomUni || data.etablissement || data[1]),
        speciality: await translateText(data.speciality || data[7]),
      birthPlace: await translateText(data.birthPlace || data[4]),
      diplomaTitle: await translateText(data.diplomaTitle || data[5]),
     };

    setTranslatedData(translations);
  };

  if (language === 'en') {
    translateAll();
  } else {
    setTranslatedData(null); // Remise à zéro si on revient au français
  }
}, [language, verificationResult]);


const handleDownloadPNG = () => {
  if (!diplomaRef.current) return;

  html2canvas(diplomaRef.current, {
    scale: 2,
    logging: false,
    useCORS: true
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = language === 'en' ? 'official-diploma.png' : 'diplome-officiel.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
};

const handleDownloadPDF = () => {
  if (!diplomaRef.current) return;

  html2canvas(diplomaRef.current, {
    scale: 2,
    logging: false,
    useCORS: true
  }).then(canvas => {
    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm'
    });

    // Calculate dimensions to maintain aspect ratio
    const imgWidth = 297; // A4 width in mm (landscape)
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(language === 'en' ? 'official-diploma.pdf' : 'diplome-officiel.pdf');
  });
};

if (!verificationResult || !verificationResult.success) return null;

// Traductions uniquement FR et EN
const translations = {
  fr: {
    conferredTo: "Décerné à",
    bornOn: "Né(e) le",
    in: "à",
    specialty: "Spécialité",
    deliveredOn: "Délivré le",
    rector: "Le Recteur",
    dean: "Le Doyen",
    type : "Diplome d'"
  },
  en: {
    conferredTo: "Awarded to",
    bornOn: "Born on",
    in: "in",
    specialty: "Specialty",
    deliveredOn: "Issued on",
    rector: "Rector",
    dean: "Dean",
    type : ""
  }
};

return (
  <div style={{ 
    padding: '2rem',
    backgroundColor: '#f8f8f8',
    minHeight: '100vh'
  }}>
    {/* Conteneur principal */}
    <div style={{ 
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '1px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      padding: '3rem',
      position: 'relative',
      border: '1px solid #eaeaea'
    }}>
      {/* Sélecteur de langue discret */}
      <div style={{ 
        position: 'absolute',
        top: '1.5rem',
        right: '1.5rem',
        display: 'flex',
        gap: '0.25rem'
      }}>
        {['fr', 'en'].map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            style={{
              padding: '0.35rem 0.75rem',
              backgroundColor: language === lang ? colors.primary : 'transparent',
              color: language === lang ? 'white' : colors.primary,
              border: language === lang ? 'none' : '1px solid #ddd',
              borderRadius: '2px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '500',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}
          >
            {lang === 'fr' ? 'FR' : 'EN'}
          </button>
        ))}
      </div>

      {/* Diplôme - version professionnelle */}
       <div 
      ref={diplomaRef}
      style={{
        position: 'relative',
        width: '700px',
        height: '500px',
        margin: '20px auto',
        backgroundImage: `url(http://localhost:5000${verificationResult.data.cheminModele})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: language === 'en' ? "'Times New Roman', serif" : "'Times New Roman', serif",
        direction: 'ltr'  // plus besoin de rtl
      }}
    >
      {/* Titre du diplôme */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        width: '80%',
        textTransform: 'uppercase'
      }}>
          {translations[language].type} {' '}
        {language === 'en'
          ? (translatedData?.diplomaTitle || verificationResult.data.diplomaOnChain.diplomaTitle || verificationResult.data.diplomaOnChain[5])
          : (verificationResult.data.diplomaOnChain.diplomaTitle || verificationResult.data.diplomaOnChain[5])
        }
      </div>

      {/* Corps du texte */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '70%',
        color: '#000',
        textAlign: 'center',
        lineHeight: '1.8'
      }}>
        <p style={{ fontSize: '18px', margin: '10px 0' }}>
          <strong>
            {language === 'en'
              ? (translatedData?.university || verificationResult.data.universite?.nomUni || verificationResult.data.diplomaOnChain.etablissement || verificationResult.data.diplomaOnChain[1])
              : (verificationResult.data.universite?.nomUni || verificationResult.data.diplomaOnChain.etablissement || verificationResult.data.diplomaOnChain[1])
            }
          </strong>
        </p>
        
        <p style={{ fontSize: '16px', fontStyle: 'italic', margin: '15px 0' }}>
          {translations[language].conferredTo}
        </p>
        
        <p style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          margin: '15px 0', 
          fontFamily: "'Times New Roman', serif"
        }}>
          {language === 'en'
            ? (translatedData?.studentName || verificationResult.data.diplomaOnChain.studentName || verificationResult.data.diplomaOnChain[2])
            : (verificationResult.data.diplomaOnChain.studentName || verificationResult.data.diplomaOnChain[2])
          }
        </p>
        
        <p style={{ fontSize: '16px', margin: '15px 0' }}>
          {translations[language].bornOn} {' '}
          {language === 'en'
            ? (translatedData?.birthDate || verificationResult.data.diplomaOnChain.birthDate || verificationResult.data.diplomaOnChain[3])
            : (verificationResult.data.diplomaOnChain.birthDate || verificationResult.data.diplomaOnChain[3])
          } {' '}
          {translations[language].in} {' '}
          {language === 'en'
            ? (translatedData?.birthPlace || verificationResult.data.diplomaOnChain.birthPlace || verificationResult.data.diplomaOnChain[4])
            : (verificationResult.data.diplomaOnChain.birthPlace || verificationResult.data.diplomaOnChain[4])
          }
        </p>
        
        <p style={{ fontSize: '18px', margin: '15px 0' }}>
        
          {translations[language].specialty} <strong>{language === 'en' ? (translatedData?.speciality || verificationResult.data.diplomaOnChain.speciality || verificationResult.data.diplomaOnChain[7]) : (verificationResult.data.diplomaOnChain.speciality || verificationResult.data.diplomaOnChain[7])}</strong>
        </p>
      </div>

      {/* Date et signature */}
      <div style={{
        position: 'absolute',
        bottom: '18%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        color: '#000',
        textAlign: 'center',
        fontSize: '16px'
      }}>
        <p>
          {translations[language].deliveredOn} {' '}
          {language === 'en'
            ? (translatedData?.dateOfIssue || verificationResult.data.diplomaOnChain.dateOfIssue || verificationResult.data.diplomaOnChain[6])
            : (verificationResult.data.diplomaOnChain.dateOfIssue || verificationResult.data.diplomaOnChain[6])
          }
        </p>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          marginTop: '40px',
          flexDirection: 'row'
        }}>
          <div style={{ borderTop: '1px solid #000', width: '200px', paddingTop: '5px' }}>
            {translations[language].rector}
          </div>
          <div style={{ borderTop: '1px solid #000', width: '200px', paddingTop: '5px' }}>
            {translations[language].dean}
          </div>
        </div>
      </div>
    </div>

      {/* Boutons de téléchargement - style professionnel */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '1rem',
        marginTop: '2.5rem',
        borderTop: '1px solid #eee',
        paddingTop: '1.5rem'
      }}>
        <button
          onClick={handleDownloadPNG}
          style={{
            padding: '0.7rem 1.5rem',
            backgroundColor: 'white',
            color: colors.primary,
            border: '1px solid #ddd',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            letterSpacing: '0.5px'
          }}
        >
          <FaDownload size={14} />
          {language === 'en' ? 'Download PNG' : 'Télécharger PNG'}
        </button>
        
        <button
          onClick={handleDownloadPDF}
          style={{
            padding: '0.7rem 1.5rem',
            backgroundColor: colors.primary,
            color: 'white',
            border: 'none',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            letterSpacing: '0.5px'
          }}
        >
          <FaFilePdf size={14} />
          {language === 'en' ? 'Download PDF' : 'Télécharger PDF'}
        </button>
      </div>
    </div>
  </div>
);
};

export default DiplomaDisplay;

