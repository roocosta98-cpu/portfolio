import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  BookOpen,
  MessageSquare,
  Building2,
  FolderKanban,
  Cpu,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';

interface Stats {
  blog: number;
  testimonials: number;
  partners: number;
  portfolio: number;
  systems: number;
}

interface DashboardOverviewProps {
  setActiveTab: (tab: any) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ setActiveTab }) => {
  const [stats, setStats] = useState<Stats>({
    blog: 0,
    testimonials: 0,
    partners: 0,
    portfolio: 0,
    systems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blogRes, testRes, partRes, portRes, sysRes] = await Promise.all([
          supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
          supabase.from('testimonials').select('*', { count: 'exact', head: true }),
          supabase.from('partners').select('*', { count: 'exact', head: true }),
          supabase.from('portfolio_items').select('*', { count: 'exact', head: true }),
          supabase.from('built_systems').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          blog: blogRes.count || 0,
          testimonials: testRes.count || 0,
          partners: partRes.count || 0,
          portfolio: portRes.count || 0,
          systems: sysRes.count || 0,
        });
      } catch (err) {
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      id: 'blog',
      label: 'Postagens no Blog',
      count: stats.blog,
      icon: <BookOpen className="text-violet-400" size={24} />,
      bgGlow: 'from-violet-600/10 to-transparent',
      borderColor: 'group-hover:border-violet-500/30',
      description: 'Compartilhe artigos, insights e dicas de produto.',
    },
    {
      id: 'testimonials',
      label: 'Depoimentos',
      count: stats.testimonials,
      icon: <MessageSquare className="text-cyan-400" size={24} />,
      bgGlow: 'from-cyan-600/10 to-transparent',
      borderColor: 'group-hover:border-cyan-500/30',
      description: 'O que clientes e colegas dizem sobre seu trabalho.',
    },
    {
      id: 'partners',
      label: 'Parceiros e Clientes',
      count: stats.partners,
      icon: <Building2 className="text-emerald-400" size={24} />,
      bgGlow: 'from-emerald-600/10 to-transparent',
      borderColor: 'group-hover:border-emerald-500/30',
      description: 'Logotipos de empresas parceiras na Home.',
    },
    {
      id: 'portfolio',
      label: 'Cases de Portfólio',
      count: stats.portfolio,
      icon: <FolderKanban className="text-amber-400" size={24} />,
      bgGlow: 'from-amber-600/10 to-transparent',
      borderColor: 'group-hover:border-amber-500/30',
      description: 'Seus cases de sucesso e projetos corporativos.',
    },
    {
      id: 'systems',
      label: 'Sistemas que Construo',
      count: stats.systems,
      icon: <Cpu className="text-pink-400" size={24} />,
      bgGlow: 'from-pink-600/10 to-transparent',
      borderColor: 'group-hover:border-pink-500/30',
      description: 'Ferramentas ativas construídas e disponibilizadas.',
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome header */}
      <div>
        <h1
          className="text-3xl font-black text-white mb-2"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Olá, Rodrigo 👋
        </h1>
        <p className="text-slate-400 text-sm">
          Bem-vindo ao seu painel de controle. Aqui você pode gerenciar todo o conteúdo dinâmico do seu site.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-panel rounded-2xl h-44 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Quick info alert */}
          <div className="glass-panel border-violet-500/20 bg-gradient-to-r from-violet-900/10 to-transparent rounded-2xl p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Integração Supabase Ativa</h3>
                <p className="text-xs text-slate-500 mt-0.5">Qualquer alteração efetuada nos painéis abaixo reflete na Home em tempo real.</p>
              </div>
            </div>
          </div>

          {/* Grid list of tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((card) => (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className={`group glass-panel rounded-2xl p-6 hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-48 cursor-pointer relative overflow-hidden`}
              >
                {/* Background glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="relative z-10 flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {card.icon}
                  </div>
                  <span className="text-3xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {card.count}
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="text-white font-bold text-base mb-1.5 flex items-center gap-1 group-hover:text-violet-400 transition-colors">
                    <span>{card.label}</span>
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardOverview;
