import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Save, X, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Hobby {
  id?: string;
  category: string;
  title: string;
  icon: string;
  gradient: string;
  description: string;
  items: string[];
  extra_info?: string | null;
}

const gradientOptions = [
  { label: 'Violet (MEI)', value: 'from-violet-500 to-purple-700' },
  { label: 'Pink (Música)', value: 'from-pink-500 to-rose-600' },
  { label: 'Orange (Cooking)', value: 'from-orange-500 to-amber-600' },
  { label: 'Cyan (Gaming)', value: 'from-cyan-500 to-sky-600' },
  { label: 'Emerald Glow', value: 'from-emerald-500 to-teal-600' },
  { label: 'Ocean Blue', value: 'from-blue-600 to-indigo-700' },
  { label: 'Sunset Red', value: 'from-red-500 to-orange-600' }
];

const categorySuggestions = [
  { value: 'microenterprise', label: 'Microempresa (MEI)' },
  { value: 'music', label: 'Música' },
  { value: 'cooking', label: 'Culinária' },
  { value: 'gaming', label: 'Gaming / Hobbies' },
  { value: 'personalizada', label: 'Outra Categoria' }
];

const iconSuggestions = [
  { value: 'Briefcase', label: 'Maleta (Briefcase)' },
  { value: 'Music', label: 'Música (Music)' },
  { value: 'UtensilsCrossed', label: 'Culinária (UtensilsCrossed)' },
  { value: 'Gamepad2', label: 'Gamer (Gamepad2)' },
  { value: 'Heart', label: 'Coração (Heart)' },
  { value: 'Sparkles', label: 'Brilho (Sparkles)' },
  { value: 'Camera', label: 'Câmera (Camera)' },
  { value: 'BookOpen', label: 'Livro (BookOpen)' },
  { value: 'Coffee', label: 'Café (Coffee)' },
  { value: 'Compass', label: 'Bússola (Compass)' }
];

const HobbiesManager: React.FC = () => {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Hobby | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Form states
  const [category, setCategory] = useState('microenterprise');
  const [customCategory, setCustomCategory] = useState('');
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('Briefcase');
  const [customIcon, setCustomIcon] = useState('');
  const [gradient, setGradient] = useState('from-violet-500 to-purple-700');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<string[]>([]);
  const [extraInfo, setExtraInfo] = useState('');

  const fetchHobbies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('life_hobbies')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setHobbies(data || []);
    } catch (err) {
      console.error('Error fetching hobbies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHobbies();
  }, []);

  const openCreateForm = () => {
    setEditingItem(null);
    setCategory('microenterprise');
    setCustomCategory('');
    setTitle('');
    setIcon('Briefcase');
    setCustomIcon('');
    setGradient('from-violet-500 to-purple-700');
    setDescription('');
    setItems([]);
    setExtraInfo('');
    setIsFormOpen(true);
  };

  const openEditForm = (item: Hobby) => {
    setEditingItem(item);
    
    // Check if category is standard or custom
    const isStandardCat = categorySuggestions.some(c => c.value === item.category);
    if (isStandardCat) {
      setCategory(item.category);
      setCustomCategory('');
    } else {
      setCategory('personalizada');
      setCustomCategory(item.category);
    }

    // Check if icon is standard or custom
    const isStandardIcon = iconSuggestions.some(i => i.value === item.icon);
    if (isStandardIcon) {
      setIcon(item.icon);
      setCustomIcon('');
    } else {
      setIcon('personalizada');
      setCustomIcon(item.icon);
    }

    setTitle(item.title);
    setGradient(item.gradient);
    setDescription(item.description);
    setItems(item.items || []);
    setExtraInfo(item.extra_info || '');
    setIsFormOpen(true);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !items.includes(newTag.trim())) {
      setItems([...items, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalCategory = category === 'personalizada' ? customCategory.trim() : category;
    const finalIcon = icon === 'personalizada' ? customIcon.trim() : icon;

    if (!finalCategory) {
      alert('Por favor, especifique uma categoria.');
      setLoading(false);
      return;
    }

    if (!finalIcon) {
      alert('Por favor, especifique um ícone ou emoji.');
      setLoading(false);
      return;
    }

    const itemData = {
      category: finalCategory,
      title,
      icon: finalIcon,
      gradient,
      description,
      items,
      extra_info: extraInfo.trim() || null
    };

    try {
      if (editingItem?.id) {
        const { error } = await supabase
          .from('life_hobbies')
          .update(itemData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('life_hobbies')
          .insert([itemData]);
        if (error) throw error;
      }

      setIsFormOpen(false);
      fetchHobbies();
    } catch (err) {
      console.error('Error saving hobby:', err);
      alert('Erro ao salvar hobby.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza de que deseja excluir este item de Life & Hobbies?')) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('life_hobbies')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchHobbies();
    } catch (err) {
      console.error('Error deleting hobby:', err);
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
            <Heart size={24} className="text-pink-500 animate-pulse" />
            <span>Gerenciador de Life & Hobbies</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">Gerencie seus cartões bento com gostos pessoais, música, culinária e empreendedorismo.</p>
        </div>

        {!isFormOpen && (
          <button
            onClick={openCreateForm}
            className="btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <Plus size={16} />
            <span>Novo Hobby</span>
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
              {editingItem ? 'Editar Item' : 'Novo Item de Life & Hobbies'}
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
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="glass-input px-4 py-3 rounded-xl text-sm cursor-pointer"
                >
                  {categorySuggestions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#020409]">
                      {opt.label}
                    </option>
                  ))}
                </select>
                {category === 'personalizada' && (
                  <input
                    type="text"
                    required
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Ex: travel, reading, etc..."
                    className="glass-input px-4 py-3 rounded-xl text-sm mt-1"
                  />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Título do Card</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Minha Trilha Sonora 🎵"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Ícone Lucide ou Emoji</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="glass-input px-4 py-3 rounded-xl text-sm cursor-pointer animate-none"
                >
                  {iconSuggestions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#020409]">
                      {opt.label}
                    </option>
                  ))}
                  <option value="personalizada" className="bg-[#020409]">Customizado (Emoji ou Ícone)</option>
                </select>
                {(icon === 'personalizada' || !iconSuggestions.some(i => i.value === icon)) && (
                  <input
                    type="text"
                    required
                    value={customIcon}
                    onChange={(e) => setCustomIcon(e.target.value)}
                    placeholder="Digite um emoji (ex: 🎨) ou ícone Lucide"
                    className="glass-input px-4 py-3 rounded-xl text-sm mt-1 animate-none"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-b border-white/5 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Glow / Tema de Cor</label>
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
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Info Adicional (Badge ou Aviso)</label>
                <input
                  type="text"
                  value={extraInfo}
                  onChange={(e) => setExtraInfo(e.target.value)}
                  placeholder="Badge Curto: 'MEI' ou Aviso Longo: '🚫 Passo longe de sushi'"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Descrição Curta</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descrição que resume o cartão Bento..."
                className="glass-input px-4 py-3 rounded-xl text-sm resize-none"
              />
            </div>

            <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Itens da Categoria / Sub-tags (Se houver)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Ex: 🎸 Rock, 📚 Fantasia, Soluções Digitais..."
                  className="glass-input flex-1 px-4 py-3 rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Adicionar
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-pink-500/10 border border-pink-500/25 text-pink-300 flex items-center gap-1.5"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => setItems(items.filter((t) => t !== item))}
                      className="text-pink-400 hover:text-red-400 cursor-pointer"
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
                className="px-5 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-white/5 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
              >
                <Save size={16} />
                <span>Salvar Hobby</span>
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
          ) : hobbies.length === 0 ? (
            <div className="col-span-full glass-panel rounded-2xl p-12 text-center text-slate-500">
              <p className="text-sm">Nenhum item de Life & Hobbies cadastrado.</p>
            </div>
          ) : (
            hobbies.map((item) => (
              <div
                key={item.id}
                className="glass-panel rounded-2xl p-6 flex flex-col justify-between hover:border-white/15 transition-all duration-300 relative group h-44"
              >
                {/* Actions overlay visible on hover */}
                <div className="absolute top-4 right-4 flex gap-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => openEditForm(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                    title="Editar"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id!)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                    title="Excluir"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${item.gradient} text-white`}>
                      {iconSuggestions.some(i => i.value === item.icon) ? (
                        React.createElement(iconSuggestions.find(i => i.value === item.icon)?.value === 'Briefcase' ? Heart : Sparkles, { size: 14 })
                      ) : (
                        <span className="text-sm">{item.icon}</span>
                      )}
                    </div>
                    <h3 className="text-white font-bold text-base">{item.title}</h3>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{item.description}</p>
                </div>

                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-white/5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-300 uppercase font-mono">
                    {item.category}
                  </span>
                  {item.items?.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                      {tag}
                    </span>
                  ))}
                  {item.items && item.items.length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-500">
                      +{item.items.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default HobbiesManager;
