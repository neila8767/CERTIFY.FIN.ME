import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import diplomaAnimation from "../public/animations/diploma.json";

// Import Lottie sans SSR
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function DiplomaAnimation() {
  const lottieRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const stopAt = 218;

  const handleFrame = (e) => {
    const currentFrame = e.currentTime;

    if (currentFrame >= stopAt && !isPaused) {
      const lottie = lottieRef.current;
      if (lottie) {
        lottie.stop();
        setIsPaused(true);

        // Pause de 2 secondes
        setTimeout(() => {
          lottie.play();      // Reprendre
          setIsPaused(false); // Reautoriser l’arrêt au prochain cycle
        }, 5000);
      }
    }
  };

  // Appliquer une vitesse réduite à l'animation
  useEffect(() => {
    const instance = lottieRef.current;
    if (instance?.setSpeed) {
      instance.setSpeed(0.7); 
    }
  }, []);

  return (
    <div className="w-full max-w-[600px] md:max-w-[600px] lg:max-w-[900px] mx-auto">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1, y: [-5, 5, -5] }}
        transition={{
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
        }}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={diplomaAnimation}
          autoplay
          loop={false} // important pour relancer
          onEnterFrame={handleFrame}
          style={{ width: "100%", height: "auto" }}
        />
      </motion.div>
    </div>
  );
}
