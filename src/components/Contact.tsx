import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Mail, MapPin, Globe, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

// LinkedIn SVG inline (lucide-react does not export 'Linkedin')
const LinkedInIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Contact: React.FC = () => {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true });
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    contact_email: 'roocosta98@gmail.com',
    email_subject: 'nova mensagem de site'
  });

  useEffect(() => {
    const fetchContactSettings = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('contact_email, email_subject')
          .eq('id', 'global')
          .single();
        if (data) {
          setSettings({
            contact_email: data.contact_email || 'roocosta98@gmail.com',
            email_subject: data.email_subject || 'nova mensagem de site'
          });
        }
      } catch (e) {
        console.warn("Failed to fetch custom contact settings, using defaults.");
      }
    };
    fetchContactSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${settings.contact_email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          _subject: `${settings.email_subject}: ${form.subject}`,
          message: form.message
        })
      });
      
      const data = await response.json();
      if (data.success === "true" || response.ok) {
        setSubmitted(true);
      } else {
        alert("Ocorreu um erro ao enviar. Por favor, tente novamente.");
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      alert(`Erro de conexão. Por favor, tente enviar um e-mail direto para ${settings.contact_email}.`);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail size={18} />,
      label: 'E-mail',
      value: settings.contact_email,
      href: `mailto:${settings.contact_email}`,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
    },
    {
      icon: <MapPin size={18} />,
      label: 'Localização',
      value: 'Taboão da Serra, SP — Brasil',
      href: undefined,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      icon: <LinkedInIcon size={18} />,
      label: 'LinkedIn',
      value: 'rodrigo-c-tagashira',
      href: 'https://www.linkedin.com/in/rodrigo-c-tagashira-726783156',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      icon: <Globe size={18} />,
      label: 'Portfolio',
      value: 'tagashira.tech',
      href: 'https://tagashira.tech',
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
    },
  ];

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6">

      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-violet-600/8 blur-[140px]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-cyan-500/8 blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 mb-4 tracking-wider uppercase">
            Contato
          </span>
          <h2
            className="text-4xl sm:text-5xl font-black text-white mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Vamos{' '}
            <span className="gradient-text">construir juntos?</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Seja um novo projeto, uma parceria ou só trocar uma ideia — estou sempre aberto a conversas que geram valor.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left — Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            <div className="glass-panel rounded-2xl p-6 mb-2">
              <h3
                className="text-white font-bold text-xl mb-1"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Rodrigo C. Tagashira
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Líder de Produto, Design Lead e Senior Developer disponível para projetos premium, parcerias e consultoria estratégica.
              </p>
            </div>

            {contactInfo.map((info) => (
              <motion.div
                key={info.label}
                whileHover={{ x: 4 }}
                className="glass-panel rounded-xl p-4 flex items-center gap-4 hover:border-white/20 transition-all duration-200"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${info.bg} ${info.color}`}>
                  {info.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-slate-500 text-xs mb-0.5">{info.label}</p>
                  {info.href ? (
                    <a
                      href={info.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm font-semibold ${info.color} hover:brightness-125 transition-all truncate block`}
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-slate-200 text-sm font-semibold">{info.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="glass-panel rounded-2xl p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full gap-6 py-16 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle size={40} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3
                      className="text-white text-2xl font-black mb-2"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      Mensagem Enviada!
                    </h3>
                    <p className="text-slate-400">
                      Obrigado pelo contato. Retorno em breve! 🚀
                    </p>
                  </div>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="text-violet-400 text-sm hover:text-violet-300 underline transition-colors"
                  >
                    Enviar outra mensagem
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-slate-400 text-xs font-semibold tracking-wider uppercase">
                        Nome
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Seu nome"
                        className="glass-input px-4 py-3 rounded-xl text-sm placeholder-slate-600"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-slate-400 text-xs font-semibold tracking-wider uppercase">
                        E-mail
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="seu@email.com"
                        className="glass-input px-4 py-3 rounded-xl text-sm placeholder-slate-600"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="text-slate-400 text-xs font-semibold tracking-wider uppercase">
                      Assunto
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      placeholder="Sobre o que vamos falar?"
                      className="glass-input px-4 py-3 rounded-xl text-sm placeholder-slate-600"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-slate-400 text-xs font-semibold tracking-wider uppercase">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      required
                      placeholder="Conte mais sobre seu projeto ou ideia..."
                      className="glass-input px-4 py-3 rounded-xl text-sm placeholder-slate-600 resize-none"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={loading}
                    className="btn-primary relative overflow-hidden inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-sm font-bold text-white disabled:opacity-60 cursor-pointer"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Enviar Mensagem
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
