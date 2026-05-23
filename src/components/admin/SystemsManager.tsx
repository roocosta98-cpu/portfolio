import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Save, X, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

interface System {
  id?: string;
  title: string;
  description: string;
  long_description: string;
  link: string;
  github: string;
  tags: string[];
  gradient: string;
  icon: string;
  stats: { label: string; value: string }[];
  cover_url?: string | null;
  order_index?: number;
}

const gradientOptions = [
  { label: 'Violet Glow', value: 'from-violet-600 via-purple-600 to-fuchsia-700' },
  { label: 'Cyan Flow', value: 'from-cyan-600 via-sky-600 to-blue-700' },
  { label: 'Warm Orange', value: 'from-orange-500 via-amber-600 to-yellow-600' },
  { label: 'Crimson Rose', value: 'from-red-600 via-orange-600 to-amber-600' },
  { label: 'Ocean Blue', value: 'from-blue-700 via-indigo-700 to-violet-700' },
  { label: 'Lime Burst', value: 'from-amber-500 via-yellow-500 to-lime-500' },
];

const SystemsManager: React.FC = () => {
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<System | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [link, setLink] = useState('');
  const [github, setGithub] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [gradient, setGradient] = useState('from-violet-600 via-purple-600 to-fuchsia-700');
  const [icon, setIcon] = useState('📋');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [orderIndex, setOrderIndex] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 800; // compress dimension max
        let width = img.width;
        let height = img.height;

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
          const base64 = canvas.toDataURL('image/jpeg', 0.7);
          setCoverUrl(base64);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Stats form states
  const [stackVal, setStackVal] = useState('');
  const [typeVal, setTypeVal] = useState('');
  const [statusVal, setStatusVal] = useState('Live ✓');

  const fetchSystems = async () => {
    setLoading(true);
    try {
      let response = await supabase
        .from('built_systems')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      if (response.error) {
        console.warn('Retrying admin systems query without order_index...', response.error);
        response = await supabase
          .from('built_systems')
          .select('*')
          .order('created_at', { ascending: false });
      }

      if (response.error) throw response.error;
      setSystems(response.data || []);
    } catch (err) {
      console.error('Error fetching systems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystems();
  }, []);

  const openCreateForm = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setLongDescription('');
    setLink('');
    setGithub('');
    setTags([]);
    setGradient('from-violet-600 via-purple-600 to-fuchsia-700');
    setIcon('📋');
    setStackVal('');
    setTypeVal('');
    setStatusVal('Live ✓');
    setCoverUrl(null);
    setOrderIndex(0);
    setIsFormOpen(true);
  };

  const openEditForm = (item: System) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setLongDescription(item.long_description);
    setLink(item.link);
    setGithub(item.github || '');
    setTags(item.tags || []);
    setGradient(item.gradient);
    setIcon(item.icon);
    setCoverUrl(item.cover_url || null);
    setOrderIndex(item.order_index ?? 0);

    // Parse stats
    const stack = item.stats?.find((s) => s.label === 'Stack')?.value || '';
    const type = item.stats?.find((s) => s.label === 'Tipo')?.value || '';
    const status = item.stats?.find((s) => s.label === 'Status')?.value || 'Live ✓';
    setStackVal(stack);
    setTypeVal(type);
    setStatusVal(status);

    setIsFormOpen(true);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const statsArray = [
      { label: 'Stack', value: stackVal || 'React' },
      { label: 'Tipo', value: typeVal || 'Tool' },
      { label: 'Status', value: statusVal || 'Live ✓' },
    ];

    const itemData = {
      title,
      description,
      long_description: longDescription,
      link,
      github,
      tags,
      gradient,
      icon,
      stats: statsArray,
      cover_url: coverUrl,
      order_index: orderIndex
    };

    try {
      if (editingItem?.id) {
        const { error } = await supabase
          .from('built_systems')
          .update(itemData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('built_systems')
          .insert([itemData]);
        if (error) throw error;
      }

      setIsFormOpen(false);
      fetchSystems();
    } catch (err) {
      console.error('Error saving system:', err);
      alert('Erro ao salvar sistema.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza de que deseja excluir este sistema?')) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('built_systems')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchSystems();
    } catch (err) {
      console.error('Error deleting system:', err);
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
            <Cpu size={24} className="text-violet-400" />
            <span>Gerenciador de Sistemas Disponibilizados</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">Gerencie as ferramentas reais e ativas que você disponibiliza no site.</p>
        </div>

        {!isFormOpen && (
          <button
            onClick={openCreateForm}
            className="btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <Plus size={16} />
            <span>Novo Sistema</span>
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
              {editingItem ? 'Editar Sistema' : 'Novo Sistema'}
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Título do Sistema</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Kanban Task Manager"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Emoji / Ícone</label>
                <input
                  type="text"
                  required
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="Ex: 📋"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Tema de Cor Glow</label>
                <select
                  value={gradient}
                  onChange={(e) => setGradient(e.target.value)}
                  className="glass-input px-4 py-3 rounded-xl text-sm cursor-pointer"
                >
                  {gradientOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#020409]">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Ordem de Exibição</label>
                <input
                  type="number"
                  required
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
                  placeholder="Ex: 0"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-b border-white/5 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Métrica: Stack</label>
                <input
                  type="text"
                  required
                  value={stackVal}
                  onChange={(e) => setStackVal(e.target.value)}
                  placeholder="Ex: React + Node"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Métrica: Tipo</label>
                <input
                  type="text"
                  required
                  value={typeVal}
                  onChange={(e) => setTypeVal(e.target.value)}
                  placeholder="Ex: Productivity / AI Tool"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Métrica: Status</label>
                <input
                  type="text"
                  required
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                  placeholder="Ex: Live ✓"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Imagem de Capa do Projeto (Opcional - PNG/JPG)</label>
              <div className="flex items-center gap-4 bg-white/3 border border-white/5 p-4 rounded-xl">
                {coverUrl ? (
                  <img src={coverUrl} alt="Capa" className="w-24 h-14 object-cover bg-white/5 rounded-lg border border-white/10" />
                ) : (
                  <div className="w-24 h-14 rounded-lg bg-white/5 border border-dashed border-white/15 flex items-center justify-center text-slate-500 text-[10px]">Sem Capa</div>
                )}
                <div className="flex-1 min-w-0">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="cover-upload-input"
                  />
                  <label
                    htmlFor="cover-upload-input"
                    className="px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-xs font-bold cursor-pointer transition-all inline-block"
                  >
                    Escolher Capa
                  </label>
                  {coverUrl && (
                    <button
                      type="button"
                      onClick={() => setCoverUrl(null)}
                      className="text-[10px] text-red-400 hover:text-red-300 ml-3 font-semibold"
                    >
                      Remover
                    </button>
                  )}
                  <p className="text-[9px] text-slate-500 mt-1">Carregue um arquivo leve. Ele será exibido como fundo do card no site.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Descrição Curta</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve resumo..."
                className="glass-input px-4 py-3 rounded-xl text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Descrição Detalhada</label>
              <textarea
                required
                rows={4}
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder="Explicação detalhada sobre o funcionamento e finalidade..."
                className="glass-input px-4 py-3 rounded-xl text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Link do Sistema (URL)</label>
                <input
                  type="text"
                  required
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://tagashira.tech/meusistema"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Link GitHub (Opcional)</label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/roocosta/..."
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Tags / Tecnologias</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="React, Tailwind, Node.js..."
                  className="glass-input flex-1 px-4 py-3 rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/10 border border-violet-500/25 text-violet-300 flex items-center gap-1.5"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((t) => t !== tag))}
                      className="text-violet-400 hover:text-red-400"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
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
                <span>Salvar Sistema</span>
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        /* List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="glass-panel rounded-2xl h-40 animate-pulse" />
            ))
          ) : systems.length === 0 ? (
            <div className="col-span-full glass-panel rounded-2xl p-12 text-center text-slate-500">
              <p className="text-sm">Nenhum sistema cadastrado.</p>
            </div>
          ) : (
            systems.map((item) => (
              <div
                key={item.id}
                className="glass-panel rounded-2xl p-6 flex flex-col justify-between hover:border-white/15 transition-all duration-300 relative group h-44"
              >
                {/* Actions overlay visible on hover */}
                <div className="absolute top-4 right-4 flex gap-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity z-10">
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
                  <div className="flex items-center gap-2 mb-2 animate-none">
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="text-white font-bold text-lg">{item.title}</h3>
                    {item.order_index !== undefined && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 font-bold ml-auto">
                        Ordem: {item.order_index}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{item.description}</p>
                </div>

                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-white/5">
                  {item.tags?.slice(0, 4).map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SystemsManager;
