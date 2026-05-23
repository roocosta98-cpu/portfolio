import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Sliders, Globe, Mail, Image, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface SiteSettings {
  id: string;
  site_title: string;
  contact_email: string;
  email_subject: string;
  logo_url: string | null;
  favicon_url: string | null;
}

const SettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    id: 'global',
    site_title: 'Rodrigo Tagashira | Product Design Lead & Developer',
    contact_email: 'roocosta98@gmail.com',
    email_subject: 'nova mensagem de site',
    logo_url: null,
    favicon_url: null
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'global')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No settings record exists yet, we'll create it on save
          console.log('No settings record found. Using defaults.');
        } else {
          throw error;
        }
      } else if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Helper to compress and convert image files to Base64 (Data URLs)
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logo_url' | 'favicon_url',
    maxSize: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if it exceeds max size
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress as WEBP or PNG
          const base64 = canvas.toDataURL(file.type === 'image/svg+xml' ? 'image/svg+xml' : 'image/png', 0.85);
          setSettings((prev) => ({ ...prev, [field]: base64 }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 'global',
          site_title: settings.site_title,
          contact_email: settings.contact_email,
          email_subject: settings.email_subject,
          logo_url: settings.logo_url,
          favicon_url: settings.favicon_url,
        });

      if (error) throw error;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // Dynamically update page title & favicon immediately in admin panel too!
      document.title = settings.site_title;
      if (settings.favicon_url) {
        const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
        if (link) {
          link.href = settings.favicon_url;
        }
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Erro ao salvar as configurações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-2xl min-h-[300px]">
        <svg className="animate-spin h-8 w-8 text-violet-400 mb-3" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-slate-400 text-sm">Carregando configurações...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2
          className="text-2xl font-black text-white flex items-center gap-2"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          <Sliders size={24} className="text-violet-400" />
          <span>Configurações Globais do Site</span>
        </h2>
        <p className="text-slate-400 text-xs mt-1">Configure elementos essenciais de SEO, formulário e identidade visual.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: General Settings */}
            <div className="flex flex-col gap-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <Globe size={16} className="text-cyan-400" />
                <span>SEO & Identidade Básica</span>
              </h3>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Título da Página (Nome na Aba)</label>
                <input
                  type="text"
                  required
                  value={settings.site_title}
                  onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                  placeholder="Ex: Rodrigo Tagashira | Product Design Lead & Developer"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
                <span className="text-[10px] text-slate-500">Este título será aplicado dinamicamente na aba do navegador.</span>
              </div>

              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2 mt-4">
                <Mail size={16} className="text-pink-400" />
                <span>Formulário de Contato</span>
              </h3>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">E-mail de Destino</label>
                <input
                  type="email"
                  required
                  value={settings.contact_email}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  placeholder="Ex: roocosta98@gmail.com"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
                <span className="text-[10px] text-slate-500">E-mail que receberá as mensagens submetidas no formulário.</span>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Assunto do E-mail</label>
                <input
                  type="text"
                  required
                  value={settings.email_subject}
                  onChange={(e) => setSettings({ ...settings, email_subject: e.target.value })}
                  placeholder="Ex: nova mensagem de site"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
                <span className="text-[10px] text-slate-500">Assunto que aparecerá na notificação do seu e-mail.</span>
              </div>
            </div>

            {/* Right: Logos & Images */}
            <div className="flex flex-col gap-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <Image size={16} className="text-violet-400" />
                <span>Identidade Visual & Mídia</span>
              </h3>

              {/* Logo Upload */}
              <div className="flex flex-col gap-3">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Logo do Site (PNG/SVG)</label>
                <div className="flex items-center gap-4 bg-white/3 border border-white/5 p-4 rounded-xl">
                  {settings.logo_url ? (
                    settings.logo_url.startsWith('<svg') ? (
                      <div className="w-12 h-12 flex items-center justify-center text-white bg-white/5 rounded-lg overflow-hidden border border-white/10" dangerouslySetInnerHTML={{ __html: settings.logo_url }} />
                    ) : (
                      <img src={settings.logo_url} alt="Logo" className="w-12 h-12 object-contain bg-white/5 rounded-lg border border-white/10 p-1" />
                    )
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-dashed border-white/15 flex items-center justify-center text-slate-500 text-xs">Sem Logo</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <input
                      type="file"
                      accept="image/png, image/svg+xml, image/jpeg"
                      onChange={(e) => handleImageUpload(e, 'logo_url', 400)}
                      className="hidden"
                      id="logo-upload-input"
                    />
                    <label
                      htmlFor="logo-upload-input"
                      className="px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-xs font-bold cursor-pointer transition-all inline-block"
                    >
                      Escolher PNG/SVG
                    </label>
                    {settings.logo_url && (
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, logo_url: null })}
                        className="text-[10px] text-red-400 hover:text-red-300 ml-3 font-semibold"
                      >
                        Remover
                      </button>
                    )}
                    <p className="text-[9px] text-slate-500 mt-1">Carregue um arquivo leve. Ele substituirá o ícone ⚡ padrão.</p>
                  </div>
                </div>
              </div>

              {/* Favicon Upload */}
              <div className="flex flex-col gap-3">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Favicon (.ico / .png)</label>
                <div className="flex items-center gap-4 bg-white/3 border border-white/5 p-4 rounded-xl">
                  {settings.favicon_url ? (
                    <img src={settings.favicon_url} alt="Favicon" className="w-8 h-8 object-contain bg-white/5 rounded-lg border border-white/10 p-1" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-dashed border-white/15 flex items-center justify-center text-slate-500 text-xs">ICO</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <input
                      type="file"
                      accept="image/x-icon, image/png, image/x-image"
                      onChange={(e) => handleImageUpload(e, 'favicon_url', 64)}
                      className="hidden"
                      id="favicon-upload-input"
                    />
                    <label
                      htmlFor="favicon-upload-input"
                      className="px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-xs font-bold cursor-pointer transition-all inline-block"
                    >
                      Escolher Favicon
                    </label>
                    {settings.favicon_url && (
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, favicon_url: null })}
                        className="text-[10px] text-red-400 hover:text-red-300 ml-3 font-semibold"
                      >
                        Remover
                      </button>
                    )}
                    <p className="text-[9px] text-slate-500 mt-1">Substitui o ícone do site exibido na aba do navegador.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-4">
            <div>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold"
                >
                  <Check size={14} />
                  <span>Configurações salvas e aplicadas com sucesso!</span>
                </motion.div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={saving}
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              <Save size={16} />
              <span>{saving ? 'Salvando...' : 'Salvar Configurações'}</span>
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default SettingsManager;
