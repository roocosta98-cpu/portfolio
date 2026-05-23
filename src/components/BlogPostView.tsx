import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

import { ArrowLeft, Calendar, Tag, BookOpen, Clock } from 'lucide-react';

interface BlogPost {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  tags: string[];
}

// A sleek, premium, React 19-safe regex Markdown renderer
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    let inList = false;
    let listItems: string[] = [];
    const elements: React.ReactNode[] = [];

    const parseInline = (line: string): React.ReactNode[] => {
      // Very simple inline parser for bold and links

      let currentText = line;

      // Handle bold **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      let match;
      let lastIndex = 0;

      const inlineElements: React.ReactNode[] = [];
      let idx = 0;

      while ((match = boldRegex.exec(currentText)) !== null) {
        if (match.index > lastIndex) {
          inlineElements.push(<span key={`text-${idx++}`}>{currentText.substring(lastIndex, match.index)}</span>);
        }
        inlineElements.push(<strong key={`bold-${idx++}`} className="font-extrabold text-white">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < currentText.length) {
        inlineElements.push(<span key={`text-${idx++}`}>{currentText.substring(lastIndex)}</span>);
      }

      return inlineElements.length > 0 ? inlineElements : [currentText];
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Handle headings
      if (trimmed.startsWith('# ')) {
        if (inList) {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc pl-6 my-4 text-slate-300 flex flex-col gap-2">
              {listItems.map((item, i) => <li key={i}>{parseInline(item)}</li>)}
            </ul>
          );
          inList = false;
          listItems = [];
        }
        elements.push(
          <h1 key={index} className="text-3xl sm:text-4xl font-black text-white mt-8 mb-4 leading-tight first:mt-0" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {trimmed.slice(2)}
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        if (inList) {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc pl-6 my-4 text-slate-300 flex flex-col gap-2">
              {listItems.map((item, i) => <li key={i}>{parseInline(item)}</li>)}
            </ul>
          );
          inList = false;
          listItems = [];
        }
        elements.push(
          <h2 key={index} className="text-2xl sm:text-3xl font-black text-white mt-8 mb-4 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {trimmed.slice(3)}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        if (inList) {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc pl-6 my-4 text-slate-300 flex flex-col gap-2">
              {listItems.map((item, i) => <li key={i}>{parseInline(item)}</li>)}
            </ul>
          );
          inList = false;
          listItems = [];
        }
        elements.push(
          <h3 key={index} className="text-xl sm:text-2xl font-black text-white mt-6 mb-3 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {trimmed.slice(4)}
          </h3>
        );
      }
      // Handle list items
      else if (trimmed.startsWith('- ')) {
        inList = true;
        listItems.push(trimmed.slice(2));
      }
      // Handle empty line
      else if (trimmed === '') {
        if (inList) {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc pl-6 my-4 text-slate-300 flex flex-col gap-2">
              {listItems.map((item, i) => <li key={i}>{parseInline(item)}</li>)}
            </ul>
          );
          inList = false;
          listItems = [];
        }
      }
      // Standard paragraph
      else {
        if (inList) {
          listItems.push(trimmed);
        } else {
          elements.push(
            <p key={index} className="text-slate-300 text-base sm:text-lg leading-relaxed mb-5">
              {parseInline(trimmed)}
            </p>
          );
        }
      }
    });

    // Close any trailing lists
    if (inList) {
      elements.push(
        <ul key="ul-end" className="list-disc pl-6 my-4 text-slate-300 flex flex-col gap-2">
          {listItems.map((item, i) => <li key={i}>{parseInline(item)}</li>)}
        </ul>
      );
    }

    return elements;
  };

  return <div className="prose prose-invert max-w-none">{parseMarkdown(content)}</div>;
};

const BlogPostView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        // Fallback mock post data for local testing
        const fallbacks: Record<string, BlogPost> = {
          'construindo-interfaces-extraordinarias': {
            id: 'fallback-1',
            created_at: new Date().toISOString(),
            title: 'Construindo Interfaces Extraordinárias com React 19 e Tailwind v4',
            slug: 'construindo-interfaces-extraordinarias',
            excerpt: 'Um mergulho técnico no novo compilador do React, suporte a Server Actions, diretivas de design e novidades do Tailwind CSS v4 para criar sites ultrarápidos.',
            tags: ['React 19', 'Tailwind v4', 'UI/UX'],
            content: `# Construindo Interfaces Extraordinárias com React 19 e Tailwind v4
            
React 19 está oficialmente entre nós, trazendo mudanças marcantes na forma como estruturamos aplicações frontend. O principal destaque é o **React Compiler**, que automatiza a memorização de componentes, eliminando de vez a necessidade de usar exaustivamente o \`useMemo\` e o \`useCallback\`.

## O que muda para nós, Designers e Desenvolvedores?

- **Fim da memorização manual**: Menos ruído visual no código e melhor performance por padrão.
- **Server Actions integradas**: Gerenciamento de estado de formulários mais robusto com transições de dados nativas.
- **Novos Hooks**: \`useActionState\` e \`useOptimistic\` tornam as experiências de carregamento e feedbacks visuais extremamente fluidas.

## A união perfeita com Tailwind CSS v4

O Tailwind v4 foi reescrito do zero com um motor de compilação em Rust extremamente rápido. Ele muda totalmente a forma como lidamos com a customização do design system.

- **Importação direta via CSS**: Esqueça o arquivo de configuração \`tailwind.config.js\`. Agora declaramos tudo diretamente com a diretiva \`@import "tailwindcss"\` e variáveis de ambiente CSS nativas.
- **Estilos mais inteligentes**: Suporte completo a containers queries, gradientes mais suaves e variáveis CSS integradas.

## Conclusão

Ao integrar o **React 19** e o **Tailwind v4**, conseguimos atingir taxas de carregamento próximas de 100% no Lighthouse, mantendo um design rico, com efeitos de partículas, vidro e micro-animações. Essa é a base de desenvolvimento que utilizei para reconstruir este portfólio.`,
          },
          'lideranca-de-produto-e-ia': {
            id: 'fallback-2',
            created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
            title: 'Liderança de Produto Orientada por Inteligência Artificial',
            slug: 'lideranca-de-produto-e-ia',
            excerpt: 'Como integrar modelos de linguagem de larga escala (LLMs) em ferramentas de produtividade diária e gerenciar squads focados em entrega orientada à experiência.',
            tags: ['IA', 'Product Lead', 'Startups'],
            content: `# Liderança de Produto Orientada por Inteligência Artificial
            
A inteligência artificial deixou de ser uma feature futurista para se tornar a espinha dorsal de produtos altamente eficientes. Como Líder de Produto e Product Designer, a minha abordagem na Kel Tech Solutions tem sido integrar agentes de IA de forma cirúrgica no fluxo de trabalho.

## Principais Pilares da Gestão com IA

- **Agilidade e Prototipagem**: Geração automatizada de relatórios técnicos e especificações de produto em segundos usando o **Doc Generator**.
- **Automação de Tarefas**: Utilização de Kanban Managers inteligentes que priorizam tarefas dinamicamente de acordo com o velocity do time.
- **Validação de Métricas**: Monitoramento contínuo da experiência do usuário baseado em feedbacks transcritos e analisados por IA.

## Criando a Cultura do Futuro nas Equipes

Liderar um time multidisciplinar exige muito mais do que gerenciar entregas. Significa dar autonomia para que desenvolvedores e designers usem assistentes cognitivos em suas tarefas diárias.

- Incentivar o uso de Copilots para otimização de código.
- Usar ferramentas inteligentes de design para exploração de layouts complexos.
- Garantir que o foco permaneça sempre na **experiência humana** e na usabilidade final.`,
          }
        };
        setPost(fallbacks[slug || ''] || null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Simple reading time estimator
  const getReadingTime = (text: string) => {
    const wpm = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wpm);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020409] flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-violet-400" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#020409] text-slate-100 flex flex-col items-center justify-center px-4">
        <BookOpen size={48} className="text-slate-600 mb-4 animate-bounce" />
        <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Artigo Não Encontrado</h2>
        <p className="text-slate-500 mb-6">A postagem solicitada não foi encontrada ou foi removida pelo autor.</p>
        <button onClick={() => navigate('/blog')} className="btn-primary px-6 py-3 rounded-xl font-bold text-white cursor-pointer">
          Voltar ao Blog
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#020409] text-slate-100 py-24 sm:py-32 px-4 sm:px-6">
      {/* Ambient background glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-violet-600/5 blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-[140px]" />
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-10 text-sm group cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para o Blog</span>
        </button>

        {/* Article Metadata */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 text-slate-500 text-xs sm:text-sm mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(post.created_at)}
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {getReadingTime(post.content)} min de leitura
            </span>
          </div>

          <h1
            className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {post.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/25 px-3 py-1 rounded-full flex items-center gap-1.5"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Cover Image (optional) */}
        {post.cover_image && (
          <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-12 shadow-xl shadow-violet-500/5">
            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Article Body */}
        <article className="glass-panel border-white/5 bg-white/1 rounded-2xl p-6 sm:p-10 mb-12">
          <MarkdownRenderer content={post.content} />
        </article>

        {/* Footer info */}
        <div className="border-t border-white/10 pt-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center font-bold text-xs text-white">
              RT
            </div>
            <div>
              <p className="text-sm font-bold text-white">Rodrigo Tagashira</p>
              <p className="text-xs text-slate-500">Product Design Lead & Analyst</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostView;
