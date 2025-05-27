import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiBook, FiSearch , FiArrowLeft,  FiPlus, FiTrash2 , FiChevronDown, FiLayers, FiHome, FiUsers,  FaSignOutAlt, FiX, FiEyeOff, FiUser, FiLock, FiCamera, FiCreditCard, FiImage, FiKey, FiEye,   FiBell, FiShield, FiLink, FiUpload , FiDollarSign , FiLogOut , FiInfo , FiEdit2, FiSave} from 'react-icons/fi';
import { useRouter } from "next/router";
import Header from '../../../components/HeaderUniversity.jsx'

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

const StudentManagement = ({  }) => {
      const router = useRouter(); 
    const {departmentId , token } = router.query
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchMatricule, setSearchMatricule] = useState('');
const [searchMode, setSearchMode] = useState(false);
const [searchError, setSearchError] = useState(null);
const [errorVisible, setErrorVisible] = useState(false);

const [formErrors, setFormErrors] = useState({
  general: null,
  email: null,
  nom: null,
  prenom: null,
  matricule: null,
  specialite: null,
  telephone: null,
  dateNaissance: null,
  lieuNaissance: null
});
  const [newStudent, setNewStudent] = useState({
    nom: '',
    prenom: '',
    email: '',
    matricule: '',
    telephone: '',
    dateNaissance: '',
    lieuNaissance: '',
    CursusUniversitaire: {
      section: '',
      groupe: '',
      filiere: '',
      specialite: '',
      niveau: '',
      moyenneAnnuelle: '',
      idFaculty: '',
      idDepart: departmentId,
      idAnnee: ''
    }
  });

  const [annees, setAnnees] = useState([]);
  const [anneeId, setAnneeId] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  

useEffect(() => {
  const fetchAnnees = async () => {
      const universityId = localStorage.getItem('university_id');
      console.log("Fetching annees for university:", universityId);
   
    try {
      const response = await axios.get(`${API_BASE_URL}/annee-uniID/${universityId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.data) {
        setAnnees(response.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des années de l’université :", error);
    }
  };
  fetchAnnees();
}, [token]);
   

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {

        
        const url = anneeId
          ? `${API_BASE_URL}/departments/${departmentId}/annees/${anneeId}/students`
          : `${API_BASE_URL}/departments/${departmentId}/students`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, [departmentId, anneeId, token]);


  const handleAddStudent = async (e) => {
      e.preventDefault();
  
  // Validation
  const errors = validateStudent(newStudent);
  setFormErrors(errors);
  
  if (Object.keys(errors).length > 0) {
   setErrorVisible(true); // Affiche les erreurs
    setTimeout(() => {
      setErrorVisible(false); // Masque les erreurs après 10 secondes
    }, 10000);
    return;
  }
    try {
      // Validation des champs obligatoires
      if (!newStudent.nom || !newStudent.prenom || !newStudent.email || !newStudent.matricule) {
        throw new Error("Nom, prénom, email et matricule sont obligatoires");
      }

      // Préparation des données avec conversion des types
      const studentData = {
        nom: newStudent.nom,
        prenom: newStudent.prenom,
        email: newStudent.email,
        matricule: newStudent.matricule,
        telephone: newStudent.telephone || null,
        dateNaissance: newStudent.dateNaissance 
          ? new Date(newStudent.dateNaissance).toISOString() 
          : new Date('2000-01-01').toISOString(),
        lieuNaissance: newStudent.lieuNaissance || null,
        CursusUniversitaire: {
          section: newStudent.CursusUniversitaire.section || 'A',
          groupe: newStudent.CursusUniversitaire.groupe || '1',
          filiere: newStudent.CursusUniversitaire.filiere || 'Informatique',
          specialite: newStudent.CursusUniversitaire.specialite || null,
          niveau: parseInt(newStudent.CursusUniversitaire.niveau) || 1,
          moyenneAnnuelle: parseFloat(newStudent.CursusUniversitaire.moyenneAnnuelle) || null,
          idFaculty: newStudent.CursusUniversitaire.idFaculty 
            ? parseInt(newStudent.CursusUniversitaire.idFaculty) 
            : null,
          idDepart: parseInt(departmentId), 
          idAnnee: parseInt(newStudent.CursusUniversitaire.idAnnee)
        }
      };

      const response = await axios.post(`${API_BASE_URL}/students/create`, studentData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStudents([...students, response.data]);
      setShowAddForm(false);
      resetNewStudentForm();
    } catch (error) {
    console.error('Erreur:', error);
    setFormErrors({
      general: "Une erreur est survenue lors de la création. Veuillez réessayer."
    });
  }
};

  const resetNewStudentForm = () => {
    setNewStudent({
      nom: '',
      prenom: '',
      email: '',
      matricule: '',
      telephone: '',
      dateNaissance: '2000-01-01',
      lieuNaissance: '',
      CursusUniversitaire: {
        section: '',
        groupe: '',
        filiere: '',
        specialite: '',
        niveau: '',
        moyenneAnnuelle: '',
        idFaculty: '',
        idDepart: departmentId,
        idAnnee: ''
      }
    });
  };
const handleUpdateStudent = async (e) => {
    e.preventDefault();
  
  // Validation (sans vérifier l'unicité pour les updates)
  const errors = validateStudent(editingStudent, true);
  setFormErrors(errors);
  
  if (Object.keys(errors).length > 0) {
  setErrorVisible(true); // Affiche les erreurs
    setTimeout(() => {
      setErrorVisible(false); // Masque les erreurs après 10 secondes
    }, 10000);
    return;
  }

  try {
    // Préparer les données dans le bon format
    const updateData = {
      nom: editingStudent.nom,
      prenom: editingStudent.prenom,
      email: editingStudent.email,
      matricule: editingStudent.matricule,
      telephone: editingStudent.telephone || null,
      dateNaissance: editingStudent.dateNaissance,
      lieuNaissance: editingStudent.lieuNaissance || null,
      CursusUniversitaire: {
        section: editingStudent.CursusUniversitaire[0]?.section || '',
        groupe: editingStudent.CursusUniversitaire[0]?.groupe || '',
        filiere: editingStudent.CursusUniversitaire[0]?.filiere || '',
        specialite: editingStudent.CursusUniversitaire[0]?.specialite || '',
        niveau: editingStudent.CursusUniversitaire[0]?.niveau || 1,
        moyenneAnnuelle: editingStudent.CursusUniversitaire[0]?.moyenneAnnuelle || null
      }
    };

    const response = await axios.put(
      `${API_BASE_URL}/students/update/${editingStudent.idEtudiant}`,
      updateData,
      { 
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setStudents(students.map(student =>
      student.idEtudiant === editingStudent.idEtudiant ? response.data : student
    ));
    setEditingStudent(null);
 } catch (error) {
    console.error('Erreur:', error);
    setFormErrors({
      general: "Une erreur est survenue lors de la mise à jour. Veuillez réessayer."
    });
  }
};
 const handleSearch = async () => {
  if (!searchMatricule.trim()) {
    setSearchError("Veuillez entrer un matricule");
    return;
  }

  try {
    setLoading(true);
    setSearchError(null);
    
    const response = await axios.get( 
      `${API_BASE_URL}/students/${searchMatricule}`,
      { 
        headers: { Authorization: `Bearer ${token}` },
        params: { anneeId }
      }
    );
    
    // Si l'API retourne un seul étudiant, le mettre dans un tableau
    const result = Array.isArray(response.data) ? response.data : [response.data];
    setStudents(result);
    setSearchMode(true);
  } catch (err) {
    if (err.response?.status === 404) {
      setSearchError("Aucun étudiant trouvé avec ce matricule");
    } else {
      console.error("Erreur de recherche:", err);
      setSearchError("Erreur lors de la recherche");
    }
    setStudents([]);
  } finally {
    setLoading(false);
  }
};

const validateStudent = (student, isUpdate = false) => {
  const errors = {};
  
  // Validation des champs obligatoires
  if (!student.nom) errors.nom = "Le nom est obligatoire";
  if (!student.prenom) errors.prenom = "Le prénom est obligatoire";
  if (!student.email) {
    errors.email = "L'email est obligatoire";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
    errors.email = "Email invalide";
  }
  
  if (!student.matricule) {
    errors.matricule = "Le matricule est obligatoire";
  } else if (!/^[A-Za-z0-9]+$/.test(student.matricule)) {
    errors.matricule = "Matricule invalide (caractères alphanumériques seulement)";
  }




  // Validation de l'unicité côté front (seulement si nouveau student)
  if (!isUpdate) {
    const emailExists = students.some(s => s.email === student.email);
    const matriculeExists = students.some(s => s.matricule === student.matricule);
    const telephoneExists = student.telephone && students.some(s => s.telephone === student.telephone);

    if (emailExists) errors.email = "Cet email est déjà utilisé";
    if (matriculeExists) errors.matricule = "Ce matricule existe déjà";
    if (telephoneExists) errors.telephone = "Ce téléphone est déjà utilisé";
  }

   if (isUpdate) {
    // En mode update, on vérifie si les valeurs existent pour un autre étudiant
    const emailExists = students.some(s => 
      s.email === student.email && s.idEtudiant !== student.idEtudiant
    );
    const matriculeExists = students.some(s => 
      s.matricule === student.matricule && s.idEtudiant !== student.idEtudiant
    );
    const telephoneExists = student.telephone && students.some(s => 
      s.telephone === student.telephone && s.idEtudiant!== student.idEtudiant
    );

    if (emailExists) errors.email = "Cet email est déjà utilisé par un autre étudiant";
    if (matriculeExists) errors.matricule = "Ce matricule est déjà utilisé par un autre étudiant";
    if (telephoneExists) errors.telephone = "Ce téléphone est déjà utilisé par un autre étudiant";
  }
  return errors;
};
  const handleDeleteStudent = async (id) => {
    if (typeof window !== 'undefined' && !window.confirm('Supprimer cet étudiant?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/students/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(students.filter(student => student.idEtudiant !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const filteredStudents = students.filter(student =>
    student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.matricule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ 
           flex: 1,
           padding: '3rem',
           marginTop :'2.5rem',
          backgroundColor: '#FFFF',
          minHeight: '100vh',
           fontFamily: "'Inter', -apple-system, sans-serif"
        }}>
          
            <Header token={token} />
  
  {/* Modal d'édition d'étudiant */}
{/* Modal d'édition d'étudiant (UNIQUEMENT POUR UPDATE) */}
      {editingStudent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: 'auto',
              maxWidth: '700px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              border: `1px solid ${colors.border}`,
              padding: '1rem'
            }}
          >
            <div style={{
              paddingBottom: '1rem',
              borderBottom: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                margin: 0,
                color: colors.textDark,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FiEdit2 size={18} />
                Modifier l'étudiant
              </h3>
              <button
                onClick={() => setEditingStudent(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.textLight,
                  cursor: 'pointer',
                  fontSize: '1.1rem'
                }}
              >
                <FiX />
              </button>
            </div>

            {/* Formulaire de MISE À JOUR uniquement */}
            <form onSubmit={handleUpdateStudent} style={{ padding: '0.5rem 0' }}>
              <div style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
              }}>
                {/* Colonne gauche : Infos personnelles */}
                <div style={{
                  padding: '0.5rem',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  minWidth: '250px'
                }}>
                  <h4 style={{...headingStyle, fontSize: '0.9rem'}}>Infos personnelles</h4>
                  <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <div>
                      <label style={labelStyle}>Nom</label>
                      <input 
                        type="text" 
                        value={editingStudent.nom} 
                        onChange={(e) => setEditingStudent({ ...editingStudent, nom: e.target.value })} 
                        style={{...inputStyle, padding: '0.3rem 0.5rem'}} 
                        required 
                      />
                      {formErrors.nom && (
  <p style={{ color: colors.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>
    {formErrors.nom}
  </p>
)}
                    </div>
                    <div>
                      <label style={labelStyle}>Prénom</label>
                      <input 
                        type="text" 
                        value={editingStudent.prenom} 
                        onChange={(e) => setEditingStudent({ ...editingStudent, prenom: e.target.value })} 
                        style={{...inputStyle, padding: '0.3rem 0.5rem'}} 
                        required 
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input 
                        type="email" 
                        value={editingStudent.email} 
                        onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })} 
                        style={{...inputStyle, padding: '0.3rem 0.5rem'}} 
                        required 
                      />
                      {formErrors.email && (
  <p style={{ color: colors.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>
    {formErrors.email}
  </p>
)}
                      
                    </div>
                    <div>
                      <label style={labelStyle}>Matricule</label>
                      <input 
                        type="text" 
                        value={editingStudent.matricule} 
                        onChange={(e) => setEditingStudent({ ...editingStudent, matricule: e.target.value })} 
                        style={{...inputStyle, padding: '0.3rem 0.5rem'}} 
                        required 
                      />
                      {formErrors.matricule && (
  <p style={{ color: colors.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>
    {formErrors.matricule}
  </p>
)}
                    </div>
                  </div>
                </div>

                {/* Colonne droite : Cursus Universitaire */}
                <div style={{
                  padding: '0.5rem',
                  backgroundColor: colors.lightBg,
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  minWidth: '250px'
                }}>
                  <h4 style={{...headingStyle, fontSize: '0.9rem'}}>Cursus Universitaire</h4>
                  <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <div>
                      <label style={labelStyle}>Filière</label>
                      <input 
                        type="text" 
                        value={editingStudent.CursusUniversitaire[0]?.filiere || ''} 
                        onChange={(e) => setEditingStudent({
                          ...editingStudent,
                          CursusUniversitaire: [{
                            ...editingStudent.CursusUniversitaire[0] || {},
                            filiere: e.target.value
                          }]
                        })} 
                        style={{...inputStyle, padding: '0.3rem 0.5rem'}} 
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Spécialité</label>
                      <input 
                        type="text" 
                        value={editingStudent.CursusUniversitaire[0]?.specialite || ''} 
                        onChange={(e) => setEditingStudent({
                          ...editingStudent,
                          CursusUniversitaire: [{
                            ...editingStudent.CursusUniversitaire[0] || {},
                            specialite: e.target.value
                          }]
                        })} 
                        style={{...inputStyle, padding: '0.3rem 0.5rem'}} 
                   required   />
                    {formErrors.specialite && (
  <p style={{ color: colors.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>
    {formErrors.specialite}
  </p>
)}
                   
                      

                    </div>
                    <div>
                      <label style={labelStyle}>Niveau</label>
                      <input 
                        type="number" 
                        value={editingStudent.CursusUniversitaire[0]?.niveau || ''} 
                        onChange={(e) => setEditingStudent({
                          ...editingStudent,
                          CursusUniversitaire: [{
                            ...editingStudent.CursusUniversitaire[0] || {},
                            niveau: e.target.value
                          }]
                        })} 
                        style={{...inputStyle, padding: '0.3rem 0.5rem'}} 
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Moyenne</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={editingStudent.CursusUniversitaire[0]?.moyenneAnnuelle || ''} 
                        onChange={(e) => setEditingStudent({
                          ...editingStudent,
                          CursusUniversitaire: [{
                            ...editingStudent.CursusUniversitaire[0] || {},
                            moyenneAnnuelle: e.target.value
                          }]
                        })} 
                        style={{...inputStyle, padding: '0.3rem 0.5rem'}} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.5rem',
                borderTop: `1px solid ${colors.border}`,
                paddingTop: '1rem',
                marginTop: '1rem'
              }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  style={{...cancelButtonStyle, padding: '0.3rem 0.8rem', fontSize: '0.9rem'}}
                >
                  Annuler
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!editingStudent.nom.trim() || !editingStudent.prenom.trim()}
                  style={{
                    ...submitButtonStyle,
                    padding: '0.3rem 0.8rem',
                    fontSize: '0.9rem',
                    backgroundColor: (!editingStudent.nom.trim() || !editingStudent.prenom.trim())
                      ? `${colors.primary}80`
                      : colors.primary,
                    cursor: (!editingStudent.nom.trim() || !editingStudent.prenom.trim())
                      ? 'not-allowed'
                      : 'pointer'
                  }}
                >
                  Mettre à jour
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

{errorVisible && formErrors.general && (
  <div style={{
    padding: '0.75rem',
    backgroundColor: `${colors.error}10`,
    borderLeft: `3px solid ${colors.error}`,
    borderRadius: '4px',
    marginBottom: '1rem'
  }}>
    <p style={{ color: colors.error, fontSize: '0.875rem', margin: 0 }}>
      {formErrors.general}
    </p>
  </div>
)}
   {showAddForm && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: 'auto',
        maxWidth: '800px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        border: `1px solid ${colors.border}`,
         maxWidth: '900px', // Largeur augmentée
    maxHeight: '480px', // Hauteur réduite
    overflowY: 'auto', // Scroll si nécessaire
    padding: '1.5rem'
      }}
    >
      <div style={{
        paddingBottom: '1rem',
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          margin: 0,
          color: colors.textDark,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <FiPlus size={18} />
          Ajouter un nouvel étudiant
        </h3>
        <button
          onClick={() => setShowAddForm(false)}
          style={{
            background: 'none',
            border: 'none',
            color: colors.textLight,
            cursor: 'pointer',
            fontSize: '1.1rem'
          }}
        >
          <FiX />
        </button>
      </div>

      <form onSubmit={handleAddStudent} style={{ padding: '1rem 0' }}>
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'flex-start'
        }}>
          {/* Colonne gauche : Infos personnelles */}
          <div style={{
            flex: 1,
            padding: '1rem',
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            border: `1px solid ${colors.border}`
          }}>
            <h4 style={{...headingStyle, fontSize: '0.9rem'}}>
              <FiUser size={16} />
              Infos personnelles
            </h4>
            
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={labelStyle}>Nom*</label>
                <input
                  type="text"
                  value={newStudent.nom}
                  onChange={(e) => setNewStudent({...newStudent, nom: e.target.value})}
                  style={{...inputStyle, padding: '0.5rem 0.75rem'}}
                  required
                />
                {formErrors.nom && (
  <p style={{ color: colors.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>
    {formErrors.nom}
  </p>
)}
                
              </div>
              
              <div>
                <label style={labelStyle}>Prénom*</label>
                <input
                  type="text"
                  value={newStudent.prenom}
                  onChange={(e) => setNewStudent({...newStudent, prenom: e.target.value})}
                  style={{...inputStyle, padding: '0.5rem 0.75rem'}}
                  required
                />
                {formErrors.prenom && (
  <p style={{ color: colors.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>
    {formErrors.prenom}
  </p>
)}
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  style={{...inputStyle, padding: '0.5rem 0.75rem'}}
                  required
                />
                {formErrors.email && (
  <p style={{ color: colors.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>
    {formErrors.email}
  </p>
)}
              </div>

              <div>
                <label style={labelStyle}>Matricule*</label>
                <input
                  type="text"
                  value={newStudent.matricule}
                  onChange={(e) => setNewStudent({...newStudent, matricule: e.target.value})}
                  style={{...inputStyle, padding: '0.5rem 0.75rem'}}
                  required
                />
                {formErrors.matricule && (
  <p style={{ color: colors.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>
    {formErrors.matricule}
  </p>
)}
              </div>

              <div>
                <label style={labelStyle}>Téléphone</label>
                <input
                  type="text"
                  value={newStudent.telephone}
                  onChange={(e) => setNewStudent({...newStudent, telephone: e.target.value})}
                  style={{...inputStyle, padding: '0.5rem 0.75rem'}}
                  required
                />
                {formErrors.telephone && (
  <p style={{ color: colors.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>
    {formErrors.telephone}
  </p>
)}
              </div>

              <div>
                <label style={labelStyle}>Date de naissance</label>
                <input
                  type="date"
                  value={newStudent.dateNaissance}
                  onChange={(e) => setNewStudent({...newStudent, dateNaissance: e.target.value})}
                  style={{...inputStyle, padding: '0.5rem 0.75rem'}}
                  required

                />
                {formErrors.dateNaissance && (
  <p style={{ color: colors.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>
    {formErrors.dateNaissance}
  </p>
)}
              </div>

              <div>
                <label style={labelStyle}>Lieu de naissance</label>
                <input
                  type="text"
                  value={newStudent.lieuNaissance}
                  onChange={(e) => setNewStudent({...newStudent, lieuNaissance: e.target.value})}
                  style={{...inputStyle, padding: '0.5rem 0.75rem'}}
                  required
                />
                {formErrors.lieuNaissance && (
  <p style={{ color: colors.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>
    {formErrors.lieuNaissance}
  </p>
)}
              </div>
            </div>
          </div>

          {/* Colonne droite : Cursus Universitaire */}
          <div style={{
            flex: 1,
            padding: '1rem',
            backgroundColor: colors.lightBg,
            borderRadius: '8px',
            border: `1px solid ${colors.border}`
          }}>
            <h4 style={{...headingStyle, fontSize: '0.9rem'}}> 
              <FiBook size={16} />
              Cursus Universitaire
            </h4>
            
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={labelStyle}>Section</label>
                <input
                  type="text"
                  value={newStudent.CursusUniversitaire.section}
                  onChange={(e) => setNewStudent({
                    ...newStudent,
                    CursusUniversitaire: {
                      ...newStudent.CursusUniversitaire,
                      section: e.target.value
                    }
                  })}
                  style={{...inputStyle, padding: '0.5rem 0.75rem'}}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Groupe</label>
                <input
                  type="text"
                  value={newStudent.CursusUniversitaire.groupe}
                  onChange={(e) => setNewStudent({
                    ...newStudent,
                    CursusUniversitaire: {
                      ...newStudent.CursusUniversitaire,
                      groupe: e.target.value
                    }
                  })}
                  style={{...inputStyle, padding: '0.5rem 0.75rem'}}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Filière*</label>
                <input
                  type="text"
                  value={newStudent.CursusUniversitaire.filiere}
                  onChange={(e) => setNewStudent({
                    ...newStudent,
                    CursusUniversitaire: {
                      ...newStudent.CursusUniversitaire,
                      filiere: e.target.value
                    }
                  })}
                  style={{...inputStyle, padding: '0.5rem 0.75rem'}}
                  
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Spécialité</label>
                <input
                  type="text"
                  value={newStudent.CursusUniversitaire.specialite}
                  onChange={(e) => setNewStudent({
                    ...newStudent,
                    CursusUniversitaire: {
                      ...newStudent.CursusUniversitaire,
                      specialite: e.target.value
                    }
                  })}
                  style={{...inputStyle, padding: '0.5rem 0.75rem'}}
                  required
                />
                {formErrors.specialite && (
  <p style={{ color: colors.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>
    {formErrors.specialite}
  </p>
)}
              </div>

              <div>
                <label style={labelStyle}>Niveau*</label>
                <input
                  type="number"
                  value={newStudent.CursusUniversitaire.niveau}
                  onChange={(e) => setNewStudent({
                    ...newStudent,
                    CursusUniversitaire: {
                      ...newStudent.CursusUniversitaire,
                      niveau: e.target.value
                    }
                  })}
                  style={{...inputStyle, padding: '0.5rem 0.75rem'}}

                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Moyenne annuelle</label>
                <input
                  type="number"
                  step="0.01"
                  value={newStudent.CursusUniversitaire.moyenneAnnuelle}
                  onChange={(e) => setNewStudent({
                    ...newStudent,
                    CursusUniversitaire: {
                      ...newStudent.CursusUniversitaire,
                      moyenneAnnuelle: e.target.value
                    }
                  })}
                  style={{...inputStyle, padding: '0.5rem 0.75rem'}}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Année universitaire*</label>
                <select
                  value={newStudent.CursusUniversitaire.idAnnee}
                  onChange={(e) => setNewStudent({
                    ...newStudent,
                    CursusUniversitaire: {
                      ...newStudent.CursusUniversitaire,
                      idAnnee: e.target.value
                    }
                  })}
                  style={{...inputStyle, padding: '0.5rem 0.75rem'}}
                  required
                >
                  <option value="">Sélectionner une année</option>
                  {annees.map(annee => (
                    <option key={annee.idAnnee} value={annee.idAnnee}>
                      {annee.annee}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          borderTop: `1px solid ${colors.border}`,
          paddingTop: '1.5rem',
          marginTop: '1.5rem'
        }}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setShowAddForm(false)}
            style={{
              ...cancelButtonStyle,
              padding: '0.5rem 1.25rem'
            }}
          >
            Annuler
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            style={{
              ...submitButtonStyle,
              padding: '0.5rem 1.25rem',
              display: 'flex',
              backgroundColor: colors.primary,
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FiSave size={16} />
            Enregistrer
          </motion.button>
        </div>
      </form>
    </motion.div>
  </motion.div>
)}
  {/* Modal principal de gestion des étudiants */}
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '1200px',
      overflow: 'auto',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      border: `1px solid ${colors.border}`
    }}
  >
    <div style={{
      padding: '1.5rem',
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      backgroundColor: 'white',
      zIndex: 10
    }}>
      <div style={{ 
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem'
}}>
  {/* Bloc gauche : Icône + Texte */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      background: `linear-gradient(135deg, ${colors.lightBg}, ${colors.border})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <FiUsers size={24} color={colors.primary} />
    </div>
    <div>
      <h2 style={{ 
        fontSize: '1.75rem',
        fontWeight: '500',
        margin: 0,
        color: colors.textDark
      }}>
        Gestion des Étudiants
      </h2>
      <p style={{ 
        fontSize: '0.9rem',
        color: colors.textLight,
        margin: 0
      }}>
        Liste complète des étudiants du département
      </p>
    </div>
  </div>

 
</div>
  {/* Bloc droit : Bouton retour */}
  <button
    onClick={() => router.back()}
      style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: 'white',
            color: colors.textDark,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
  >
    ← Retour
  </button>
      
    </div>

    <div style={{ padding: '1.5rem' }}>
      {/* Barre de recherche et filtres */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '1.5rem',
        gap: '1rem'
      }}>
        <div style={{ flex: 1 }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: colors.textDark,
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>Sélectionner l'année</label>
          <select
            value={anneeId}
            onChange={(e) => setAnneeId(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              fontSize: '0.875rem',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(colors.textLight)}'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '16px'
            }}
          >
            <option value=''>Tous les étudiants</option>
            {annees.map((annee) => (
              <option key={annee.idAnnee} value={annee.idAnnee}>{annee.annee}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: 2, position: 'relative' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: colors.textDark,
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>Rechercher par matricule</label>
          <div style={{ display: 'flex', gap: '0.75rem'}}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Entrez un matricule..."
                value={searchMatricule}
                onChange={(e) => setSearchMatricule(e.target.value)}
                style={{
                  width: '80%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  borderRadius: '8px',
                  
                   marginTop: '10px',
                   border: `1px solid ${colors.border}`,
              fontSize: '0.875rem',
              appearance: 'none',
                  outline: 'none',
                  
backgroundPosition: 'right 1rem center',
              backgroundSize: '16px',
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
              <FiSearch style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                
                transform: 'translateY(-50%)',
                color: colors.textLight
              }} />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              style={{
                padding: '0.7rem 1.5rem',
                 backgroundColor: `${colors.primary}10`,
                            color: colors.primary,
                            border: `1px solid ${colors.primary}`,
                          borderRadius: '8px',
                          
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FiSearch size={16} />
              Rechercher
            </motion.button>
            
            
          </div>
        </div>

        <motion.button
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => setShowAddForm(true)} // Changé ici
  style={{
    padding: '0.75rem 1.25rem',
    backgroundColor: colors.accent,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }}
>
  <FiPlus size={16} />
  Ajouter un étudiant
</motion.button>
      </div>

      {/* Liste des étudiants */}
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem',
          color: colors.textLight
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: `3px solid ${colors.border}`,
            borderTopColor: colors.primary,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      ) : filteredStudents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ 
            textAlign: 'center',
            padding: '3rem',
            color: colors.textLight,
            backgroundColor: colors.lightBg,
            borderRadius: '8px',
            border: `1px dashed ${colors.border}`
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.textLight} style={{ opacity: 0.5 }}>
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="7" r="4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p style={{ margin: '1rem 0 0', fontSize: '1rem' }}>Aucun étudiant trouvé</p>
        <motion.button
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => setShowAddForm(true)} // Changé ici
  style={{
    padding: '0.75rem 1.5rem',
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginTop: '1.5rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem'
  }}
>
  <FiPlus size={16} />
  Ajouter votre premier étudiant
</motion.button>
        </motion.div>
      ) : (
        <div style={{ 
          border: `1px solid ${colors.border}`,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            overflowX: 'auto',
            width: '100%'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '100%'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: colors.lightBg,
                  borderBottom: `1px solid ${colors.border}`
                }}>
                  {['Nom', 'Prénom', 'Matricule', 'Filière', 'Specialite' , 'Niveau', 'Section', 'Moeynne', 'Actions'].map((header, index) => (
                    <th key={index} style={{
                      padding: '1rem',
                      textAlign: index === 4 ? 'center' : 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: colors.textDark
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr 
                    key={student.idEtudiant} 
                    style={{
                      borderBottom: `1px solid ${colors.border}`,
                      backgroundColor: index % 2 === 0 ? 'white' : colors.lightBg
                    }}
                  >
                    <td style={{
                      padding: '1rem',
                      fontSize: '0.875rem',
                      color: colors.textDark,
                      fontWeight: '500'
                    }}>
                      {student.nom}
                    </td>
                    <td style={{
                      padding: '1rem',
                      fontSize: '0.875rem',
                      color: colors.textDark
                    }}>
                      {student.prenom}
                    </td>
                    <td style={{
                      padding: '1rem',
                      fontSize: '0.875rem',
                      color: colors.textDark,
                      fontFamily: 'monospace'
                    }}>
                      {student.matricule}
                    </td>
                    <td style={{
                      padding: '1rem',
                      fontSize: '0.875rem',
                      color: colors.textDark
                    }}>
                      {student.CursusUniversitaire[0]?.filiere || 'N/A'}
                    </td>
                    <td style={{
                      padding: '1rem',
                      fontSize: '0.875rem',
                      color: colors.textDark,
                      textAlign: 'center'
                    }}>
                      {student.CursusUniversitaire[0]?.specialite || 'N/A'}
                    </td>
                    <td style={{
                      padding: '1rem',
                      fontSize: '0.875rem',
                      color: colors.textDark,
                      textAlign: 'center'
                    }}>
                      {student.CursusUniversitaire[0]?.niveau || 'N/A'}
                    </td>
                    <td style={{
                      padding: '1rem',
                      fontSize: '0.875rem',
                      color: colors.textDark,
                      textAlign: 'center'
                    }}>
                      {student.CursusUniversitaire[0]?.section || 'N/A'}
                    </td>
                    <td style={{
                      padding: '1rem',
                      fontSize: '0.875rem',
                      color: colors.textDark,
                      textAlign: 'center'
                    }}>
                      {student.CursusUniversitaire[0]?.moyenneAnnuelle || 'N/A'}
                    </td>
                    <td style={{
                      padding: '1rem',
                      textAlign: 'right'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '0.75rem'
                      }}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditingStudent(student)}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: `${colors.primary}10`,
                            color: colors.primary,
                            border: `1px solid ${colors.primary}`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <FiEdit2 size={14} />
                        
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteStudent(student.idEtudiant)}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: `${colors.lightBg}10`,
                            color: colors.error,
                            border: `1px solid ${colors.error}`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <FiTrash2 size={14} />
                          
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  </motion.div>
</div>
  )
};

export default StudentManagement;


const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  color: colors.textDark,
  fontSize: '0.875rem',
  fontWeight: '500'
};

const inputStyle = {
  width: '90%',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: `1px solid ${colors.border}`,
  fontSize: '0.875rem',
  outline: 'none'
};

const headingStyle = {
  marginBottom: '1rem',
  fontSize: '1rem',
  fontWeight: '600',
  color: colors.textDark,
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const cancelButtonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: 'white',
  color: colors.textDark,
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500'
};

const submitButtonStyle = {
  padding: '0.75rem 1.5rem',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: '500'
};
