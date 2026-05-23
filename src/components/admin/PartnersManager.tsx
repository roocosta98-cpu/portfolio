import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Save, X, Building2, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface Partner {
  id?: string;
  name: string;
  color: string;
  svg_markup: string;
}

const PartnersManager: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partner | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [svgMarkup, setSvgMarkup] = useState('');

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartners(data || []);
    } catch (err) {
      console.error('Error fetching partners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const openCreateForm = () => {
    setEditingItem(null);
    setName('');
    setColor('#ffffff');
    setSvgMarkup('');
    setIsFormOpen(true);
  };

  const openEditForm = (item: Partner) => {
    setEditingItem(item);
    setName(item.name);
    setColor(item.color);
    setSvgMarkup(item.svg_markup);
    setIsFormOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 250; // max width/height for client logos
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
          const base64 = canvas.toDataURL('image/png', 0.85);
          setSvgMarkup(base64);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const itemData: Partner = {
      name,
      color,
      svg_markup: svgMarkup,
    };

    try {
      if (editingItem?.id) {
        const { error } = await supabase
          .from('partners')
          .update(itemData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('partners')
          .insert([itemData]);
        if (error) throw error;
      }

      setIsFormOpen(false);
      fetchPartners();
    } catch (err) {
      console.error('Error saving partner:', err);
      alert('Erro ao salvar parceiro.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza de que deseja excluir este parceiro/cliente?')) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchPartners();
    } catch (err) {
      console.error('Error deleting partner:', err);
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
            <Building2 size={24} className="text-violet-400" />
            <span>Gerenciador de Parceiros e Clientes</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">Gerencie os logotipos das marcas corporativas exibidas no slider.</p>
        </div>

        {!isFormOpen && (
          <button
            onClick={openCreateForm}
            className="btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <Plus size={16} />
            <span>Novo Parceiro</span>
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
              {editingItem ? 'Editar Parceiro' : 'Novo Parceiro'}
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Nome da Empresa</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Itaú Unibanco"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Cor de Destaque (Hover)</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border-white/10 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    required
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="#FF7200"
                    className="glass-input flex-1 px-4 py-3 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 bg-white/3 border border-white/5 p-4 rounded-xl">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Logo do Cliente</span>
              <div className="flex flex-col sm:flex-row gap-4 items-center mb-2">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="client-logo-upload"
                />
                <label
                  htmlFor="client-logo-upload"
                  className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-bold cursor-pointer transition-all inline-flex items-center gap-2"
                >
                  <Upload size={14} />
                  <span>Upload de Logo PNG / JPG</span>
                </label>
                <span className="text-[10px] text-slate-500">Ou cole o SVG inline abaixo:</span>
              </div>

              <div className="flex flex-col gap-2">
                <textarea
                  required
                  rows={4}
                  value={svgMarkup}
                  onChange={(e) => setSvgMarkup(e.target.value)}
                  placeholder='Cole o código <svg> ou faça upload de imagem acima'
                  className="glass-input px-4 py-3 rounded-xl text-sm font-mono resize-y"
                />
              </div>
            </div>

            {/* Live Preview of SVG/PNG Logo */}
            {svgMarkup.trim() && (
              <div className="flex flex-col gap-2 border border-white/5 bg-white/3 rounded-xl p-4">
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Visualização Prévia do Logo</span>
                <div className="flex items-center justify-center py-6 text-slate-400 hover:text-white transition-colors" style={{ color: color }}>
                  {svgMarkup.trim().startsWith('<svg') ? (
                    <div dangerouslySetInnerHTML={{ __html: svgMarkup }} />
                  ) : (
                    <img src={svgMarkup} alt="Preview" className="h-8 w-auto object-contain max-h-8" />
                  )}
                </div>
              </div>
            )}

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
                <span>Salvar Parceiro</span>
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        /* Grid of partners */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-panel rounded-2xl h-32 animate-pulse" />
            ))
          ) : partners.length === 0 ? (
            <div className="col-span-full glass-panel rounded-2xl p-12 text-center text-slate-500">
              <p className="text-sm">Nenhum parceiro cadastrado.</p>
            </div>
          ) : (
            partners.map((item) => (
              <div
                key={item.id}
                className="glass-panel rounded-2xl p-5 flex flex-col justify-between items-center hover:border-white/15 transition-all duration-300 relative group h-36"
              >
                {/* Actions overlay visible on hover */}
                <div className="absolute top-2 right-2 flex gap-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditForm(item)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                    title="Editar"
                  >
                    <Edit2 size={10} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id!)}
                    className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Excluir"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>

                <div className="flex-1 flex items-center justify-center w-full max-h-16 text-slate-400 group-hover:text-white transition-colors" style={{ color: item.color }}>
                  {item.svg_markup.trim().startsWith('<svg') ? (
                    <div dangerouslySetInnerHTML={{ __html: item.svg_markup }} />
                  ) : (
                    <img src={item.svg_markup} alt={item.name} className="h-10 w-auto object-contain max-h-12 brightness-75 group-hover:brightness-100 transition-all duration-300" />
                  )}
                </div>

                <div className="text-center pt-2">
                  <p className="text-white text-xs font-bold">{item.name}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PartnersManager;
