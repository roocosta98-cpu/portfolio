import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const navItems = [
  { label: 'Início', href: '#hero' },
  { label: 'Sobre', href: '#about' },
  { label: 'Projetos', href: '#projects' },
  { label: 'Portfólio', href: '#portfolio' },
  { label: 'Skills', href: '#skills' },
  { label: 'Vida', href: '#life' },
  { label: 'Contato', href: '#contact' },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('logo_url')
          .eq('id', 'global')
          .single();
        if (data && data.logo_url) {
          setLogoUrl(data.logo_url);
        }
      } catch (e) {
        console.warn("Failed to fetch custom logo, using default zap.");
      }
    };
    fetchLogo();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (location.pathname === '/') {
        const sections = navItems.map(i => i.href.replace('#', ''));
        for (const id of [...sections].reverse()) {
          const el = document.getElementById(id);
          if (el && window.scrollY >= el.offsetTop - 120) {
            setActiveSection(id);
            break;
          }
        }
      } else {
        setActiveSection('');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'backdrop-blur-md bg-[#020409]/75 border-b border-white/10 py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* ── Logo: ⚡ Tagashira ── */}
          <motion.button
            onClick={() => handleNav('#hero')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            {logoUrl ? (
              logoUrl.startsWith('<svg') ? (
                <div
                  className="w-6 h-6 flex items-center justify-center text-violet-400 group-hover:text-cyan-400 transition-colors duration-300 [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: logoUrl }}
                />
              ) : (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-6 w-auto object-contain max-h-6 filter brightness-100 group-hover:brightness-110 transition-all duration-300"
                />
              )
            ) : (
              <motion.div
                animate={{ rotate: [0, 10, -10, 6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
              >
                <Zap
                  size={22}
                  className="text-violet-400 group-hover:text-cyan-400 transition-colors duration-300"
                  fill="currentColor"
                />
              </motion.div>
            )}
            <span
              className="font-black text-white text-lg tracking-tight gradient-text"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Tagashira
            </span>
          </motion.button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <motion.button
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-white/10 border border-white/15"
                      transition={{ type: 'spring', stiffness: 380, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden lg:block">
            <motion.button
              onClick={() => handleNav('#contact')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary relative overflow-hidden px-5 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              <span className="relative z-10">Fale Comigo</span>
            </motion.button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[65px] z-40 glass-panel border-b border-white/10 px-4 py-3 lg:hidden"
          >
            <div className="grid grid-cols-2 gap-1">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => handleNav(item.href)}
                  className="text-left px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium cursor-pointer"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-white/10">
              <button
                onClick={() => handleNav('#contact')}
                className="btn-primary w-full relative overflow-hidden py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                <span className="relative z-10">Fale Comigo</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
