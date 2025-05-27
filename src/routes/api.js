import express from 'express';
import multer from 'multer';
import AnneeController from '../controllers/AnneeController.js';
import FacultyController from '../controllers/FacultyController.js';
import DepartmentController from '../controllers/DepartmentController.js';
import CursusController from '../controllers/CursusController.js';
import StudentController from '../controllers/StudentController.js';
import UniversityController from '../controllers/UniversityController.js';
import authController from '../controllers/authController.js';
import { authenticateToken } from  '../controllers/authenticateToken.js';
import StudentMinistryController from '../controllers/StudentMinistryController.js';
import DiplomasController from '../controllers/DiplomaController.js';
import NotificationController from '../controllers/NotificationController.js'
import CompteController from '../controllers/CompteController.js';
import { extractAndTranslate } from '../controllers/uploadController.js';
import EcoleController from '../controllers/EcoleController.js';
import FormationController from '../controllers/FormationController.js';
import EtudiantEcoleController from '../controllers/EtudiantEcoleController.js';
import EcoleAnneeController from '../controllers/EcoleAnneeController.js';
import CursusEcoleController from '../controllers/CursusEcoleController.js';

import path from 'path';
import fs from 'fs';


const router = express.Router();

// Get absolute directory path
const __dirname = path.resolve();

// Create uploads directory
const uploadDir = path.join(__dirname, 'src', 'routes', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });


router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image manquante" });
  }

  try {
    const imagePath = req.file.path;
    const result = await extractAndTranslate(imagePath);
    fs.unlinkSync(imagePath); // Nettoyage du fichier temporaire
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("Erreur traitement image:", error);
    res.status(500).json({ success: false, message: "Erreur lors du traitement de l'image" });
  }
});


// 1. University routes
//recupere toutes les universites possible
router.get('/universities', UniversityController.getUniversities);
router.get('/universites-with-account', UniversityController.getAllUniversitiesWithAccount);
router.get('/universites/:universityId', UniversityController.getUniversityById);

router.get('/universities/modeles', UniversityController.getModelesDiplomes);
router.put('/universities/:id/choix-modele', UniversityController.choisirModele);
router.get('/universities/:id/verifier-modele', UniversityController.verifierModeleDiplome);
 

// 2. Student routes
router.get('/students-by-annee/:idAnnee',authenticateToken, StudentController.getStudentsByAnnee);
router.post('/students/upload', upload.single('file'),authenticateToken, StudentController.uploadStudents);

const validateFaculty = (req, res, next) => {
  if (!req.body.nomFaculty || !req.body.idUni) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  next();
};

// 3. Faculty routes
router.get('/faculties', FacultyController.getAll);
//recupere les annees d'une universite
router.get('/faculties-by-university', FacultyController.getFaculties);
router.post('/faculties/upload', upload.single('file'), FacultyController.uploadFaculties);
router.post('/facultiescreate', validateFaculty, FacultyController.createFaculty);
router.put('/facultiesupdate/:id', FacultyController.updateFaculty);
router.delete('/facultiesdelete/:id', FacultyController.deleteFaculty);


// Protéger les routes
router.get('/faculties/:universityId',  authenticateToken, FacultyController.getFacultiesByUniversity);

const validateDepartment = (req, res, next) => {
  if (!req.body.nomDepart || !req.body.idFaculty || !req.body.idUni) {
      return res.status(400).json({ error: 'Missing required fields' });
  }
  next();
};

// 4. Department routes
router.get('/departments/:facultyId', DepartmentController.getByFaculty);
router.post('/departments/upload', upload.single('file'), DepartmentController.uploadDepartments);
router.post('/departmentscreate', validateDepartment, DepartmentController.createDepartment);
router.put('/departmentsupdate/:id', DepartmentController.updateDepartment);
router.delete('/departmentsdelete/:id', DepartmentController.deleteDepartment);


// 5. Cursus routes
router.get('/specialties/:departmentId', CursusController.getSpecialties);
router.get('/levels/:specialty', CursusController.getLevels);
router.get('/sections/:level', CursusController.getSections);
router.get('/students-with-cursus', CursusController.getStudentsWithCursus);
router.get('/students/:matricule', CursusController.getStudentByMatricule);

// 6. Year routes
router.get('/annee', AnneeController.getAnnee);
router.post('/annee-universitaire', AnneeController.addAnneeUniversitaire);
router.get('/annee-uniID/:idUni', AnneeController.getAnneesByUniversity);

//7. Etudiants ministere
router.post('/verifier-etudiants', StudentMinistryController.verifierEtudiants);
//8.creation de diplome
router.post('/creer-diplomes', DiplomasController.creerDiplomes);
router.get('/students-by-annee/:idAnnee', StudentController.getStudentsByAnnee);

//9. validation diplome 
// Diplômes non validés pour une université
router.get('/:universityId/recuperer-diplomes',authenticateToken, DiplomasController.getDiplomasToValidate);
// Valider tous les diplômes d'une université
router.post('/:universityId/valider-tous', authenticateToken, DiplomasController.validateAllDiplomas);
// Valider un diplôme individuel (pas besoin de l'université ici)
router.post('/:diplomaId/valider',authenticateToken, DiplomasController.validateDiploma);
// Diplômes validés pour une université 
router.get('/:universityId/diplomes-valides',authenticateToken, DiplomasController.getValidatedDiplomas);
router.post('/:diplomaId/rejeter',authenticateToken, DiplomasController.rejectDiploma);
//route pour demander un diplôme par un étudiant
router.post('/demande-diplome',authenticateToken, DiplomasController.demanderDiplome);
//route pour verifier un diplôme par url
router.get('/verifier-diplome/:hash', DiplomasController.verifierDiplome);
//8.creation de diplome
router.get('/historique', authenticateToken, DiplomasController.getHistorique);
router.post('/generate-hash', DiplomasController.generateHash);

//Notification
router.get('/notifications', authenticateToken, NotificationController.getMine);
router.patch('/notifications/:id', authenticateToken, NotificationController.markRead);

//compte
router.put('/profileMinistere',authenticateToken, CompteController.updateMinistereController);
router.get('/infoMinistere', authenticateToken, CompteController.getMinistereController);
router.put('/profileUniversity',authenticateToken, CompteController.updateUniController);
router.get('/infoUniversity', authenticateToken, CompteController.getUniController);
router.put('/profileECOLE',authenticateToken, CompteController.updateECOLEController);
router.get('/infoECOLE', authenticateToken, CompteController.getECOLEController);
router.put('/profileSTUDENT',authenticateToken, CompteController.updateSTUDENTController);
router.get('/infoSTUDENT', authenticateToken, CompteController.getSTUDENTController);

router.get('/formations/:formationId/annee/:anneeId/etudiants', FormationController.getStudentsByFormationAndAnnee);
     
router.put('/change-password', authenticateToken, CompteController.changePasswordController);

// Auth routes
router.post('/register', authController.register);
router.get('/universities-auth', authController.getUniversitiesAUTH);
router.get('/ecoles-auth', authController.getEcolesAUTH);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/login', authController.login);

// 10. Ecole routes
router.get('/ecoles', EcoleController.getEcoles); // Récupérer toutes les écoles
router.get('/ecoles-with-account', EcoleController.getAllEcolesWithAccount); // Récupérer les écoles avec compte
router.get('/ecoles/:ecoleId', EcoleController.getEcoleById); // Récupérer une école par ID
router.get('/ecoles-by-role', EcoleController.getEcolesByRole);
router.get('/ecoles-acc', EcoleController.getEcolesAccountByRole ) ;

router.get('/ecoles-modeles', EcoleController.getModelesDiplomesECOLE);
router.put('/ecoles-modeles/:id/choix-modele', EcoleController.choisirModeleECOLE);
router.get('/ecoles-modeles/:id/verifier-modele', EcoleController.verifierModeleDiplomeECOLE);
 


// Routes pour les formations
router.post('/formations/create', FormationController.createFormation);
router.put('/formations/update/:id', FormationController.updateFormation);
router.delete('/formations/delete/:id', FormationController.deleteFormation);
router.get('/ecoles/:ecoleId/formations', FormationController.getFormationsByEcole);
router.post('/formations/upload', upload.single('file'), FormationController.uploadFormations);
router.get('/students-by-anneeEcole/:idAnnee',EtudiantEcoleController.getStudentsByAnnee);

// Routes pour les étudiants des écoles
router.get('/formations/:formationId/etudiants', EtudiantEcoleController.getStudentsByFormation);
router.post('/etudiants-ecole/upload', upload.single('file'), EtudiantEcoleController.uploadStudents);
router.post('/etudiants-ecole/create', EtudiantEcoleController.createStudent);
router.put('/etudiants-ecole/update/:id', EtudiantEcoleController.updateStudent);
router.delete('/etudiants-ecole/delete/:id', EtudiantEcoleController.deleteStudent);

// Routes pour les cursus des écoles
router.get('/cursus-ecole/etudiant/:matricule', CursusEcoleController.getStudentByMatricule);
router.get('/cursus-ecole/formation/:formationId/etudiants', CursusEcoleController.getStudentsByFormation);
router.post('/cursus-ecole', CursusEcoleController.createCursus);

// Créer une année scolaire
router.post('/', EcoleAnneeController.create);
router.post('/annee-ecole', authenticateToken , EcoleAnneeController.addAnneeEcole);

// Récupérer les années d'une école
router.get('/ecole/:ecoleId', EcoleAnneeController.getByEcole);
// Définir une année comme courante
router.put('/:id/set-current', EcoleAnneeController.setCurrent);

// Supprimer une année
router.delete('/:id', EcoleAnneeController.delete);



// Créer des diplômes pour école
router.post('/creer-diplomes-ecoles',DiplomasController.creerDiplomesECOLE);
// Diplômes non validés pour une ecole
router.get('/ecoles/:ecoleId/recuperer-diplomes',authenticateToken, DiplomasController.getDiplomasToValidateECOLE);
// Valider tous les diplômes d'une ecole
router.post('/ecoles/:ecoleId/valider-tous', authenticateToken, DiplomasController.validateAllDiplomasECOLE);
// Valider un diplôme individuel 
router.post('/ecoles/:diplomaId/valider',authenticateToken, DiplomasController.validateDiplomaECOLE);
// Diplômes validés pour une ecole
router.get('/ecoles/:ecoleId/diplomes-valides',authenticateToken, DiplomasController.getValidatedDiplomasECOLE);
router.post('/ecoles/:diplomaId/rejeter',authenticateToken, DiplomasController.rejectDiplomaECOLE);
router.post('/ecoles/demande-diplome', authenticateToken , DiplomasController.demanderDiplomeECOLE);
router.get('/verifier-diplome-ecole/:hash', DiplomasController.verifierDiplomeECOLE);

router.get('/ecoles/:ecoleId/diplomes', DiplomasController.getEcoleDiplomes);


router.get('/departments/:departmentId/students', StudentController.getStudentsByDepartment);
router.post('/students/create', StudentController.createStudent);
router.put('/students/update/:id', StudentController.updateStudent);
router.delete('/students/delete/:id', StudentController.deleteStudent);

router.get('/universites/:universityId/diplomes', DiplomasController.getUniversityDiplomas);
router.delete('/universites/:universityId/diplomes/:diplomaId', DiplomasController.deleteUniversityDiploma);

router.get('/departments/:departmentId/annees/:anneeId/students',StudentController.getStudentsByDepartmentAndAnnee);
export default router;