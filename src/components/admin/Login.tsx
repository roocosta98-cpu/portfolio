import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Zap, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/admin');
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.session) {
        navigate('/admin');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao realizar login. Verifique as credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020409] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Dynamic ambient background glows */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[130px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Brand header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={28} className="text-violet-400" fill="currentColor" />
            <span className="font-black text-white text-2xl tracking-tight gradient-text" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Tagashira
            </span>
          </div>
          <span className="text-slate-400 text-xs font-semibold tracking-widest uppercase">
            Painel Administrativo
          </span>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* subtle line effect */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500" />

          <h2
            className="text-white text-xl font-bold mb-6 text-center"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Faça login para gerenciar
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                E-mail
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full pl-12 pr-4 py-3.5 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full pl-12 pr-4 py-3.5 rounded-xl text-sm"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs leading-relaxed"
              >
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full relative overflow-hidden py-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Entrar no Painel</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Quick info tip */}
          <div className="mt-8 text-center text-slate-500 text-[11px]">
            <p>Utilize suas credenciais cadastradas no console do Supabase.</p>
          </div>
        </div>

        {/* Back to Home link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-slate-400 text-xs hover:text-white transition-colors underline cursor-pointer"
          >
            ← Voltar para o Portfólio
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
