import React from 'react';
import ScrollToTopButton from './ScrollToTopButton'; // adapte le chemin si besoin

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

const Footer = () => {
  const linkStyle = {
    color: 'white',
    opacity: 0.8,
    textDecoration: 'none',
  };

  const linkHoverStyle = {
    ...linkStyle,
    opacity: 1,
  };

  return (
    <>
      <footer
        style={{
          backgroundColor: colors.darkBg,
          color: 'white',
          padding: '4rem 2rem 2rem',
          fontSize: '0.9rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem',
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                color: colors.primary,
              }}
            >
              CertifyMe
            </h3>
            <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
              La solution ultime contre la fraude académique grâce à la blockchain.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {/* Facebook */}
              <a href="#" style={linkStyle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
                    strokeWidth="2"
                  />
                </svg>
              </a>

              {/* Twitter */}
              <a href="#" style={linkStyle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
                    strokeWidth="2"
                  />
                </svg>
              </a>

              {/* LinkedIn */}
              <a href="#" style={linkStyle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                    strokeWidth="2"
                  />
                  <circle cx="4" cy="4" r="2" strokeWidth="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                opacity: 0.7,
              }}
            >
              Solutions
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Pour les universités', 'Pour les entreprises', 'Pour les étudiants', "API d'intégration"].map(
                (text, idx) => (
                  <li key={idx} style={{ marginBottom: '0.75rem' }}>
                    <a href="#" style={linkStyle}>{text}</a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                opacity: 0.7,
              }}
            >
              Ressources
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Documentation', "Centre d'aide", 'Blog', 'Presse'].map((text, idx) => (
                <li key={idx} style={{ marginBottom: '0.75rem' }}>
                  <a href="#" style={linkStyle}>{text}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                opacity: 0.7,
              }}
            >
              Entreprise
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['À propos', 'Carrières', 'Contact', 'Partenaires'].map((text, idx) => (
                <li key={idx} style={{ marginBottom: '0.75rem' }}>
                  <a href="#" style={linkStyle}>{text}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
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
            opacity: 0.7,
          }}
        >
          <div>© 2025 CertifyMe. Tous droits réservés.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={linkStyle}>Confidentialité</a>
            <a href="#" style={linkStyle}>Conditions</a>
            <a href="#" style={linkStyle}>Cookies</a>
          </div>
        </div>
      </footer>

      {/* Scroll Button */}
      <ScrollToTopButton />
    </>
  );
};

export default Footer;
