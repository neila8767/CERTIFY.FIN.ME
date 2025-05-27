import Image from "next/image";
import { motion } from "framer-motion";

const partners = [
  "usthb.png",
  "alger.png",
  "BajiMokhtar.png",
  "Laghouat.png",
  "Tlemcen.png",
];

// Nouveau composant de lien animé
const AnimatedChainLink = () => (
  <motion.div 
    className="relative mx-1 flex items-center"
    animate={{
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <svg
      width="48"
      height="24"
      viewBox="0 0 48 24"
      xmlns="http://www.w3.org/2000/svg"
      className="metallic-chain"
    >
      {/* Lien stylisé en noir métallique */}
      <path
        d="M10 12C10 8.686 12.686 6 16 6H32C35.314 6 38 8.686 38 12C38 15.314 35.314 18 32 18H16C12.686 18 10 15.314 10 12Z"
        fill="url(#blackMetalGradient)"
        stroke="#111827"
        strokeWidth="1.5"
      />
      {/* Reflet métallique */}
      <path
        d="M16 6C12.686 6 10 8.686 10 12C10 15.314 12.686 18 16 18"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="blackMetalGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="40%" stopColor="#1F2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
);

// Ajoutez dans votre CSS global :
<style jsx global>{`
  .metallic-chain {
    filter: drop-shadow(0 1px 1px rgba(0,0,0,0.3));
    transition: all 0.3s ease;
  }
  .metallic-chain:hover {
    filter: 
      drop-shadow(0 1px 2px rgba(0,0,0,0.4))
      drop-shadow(0 0 8px rgba(156, 163, 175, 0.3));
  }
`}</style>

const PartnersSection = () => {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-[#F5F5F5] to-[#E0E7FF]">
      <div className="max-w-6xl mx-auto px-4 text-center">
       <div className="max-w-[70%] mx-auto px-4 text-center">
       <motion.h2 
          className="text-2xl md:text-2xl font-bold text-gray-800 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
            
          Rejoignez les universités, établissements d'enseignement supérieur,
          organismes de formation et entreprises qui ont choisi CertifyMe pour
          donner une nouvelle dimension à leurs certificats.
        

        </motion.h2>
            </div>
        
        <div className="relative w-full h-48 overflow-hidden">
<div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" />


  <motion.div
    className="absolute flex items-center h-full"
    animate={{
      x: ["0%", "-50%"],
    }}
    transition={{
      repeat: Infinity,
      duration: 25,
      ease: "linear",
    }}
    style={{ minWidth: "300%" }} // important pour que le scroll fonctionne correctement
  >
    {[...partners, ...partners].map((logo, index) => (
      <motion.div 
        key={index} 
        className="flex items-center h-full"
        whileHover={{ scale: 1.05 }}
      >
        <div className="relative w-36 h-36 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-4
          border-2 border-transparent hover:border-blue-500 transition-all duration-300
          hover:shadow-2xl hover:bg-blue-50">
          <Image
            src={`/logos/${logo}`}
            alt={`Logo ${logo.replace(/\.[^/.]+$/, "")}`}
            width={96}
            height={96}
            className="object-contain p-4"
          />
        </div>
        {index < partners.length * 2 - 1 && <AnimatedChainLink />}
      </motion.div>
    ))}
  </motion.div>
</div>

      </div>
    </section>
  );
};

export default PartnersSection;