import Student from '../models/Student.js';
import fs from 'fs';
import path from 'path';
import csv from 'fast-csv';
import { fileURLToPath } from 'url';
import { prisma } from '../prismaClient.js';

// Nécessaire pour __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const StudentController = {
  async getStudents(req, res) {
    try {
      const students = await Student.getAllStudents(req.query);
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }, 

  async uploadStudents(req, res) {
    try {
      const { facultyId, departmentId, anneeId } = req.body;
      const etudiants = [];

      // Validation des IDs
      const faculty = facultyId ? await prisma.faculty.findUnique({ where: { idFaculty: parseInt(facultyId) } }) : null;
      const department = departmentId ? await prisma.department.findUnique({ where: { idDepart: parseInt(departmentId) } }) : null;
      const annee = await prisma.anneeUniversitaire.findUnique({ where: { idAnnee: parseInt(anneeId) } });

      if (!faculty || !department || !annee) {
        return res.status(400).json({ message: "Certains ID sont invalides ou manquants." });
      }

        const filePath = path.join(__dirname, '../routes/uploads/', req.file.filename);
       
      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on('error', error => {
          throw error;
        })
        .on('data', (row) => {
          etudiants.push({
            nom: row.nom,
            prenom: row.prenom,
            email: row.email,
            matricule: row.matricule,
            telephone: row.telephone,
            dateNaissance: new Date(row.dateNaissance),
            lieuNaissance: row.lieuNaissance,
            CursusUniversitaire: {
              section: row.section,
              groupe: row.groupe,
              filiere: row.filiere,
              specialite: row.specialite,
              niveau: parseInt(row.niveau),
              moyenneAnnuelle: parseFloat(row.moyenneAnnuelle),
              idFaculty: faculty.idFaculty,
              idDepart: department.idDepart,
              idAnnee: annee.idAnnee
            }
          });
        })
        .on('end', async () => {
          try {
            // Traitement transactionnel pour éviter les insertions multiples
            await prisma.$transaction(async (prisma) => {
              for (const etudiant of etudiants) {
                await prisma.etudiant.upsert({
                  where: { email: etudiant.email },
                  create: {
                    ...etudiant,
                    CursusUniversitaire: { create: etudiant.CursusUniversitaire }
                  },
                  update: {
                    ...etudiant,
                    CursusUniversitaire: {
                      create: etudiant.CursusUniversitaire
                    }
                  }
                });
              }
            });

            // Suppression du fichier après traitement
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Erreur lors de la suppression du fichier:", err);
              } else {
                console.log("Fichier supprimé avec succès:", req.file.filename);
              }
            });

            res.json({
              status: "ok",
              filename: req.file.originalname,
              message: "Upload réussi!",
              count: etudiants.length
            });
          } catch (error) {
            console.error("Erreur Prisma:", error);
            res.status(500).json({
              status: "fail",
              message: error.message
            });
          }
        });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: error.message
      });
    }
  },
  async getStudentsByAnnee(req, res) {
    try {
      // Extraction CORRECTE du paramètre de route
      const { idAnnee } = req.params; // ← Utilisez req.params (pas req.query)
      
      if (!idAnnee || isNaN(idAnnee)) {
        return res.status(400).json({ 
          error: "Paramètre manquant ou invalide",
          details: "L'ID d'année (anneeId) est requis et doit être un nombre"
        });
      }
  
      const students = await Student.getStudentsByAnnee(parseInt(idAnnee));
      res.json(students);
      
    } catch (error) {
      console.error("Erreur complète:", error); // Log complet pour débogage
      res.status(500).json({
        error: "Erreur lors de la récupération des étudiants",
        details: process.env.NODE_ENV === 'development' ? error.message : "Détails cachés en production"
      });
    }
  }, 


   // Ajouter ces méthodes au contrôleur existant

async getStudentsByDepartment(req, res) {
  try {
    const { departmentId } = req.params;
    const students = await Student.getByDepartment(departmentId);
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

async createStudent(req, res) {
  try {
    console.log("Données reçues:", req.body);
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    console.error("Erreur détaillée:", error);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
},
async updateStudent(req, res) {
  try {
    const { id } = req.params;
    const { 
      nom, 
      prenom, 
      email, 
      matricule, 
      telephone, 
      dateNaissance, 
      lieuNaissance,
      CursusUniversitaire
    } = req.body;

    // Validation des champs obligatoires
    if (!nom || !prenom || !email || !matricule) {
      return res.status(400).json({ 
        error: 'Nom, prénom, email et matricule sont obligatoires' 
      });
    }

    // Augmenter le timeout de la transaction
    const updatedStudent = await prisma.$transaction(async (tx) => {
      // 1. Mettre à jour l'étudiant
      const student = await tx.etudiant.update({
        where: { idEtudiant: parseInt(id) },
        data: {
          nom,
          prenom,
          email,
          matricule,
          telephone: telephone || null,
          dateNaissance: dateNaissance ? new Date(dateNaissance) : new Date('2000-01-01'),
          lieuNaissance: lieuNaissance || null
        },
        include: {
          CursusUniversitaire: true
        }
      });

      // 2. Mettre à jour le cursus universitaire si fourni
      if (CursusUniversitaire && student.CursusUniversitaire.length > 0) {
        const cursusId = student.CursusUniversitaire[0].id;
        await tx.cursusUniversitaire.update({
          where: { id: cursusId },
          data: {
            section: CursusUniversitaire.section || '',
            groupe: CursusUniversitaire.groupe || '',
            filiere: CursusUniversitaire.filiere || '',
            specialite: CursusUniversitaire.specialite || '',
            niveau: CursusUniversitaire.niveau ? parseInt(CursusUniversitaire.niveau) : 1,
            moyenneAnnuelle: CursusUniversitaire.moyenneAnnuelle ? 
              parseFloat(CursusUniversitaire.moyenneAnnuelle) : null,
            // Conserver les relations existantes
            idFaculty: student.CursusUniversitaire[0].idFaculty,
            idDepart: student.CursusUniversitaire[0].idDepart,
            idAnnee: student.CursusUniversitaire[0].idAnnee
          }
        });
      }

      // Recharger les données mises à jour
      return await tx.etudiant.findUnique({
        where: { idEtudiant: parseInt(id) },
        include: { CursusUniversitaire: true }
      });
    }, {
      maxWait: 10000, // Augmenter le timeout à 10 secondes
      timeout: 10000
    });

    res.json(updatedStudent);

  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ 
      error: 'Error updating student',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
},

// In StudentController.js
async deleteStudent(req, res) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return res.status(400).json({ error: 'ID étudiant invalide' });
    }

    // Utiliser la méthode du modèle
    await Student.deleteStudent(parsedId);

    res.status(204).end();
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'étudiant:', error);
    
    // Gestion des erreurs spécifiques
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Étudiant non trouvé' });
    }
    
    res.status(500).json({ 
      error: 'Erreur lors de la suppression de l\'étudiant',
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code,
        meta: error.meta
      } : undefined
    });
  }
}
, 
  async getStudentsByDepartmentAndAnnee(req, res) {
  try {
    const { departmentId, anneeId } = req.params;

    // Validation
    if (!departmentId  || !anneeId) {
      return res.status(400).json([]); // Return empty array for consistency
    }

    const parsedDeptId = parseInt(departmentId);
    const parsedAnneeId = parseInt(anneeId);

    if (isNaN(parsedDeptId) || isNaN(parsedAnneeId)) {
      return res.status(400).json([]); // Return empty array for consistency
    }

    const students = await prisma.etudiant.findMany({
      where: {
        CursusUniversitaire: {
          some: {
            idDepart: parsedDeptId,
            idAnnee: parsedAnneeId
          }
        }
      },
      include: {
        CursusUniversitaire: {
          where: {
            idDepart: parsedDeptId,
            idAnnee: parsedAnneeId
          }
        }
      }
    });

    // Return just the array of students without success wrapper
    res.json(students || []);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json([]); // Return empty array on error
  }
},

};// 👈 Et celle-ci pour fermer le `FacultyController`
  
  export default StudentController;

