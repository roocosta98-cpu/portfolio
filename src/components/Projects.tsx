import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ExternalLink, Tag, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSpotlight } from '../hooks/useSpotlight';

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  link: string;
  tags: string[];
  gradient: string;
  icon: string;
  stats: { label: string; value: string }[];
  cover_url?: string;
}

const projects: Project[] = [
  {
    id: 'doc-generator',
    title: 'Doc Generator',
    description: 'Sistema inteligente para geração automatizada de documentos e relatórios técnicos.',
    longDescription:
      'Uma plataforma que automatiza a criação de documentação técnica com precisão e velocidade, integrando fluxos inteligentes de IA para gerar relatórios estruturados e profissionais em segundos.',
    link: 'https://tagashira.tech/docgenerator',
    tags: ['React', 'Node.js', 'Automation', 'UX Design'],
    gradient: 'from-violet-600 via-purple-600 to-fuchsia-700',
    icon: '📄',
    stats: [
      { label: 'Stack', value: 'React + Node' },
      { label: 'Tipo', value: 'AI Tool' },
      { label: 'Status', value: 'Live ✓' },
    ],
  },
  {
    id: 'kanban',
    title: 'Kanban Task Manager',
    description: 'Gerenciador de tarefas ágil e visual focado em produtividade de times e fluxo de trabalho limpo.',
    longDescription:
      'Uma ferramenta de gestão de tarefas com drag-and-drop fluido, visualização em colunas Kanban customizáveis, e experiência de usuário cuidadosamente desenhada para times que precisam de clareza e velocidade.',
    link: 'https://tagashira.tech/kanban/',
    tags: ['React', 'Drag and Drop', 'Product Management', 'Tailwind'],
    gradient: 'from-cyan-600 via-sky-600 to-blue-700',
    icon: '📋',
    stats: [
      { label: 'Stack', value: 'React + Tailwind' },
      { label: 'Tipo', value: 'Productivity' },
      { label: 'Status', value: 'Live ✓' },
    ],
  },
];

const tagColors: Record<string, string> = {
  React: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/25',
  'Node.js': 'text-green-300 bg-green-500/10 border-green-500/25',
  Automation: 'text-violet-300 bg-violet-500/10 border-violet-500/25',
  'UX Design': 'text-pink-300 bg-pink-500/10 border-pink-500/25',
  'Drag and Drop': 'text-orange-300 bg-orange-500/10 border-orange-500/25',
  'Product Management': 'text-amber-300 bg-amber-500/10 border-amber-500/25',
  Tailwind: 'text-sky-300 bg-sky-500/10 border-sky-500/25',
};

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { ref: spotlightRef, handleMouseMove } = useSpotlight();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative h-full flex flex-col hover:-translate-y-1.5 transition-all duration-300"
    >
      {/* Premium static glassmorphic glow behind card */}
      <div className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`} />

      <div
        ref={spotlightRef}
        onMouseMove={handleMouseMove}
        className="spotlight-card glass-panel rounded-3xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-all duration-300 h-full flex flex-col relative z-10"
      >
        {/* Card header with gradient banner or cover photo */}
        <div 
          className={`relative h-32 bg-gradient-to-br ${project.gradient} overflow-hidden flex-shrink-0`}
          style={project.cover_url ? { backgroundImage: `url(${project.cover_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          <div className={`absolute inset-0 ${project.cover_url ? 'bg-black/55 backdrop-blur-[1px] group-hover:bg-black/45 transition-colors duration-300' : 'bg-black/20'}`} />
          {!project.cover_url && (
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            />
          )}
          {/* Icon */}
          <div className="absolute bottom-4 left-6">
            <span className="text-4xl">{project.icon}</span>
          </div>
          {/* Open link CTA */}
          <motion.a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
          >
            <ArrowUpRight size={18} />
          </motion.a>
        </div>

          {/* Card body */}
          <div className="relative z-10 p-6 flex-1 flex flex-col justify-between">
            <div>
              <h3
                className="text-xl font-black text-white mb-2 group-hover:gradient-text transition-all duration-300"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                {project.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{project.longDescription}</p>
            </div>

            <div>
              {/* Stats row */}
              <div className="flex gap-4 mb-5 pb-4 border-b border-white/10">
              {project.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</span>
                  <span className="text-xs font-semibold text-slate-200">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className={`skill-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                    tagColors[tag] || 'text-slate-300 bg-slate-500/10 border-slate-500/25'
                  }`}
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA Link */}
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4 }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors group/link"
            >
              Visitar Projeto
              <ExternalLink size={14} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-200" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true });
  const [projectList, setProjectList] = useState<Project[]>(projects);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(projectList.length / itemsPerPage);
  const paginatedProjects = projectList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        let response = await supabase
          .from('built_systems')
          .select('*')
          .order('order_index', { ascending: true })
          .order('created_at', { ascending: false });
        
        if (response.error) {
          console.warn('Retrying projects query without order_index...', response.error);
          response = await supabase
            .from('built_systems')
            .select('*')
            .order('created_at', { ascending: false });
        }

        if (response.error) throw response.error;
        const data = response.data;

        if (data && data.length > 0) {
          const parsed = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            description: d.description,
            longDescription: d.long_description,
            link: d.link,
            tags: d.tags || [],
            gradient: d.gradient,
            icon: d.icon,
            stats: Array.isArray(d.stats) ? d.stats : [],
            cover_url: d.cover_url || undefined,
          }));
          setProjectList(parsed);
        }
      } catch (err) {
        console.warn('Error fetching projects from Supabase:', err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="relative py-32 sm:py-40 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20 sm:mb-28"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 mb-4 tracking-wider uppercase">
            Projetos em Destaque
          </span>
          <h2
            className="text-4xl sm:text-5xl font-black text-white mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            O que eu{' '}
            <span className="gradient-text">construo</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Produtos reais, live e funcionando. Cada um representando um ângulo diferente da minha visão técnica e de produto.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {paginatedProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Paginador */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16">
            <button
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              disabled={currentPage === 1}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                currentPage === 1
                  ? 'text-slate-600 border-white/5 bg-white/2 cursor-not-allowed'
                  : 'text-slate-300 border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10 hover:text-white'
              }`}
              title="Página Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isCurrent = currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer border flex items-center justify-center ${
                      isCurrent
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 border-violet-500/50 text-white shadow-lg shadow-violet-500/20'
                        : 'border-white/5 bg-white/3 text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                currentPage === totalPages
                  ? 'text-slate-600 border-white/5 bg-white/2 cursor-not-allowed'
                  : 'text-slate-300 border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10 hover:text-white'
              }`}
              title="Próxima Página"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
