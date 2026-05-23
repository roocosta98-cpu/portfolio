import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { BookOpen, Search, ArrowLeft, Calendar, Tag, ArrowUpRight } from 'lucide-react';

interface BlogPost {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image?: string;
  tags: string[];
}

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error('Error fetching published posts:', err);
        // Fallback mock post so the blog is never empty
        setPosts([
          {
            id: 'fallback-1',
            created_at: new Date().toISOString(),
            title: 'Construindo Interfaces Extraordinárias com React 19 e Tailwind v4',
            slug: 'construindo-interfaces-extraordinarias',
            excerpt: 'Um mergulho técnico no novo compilador do React, suporte a Server Actions, diretivas de design e novidades do Tailwind CSS v4 para criar sites ultrarápidos.',
            tags: ['React 19', 'Tailwind v4', 'UI/UX'],
          },
          {
            id: 'fallback-2',
            created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
            title: 'Liderança de Produto Orientada por Inteligência Artificial',
            slug: 'lideranca-de-produto-e-ia',
            excerpt: 'Como integrar modelos de linguagem de larga escala (LLMs) em ferramentas de produtividade diária e gerenciar squads focados em entrega orientada à experiência.',
            tags: ['IA', 'Product Lead', 'Startups'],
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || [])));

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? post.tags?.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="relative min-h-screen bg-[#020409] text-slate-100 py-24 sm:py-32 px-4 sm:px-6">
      {/* Background radial glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-[130px]" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[130px]" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12 text-sm group cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para o Portfólio</span>
        </button>

        {/* Heading */}
        <div className="mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 mb-4 tracking-wider uppercase">
            Artigos e Insights
          </span>
          <h1
            className="text-4xl sm:text-5xl font-black text-white mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            O Blog do <span className="gradient-text">Rodrigo</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
            Reflexões sobre design de produto, engenharia de software, inteligência artificial e a interseção entre criatividade e lógica.
          </p>
        </div>

        {/* Search & Tags filter row */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input w-full pl-12 pr-4 py-3 rounded-xl text-sm"
            />
          </div>

          {/* Tags list */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-slate-500 mr-1 flex items-center gap-1">
                <Tag size={12} /> Filtrar:
              </span>
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedTag === null
                    ? 'bg-violet-500/15 border border-violet-500/35 text-white'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                Todos
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    selectedTag === tag
                      ? 'bg-violet-500/15 border border-violet-500/35 text-white'
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Post Grid */}
        {loading ? (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="glass-panel rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="glass-panel rounded-2xl p-16 text-center text-slate-500">
            <p className="text-base">Nenhuma postagem encontrada para os filtros aplicados.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="group glass-panel rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col md:flex-row gap-6 p-6 cursor-pointer relative"
              >
                {/* Visual Glow overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Left - Cover Image (Optional) */}
                {post.cover_image ? (
                  <div className="w-full md:w-48 h-48 md:h-auto rounded-xl overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full md:w-48 h-36 md:h-auto rounded-xl flex-shrink-0 bg-gradient-to-br from-violet-500/10 to-cyan-500/5 border border-white/10 flex items-center justify-center text-violet-400 group-hover:text-cyan-400 transition-colors">
                    <BookOpen size={36} />
                  </div>
                )}

                {/* Right - Details */}
                <div className="flex-1 flex flex-col justify-between py-1 relative z-10">
                  <div>
                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-3">
                      <Calendar size={12} />
                      <span>{formatDate(post.created_at)}</span>
                    </div>

                    <h2
                      className="text-xl sm:text-2xl font-black text-white mb-3 group-hover:gradient-text transition-all leading-tight"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      {post.title}
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/5">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs font-bold text-violet-400 flex items-center gap-1 hover:text-violet-300 transition-colors">
                      <span>Ler Postagem</span>
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
