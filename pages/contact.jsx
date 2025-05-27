import { useState } from 'react';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import ScrollToTopButton from '../components/ScrollToTopButton'; 


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
  
  <div>

       <header className="bg-white  border-b border-gray-200">
        <Header />
      </header>

    {/* Contenu principal - prend toute la largeur */}
    <main >
     <div
  style={{
    display: "flex",
     margin: "0 auto",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    overflow: "hidden",
    border: "1px solid #E5E7EB",
  }}
>
  {/* Colonne gauche - 1/3 */}
  <div
    style={{
      flex: "1 1 20.33%", // 1/3 largeur
      background: "linear-gradient(to bottom, #1E3A8A, #2D3748)",
      color: "white",
      padding: "2rem",
      paddingTop : "1rem",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: "1rem",
    }}
  >
    <h2 style={{ fontSize: "1.75rem", fontWeight: "600" }}>
      Contact rapide
    </h2>
    <p style={{ fontSize: "1rem", marginTop: 0, color: "#E5E7EB" }}>
      Remplissez ce formulaire pour une réponse sous 24h
    </p>

    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <svg
        style={{ width: "1.25rem", height: "1.25rem" }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      <span>contact@entreprise.com</span>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <svg
        style={{ width: "1.25rem", height: "1.25rem" }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
      <span>+33 1 23 45 67 89</span>
    </div>
  </div>

  {/* Colonne droite - 2/3 */}
  <div
    style={{
      flex: "1 1 66.66%", // 2/3 largeur
      padding: "4rem",
      paddingTop : "6rem", 
      boxSizing: "border-box",
      backgroundColor: "white",
    }}
  >
    <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", fontWeight: "450" }}>
      Formulaire professionnel :
    </h2>

    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Prénom *"
          name="prenom"
          value={form.prenom}
          onChange={handleChange}
          required
          style={{
            flex: 1,
            padding: "0.5rem 0.75rem",
            fontSize: "1rem",
            borderRadius: "0.375rem",
            border: "1px solid #E5E7EB",
          }}
        />
        <input
          type="text"
          placeholder="Nom *"
          name="nom"
          value={form.nom}
          onChange={handleChange}
          required
          style={{
            flex: 1,
            padding: "0.5rem 0.75rem",
            fontSize: "1rem",
            borderRadius: "0.375rem",
            border: "1px solid #E5E7EB",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <input
          type="email"
          placeholder="Email *"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            flex: 1,
            padding: "0.5rem 0.75rem",
            fontSize: "1rem",
            borderRadius: "0.375rem",
            border: "1px solid #E5E7EB",
          }}
        />
        <input
          type="tel"
          placeholder="Téléphone *"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          style={{
            flex: 1,
            padding: "0.5rem 0.75rem",
            fontSize: "1rem",
            borderRadius: "0.375rem",
            border: "1px solid #E5E7EB",
          }}
        />
      </div>

      <input
        type="text"
        placeholder="Poste *"
        name="poste"
        value={form.poste}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          padding: "0.5rem 0.75rem",
          fontSize: "1rem",
          borderRadius: "0.375rem",
          border: "1px solid #E5E7EB",
        }}
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          padding: "0.5rem 0.75rem",
          fontSize: "1rem",
          borderRadius: "0.375rem",
          border: "1px solid #E5E7EB",
          backgroundColor: "white",
        }}
      >
        <option value="" disabled>
          Type d'entreprise *
        </option>
        <option value="entreprise">Entreprise</option>
        <option value="etudiant">Étudiant</option>
        <option value="universite">Université</option>
      </select>

      <textarea
        name="message"
        rows={4}
        placeholder="Message *"
        value={form.message}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          padding: "0.5rem 0.75rem",
          fontSize: "1rem",
          borderRadius: "0.375rem",
          border: "1px solid #E5E7EB",
          resize: "vertical",
        }}
      />
 <div style = {{}}>
      <button
        type="submit"
        style={{
          width: "20%",
          padding: "0.5rem",
             backgroundColor: "white",
              color: colors.accent,
              border: `1px solid ${colors.accent}`,
      borderRadius: "0.375rem",
          fontSize: "1.1rem",
          fontWeight: "600",
          
          cursor: "pointer",
          marginLeft: 0,
           marginRight: "auto"
         }}
      >
        Envoyer
      </button>
      </div>
    </form>
  </div>
</div>

    </main>

    {/* Footer */}
          <footer style={{
            backgroundColor: colors.darkBg,
            color: 'white',
            padding: '4rem 2rem 2rem',
            fontSize: '0.9rem'
          }}>
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '3rem',
              marginBottom: '3rem'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '1.5rem',
                  color: colors.primary
                }}>CertifyMe</h3>
                <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
                  La solution ultime contre la fraude académique grâce à la blockchain.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <a href="#" style={{ color: 'white', opacity: 0.7, ':hover': { opacity: 1 } }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" strokeWidth="2"/>
                    </svg>
                  </a>
                  <a href="#" style={{ color: 'white', opacity: 0.7, ':hover': { opacity: 1 } }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" strokeWidth="2"/>
                    </svg>
                  </a>
                  <a href="#" style={{ color: 'white', opacity: 0.7, ':hover': { opacity: 1 } }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" strokeWidth="2"/>
                      <circle cx="4" cy="4" r="2" strokeWidth="2"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '1.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  opacity: 0.7
                }}>Solutions</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Pour les universités</a></li>
                  <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Pour les entreprises</a></li>
                  <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Pour les étudiants</a></li>
                  <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>API d'intégration</a></li>
                </ul>
              </div>
              
              <div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '1.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  opacity: 0.7
                }}>Ressources</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Documentation</a></li>
                  <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Centre d'aide</a></li>
                  <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Blog</a></li>
                  <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Presse</a></li>
                </ul>
              </div>
              
              <div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '1.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  opacity: 0.7
                }}>Entreprise</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>À propos</a></li>
                  <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Carrières</a></li>
                  <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Contact</a></li>
                  <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', ':hover': { opacity: 1 } }}>Partenaires</a></li>
                </ul>
              </div>
            </div>
            
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              paddingTop: '2rem',
              borderTop: `1px solid ${colors.textLight}20`,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              fontSize: '0.8rem',
              opacity: 0.7
            }}>
              <div>© 2025 CertifyMe. Tous droits réservés.</div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Confidentialité</a>
                <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Conditions</a>
                <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Cookies</a>
              </div>
            </div>
            
          </footer>
                <ScrollToTopButton />
  </div>
);
}
