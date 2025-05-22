import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import BlockchainSection from '../components/BlockchainSection';
import PartnersSection from '../components/PartnersSection';
import { useRouter } from 'next/router';
import FlipCard from '../components/FlipCard';
import ScrollToTopButton from '../components/ScrollToTopButton'; 



const HomePage = () => {
  const router = useRouter();
  

const colors = {
  primary: '#1666C7',      // bleu principal
  secondary: '#0B1F3A',    // bleu foncé pour fonds & textes
  accent: '#33A9FF',       // bleu néon pour accent
  lightBg: '#F4F7FA',      // fond clair doux
  darkBg: '#0B1F3A',       // fond sombre sérieux
  textDark: '#0B1F3A',     // texte principal foncé
  textLight: '#A9BCD0',    // texte secondaire gris bleu
  border: '#D0D9E6',       // bordure claire
  success: '#2F855A',      // vert validation
  error: '#C53030',
  warning: '#D69E2E',
  blockchainBlue: '#1666C7',
  blockchainPurple: '#6F42C1'  // on peut garder cette couleur pour un accent subtil
};
 useEffect(() => {
    const section = sessionStorage.getItem('scrollToId');
    if (section) {
      const el = document.getElementById(section);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Donne un petit délai pour que la section existe bien
      }
      sessionStorage.removeItem('scrollToId');
    }
  }, []);

  return (
<div>

       <header className="bg-white shadow-sm border-b border-gray-200">
        <Header />
      </header>

  {/* Séparation visible entre le header et la section */}

      <BlockchainSection />
      <PartnersSection />
    



      <div id="solutions" style={{
          backgroundColor: '#fff',
          position: 'relative',
          overflow: 'hidden',
          padding: '4rem 2rem',
        }}
      >


        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: colors.darkBg,
            marginBottom: '1rem'
          }}>
            Une plateforme <span style={{ color: colors.primary }}>complète</span>
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: colors.textLight,
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Découvrez comment CertifyMe protège l'intégrité des diplômes grâce à des technologies de pointe.
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          
          {/* Carte 1 */}
{/* Carte 1 */}
<FlipCard
  front={
    <>
      <div
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: `${colors.success}10`, 
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}
      >
        {/* Exemple SVG "Blockchain / sécurité" */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke={colors.primary}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <path d="M10 14h4v1a3 3 0 0 1-6 0v-1z" />
          <path d="M7 11V7a3 3 0 0 1 6 0v4" />
        </svg>
      </div>

      <h3
        style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: colors.darkBg,
          marginBottom: '1rem',
        }}
      >
        Technologie Blockchain
      </h3>
    </>
  }
  back={
    <p style={{ color: colors.textLight, lineHeight: '1.6' }}>
      Chaque diplôme est enregistré sur la blockchain, assurant une traçabilité et une sécurité sans faille.
    </p>
  }
/>


          {/* Carte 2 */}
          <FlipCard
            front={
              <>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: `${colors.primary}10`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                  }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={colors.primary}
                  >
                    <path
                      d="M22 11.08V12a10 10 0 11-5.93-9.14"
                      strokeWidth="2"
                    />
                    <path d="M22 4L12 14.01l-3-3" strokeWidth="2" />
                  </svg>
                </div>
                <h3
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: colors.darkBg,
                    marginBottom: '1rem',
                  }}
                >
                  Vérification instantanée
                </h3>
              </>
            }
            back={
              <p style={{ color: colors.textLight, lineHeight: '1.6' }}>
                Vérifiez l'authenticité d'un diplôme en quelques secondes grâce
                à notre système de QR code et numéro unique.
              </p>
            }
          />

          {/* Carte 3 */}
          <FlipCard
            front={
              <>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: `${colors.blockchainPurple}10`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                  }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={colors.blockchainPurple}
                  >
                    <path
                      d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M16 17l-4 4m0 0l-4-4m4 4V3"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h3
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: colors.darkBg,
                    marginBottom: '1rem',
                  }}
                >
                  Reconnaissance IA
                </h3>
              </>
            }
            back={
              <p style={{ color: colors.textLight, lineHeight: '1.6' }}>
                Notre intelligence artificielle analyse automatiquement les
                documents scannés pour détecter les falsifications.
              </p>
            }
          />
        </div>
      </div>

      {/* Section Statistiques */}
      <section style={{
        backgroundColor: colors.darkBg,
        padding: '6rem 2rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '3rem'
          }}>
            L'ampleur du <span style={{ color: colors.primary }}>problème</span>
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
          }}>
            <div>
              <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: colors.primary,
                marginBottom: '0.5rem'
              }}>30%</div>
              <p style={{ color: '#CBD5E0' }}>des CVs contiennent des fausses informations académiques</p>
            </div>
            <div>
              <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: colors.primary,
                marginBottom: '0.5rem'
              }}>500K</div>
              <p style={{ color: '#CBD5E0' }}>diplômes falsifiés détectés chaque année</p>
            </div>
            <div>
              <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: colors.primary,
                marginBottom: '0.5rem'
              }}>85%</div>
              <p style={{ color: '#CBD5E0' }}>des employeurs préoccupés par ce phénomène</p>
            </div>
            <div>
              <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: colors.primary,
                marginBottom: '0.5rem'
              }}>100%</div>
              <p style={{ color: '#CBD5E0' }}>sécurité avec CertifyMe</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Processus */}
      <section  id="fonctionnalites" style={{
        padding: '6rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: colors.darkBg,
            marginBottom: '1rem'
          }}>
            Comment ça <span style={{ color: colors.primary }}>fonctionne</span> ?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: colors.textLight,
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Un processus simple et sécurisé pour les établissements et les vérificateurs
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem',
          position: 'relative'
        }}>
          {/* Ligne de connexion */}
          <div style={{
            position: 'absolute',
            left: '40px',
            top: '0',
            bottom: '0',
            width: '4px',
            backgroundColor: `${colors.primary}20`,
            zIndex: 0
          }}></div>

          {/* Étape 1 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              flexShrink: 0,
              backgroundColor: `${colors.primary}10`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${colors.primary}`
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: colors.primary,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '1.5rem'
              }}>1</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', flex: 1, boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: colors.darkBg,
                marginBottom: '1rem'
              }}>Enregistrement du diplôme</h3>
              <p style={{
                color: colors.textLight,
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                L'institution académique enregistre le diplôme sur la blockchain CertifyMe via notre plateforme sécurisée.
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                backgroundColor: `${colors.primary}10`,
                borderRadius: '6px',
                color: colors.primary,
                fontWeight: '500',
                fontSize: '0.9rem'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginRight: '0.5rem' }}>
                  <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5" strokeWidth="2"/>
                </svg>
                Pour les institutions
              </div>
            </div>
          </div>

          {/* Étape 2 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              flexShrink: 0,
              backgroundColor: `${colors.primary}10`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${colors.primary}`
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: colors.primary,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '1.5rem'
              }}>2</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', flex: 1, boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: colors.darkBg,
                marginBottom: '1rem'
              }}>Certification blockchain</h3>
              <p style={{
                color: colors.textLight,
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                Le diplôme reçoit un hash unique et est enregistré de manière immuable sur la blockchain Ethereum.
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                backgroundColor: `${colors.blockchainBlue}10`,
                borderRadius: '6px',
                color: colors.blockchainBlue,
                fontWeight: '500',
                fontSize: '0.9rem'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginRight: '0.5rem' }}>
                  <path d="M2 2h20v20H2V2z" strokeWidth="2"/>
                  <path d="M8 2v20M2 8h20M2 16h20M16 2v20" strokeWidth="1.5"/>
                </svg>
                Technologie blockchain
              </div>
            </div>
          </div>

          {/* Étape 3 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              flexShrink: 0,
              backgroundColor: `${colors.primary}10`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${colors.primary}`
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: colors.primary,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '1.5rem'
              }}>3</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', flex: 1, boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: colors.darkBg,
                marginBottom: '1rem'
              }}>Vérification instantanée</h3>
              <p style={{
                color: colors.textLight,
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                Les employeurs peuvent scanner le QR code ou saisir le numéro unique pour vérifier instantanément l'authenticité du diplôme.
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                backgroundColor: `${colors.accent}10`,
                borderRadius: '6px',
                color: colors.accent,
                fontWeight: '500',
                fontSize: '0.9rem'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginRight: '0.5rem' }}>
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01" strokeWidth="2"/>
                </svg>
                Pour les recruteurs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section style={{
        padding: '6rem 2rem',
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.darkBg} 100%)`,
        color: 'white',
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem'
          }}>
            Prêt à révolutionner la certification académique ?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            maxWidth: '700px',
            margin: '0 auto 3rem',
            opacity: 0.9
          }}>
            Rejoignez les centaines d'institutions qui font déjà confiance à CertifyMe pour sécuriser leurs diplômes.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/contact')}
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'white',
                color: colors.primary,
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Nous contacter
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/demo')}
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Voir une démo
            </motion.button>
          </div>
        </motion.div>
      </section>

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
          <div>© 2023 CertifyMe. Tous droits réservés.</div>
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
};

export default HomePage;