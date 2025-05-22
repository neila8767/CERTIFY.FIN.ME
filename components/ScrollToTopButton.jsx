import React, { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  // Montre le bouton quand on a scrollé de plus de 100px
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.pageYOffset > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Au clic, remonte en haut et cache le bouton
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Remonter en haut de la page"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '48px',
        height: '48px',
        backgroundColor: '#33A9FF', 
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        zIndex: 1000,
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* Flèche vers le haut en SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;
