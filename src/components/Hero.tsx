import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ChevronRight, Mail } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const floatVariants = {
  animate: {
    y: [0, -18, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

const handleScroll = (href: string) => {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
};

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Background orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-violet-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-500/5 blur-[180px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(124,58,237,0.5) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
        {/* Left - Text Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start gap-8"
        >
          {/* Name */}
          <motion.div variants={itemVariants}>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.12] tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              <span className="text-white">Rodrigo</span>
              <br />
              <span className="gradient-text">C. Tagashira</span>
            </h1>
          </motion.div>

          {/* Titles */}
          <motion.div variants={itemVariants} className="w-full">
            <h2 
              className="text-base sm:text-xl font-bold tracking-wide leading-snug"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              <span className="text-violet-300">Product Design Lead</span>
              <span className="text-slate-500 mx-2 sm:mx-2.5 font-normal opacity-50">|</span>
              <span className="text-cyan-400">Software Developer & Analyst</span>
            </h2>
          </motion.div>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-xl"
          >
            Um profissional que transita com fluidez entre o{' '}
            <span className="text-violet-300 font-semibold">Design de Experiência (UI/UX)</span>,{' '}
            <span className="text-cyan-400 font-semibold">Inteligência Artificial</span> e a{' '}
            <span className="text-slate-100 font-semibold">Engenharia de Software</span>, transformando
            requisitos complexos em códigos limpos, escaláveis e interfaces de alta conversão.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-6 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleScroll('#projects')}
              className="btn-primary relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold text-white cursor-pointer"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              <span className="relative z-10">Ver Projetos</span>
              <ChevronRight size={16} className="relative z-10" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleScroll('#contact')}
              className="btn-secondary inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold text-slate-200 cursor-pointer"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              <Mail size={16} />
              Entre em Contato
            </motion.button>
          </motion.div>

          {/* Stats row */}
          <motion.div variants={itemVariants} className="flex gap-8 pt-8 mt-6 sm:mt-8 border-t border-white/10 w-full">
            {[
              { value: '12+', label: 'Anos de Experiência' },
              { value: '50+', label: 'Projetos Entregues' },
              { value: '6', label: 'Grandes Empresas' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5">
                <span className="text-2xl sm:text-3xl font-black gradient-text" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm text-slate-500 leading-tight">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right - Photo Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          className="flex items-center justify-center"
        >
          <motion.div variants={floatVariants} animate="animate" className="relative">
            {/* Outer ambient glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/30 via-cyan-500/20 to-violet-800/30 blur-2xl scale-110" />

            {/* Photo wrapper with animated border */}
            <div className="photo-glow-border relative w-72 h-80 sm:w-80 sm:h-96 lg:w-[360px] lg:h-[420px]">
              <div className="glass-panel w-full h-full rounded-3xl flex flex-col items-center justify-center gap-4 p-8">
                {/* Avatar placeholder */}
                <div className="relative w-36 h-36 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/40 to-cyan-500/40" />
                  <img
                    src="/fotos/foto2.jpg"
                    alt="Rodrigo C. Tagashira"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const next = target.nextElementSibling as HTMLElement;
                      if (next) next.style.display = 'flex';
                    }}
                  />
                  {/* Fallback SVG Avatar */}
                  <div
                    className="absolute inset-0 items-center justify-center bg-gradient-to-br from-violet-600 to-cyan-600"
                    style={{ display: 'none' }}
                  >
                    <svg viewBox="0 0 100 100" className="w-24 h-24" fill="none">
                      <circle cx="50" cy="35" r="22" fill="white" fillOpacity="0.9" />
                      <ellipse cx="50" cy="85" rx="35" ry="25" fill="white" fillOpacity="0.9" />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Rodrigo Tagashira
                  </p>
                  <p className="text-slate-400 text-xs mt-1">Product Design Lead & Developer</p>
                  <div className="flex gap-2 mt-3 justify-center flex-wrap">
                    {['UX/UI', 'AI', 'React'].map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-full text-[10px] font-semibold text-violet-300 bg-violet-500/15 border border-violet-500/25">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.5 }}
              className="absolute -left-12 top-1/4 glass-panel rounded-xl px-4 py-3 hidden sm:flex items-center gap-3 shadow-lg shadow-black/20"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🧠</span>
              </div>
              <div>
                <p className="text-white text-xs font-bold">AI-Driven</p>
                <p className="text-slate-400 text-[10px]">Development</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const, delay: 1 }}
              className="absolute -right-10 bottom-1/4 glass-panel rounded-xl px-4 py-3 hidden sm:flex items-center gap-3 shadow-lg shadow-black/20"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">⚡</span>
              </div>
              <div>
                <p className="text-white text-xs font-bold">12+ anos</p>
                <p className="text-slate-400 text-[10px]">Experiência</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => handleScroll('#about')}
      >
        <span className="text-slate-500 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown size={16} className="text-slate-500" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
