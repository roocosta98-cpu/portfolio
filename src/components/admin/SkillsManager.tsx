import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Save, X, Cpu, Palette, Brain, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

interface SkillCategory {
  id?: string;
  label: string;
  icon: string;
  color: string;
  skills: string[];
}

const DEFAULT_ICONS = ['Brain', 'Palette', 'Code2', 'Wrench', 'Cpu', 'Database', 'Globe', 'Terminal'];
const DEFAULT_COLORS = [
  { name: 'Emerald', class: 'from-emerald-500 to-teal-600' },
  { name: 'Pink', class: 'from-pink-500 to-rose-600' },
  { name: 'Cyan', class: 'from-cyan-500 to-blue-600' },
  { name: 'Violet', class: 'from-violet-500 to-purple-600' },
  { name: 'Amber', class: 'from-amber-500 to-orange-600' },
  { name: 'Indigo', class: 'from-indigo-500 to-violet-600' }
];

const SkillsManager: React.FC = () => {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<SkillCategory | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState('Brain');
  const [color, setColor] = useState('from-cyan-500 to-blue-600');
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [newSkillName, setNewSkillName] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('skill_categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        // Handle gracefully if table doesn't exist yet
        if (error.code === 'PGRST116' || error.message.includes('relation "public.skill_categories" does not exist')) {
          console.warn('skill_categories table not found. Using fallback mockup.');
          setCategories([]);
        } else {
          throw error;
        }
      } else {
        setCategories(data || []);
      }
    } catch (err) {
      console.error('Error fetching skill categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateForm = () => {
    setEditingItem(null);
    setLabel('');
    setIcon('Brain');
    setColor('from-cyan-500 to-blue-600');
    setSkillsList([]);
    setNewSkillName('');
    setIsFormOpen(true);
  };

  const openEditForm = (item: SkillCategory) => {
    setEditingItem(item);
    setLabel(item.label);
    setIcon(item.icon);
    setColor(item.color);
    setSkillsList([...item.skills]);
    setNewSkillName('');
    setIsFormOpen(true);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    if (skillsList.includes(newSkillName.trim())) {
      alert('Esta habilidade já existe nesta categoria.');
      return;
    }
    setSkillsList([...skillsList, newSkillName.trim()]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (indexToRemove: number) => {
    setSkillsList(skillsList.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      alert('O nome da categoria é obrigatório.');
      return;
    }

    setLoading(true);
    const categoryData: SkillCategory = {
      label: label.trim(),
      icon,
      color,
      skills: skillsList,
    };

    try {
      if (editingItem?.id) {
        const { error } = await supabase
          .from('skill_categories')
          .update(categoryData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('skill_categories')
          .insert([categoryData]);
        if (error) throw error;
      }

      setIsFormOpen(false);
      fetchCategories();
    } catch (err: any) {
      console.error('Error saving skill category:', err);
      alert(`Erro ao salvar categoria: ${err.message || 'Verifique se a tabela skill_categories já foi criada no Supabase.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza de que deseja excluir esta categoria e todas as suas habilidades?')) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('skill_categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchCategories();
    } catch (err: any) {
      console.error('Error deleting skill category:', err);
      alert(`Erro ao excluir: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Brain': return <Brain size={18} />;
      case 'Palette': return <Palette size={18} />;
      case 'Wrench': return <Wrench size={18} />;
      case 'Cpu': return <Cpu size={18} />;
      default: return <Cpu size={18} />;
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
            <Wrench size={24} className="text-violet-400" />
            <span>Gerenciador de Arsenal (Habilidades)</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Cadastre as categorias de habilidades, selecione ícones e gradientes, e adicione as tecnologias correspondentes.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={openCreateForm}
            className="btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <Plus size={16} />
            <span>Nova Categoria</span>
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
              {editingItem ? 'Editar Categoria de Habilidades' : 'Nova Categoria de Habilidades'}
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
              
              {/* Category Name */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Título da Categoria</label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Ex: Artificial Intelligence"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>

              {/* Icon Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Ícone Lucide</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="glass-input px-4 py-3 rounded-xl text-sm text-slate-300 bg-slate-900 border border-white/10"
                >
                  {DEFAULT_ICONS.map(ic => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </div>

              {/* Gradient Color Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Cor / Gradiente Visual</label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="glass-input px-4 py-3 rounded-xl text-sm text-slate-300 bg-slate-900 border border-white/10"
                >
                  {DEFAULT_COLORS.map(c => (
                    <option key={c.class} value={c.class}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Manage Skills List inside this Category */}
            <div className="flex flex-col gap-3 border border-white/5 bg-white/3 rounded-xl p-5 mt-2">
              <span className="text-slate-300 text-xs font-bold uppercase tracking-wider">Habilidades desta Categoria</span>
              
              {/* Add skill input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Adicionar habilidade. Ex: PyTorch"
                  className="glass-input flex-1 px-4 py-2.5 rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2.5 bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/30 text-violet-300 rounded-xl text-sm font-bold cursor-pointer"
                >
                  Adicionar
                </button>
              </div>

              {/* Skill Items List */}
              <div className="flex flex-wrap gap-2 mt-2">
                {skillsList.length === 0 ? (
                  <span className="text-slate-500 text-xs italic">Nenhuma habilidade adicionada ainda. Digite acima para incluir.</span>
                ) : (
                  skillsList.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 text-white rounded-lg text-xs font-medium"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-5 mt-2">
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
                <span>Salvar Categoria</span>
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        /* Grid of categories */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-panel rounded-2xl h-44 animate-pulse" />
            ))
          ) : categories.length === 0 ? (
            <div className="col-span-full glass-panel rounded-2xl p-12 text-center text-slate-500 border border-dashed border-white/10">
              <p className="text-sm mb-2">Nenhuma categoria de habilidade dinâmica cadastrada.</p>
              <p className="text-xs text-slate-600">Por favor, execute as migrações no banco de dados e clique em "Nova Categoria" para criar.</p>
            </div>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-white/15 transition-all duration-300 flex flex-col justify-between group min-h-[180px]"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg`}>
                        {getIconComponent(cat.icon)}
                      </div>
                      <h3 className="text-white text-base font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {cat.label}
                      </h3>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditForm(cat)}
                        className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                        title="Editar"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id!)}
                        className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-md text-[11px] text-slate-300 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 mt-4 text-[10px] text-slate-500 flex justify-between">
                  <span>Habilidades: {cat.skills.length}</span>
                  <span>ID: {cat.id?.slice(0, 8)}...</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsManager;
