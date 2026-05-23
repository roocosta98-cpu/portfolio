import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import PhotoSlider from './PhotoSlider';
import {
  Palette,
  Server,
  Globe,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  Play,
  Crown,
  Heart,
  GraduationCap,
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'professional' | 'personal' | 'education';
  icon: React.ReactNode;
  highlight?: boolean;
  color: string;
}

const timelineData: TimelineEvent[] = [
  {
    id: '1',
    date: '2011 — 2013',
    title: 'Início no Design Gráfico',
    description: 'Ensino Técnico em Design Gráfico na Escola SAGA, construindo as bases visuais que norteariam toda a minha carreira.',
    type: 'education',
    icon: <Palette size={18} />,
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: '2',
    date: '2013',
    title: 'Primeiro Passo na TI — Aos 14 Anos',
    description: 'Início precoce no universo de tecnologia e infraestrutura de TI, atuando no Helpdesk da JWCOSTA Soluções Contábeis. Uma jornada profissional que começou cedo e de forma intensa.',
    type: 'professional',
    icon: <Server size={18} />,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: '3',
    date: 'Um Momento Especial ✨',
    title: 'Pai de 3 Marias 💜',
    description: 'O maior projeto da vida: ser pai de três filhas incríveis. Cada uma delas é a motivação diária para criar coisas extraordinárias e deixar um legado que vai além do código.',
    type: 'personal',
    icon: <Heart size={18} />,
    highlight: true,
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: '4',
    date: '2015 — 2022',
    title: 'Designer UI/UX & Dev Web Autônomo',
    description: 'Sete anos de atuação em projetos internacionais, liderando times de UX e implementando sistemas do zero. Construindo a base multidisciplinar que define meu trabalho hoje.',
    type: 'professional',
    icon: <Globe size={18} />,
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: '5',
    date: '2022',
    title: 'Senior UI Designer — eBakery (Alemanha 🇩🇪)',
    description: 'Liderança de processos de design ponta a ponta para empresa alemã, trabalhando 100% remotamente. Projetos internacionais com padrões europeus de qualidade e usabilidade.',
    type: 'professional',
    icon: <Briefcase size={18} />,
    color: 'from-cyan-500 to-teal-600',
  },
  {
    id: '6',
    date: '2022 — 2023',
    title: 'UX Designer Pleno — Stefanini × Polícia Federal',
    description: 'Alocado estrategicamente no Departamento de Polícia Federal. Gestão de Design System, protótipos de alta fidelidade e liderança de squads cross-functional em projetos críticos de segurança nacional.',
    type: 'professional',
    icon: <ShieldCheck size={18} />,
    color: 'from-emerald-500 to-green-600',
  },
  {
    id: '7',
    date: '2023',
    title: 'UX Designer Pleno — Stefanini × Itaú Unibanco',
    description: 'Criação de fluxos de experiência que geraram um aumento de 60% na eficiência de sistemas internos do maior banco da América Latina.',
    type: 'professional',
    icon: <TrendingUp size={18} />,
    color: 'from-orange-500 to-amber-600',
  },
  {
    id: '8',
    date: '2024',
    title: 'UX Designer Pleno — Stefanini × EC Global (LABFLIX)',
    description: 'Liderança completa do produto LABFLIX, gerenciando todo o ciclo de design: pesquisa, arquitetura de informação, prototipagem e validação de experiência.',
    type: 'professional',
    icon: <Play size={18} />,
    color: 'from-red-500 to-rose-600',
  },
  {
    id: '9',
    date: '2025 — Presente',
    title: 'Líder de Equipe de Produto — Kel Tech Solutions',
    description: 'Desenvolvimento end-to-end de marketplaces, e-commerces e branding. Concomitantemente, expandindo a base técnica com o curso de Análise e Desenvolvimento de Sistemas na FAM.',
    type: 'professional',
    icon: <Crown size={18} />,
    highlight: false,
    color: 'from-violet-600 to-cyan-600',
  },
  {
    id: '10',
    date: '2025 — Presente',
    title: 'ADS — FAM (Análise e Desenvolvimento de Sistemas)',
    description: 'Aprofundando fundamentos técnicos em Análise e Desenvolvimento de Sistemas, consolidando a ponte entre o design e a engenharia de software.',
    type: 'education',
    icon: <GraduationCap size={18} />,
    color: 'from-sky-500 to-blue-600',
  },
];

const typeColors = {
  professional: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  personal: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  education: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
};

const typeLabels = {
  professional: 'Profissional',
  personal: 'Pessoal',
  education: 'Educação',
};

interface TimelineItemProps {
  event: TimelineEvent;
  index: number;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ event, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div
      ref={ref}
      className="flex flex-col items-center w-80 sm:w-[22rem] flex-shrink-0 relative pt-4 select-none"
    >
      {/* Top Date + Dot sitting on line */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Date bubble */}
        <span className="text-[10px] sm:text-xs font-bold text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-3 shadow-sm">
          {event.date}
        </span>

        {/* Center dot sitting on line */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${event.color} text-white shadow-lg shadow-violet-500/10 ring-4 ring-[#020409] hover:scale-115 transition-transform duration-200 cursor-default`}>
          {event.icon}
        </div>
      </motion.div>

      {/* Vertical connection line from dot to card */}
      <div className="w-0.5 h-6 bg-gradient-to-b from-violet-500/50 to-transparent my-2" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.05 + index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`w-full relative ${event.highlight ? 'z-10' : ''}`}
      >
        {event.highlight && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 blur-xl" />
        )}
        <div
          className={`glass-panel rounded-2xl p-5 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 h-52 flex flex-col justify-between ${
            event.highlight ? 'border-amber-500/30 shadow-lg shadow-amber-500/10' : ''
          }`}
        >
          <div className="flex flex-col gap-2.5 h-full justify-between">
            <div className="flex items-start justify-between gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${typeColors[event.type]}`}>
                {typeLabels[event.type]}
              </span>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <h4
                className="text-white font-bold text-sm leading-snug mb-1.5 line-clamp-2"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                {event.title}
              </h4>
              <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed line-clamp-3">
                {event.description}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Timeline: React.FC = () => {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true });
  const sliderRef = useRef(null);
  const sliderInView = useInView(sliderRef, { once: true, margin: '-60px' });

  const [scrollProgress, setScrollProgress] = useState({ left: 0, right: 1 });
  const [maskWidth, setMaskWidth] = useState(80);
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag to scroll state for desktop
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      
      const leftOpacity = Math.min(scrollLeft / 100, 1);
      const rightOpacity = maxScroll > 0 ? Math.min((maxScroll - scrollLeft) / 100, 1) : 0;
      
      setScrollProgress({ left: leftOpacity, right: rightOpacity });
      setMaskWidth(window.innerWidth < 640 ? 40 : 80);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleScroll();
    }, 100);

    window.addEventListener('resize', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed multiplier
    containerRef.current.scrollLeft = scrollLeftState - walk;
    handleScroll();
  };

  const leftAlpha = 1 - scrollProgress.left;
  const rightAlpha = 1 - scrollProgress.right;

  const maskStyle = {
    WebkitMaskImage: `linear-gradient(to right, rgba(0, 0, 0, ${leftAlpha}) 0px, black ${maskWidth}px, black calc(100% - ${maskWidth}px), rgba(0, 0, 0, ${rightAlpha}) 100%)`,
    maskImage: `linear-gradient(to right, rgba(0, 0, 0, ${leftAlpha}) 0px, black ${maskWidth}px, black calc(100% - ${maskWidth}px), rgba(0, 0, 0, ${rightAlpha}) 100%)`,
  };

  return (
    <section id="about" className="relative py-32 sm:py-40 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20 sm:mb-28"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 mb-4 tracking-wider uppercase">
            Minha Jornada
          </span>
          <h2
            className="text-4xl sm:text-5xl font-black text-white mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Sobre Mim &{' '}
            <span className="gradient-text">Minha História</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Uma trajetória de mais de 12 anos construindo na interseção entre design,
            tecnologia e experiência humana — com momentos que vão muito além do código.
          </p>
        </motion.div>

        {/* ── Photo Slider + Bio Split ── */}
        <motion.div
          ref={sliderRef}
          initial={{ opacity: 0, y: 50 }}
          animate={sliderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-32"
        >
          {/* Left — Photo slider */}
          <div className="relative">
            {/* Ambient glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/20 to-cyan-500/10 blur-2xl scale-105 -z-10" />
            <PhotoSlider />
          </div>

          {/* Right — Bio panel */}
          <div className="flex flex-col gap-6">
            <div>
              <h3
                className="text-3xl font-black text-white mb-3 leading-tight"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Olá, eu sou o{' '}
                <span className="gradient-text">Rodrigo</span> 👋
              </h3>
              <p className="text-slate-400 leading-relaxed text-base mb-4">
                Sou um profissional que vive na interseção entre criatividade e lógica.
                Com mais de <span className="text-violet-300 font-semibold">12 anos de experiência</span>, já
                atuei em projetos que vão desde startups até os maiores bancos e instituições do Brasil.
              </p>
              <p className="text-slate-400 leading-relaxed text-base">
                Minha missão é simples: <span className="text-cyan-400 font-semibold">transformar problemas complexos
                em experiências elegantes</span> — seja através de um design intuitivo, de um código limpo
                ou de uma estratégia de produto bem fundamentada.
              </p>
            </div>

            {/* Highlights grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: '🎨', title: 'Design Lead', desc: 'UI/UX de alta fidelidade' },
                { emoji: '🧠', title: 'AI-Driven', desc: 'Integração de LLMs e automação' },
                { emoji: '💻', title: 'Full Stack', desc: 'React, Node, Flutter' },
                { emoji: '🚀', title: 'Product Lead', desc: 'End-to-end e squads ágeis' },
                { emoji: '🌍', title: 'Internacional', desc: 'Projetos em PT, DE e além' },
                { emoji: '💜', title: 'Pai de 3 Marias', desc: 'Motivação acima de tudo' },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className="glass-panel rounded-xl p-3 flex items-center gap-3 hover:border-white/20 transition-all duration-200 cursor-default"
                >
                  <span className="text-xl flex-shrink-0">{item.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-bold truncate">{item.title}</p>
                    <p className="text-slate-500 text-[11px] truncate">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <motion.a
                href="https://www.linkedin.com/in/rodrigo-c-tagashira-726783156"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                <span className="relative z-10">LinkedIn</span>
              </motion.a>
              <motion.button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-secondary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-200 cursor-pointer"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Fale Comigo
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ── Timeline heading ── */}
        <div className="text-center mb-20 sm:mb-24">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 mb-2 tracking-wider uppercase">
            Linha do Tempo
          </span>
          <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Cada Marco da Jornada
          </h3>
        </div>

        {/* Horizontal Timeline Wrapper with Dynamic Gradient Mask */}
        <div 
          className="relative w-full overflow-hidden transition-all duration-300"
          style={maskStyle}
        >
          {/* Horizontal timeline container with hidden scrollbar and drag-to-scroll */}
          <div 
            ref={containerRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`w-full overflow-x-auto no-scrollbar pb-8 pt-4 px-16 relative transition-all ${
              isDown ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {/* Inner scrollable wrapper that stretches to the full width of items */}
            <div className="relative flex gap-6 items-stretch min-w-max">
              {/* Horizontal connecting line behind the dots */}
              <div className="absolute left-[10rem] right-[10rem] sm:left-[11rem] sm:right-[11rem] h-0.5 bg-gradient-to-r from-violet-500/65 via-cyan-400/65 to-violet-500/65 top-[4.75rem] sm:top-[4.875rem] -z-10" />

              {timelineData.map((event, index) => (
                <TimelineItem key={event.id} event={event} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* User Tip */}
        <div className="flex items-center justify-center gap-2 mt-4 text-slate-500 text-xs">
          <span>Deslize horizontalmente ou arraste para navegar</span>
          <span className="animate-pulse">↔</span>
        </div>

      </div>
    </section>
  );
};

export default Timeline;
