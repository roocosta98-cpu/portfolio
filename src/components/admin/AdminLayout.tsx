import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Zap,
  BookOpen,
  MessageSquare,
  Building2,
  FolderKanban,
  Cpu,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  User,
  Heart,
  Wrench,
  Sliders
} from 'lucide-react';
import DashboardOverview from './DashboardOverview';
import BlogManager from './BlogManager';
import TestimonialsManager from './TestimonialsManager';
import PartnersManager from './PartnersManager';
import PortfolioManager from './PortfolioManager';
import SystemsManager from './SystemsManager';
import HobbiesManager from './HobbiesManager';
import SkillsManager from './SkillsManager';
import SettingsManager from './SettingsManager';

type Tab = 'overview' | 'blog' | 'testimonials' | 'partners' | 'portfolio' | 'systems' | 'hobbies' | 'skills' | 'settings';

const AdminLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/admin/login');
      } else {
        setUserEmail(session.user.email || null);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/admin/login');
      } else {
        setUserEmail(session.user.email || null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020409] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-violet-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-slate-400 text-sm">Verificando sessão...</span>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'blog', label: 'Blog Posts', icon: <BookOpen size={18} /> },
    { id: 'testimonials', label: 'Depoimentos', icon: <MessageSquare size={18} /> },
    { id: 'partners', label: 'Logos Clientes', icon: <Building2 size={18} /> },
    { id: 'portfolio', label: 'Portfólio (Cases)', icon: <FolderKanban size={18} /> },
    { id: 'systems', label: 'Sistemas que Construo', icon: <Cpu size={18} /> },
    { id: 'hobbies', label: 'Life & Hobbies', icon: <Heart size={18} /> },
    { id: 'skills', label: 'Skills & Arsenal', icon: <Wrench size={18} /> },
    { id: 'settings', label: 'Configurações', icon: <Sliders size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview setActiveTab={setActiveTab} />;
      case 'blog':
        return <BlogManager />;
      case 'testimonials':
        return <TestimonialsManager />;
      case 'partners':
        return <PartnersManager />;
      case 'portfolio':
        return <PortfolioManager />;
      case 'systems':
        return <SystemsManager />;
      case 'hobbies':
        return <HobbiesManager />;
      case 'skills':
        return <SkillsManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <DashboardOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020409] text-slate-100 flex flex-col lg:flex-row relative overflow-x-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-violet-600/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      {/* ── Mobile Header ── */}
      <header className="lg:hidden h-16 border-b border-white/10 px-4 flex items-center justify-between glass-panel sticky top-0 z-40">
        <div className="flex items-center gap-1.5">
          <Zap size={20} className="text-violet-400" fill="currentColor" />
          <span className="font-black text-white text-lg gradient-text" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Tagashira
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* ── Sidebar ── */}
      <aside
        className={`w-64 border-r border-white/10 flex flex-col fixed inset-y-0 left-0 z-30 transform lg:transform-none lg:static transition-transform duration-300 ease-in-out glass-panel ${
          sidebarOpen ? 'translate-x-0 pt-16 lg:pt-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="hidden lg:flex items-center gap-1.5 px-6 py-6 border-b border-white/5">
          <Zap size={22} className="text-violet-400" fill="currentColor" />
          <span className="font-black text-white text-lg gradient-text" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Tagashira Admin
          </span>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 flex items-center gap-3 bg-white/3 border-b border-white/5">
          <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <User size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">Rodrigo</p>
            <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 flex flex-col gap-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as Tab);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-violet-500/15 border border-violet-500/25 text-white shadow-lg shadow-violet-500/5'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-violet-400' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-slate-500 hover:text-white hover:bg-white/5 transition-all mb-1 cursor-pointer"
          >
            <span>Ver Site Principal</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
        />
      )}

      {/* ── Main Content Area ── */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminLayout;
