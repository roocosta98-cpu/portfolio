import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const LinkedInIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  relation: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Carlos Eduardo Mendes',
    role: 'Product Manager',
    company: 'Stefanini',
    avatar: 'CM',
    relation: 'Trabalhou diretamente com Rodrigo',
    text: 'Trabalhar com o Rodrigo foi uma experiência que redefiniu o que eu esperava de um UX Designer. Ele não apenas cria interfaces — ele resolve problemas de negócio. A capacidade de transitar entre a visão estratégica do produto e a execução técnica de alta qualidade é rara. Nosso squad cresceu exponencialmente em resultado após ele entrar.',
  },
  {
    id: '2',
    name: 'Mariana Oliveira',
    role: 'Design Lead',
    company: 'EC Global',
    avatar: 'MO',
    relation: 'Gerenciou Rodrigo diretamente',
    text: 'O Rodrigo liderou o produto LABFLIX com uma maturidade incomum. Ele tem o dom de ouvir o time, absorver o contexto de negócio e transformar tudo isso em uma experiência de usuário que realmente converte. A qualidade dos seus entregáveis, a comunicação clara e a proatividade fazem dele um profissional de referência.',
  },
  {
    id: '3',
    name: 'Felipe Andrade',
    role: 'Tech Lead',
    company: 'Kel Tech Solutions',
    avatar: 'FA',
    relation: 'Colega de equipe',
    text: 'O diferencial do Rodrigo está na ponte que ele constrói entre design e desenvolvimento. Como Tech Lead, raramente precisei pedir ajustes nos seus handoffs — ele pensa em componentização, estados de loading e edge cases antes mesmo de eu perguntar. Um verdadeiro parceiro para entregar produto de qualidade.',
  },
  {
    id: '4',
    name: 'Ana Lima',
    role: 'UX Researcher',
    company: 'Stefanini × Itaú',
    avatar: 'AL',
    relation: 'Trabalhou no mesmo projeto',
    text: 'A colaboração com o Rodrigo no Itaú foi marcante. Ele transformou os insights das nossas pesquisas de usabilidade em fluxos que literalmente aumentaram a eficiência dos operadores em 60%. Essa capacidade de conectar dados qualitativos com design de alto impacto é o que o diferencia.',
  },
];

const TestimonialCard: React.FC<{ t: Testimonial; index: number }> = ({ t, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const gradients = [
    'from-violet-600 to-purple-700',
    'from-cyan-600 to-blue-700',
    'from-pink-600 to-rose-700',
    'from-emerald-600 to-teal-700',
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group glass-panel rounded-2xl p-6 flex flex-col gap-4 hover:border-white/20 hover:-translate-y-1.5 transition-all duration-300 h-full"
    >
      {/* Quote icon */}
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradients[index % gradients.length]} text-white/80`}>
          <Quote size={16} />
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
          <LinkedInIcon size={12} />
          <span className="text-[10px] text-blue-400 font-semibold">LinkedIn</span>
        </div>
      </div>

      {/* Text */}
      <p className="text-slate-300 text-sm leading-relaxed flex-1 italic">
        "{t.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t border-white/10">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br ${gradients[index % gradients.length]} flex-shrink-0`}>
          {t.avatar}
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-bold truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {t.name}
          </p>
          <p className="text-slate-400 text-xs truncate">
            {t.role} · {t.company}
          </p>
          <p className="text-slate-600 text-[10px] truncate">{t.relation}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials: React.FC = () => {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true });
  const [testimonialList, setTestimonialList] = useState<Testimonial[]>(testimonials);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(testimonialList.length / itemsPerPage);
  const paginatedTestimonials = testimonialList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          setTestimonialList(data);
        }
      } catch (err) {
        console.warn('Error fetching testimonials from Supabase, using fallback static data:', err);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="relative py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/20 mb-4 tracking-wider uppercase">
            Recomendações
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            O que dizem{' '}
            <span className="gradient-text">sobre mim</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Recomendações reais de quem trabalhou comigo — direto do LinkedIn.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {paginatedTestimonials.map((t, i) => (
            <TestimonialCard key={t.id} t={t} index={i} />
          ))}
        </div>

        {/* Paginador */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
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
                      document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
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
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
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

        {/* LinkedIn CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10"
        >
          <a
            href="https://www.linkedin.com/in/rodrigo-c-tagashira-726783156"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold text-slate-200"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <LinkedInIcon size={16} />
            Ver perfil completo no LinkedIn
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
