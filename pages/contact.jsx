import { useState } from 'react';
import Header from '../components/Header';

export default function Contact() {
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    phone: '',
    poste: '',
    type: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Envoi en cours...');

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("Merci de nous avoir contacté. L'équipe CertifyMe va vous répondre le plus tôt possible.");
      setForm({
        prenom: '',
        nom: '',
        email: '',
        phone: '',
        poste: '',
        type: '',
        message: '',
      });
    } else {
      setStatus('Une erreur est survenue, veuillez réessayer.');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-green-100">
      {/* EFFETS SPATIAUX FLOUS */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-72 h-72 bg-blue-300 rounded-full opacity-30 blur-3xl top-10 left-10 animate-pulse" />
        <div className="absolute w-96 h-96 bg-green-300 rounded-full opacity-20 blur-2xl bottom-20 left-1/2 animate-pulse" />
        <div className="absolute w-64 h-64 bg-purple-300 rounded-full opacity-30 blur-3xl top-1/2 right-10 animate-pulse" />
      </div>

      <header className="bg-white shadow-sm border-b border-gray-200 relative z-10">
        <Header />
      </header>

      {/* Espace après le header */}
      <div className="h-20" />

      <div className="relative z-10 max-w-xl mx-auto bg-white/80 backdrop-blur-md rounded-lg shadow-md p-8 my-10">
        <h1 className="text-3xl font-bold text-[#2A3F8F] mb-6 text-center">Contactez-nous</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="prenom"
            value={form.prenom}
            onChange={handleChange}
            placeholder="Prénom*"
            required
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            placeholder="Nom*"
            required
            className="border px-3 py-2 rounded"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Adresse email professionnelle*"
            required
            className="border px-3 py-2 rounded"
          />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Numéro de téléphone*"
            required
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="poste"
            value={form.poste}
            onChange={handleChange}
            placeholder="Intitulé de poste*"
            required
            className="border px-3 py-2 rounded"
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded text-gray-700"
          >
            <option value="" disabled>Type d'entreprise / étudiant ?*</option>
            <option value="entreprise">Entreprise</option>
            <option value="etudiant">Étudiant</option>
            <option value="universite">Université</option>
            <option value="autre">Autre</option>
          </select>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Votre message"
            required
            className="border px-3 py-2 rounded"
            rows={4}
          />
          <button
            type="submit"
            className="bg-[#2A3F8F] text-white py-2 rounded hover:bg-[#1E3A8A] transition"
          >
            Envoyer
          </button>
        </form>
        {status && <p className="mt-4 text-center text-green-600">{status}</p>}
      </div>
    </div>
  );
}
