import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Save, X, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  id?: string;
  name: string;
  role: string;
  company: string;
  relation: string;
  text: string;
  avatar: string;
}

const TestimonialsManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [relation, setRelation] = useState('');
  const [text, setText] = useState('');
  const [avatar, setAvatar] = useState('');

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreateForm = () => {
    setEditingItem(null);
    setName('');
    setRole('');
    setCompany('');
    setRelation('');
    setText('');
    setAvatar('');
    setIsFormOpen(true);
  };

  const openEditForm = (item: Testimonial) => {
    setEditingItem(item);
    setName(item.name);
    setRole(item.role);
    setCompany(item.company);
    setRelation(item.relation);
    setText(item.text);
    setAvatar(item.avatar);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const itemData: Testimonial = {
      name,
      role,
      company,
      relation,
      text,
      avatar: avatar || name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
    };

    try {
      if (editingItem?.id) {
        const { error } = await supabase
          .from('testimonials')
          .update(itemData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([itemData]);
        if (error) throw error;
      }

      setIsFormOpen(false);
      fetchTestimonials();
    } catch (err) {
      console.error('Error saving testimonial:', err);
      alert('Erro ao salvar depoimento.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza de que deseja excluir este depoimento?')) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchTestimonials();
    } catch (err) {
      console.error('Error deleting testimonial:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-black text-white flex items-center gap-2"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <MessageSquare size={24} className="text-violet-400" />
            <span>Gerenciador de Depoimentos</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">Gerencie as recomendações e depoimentos de colegas de trabalho e gestores.</p>
        </div>

        {!isFormOpen && (
          <button
            onClick={openCreateForm}
            className="btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <Plus size={16} />
            <span>Novo Depoimento</span>
          </button>
        )}
      </div>

      {isFormOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <h3 className="text-lg font-bold text-white">
              {editingItem ? 'Editar Depoimento' : 'Novo Depoimento'}
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Nome</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo Mendes"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Cargo</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ex: Product Manager"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Empresa</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Ex: Stefanini"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Relação Profissional</label>
                <input
                  type="text"
                  required
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  placeholder="Ex: Trabalhou diretamente com Rodrigo"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Iniciais / URL do Avatar</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="Ex: CM (Deixe vazio para gerar pelas iniciais automaticamente)"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Depoimento</label>
              <textarea
                required
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escreva a recomendação aqui..."
                className="glass-input px-4 py-3 rounded-xl text-sm resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-5">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
              >
                <Save size={16} />
                <span>Salvar Depoimento</span>
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        /* Grid of testimonials for easy view and delete */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-panel rounded-2xl h-44 animate-pulse" />
            ))
          ) : testimonials.length === 0 ? (
            <div className="col-span-2 glass-panel rounded-2xl p-12 text-center text-slate-500">
              <p className="text-sm">Nenhum depoimento cadastrado.</p>
            </div>
          ) : (
            testimonials.map((item) => (
              <div
                key={item.id}
                className="glass-panel rounded-2xl p-6 flex flex-col justify-between hover:border-white/15 transition-all duration-300 relative group"
              >
                {/* Actions overlay visible on hover */}
                <div className="absolute top-4 right-4 flex gap-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditForm(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                    title="Editar"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id!)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Excluir"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div>
                  <p className="text-slate-400 text-xs leading-relaxed italic mb-4 line-clamp-3">
                    "{item.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                    {item.avatar.length <= 3 ? item.avatar : item.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {item.role} @ <span className="text-violet-400">{item.company}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;
