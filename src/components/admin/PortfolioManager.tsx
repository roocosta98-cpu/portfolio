import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Save, X, FolderKanban } from 'lucide-react';
import { motion } from 'framer-motion';

interface PortfolioItem {
  id?: string;
  title: string;
  category: string;
  description: string;
  long_description: string;
  link: string;
  github: string;
  tags: string[];
  gradient: string;
  icon: string;
  year: string;
  role: string;
  highlights: string[];
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

const PortfolioManager: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newHighlight, setNewHighlight] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [link, setLink] = useState('');
  const [github, setGithub] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [gradient, setGradient] = useState('from-violet-600 via-purple-600 to-fuchsia-700');
  const [icon, setIcon] = useState('💼');
  const [year, setYear] = useState('');
  const [role, setRole] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);
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
        const maxSize = 800; // compress dimension max to keep Base64 ultra light
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
          const base64 = canvas.toDataURL('image/jpeg', 0.7); // light JPEG quality
          setCoverUrl(base64);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      let response = await supabase
        .from('portfolio_items')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      if (response.error) {
        console.warn('Retrying admin portfolio query without order_index...', response.error);
        response = await supabase
          .from('portfolio_items')
          .select('*')
          .order('created_at', { ascending: false });
      }

      if (response.error) throw response.error;
      setItems(response.data || []);
    } catch (err) {
      console.error('Error fetching portfolio items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreateForm = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('');
    setDescription('');
    setLongDescription('');
    setLink('');
    setGithub('');
    setTags([]);
    setGradient('from-violet-600 via-purple-600 to-fuchsia-700');
    setIcon('💼');
    setYear('');
    setRole('');
    setHighlights([]);
    setCoverUrl(null);
    setOrderIndex(0);
    setIsFormOpen(true);
  };

  const openEditForm = (item: PortfolioItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setDescription(item.description);
    setLongDescription(item.long_description);
    setLink(item.link || '');
    setGithub(item.github || '');
    setTags(item.tags || []);
    setGradient(item.gradient);
    setIcon(item.icon);
    setYear(item.year);
    setRole(item.role);
    setHighlights(item.highlights || []);
    setCoverUrl(item.cover_url || null);
    setOrderIndex(item.order_index ?? 0);
    setIsFormOpen(true);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleAddHighlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHighlight.trim() && !highlights.includes(newHighlight.trim())) {
      setHighlights([...highlights, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const itemData: PortfolioItem = {
      title,
      category,
      description,
      long_description: longDescription,
      link,
      github,
      tags,
      gradient,
      icon,
      year,
      role,
      highlights,
      cover_url: coverUrl,
      order_index: orderIndex
    };

    try {
      if (editingItem?.id) {
        const { error } = await supabase
          .from('portfolio_items')
          .update(itemData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolio_items')
          .insert([itemData]);
        if (error) throw error;
      }

      setIsFormOpen(false);
      fetchItems();
    } catch (err) {
      console.error('Error saving portfolio item:', err);
      alert('Erro ao salvar item.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza de que deseja excluir este item de portfólio?')) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchItems();
    } catch (err) {
      console.error('Error deleting portfolio item:', err);
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
            <FolderKanban size={24} className="text-violet-400" />
            <span>Gerenciador de Portfólio (Cases)</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">Gerencie seus principais cases de design de produto e engenharia.</p>
        </div>

        {!isFormOpen && (
          <button
            onClick={openCreateForm}
            className="btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <Plus size={16} />
            <span>Novo Case de Portfólio</span>
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
              {editingItem ? 'Editar Case' : 'Novo Case'}
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
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Título do Projeto</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Doc Generator"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Categoria</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ex: AI Tool / Product Design"
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
                  placeholder="Ex: 🎬"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Ano</label>
                <input
                  type="text"
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Ex: 2024"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Sua Função (Role)</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ex: UX Design Lead"
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

            {/* Cover Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Imagem de Capa do Case (Opcional - PNG/JPG)</label>
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
                  <p className="text-[9px] text-slate-500 mt-1">Carregue um arquivo leve. Ele será exibido como fundo do case no site.</p>
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
                placeholder="Breve resumo que aparece na listagem do grid..."
                className="glass-input px-4 py-3 rounded-xl text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Descrição Detalhada (Long Description)</label>
              <textarea
                required
                rows={5}
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder="Explicação completa do case..."
                className="glass-input px-4 py-3 rounded-xl text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Link de Acesso (URL)</label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://meucase.com"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Tags */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Tags / Tecnologias</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="React, Figma, Design System..."
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
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 flex items-center gap-1.5"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                        className="text-cyan-400 hover:text-red-400"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Destaques / Conquistas (Highlights)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    placeholder="Ex: Aumento de 60% na conversão..."
                    className="glass-input flex-1 px-4 py-3 rounded-xl text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-4 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-col gap-1 mt-1.5">
                  {highlights.map((h, i) => (
                    <div
                      key={i}
                      className="text-xs text-slate-300 flex items-center justify-between bg-white/3 border border-white/5 px-3 py-1.5 rounded-lg"
                    >
                      <span className="truncate">{h}</span>
                      <button
                        type="button"
                        onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
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
                <span>Salvar Case</span>
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        /* List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-panel rounded-2xl h-40 animate-pulse" />
            ))
          ) : items.length === 0 ? (
            <div className="col-span-full glass-panel rounded-2xl p-12 text-center text-slate-500">
              <p className="text-sm">Nenhum case de portfólio cadastrado.</p>
            </div>
          ) : (
            items.map((item) => (
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
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-slate-400">
                      {item.category}
                    </span>
                    {item.order_index !== undefined && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 font-bold">
                        Ordem: {item.order_index}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 font-bold ml-auto">{item.year}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
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

export default PortfolioManager;
