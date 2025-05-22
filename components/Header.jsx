'use client';

import { motion } from 'framer-motion';
import { FaGraduationCap } from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (section) => {
    if (section === 'contact') {
      router.push('/contact');
    } else if (pathname !== '/') {
      // On change de page, puis on attend que la page soit chargée pour scroller
      router.push(`/#${section}`);
    } else {
      // Si on est déjà sur la page d'accueil, on scroll directement
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm' : 'bg-white/90'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">

        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => router.push('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <FaGraduationCap className="text-3xl text-[#2A3F8F] relative z-10 transition-transform group-hover:rotate-12" />
            <div className="absolute inset-0 bg-[#00BCD4] rounded-full blur-[8px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
          </div>
          <span className="text-2xl font-bold text-[#2A3F8F]">
            CertifyMe
          </span>
        </motion.div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => router.push('/')}
            className={`font-medium ${pathname === '/' ? 'text-[#2A3F8F]' : 'text-gray-600'} relative group`}
          >
            Accueil
            <motion.div
              layout
              className={`h-0.5 bg-[#00BCD4] mt-1 origin-left transition-transform ${
                pathname === '/' ? 'scale-x-100' : 'scale-x-0'
              } group-hover:scale-x-100`}
            />
          </button>

          <button
            onClick={() => handleNavClick('fonctionnalites')}
            className="font-medium text-gray-600 relative group"
          >
            Fonctionnalités
            <motion.div
              layout
              className="h-0.5 bg-[#00BCD4] mt-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform"
            />
          </button>

          <button
            onClick={() => handleNavClick('solutions')}
            className="font-medium text-gray-600 relative group"
          >
            Solutions
            <motion.div
              layout
              className="h-0.5 bg-[#00BCD4] mt-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform"
            />
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className="font-medium text-gray-600 relative group"
          >
            Contact
            <motion.div
              layout
              className="h-0.5 bg-[#00BCD4] mt-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform"
            />
          </button>
        </nav>

        {/* Boutons Connexion / Inscription */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ y: 1 }}
            onClick={() => router.push('/PageAcceuil/Login')}
            className="px-4 py-2 rounded-md font-medium text-[#2A3F8F] border border-[#2A3F8F]/20 hover:border-[#2A3F8F]/40 transition-all"
          >
            Connexion
          </motion.button>

          <motion.button
            whileHover={{ y: -1, boxShadow: '0 2px 8px rgba(0, 188, 212, 0.3)' }}
            whileTap={{ y: 1 }}
            onClick={() => router.push('/PageAcceuil/RolePage')}
            className="px-4 py-2 rounded-md font-medium text-white bg-[#2A3F8F] hover:bg-[#1E3A8A] transition-colors"
          >
            S'inscrire
          </motion.button>
        </div>
      </div>

      {/* Barre inférieure dynamique */}
      <motion.div
        className="h-0.5 bg-gradient-to-r from-[#2A3F8F] to-[#00BCD4] origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isScrolled ? 1 : 0.2 }}
        transition={{ type: 'spring', damping: 10 }}
        style={{ transformOrigin: 'left' }}
      />
    </header>
  );
};

export default Header;
