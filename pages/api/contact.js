// pages/api/contact.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prenom, nom, email, message, phone, poste, type } = req.body;

  if (!prenom || !nom || !email || !message) {
    return res.status(400).json({ error: 'Données manquantes' });
  }

  const name = `${prenom} ${nom}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_USER,
    subject: 'Nouveau message depuis le formulaire Contact CertifyMe',
    text: `
      Nom: ${name}
      Email: ${email}
      Téléphone: ${phone || 'N/A'}
      Poste: ${poste || 'N/A'}
      Type: ${type || 'N/A'}
      Message: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email envoyé' });
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
