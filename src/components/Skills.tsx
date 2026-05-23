import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Brain, Palette, Code2, Wrench, Cpu, Database, Globe, Terminal } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SkillCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  badgeStyle: string;
  hoverGlow: string;
  skills: string[];
}

const STATIC_SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'ai',
    label: 'Artificial Intelligence',
    icon: <Brain size={20} />,
    color: 'from-emerald-500 to-teal-600',
    badgeStyle: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25',
    hoverGlow: 'hover:shadow-emerald-500/20 hover:border-emerald-500/50 hover:text-emerald-200',
    skills: [
      'Prompt Engineering',
      'Integração de LLMs (OpenAI, Anthropic, Gemini)',
      'AI-Driven Development',
      'IA Generativa para UI/UX',
      'Automação Inteligente de Processos',
    ],
  },
  {
    id: 'design',
    label: 'Product & UX/UI Design',
    icon: <Palette size={20} />,
    color: 'from-pink-500 to-rose-600',
    badgeStyle: 'text-pink-300 bg-pink-500/10 border-pink-500/25',
    hoverGlow: 'hover:shadow-pink-500/20 hover:border-pink-500/50 hover:text-pink-200',
    skills: [
      'Liderança de Times de Produto',
      'UX Research',
      'Testes de Usabilidade',
      'Wireframing',
      'Prototipagem de Alta Fidelidade',
      'Design Systems',
    ],
  },
  {
    id: 'dev',
    label: 'Desenvolvimento de Software',
    icon: <Code2 size={20} />,
    color: 'from-cyan-500 to-blue-600',
    badgeStyle: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/25',
    hoverGlow: 'hover:shadow-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-200',
    skills: [
      'React',
      'Vite',
      'Node.js',
      'Flutter',
      'JavaScript',
      'TypeScript',
      'HTML / CSS',
      'MySQL',
    ],
  },
  {
    id: 'tools',
    label: 'Ferramentas & Plataformas',
    icon: <Wrench size={20} />,
    color: 'from-violet-500 to-purple-600',
    badgeStyle: 'text-violet-300 bg-violet-500/10 border-violet-500/25',
    hoverGlow: 'hover:shadow-violet-500/20 hover:border-violet-500/50 hover:text-violet-200',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Cursor', 'v0', 'GitHub Copilot'],
  },
];

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Brain': return <Brain size={20} />;
    case 'Palette': return <Palette size={20} />;
    case 'Code2': return <Code2 size={20} />;
    case 'Wrench': return <Wrench size={20} />;
    case 'Cpu': return <Cpu size={20} />;
    case 'Database': return <Database size={20} />;
    case 'Globe': return <Globe size={20} />;
    case 'Terminal': return <Terminal size={20} />;
    default: return <Wrench size={20} />;
  }
};

const getStyleMapping = (colorClass: string) => {
  if (colorClass.includes('emerald')) {
    return {
      badge: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25',
      hover: 'hover:shadow-emerald-500/20 hover:border-emerald-500/50 hover:text-emerald-200'
    };
  }
  if (colorClass.includes('pink') || colorClass.includes('rose')) {
    return {
      badge: 'text-pink-300 bg-pink-500/10 border-pink-500/25',
      hover: 'hover:shadow-pink-500/20 hover:border-pink-500/50 hover:text-pink-200'
    };
  }
  if (colorClass.includes('cyan') || colorClass.includes('blue')) {
    return {
      badge: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/25',
      hover: 'hover:shadow-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-200'
    };
  }
  if (colorClass.includes('violet') || colorClass.includes('purple')) {
    return {
      badge: 'text-violet-300 bg-violet-500/10 border-violet-500/25',
      hover: 'hover:shadow-violet-500/20 hover:border-violet-500/50 hover:text-violet-200'
    };
  }
  if (colorClass.includes('amber') || colorClass.includes('orange')) {
    return {
      badge: 'text-amber-300 bg-amber-500/10 border-amber-500/25',
      hover: 'hover:shadow-amber-500/20 hover:border-amber-500/50 hover:text-amber-200'
    };
  }
  return {
    badge: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/25',
    hover: 'hover:shadow-indigo-500/20 hover:border-indigo-500/50 hover:text-indigo-200'
  };
};

const SkillCategoryCard: React.FC<{ category: SkillCategory; index: number }> = ({
  category,
  index,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group"
    >
      {/* Hover glow */}
      <motion.div
        animate={{ opacity: hovered ? 0.3 : 0 }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.color} blur-xl`}
      />

      <div className="relative glass-panel rounded-2xl p-6 h-full transition-all duration-300 group-hover:border-white/20">
        {/* Category header */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${category.color} text-white shadow-lg`}>
            {category.icon}
          </div>
          <h3
            className="text-white font-bold text-base"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {category.label}
          </h3>
        </div>

        {/* Skill badges */}
        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill) => (
            <motion.span
              key={skill}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`skill-badge inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border cursor-default transition-all duration-200 hover:shadow-lg ${category.badgeStyle} ${category.hoverGlow}`}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Skills: React.FC = () => {
  const [categories, setCategories] = useState<SkillCategory[]>(STATIC_SKILL_CATEGORIES);
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true });

  useEffect(() => {
    const fetchDynamicSkills = async () => {
      try {
        const { data, error } = await supabase
          .from('skill_categories')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.warn('Could not read from skill_categories. Operating in static fallback mode:', error.message);
          return;
        }

        if (data && data.length > 0) {
          const mapped: SkillCategory[] = data.map((cat: any) => {
            const styles = getStyleMapping(cat.color);
            return {
              id: cat.id,
              label: cat.label,
              icon: getIcon(cat.icon),
              color: cat.color,
              badgeStyle: styles.badge,
              hoverGlow: styles.hover,
              skills: cat.skills
            };
          });
          setCategories(mapped);
        }
      } catch (err) {
        console.error('Error fetching dynamic skills:', err);
      }
    };

    fetchDynamicSkills();
  }, []);

  return (
    <section id="skills" className="relative py-32 sm:py-40 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20 sm:mb-28"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 mb-4 tracking-wider uppercase">
            Hard Skills
          </span>
          <h2
            className="text-4xl sm:text-5xl font-black text-white mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Ferramentas do{' '}
            <span className="gradient-text">meu arsenal</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            De Prompt Engineering e integração de LLMs até liderança de produto e desenvolvimento front-end — domínio amplo, execução precisa.
          </p>
        </motion.div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <SkillCategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default Skills;

