import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowUp, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';

// LinkedIn SVG
const LinkedInIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// WhatsApp SVG
const WhatsAppIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

const Footer: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('logo_url')
          .eq('id', 'global')
          .single();
        if (data && data.logo_url) {
          setLogoUrl(data.logo_url);
        }
      } catch (e) {
        console.warn("Failed to fetch custom logo, using default zap.");
      }
    };
    fetchLogo();
  }, []);

  return (
    <footer className="relative border-t border-white/10 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">

          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="flex items-center gap-1.5">
              {logoUrl ? (
                logoUrl.startsWith('<svg') ? (
                  <div
                    className="w-5 h-5 flex items-center justify-center text-violet-400 [&>svg]:w-full [&>svg]:h-full"
                    dangerouslySetInnerHTML={{ __html: logoUrl }}
                  />
                ) : (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="h-5 w-auto object-contain max-h-5"
                  />
                )
              ) : (
                <Zap size={20} className="text-violet-400" fill="currentColor" />
              )}
              <span className="font-black text-white text-lg gradient-text" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Tagashira
              </span>
            </div>
            <p className="text-slate-500 text-xs text-center sm:text-left">
              Líder de Produto · Design Lead · Senior Developer
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            <motion.a
              href="https://www.linkedin.com/in/rodrigo-c-tagashira-726783156"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-colors"
              title="LinkedIn"
            >
              <LinkedInIcon size={18} />
            </motion.a>

            <motion.a
              href="https://wa.me/5511978454100"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
              title="WhatsApp"
            >
              <WhatsAppIcon size={18} />
            </motion.a>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:border-violet-500/40 transition-colors cursor-pointer"
              title="Voltar ao topo"
            >
              <ArrowUp size={18} />
            </motion.button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} Rodrigo C. Tagashira · tagashira.tech
          </p>
          <p className="text-slate-600 text-xs flex items-center justify-center sm:justify-start gap-1 flex-wrap">
            feito com
            <motion.span
              className="inline-block mx-0.5"
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
            >
              <Heart size={12} className="text-red-500 fill-red-500 inline-block align-middle" />
            </motion.span>
            por{' '}
            <span className="text-violet-400 font-medium">Rodrigo Tagashira</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
