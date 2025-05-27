import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import BlockchainAnimation from "./BlockchainAnimation";
import { motion } from "framer-motion";
import AnimationPrincipale from '../public/animations/AnimationPrincipale.json';
// Import Lottie sans SSR
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const BlockchainSection = () => {
  const router = useRouter();

  return (
  <div className="relative w-full h-[800px] lg:h-[700px] overflow-hidden">
    {/* FOND BLEU FLOU */}
    <div className="absolute inset-0 z-0">
      <div className="w-full h-full bg-[#0b1f3a]" />
    </div>

    {/* ANIMATION 3D */}
    <div className="absolute inset-0 z-10">
      <BlockchainAnimation />
    </div>

    {/* FILTRE FLOU */}
    <div className="absolute inset-0 z-10 backdrop-blur-sm bg-blue-950/40" />

 {/* CONTENU PRINCIPAL */}
 
 <div
  style={{
    position: "absolute",
    inset: 0, // équivalent à top: 0, bottom: 0, left: 0, right: 0
    zIndex: 20,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingLeft: "2rem",  // px-8 = 32px
    paddingRight: "6rem", // px-8 = 32px
  }}
  className="lg:px-16" // on garde cette classe uniquement pour les grands écrans
>   
    {/* COLONNE GAUCHE (Texte) - Version élargie */}
     <div
  style={{
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",       // vertical alignment
    justifyContent: "center",   // horizontal alignment
    paddingLeft: "1rem",        // px-4
    paddingRight: "1rem",
    textAlign: "center",        // centre le texte
  }}
>
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 1.5, ease: "easeOut" }}
    style={{
      maxWidth: "42rem",         // max-w-2xl
      width: "100%",
      margin: "0 auto",
    }}
  >
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        fontFamily: "'League Spartan', serif",
        color: "#F8FAFC",
        fontWeight: 600,
        letterSpacing: "-0.03em",
        lineHeight: 1.2,
        textShadow: "0 2px 4px rgba(0,0,0,0.1)",
        fontSize: "2.35rem",        // sm:text-3xl
        marginBottom: "1.5rem",
      }}
    >
      Certificats{" "}
      <span style={{
        color: "#7DD3FC",
        textShadow: "0 2px 8px rgba(125, 211, 252, 0.4)"
      }}>
        sécurisés
      </span>,{" "}
      <span style={{
        color: "#BAE6FD",
        position: "relative",
        display: "inline-block",
        transform: "translateZ(0)"
      }}>
        valides,
      </span>{" "}
      <span style={{
        position: "relative",
        display: "inline-block"
      }}>
        vérifiables, infalsifiables
      </span>
    </motion.h1>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 1 }}
      style={{
        color: "#E2E8F0",
        fontFamily: "'Inter', sans-serif",
        fontSize: "1.12rem", // text-lg
        lineHeight: "1.75rem", // leading-relaxed
        fontWeight: 300,
        marginBottom: "2rem",
        maxWidth: "90%",
        margin: "0 auto",
      }}
    >
      Diplômes, micro-certifications, attestations : simplifiez vos processus
      grâce à des certificats numériques sur mesure, infalsifiables, et accessibles à
      vie via notre technologie blockchain brevetée.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <button
        onClick={() => router.push("/PageAcceuil/RolePage")}
        style={{
          display: "block",
          margin: "1.5rem auto",
          color: "white",
          fontWeight: 400,
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          borderRadius: "0.5rem",
          transition: "all 0.3s ease",
          fontSize: "1.125rem",
          backgroundColor: "#1a3a8f",
          border: "1px solid rgba(79, 100, 247, 0.3)",
          boxShadow: "0 0 10px #4fc3f7",
          cursor: "pointer"
        }}
      >
        Démarrer la certification
      </button>
    </motion.div>
  </motion.div>
</div>
 
   {/* COLONNE DROITE - Animation mieux intégrée */}
  
{/* Conteneur animation réduite, encore plus petite */}
<div
  style={{
    position: 'relative',
    width: '100%',
    height: '85%',
    overflow: 'visible',
  }}
  className="lg:flex" // On garde uniquement cette classe pour activer le display:flex en responsive
>  <motion.div
    initial={{ opacity: 0, scale: 0.68, x: 200, y: 20 }}
    animate={{ opacity: 1, scale: 0.95, x: 100, y: 0 }}
    transition={{ duration: 1.5, ease: "easeOut" }}
    style={{
    position: 'relative',
    width: '100%',
   }}  >
    <Lottie
      animationData={AnimationPrincipale}
      loop
      autoplay
  style={{
  position: "absolute",
  right: "-7%",
  bottom: 0,
  width: "140%",
  height: "85%"
}}
   />
  </motion.div>
</div>

    </div>
  </div>
);
};

export default BlockchainSection;
