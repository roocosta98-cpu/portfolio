import React, { useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { X, ExternalLink, Tag, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  link?: string;
  github?: string;
  tags: string[];
  gradient: string;
  icon: string;
  year: string;
  role: string;
  highlights: string[];
  cover_url?: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 'doc-generator',
    title: 'Doc Generator',
    category: 'AI Tool',
    description: 'Sistema inteligente para geração automatizada de documentos e relatórios técnicos.',
    longDescription: 'Uma plataforma que automatiza a criação de documentação técnica com precisão e velocidade, integrando fluxos inteligentes de IA para gerar relatórios estruturados e profissionais em segundos. Desenvolvida com foco em produtividade para equipes de tecnologia e negócios.',
    link: 'https://tagashira.tech/docgenerator',
    tags: ['React', 'Node.js', 'Automation', 'UX Design'],
    gradient: 'from-violet-600 via-purple-600 to-fuchsia-700',
    icon: '📄',
    year: '2024',
    role: 'Product Designer & Developer',
    highlights: ['Geração automática de docs', 'Integração com IA', 'Interface intuitiva'],
  },
  {
    id: 'kanban',
    title: 'Kanban Task Manager',
    category: 'Productivity',
    description: 'Gerenciador de tarefas ágil e visual focado em produtividade de times.',
    longDescription: 'Uma ferramenta de gestão de tarefas com drag-and-drop fluido, visualização em colunas Kanban customizáveis, e experiência de usuário cuidadosamente desenhada para times que precisam de clareza e velocidade. Perfeito para equipes ágeis.',
    link: 'https://tagashira.tech/kanban/',
    tags: ['React', 'Drag and Drop', 'Tailwind', 'Product'],
    gradient: 'from-cyan-600 via-sky-600 to-blue-700',
    icon: '📋',
    year: '2024',
    role: 'Full Stack Developer & UX Designer',
    highlights: ['Drag & Drop fluido', 'Colunas customizáveis', 'UI limpa e ágil'],
  },
  {
    id: 'labflix',
    title: 'LABFLIX',
    category: 'Product Design',
    description: 'Plataforma de streaming educacional com liderança completa do produto.',
    longDescription: 'Liderança completa do produto LABFLIX para EC Global, gerenciando todo o ciclo de design: pesquisa de usuário, arquitetura de informação, prototipagem de alta fidelidade e validação de experiência. Produto com design system próprio e fluxos otimizados para engajamento.',
    tags: ['Figma', 'Design System', 'UX Research', 'Product'],
    gradient: 'from-red-600 via-orange-600 to-amber-600',
    icon: '🎬',
    year: '2024',
    role: 'UX Design Lead',
    highlights: ['Design system completo', 'Pesquisa de usuário', 'Alta fidelidade'],
  },
  {
    id: 'policia-federal',
    title: 'Sistemas PF',
    category: 'Gov Design System',
    description: 'Design System e protótipos de alta fidelidade para o Departamento de Polícia Federal.',
    longDescription: 'Alocado estrategicamente na Polícia Federal via Stefanini, fui responsável pela gestão e evolução do Design System institucional, criação de protótipos de alta fidelidade para sistemas críticos e liderança de squads cross-functional. Projetos com alto grau de segurança e complexidade de UX.',
    tags: ['Figma', 'Design System', 'Prototyping', 'UX'],
    gradient: 'from-blue-700 via-indigo-700 to-violet-700',
    icon: '🛡️',
    year: '2022',
    role: 'UX Designer Pleno — Stefanini',
    highlights: ['Design System institucional', 'Squads cross-functional', 'Sistemas críticos'],
  },
  {
    id: 'itau',
    title: 'Itaú Unibanco — UX',
    category: 'Banking UX',
    description: 'Fluxos que geraram +60% de eficiência em sistemas internos do maior banco da América Latina.',
    longDescription: 'Criação de fluxos de experiência e interfaces que resultaram em um aumento de 60% na eficiência operacional de sistemas internos do Itaú Unibanco. Trabalho realizado em squads ágeis com forte foco em dados, testes de usabilidade e entregas rápidas via Stefanini.',
    tags: ['Figma', 'UX Research', 'Usability Testing', 'Agile'],
    gradient: 'from-orange-500 via-amber-600 to-yellow-600',
    icon: '🏦',
    year: '2023',
    role: 'UX Designer Pleno — Stefanini',
    highlights: ['+60% de eficiência', 'Testes de usabilidade', 'Squads ágeis'],
  },
  {
    id: 'ebakery',
    title: 'eBakery — UI Design',
    category: 'E-commerce Design',
    description: 'Liderança de processos de design ponta a ponta para agência alemã de e-commerce.',
    longDescription: 'Como Senior UI Designer na eBakery (Alemanha), liderei processos de design completos para clientes de e-commerce europeus, trabalhando 100% remotamente. Projetos com padrões internacionais de qualidade, responsividade avançada e foco em conversão.',
    tags: ['Adobe XD', 'UI Design', 'E-commerce', 'Remote'],
    gradient: 'from-amber-500 via-yellow-500 to-lime-500',
    icon: '🇩🇪',
    year: '2022',
    role: 'Senior UI Designer',
    highlights: ['Projetos internacionais', '100% remoto', 'E-commerce UX'],
  },
];

const tagColors: Record<string, string> = {
  React: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/25',
  'Node.js': 'text-green-300 bg-green-500/10 border-green-500/25',
  Automation: 'text-violet-300 bg-violet-500/10 border-violet-500/25',
  'UX Design': 'text-pink-300 bg-pink-500/10 border-pink-500/25',
  'Drag and Drop': 'text-orange-300 bg-orange-500/10 border-orange-500/25',
  Tailwind: 'text-sky-300 bg-sky-500/10 border-sky-500/25',
  Product: 'text-amber-300 bg-amber-500/10 border-amber-500/25',
  Figma: 'text-purple-300 bg-purple-500/10 border-purple-500/25',
  'Design System': 'text-rose-300 bg-rose-500/10 border-rose-500/25',
};

// ── Modal ──────────────────────────────────────────────
const ProjectModal: React.FC<{ item: PortfolioItem; onClose: () => void }> = ({ item, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header banner */}
          <div 
            className={`relative h-40 bg-gradient-to-br ${item.gradient} rounded-t-3xl overflow-hidden flex-shrink-0`}
            style={item.cover_url ? { backgroundImage: `url(${item.cover_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            <div className={`absolute inset-0 ${item.cover_url ? 'bg-black/55 backdrop-blur-[1px]' : 'bg-black/20'}`} />
            {!item.cover_url && (
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }} />
            )}
            <div className="absolute bottom-5 left-6 flex items-end gap-4">
              <span className="text-5xl">{item.icon}</span>
              <div>
                <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{item.category}</span>
                <h3 className="text-white text-2xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>{item.title}</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 flex flex-col gap-5">
            {/* Meta row */}
            <div className="flex flex-wrap gap-4 text-sm">
              {[
                { label: 'Ano', value: item.year },
                { label: 'Papel', value: item.role },
              ].map((m) => (
                <div key={m.label} className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">{m.label}</span>
                  <span className="text-slate-200 font-semibold text-sm">{m.value}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-slate-400 leading-relaxed text-sm">{item.longDescription}</p>

            {/* Highlights */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Destaques</p>
              <div className="flex flex-col gap-2">
                {item.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 text-sm text-slate-300">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${item.gradient} flex-shrink-0`} />
                    {h}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${tagColors[tag] || 'text-slate-300 bg-slate-500/10 border-slate-500/25'}`}>
                  <Tag size={9} />{tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white w-full"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <ExternalLink size={15} /> Visitar Projeto ao Vivo
                </span>
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Card ───────────────────────────────────────────────
const PortfolioCard: React.FC<{ item: PortfolioItem; index: number; onClick: () => void }> = ({ item, index, onClick }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClick}
      className="group glass-panel rounded-2xl overflow-hidden cursor-pointer hover:border-white/20 hover:-translate-y-1.5 transition-all duration-300"
    >
      {/* Banner */}
      <div 
        className={`relative h-28 bg-gradient-to-br ${item.gradient} overflow-hidden`}
        style={item.cover_url ? { backgroundImage: `url(${item.cover_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <div className={`absolute inset-0 ${item.cover_url ? 'bg-black/55 backdrop-blur-[1px] group-hover:bg-black/40 transition-colors duration-300' : 'bg-black/20'}`} />
        <div className="absolute bottom-3 left-4 flex items-end gap-3">
          <span className="text-3xl">{item.icon}</span>
          <span className="text-white/70 text-xs font-bold uppercase tracking-wider">{item.category}</span>
        </div>
        <div className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ArrowUpRight size={14} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-white font-bold text-base leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {item.title}
          </h3>
          <span className="text-[10px] text-slate-500 font-mono flex-shrink-0 mt-0.5">{item.year}</span>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed mb-3 line-clamp-2">{item.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tagColors[tag] || 'text-slate-400 bg-slate-500/10 border-slate-500/20'}`}>
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] text-slate-500 bg-white/5 border border-white/10">
              +{item.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Section ───────────────────────────────────────
const PortfolioSection: React.FC = () => {
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true });
  const [itemsList, setItemsList] = useState<PortfolioItem[]>(portfolioItems);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(itemsList.length / itemsPerPage);
  const paginatedItems = itemsList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        let response = await supabase
          .from('portfolio_items')
          .select('*')
          .order('order_index', { ascending: true })
          .order('created_at', { ascending: false });
        
        if (response.error) {
          console.warn('Retrying portfolio query without order_index...', response.error);
          response = await supabase
            .from('portfolio_items')
            .select('*')
            .order('created_at', { ascending: false });
        }

        if (response.error) throw response.error;
        const data = response.data;

        if (data && data.length > 0) {
          const parsed = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            category: d.category,
            description: d.description,
            longDescription: d.long_description,
            link: d.link || undefined,
            github: d.github || undefined,
            tags: d.tags || [],
            gradient: d.gradient,
            icon: d.icon,
            year: d.year,
            role: d.role,
            highlights: d.highlights || [],
            cover_url: d.cover_url || undefined,
          }));
          setItemsList(parsed);
        }
      } catch (err) {
        console.warn('Error fetching portfolio items from Supabase:', err);
      }
    };
    fetchPortfolioItems();
  }, []);

  return (
    <>
      <section id="portfolio" className="relative py-32 sm:py-40 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            ref={headingRef}
            initial={{ opacity: 0, y: 30 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-20 sm:mb-28"
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-fuchsia-300 bg-fuchsia-500/10 border border-fuchsia-500/20 mb-4 tracking-wider uppercase">
              Portfólio Completo
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Trabalhos &{' '}
              <span className="gradient-text">Cases</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Clique em qualquer projeto para ver os detalhes completos.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedItems.map((item, i) => (
              <PortfolioCard key={item.id} item={item} index={i} onClick={() => setSelected(item)} />
            ))}
          </div>

          {/* Paginador */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-16">
              <button
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
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
                        document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
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
                    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
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

      {/* Modal */}
      {selected && <ProjectModal item={selected} onClose={() => setSelected(null)} />}
    </>
  );
};

export default PortfolioSection;
