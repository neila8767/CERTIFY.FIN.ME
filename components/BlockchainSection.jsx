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
    <div className="relative w-full h-[600px] lg:h-[800px] overflow-hidden">

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
      <div className="absolute inset-0 z-20 flex">
        {/* COLONNE GAUCHE (Texte) */}
        <div className="w-3/5  h-full flex items-center justify-start pl-12 pr-6">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl lg:text-6xl font-black leading-tight mb-6"
              style={{
                fontFamily: "'League Spartan', serif",
                color: "#F8FAFC",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              Certificats{" "}
              <span style={{
                color: "#7DD3FC",
                textShadow: "0 2px 8px rgba(125, 211, 252, 0.4)"
              }}>
                sécurisés
              </span>
              ,{" "}
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
              className="text-lg lg:text-xl font-light leading-relaxed mb-8 text-center mx-auto max-w-2xl"
              style={{
                color: "#E2E8F0",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
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
              className="flex justify-center"
            >
              <button
                onClick={() => router.push("/PageAcceuil/RolePage")}
                className="mt-6 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 text-lg hover:bg-[#3a5fc8] hover:scale-105"
                style={{
                  backgroundColor: '#1a3a8f',
                  border: '1px solid rgba(79, 195, 247, 0.3)',
                  boxShadow: '0 0 20px #4fc3f7'
                }}
              >
                Démarrer la certification
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* COLONNE DROITE - laissée vide ou pour une future animation */}
      <div className="absolute top-[70px] right-[-500px] z-30 w-[1600px] h-[900px]">
        <Lottie
          animationData={AnimationPrincipale}
          loop
          autoplay
          style={{ width: '80%', height: '80%' }}
        />
      </div>

      </div>
    </div>
  );
};

export default BlockchainSection;
