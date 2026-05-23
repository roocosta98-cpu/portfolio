import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { supabase } from '../lib/supabase';
import {
  Briefcase,
  UtensilsCrossed,
  Gamepad2,
  Music,
  Sparkles,
  Heart,
  Camera,
  BookOpen,
  Coffee,
  Compass
} from 'lucide-react';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

const BentoCard: React.FC<BentoCardProps> = ({ children, className = '', index = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`bento-card glass-panel rounded-2xl p-6 sm:p-8 hover:border-white/20 h-full w-full flex flex-col justify-start ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface Hobby {
  id?: string;
  category: string;
  title: string;
  icon: string;
  gradient: string;
  description: string;
  items: string[];
  extra_info?: string | null;
}

const fallbackHobbies: Hobby[] = [
  {
    category: 'microenterprise',
    title: 'Microempreendedor',
    icon: 'Briefcase',
    gradient: 'from-violet-500 to-purple-700',
    description: 'Empreendo com propósito — desenvolvendo soluções robustas e escaláveis para empresas que precisam de um parceiro técnico estratégico, não apenas um freelancer.',
    items: ['Soluções Digitais', 'Consultoria', 'Produto', 'Branding'],
    extra_info: 'MEI'
  },
  {
    category: 'music',
    title: 'Minha Trilha Sonora 🎵',
    icon: 'Music',
    gradient: 'from-pink-500 to-rose-600',
    description: 'Do pesado ao suave — meu gosto musical não tem fronteiras. Cada gênero tem o momento certo para inspirar.',
    items: ['🎸 Rock', '🤘 Metal', '🎵 Blues', '🎤 Rap', '🎷 Jazz', '🌿 Reggae']
  },
  {
    category: 'cooking',
    title: 'Chef de Improviso 🔥',
    icon: 'UtensilsCrossed',
    gradient: 'from-orange-500 to-amber-600',
    description: 'Especialista em criar pratos incríveis com carne bovina e pizzas artesanais do zero. O fogão é onde o caos vira obra de arte — sem receita.',
    items: [],
    extra_info: '🚫 Passo longe de sushi. Não, obrigado.'
  },
  {
    category: 'gaming',
    title: 'Hobbies & Gaming 🎮',
    icon: 'Gamepad2',
    gradient: 'from-cyan-500 to-sky-600',
    description: 'Gamer nas horas vagas com setup Lenovo. Leitor assíduo de fantasia épica, ficção científica e thrillers de suspense — sempre com um livro na fila.',
    items: ['🎮 Setup Lenovo', '📚 Fantasia · Sci-Fi']
  }
];

const iconMap: Record<string, React.ComponentType<any>> = {
  Briefcase,
  UtensilsCrossed,
  Gamepad2,
  Music,
  Heart,
  Sparkles,
  Camera,
  BookOpen,
  Coffee,
  Compass
};

const renderIcon = (iconName: string) => {
  const IconComp = iconMap[iconName];
  if (IconComp) {
    return <IconComp size={18} className="text-white" />;
  }
  return <span className="text-lg leading-none select-none">{iconName}</span>;
};

const getBadgeStyle = (gradient: string, label: string) => {
  const norm = label.toLowerCase();
  if (norm.includes('🎸') || norm.includes('rock')) return 'text-red-300 bg-red-500/10 border-red-500/20';
  if (norm.includes('🤘') || norm.includes('metal')) return 'text-orange-300 bg-orange-500/10 border-orange-500/20';
  if (norm.includes('🎵') || norm.includes('blues')) return 'text-blue-300 bg-blue-500/10 border-blue-500/20';
  if (norm.includes('🎤') || norm.includes('rap')) return 'text-yellow-300 bg-yellow-500/10 border-yellow-500/20';
  if (norm.includes('🎷') || norm.includes('jazz')) return 'text-violet-300 bg-violet-500/10 border-violet-500/20';
  if (norm.includes('🌿') || norm.includes('reggae')) return 'text-green-300 bg-green-500/10 border-green-500/20';

  if (gradient.includes('violet') || gradient.includes('purple')) {
    return 'text-violet-300 bg-violet-500/10 border-violet-500/20';
  }
  if (gradient.includes('pink') || gradient.includes('rose')) {
    return 'text-pink-300 bg-pink-500/10 border-pink-500/20';
  }
  if (gradient.includes('orange') || gradient.includes('amber')) {
    return 'text-orange-300 bg-orange-500/10 border-orange-500/20';
  }
  if (gradient.includes('cyan') || gradient.includes('sky') || gradient.includes('blue')) {
    return 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20';
  }
  return 'text-slate-300 bg-white/5 border-white/10';
};

const BentoGrid: React.FC = () => {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true });
  const [hobbies, setHobbies] = useState<Hobby[]>(fallbackHobbies);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const { data, error } = await supabase
          .from('life_hobbies')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        if (data && data.length > 0) {
          const parsed = data.map((d: any) => ({
            id: d.id,
            category: d.category,
            title: d.title,
            icon: d.icon,
            gradient: d.gradient,
            description: d.description,
            items: d.items || [],
            extra_info: d.extra_info
          }));
          setHobbies(parsed);
        }
      } catch (err) {
        console.warn('Error fetching hobbies from Supabase:', err);
      }
    };
    fetchHobbies();
  }, []);

  return (
    <section id="life" className="relative py-32 sm:py-40 px-4 sm:px-6">
      {/* Background orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-pink-600/5 blur-[120px] animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20 sm:mb-28"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-pink-300 bg-pink-500/10 border border-pink-500/20 mb-4 tracking-wider uppercase">
            Além do Código
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Life &{' '}
            <span className="gradient-text">Hobbies</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Quem sou fora das linhas de código — porque a melhor tecnologia é construída por pessoas reais.
          </p>
        </motion.div>

        {/* Dynamic equal height grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
          {hobbies.map((hobby, index) => {
            const hasExtraBadge = hobby.extra_info && hobby.extra_info.length <= 6;
            const hasExtraBanner = hobby.extra_info && hobby.extra_info.length > 6;
            const isGamingGrid = hobby.category === 'boxes';

            return (
              <BentoCard key={hobby.id || index} index={index}>
                <div className="flex flex-col gap-4 sm:gap-5 w-full h-full justify-between">
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br ${hobby.gradient} shadow-lg`}>
                        {renderIcon(hobby.icon)}
                      </div>
                      <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                        <h3 className="text-white font-bold text-base sm:text-lg truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>
                          {hobby.title}
                        </h3>
                        {hasExtraBadge && (
                          <span className="text-[10px] font-bold text-violet-300 bg-violet-500/15 border border-violet-500/25 px-2 py-0.5 rounded-full select-none">
                            {hobby.extra_info}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {hobby.description}
                    </p>
                  </div>

                  {/* Group items and warning banners together at the bottom */}
                  {((hobby.items && hobby.items.length > 0) || hasExtraBanner) && (
                    <div className="flex flex-col gap-4 mt-auto">
                      {/* Items/Tags rendering */}
                      {hobby.items && hobby.items.length > 0 && (
                        <div>
                          {isGamingGrid ? (
                            <div className="grid grid-cols-2 gap-2 w-full">
                              {hobby.items.map((item) => {
                                const emojiMatch = item.match(/^([\p{Emoji}\u200d\s]+)\s*(.*)$/u);
                                const emoji = emojiMatch ? emojiMatch[1].trim() : '⭐';
                                const text = emojiMatch ? emojiMatch[2] : item;
                                return (
                                  <div key={item} className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 text-center flex flex-col justify-center items-center hover:bg-white/10 hover:border-white/20 transition-all duration-200">
                                    <span className="text-xl block mb-0.5 select-none">{emoji}</span>
                                    <p className="text-slate-300 text-[10px] sm:text-xs font-bold truncate w-full">{text}</p>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {hobby.items.map((tag) => (
                                <motion.span
                                  key={tag}
                                  whileHover={{ scale: 1.08 }}
                                  className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold border cursor-default transition-all duration-200 ${getBadgeStyle(hobby.gradient, tag)}`}
                                >
                                  {tag}
                                </motion.span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Warning/Banner rendering */}
                      {hasExtraBanner && (
                        <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 w-full">
                          <p className="text-red-400 text-xs font-bold text-center sm:text-left">
                            {hobby.extra_info}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </BentoCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
