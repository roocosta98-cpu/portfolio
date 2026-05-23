import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Search,
  Check,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

interface BlogPost {
  id?: string;
  created_at?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  tags: string[];
  published: boolean;
}

const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [published, setPublished] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .trim()
      .replace(/\s+/g, '-'); // replace spaces with dashes
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!editingPost) {
      setSlug(generateSlug(val));
    }
  };

  const openCreateForm = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCoverImage('');
    setTags([]);
    setPublished(false);
    setIsFormOpen(true);
  };

  const openEditForm = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCoverImage(post.cover_image || '');
    setTags(post.tags || []);
    setPublished(post.published);
    setIsFormOpen(true);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const postData: BlogPost = {
      title,
      slug: slug || generateSlug(title),
      excerpt,
      content,
      cover_image: coverImage,
      tags,
      published,
    };

    try {
      if (editingPost?.id) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);
        if (error) throw error;
      }

      setIsFormOpen(false);
      fetchPosts();
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Erro ao salvar post. Verifique se o slug é único.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza de que deseja excluir esta postagem?')) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-black text-white flex items-center gap-2"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <BookOpen size={24} className="text-violet-400" />
            <span>Gerenciador de Blog</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">Crie, edite e organize seus artigos técnicos e insights.</p>
        </div>

        {!isFormOpen && (
          <button
            onClick={openCreateForm}
            className="btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <Plus size={16} />
            <span>Nova Postagem</span>
          </button>
        )}
      </div>

      {isFormOpen ? (
        /* Form Drawer/Modal */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <h3 className="text-lg font-bold text-white">
              {editingPost ? 'Editar Postagem' : 'Nova Postagem'}
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
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Título</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Ex: Como otimizar animações com Framer Motion"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">URL Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  placeholder="ex-como-otimizar-animacoes"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Resumo (Excerpt)</label>
              <input
                type="text"
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Um breve resumo do artigo que aparece na listagem..."
                className="glass-input px-4 py-3 rounded-xl text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">URL da Imagem de Capa</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... ou URL do Supabase Storage"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Adicionar Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="React, UX, Framer..."
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
                {/* Tag render */}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/10 border border-violet-500/25 text-violet-300 flex items-center gap-1.5"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-violet-400 hover:text-red-400"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Conteúdo (Markdown Completo)</label>
                <span className="text-[10px] text-slate-500">Suporta formatação **Bold**, # Heading, etc.</span>
              </div>
              <textarea
                required
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="# Minha Introdução..."
                className="glass-input px-4 py-3 rounded-xl text-sm font-mono resize-y"
              />
            </div>

            {/* Toggle Published */}
            <div className="flex items-center gap-3 py-2">
              <input
                id="published"
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-violet-500 focus:ring-violet-500"
              />
              <label htmlFor="published" className="text-white text-sm font-semibold cursor-pointer select-none">
                Publicar postagem imediatamente
              </label>
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
                <span>Salvar Artigo</span>
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        /* List */
        <div className="flex flex-col gap-4">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por título ou resumo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input w-full pl-12 pr-4 py-3 rounded-xl text-sm"
            />
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-panel rounded-2xl h-24 animate-pulse" />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center text-slate-500">
              <p className="text-sm">Nenhuma postagem encontrada.</p>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/3 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      <th className="py-4 px-6">Artigo</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6">Tags</th>
                      <th className="py-4 px-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-white/1 border-white/5">
                        <td className="py-4 px-6">
                          <div className="min-w-[200px]">
                            <p className="font-bold text-white mb-1 line-clamp-1">{post.title}</p>
                            <p className="text-slate-500 text-xs line-clamp-1">{post.excerpt}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {post.published ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                              <Check size={8} /> Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 border border-slate-500/20 text-slate-400">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1 max-w-[220px]">
                            {post.tags?.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                                {tag}
                              </span>
                            ))}
                            {post.tags?.length > 3 && (
                              <span className="text-[10px] px-1.5 py-0.5 text-slate-600">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditForm(post)}
                              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                              title="Editar"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(post.id!)}
                              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                              title="Excluir"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="block sm:hidden divide-y divide-white/5">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-white mb-1 line-clamp-1">{post.title}</p>
                        <p className="text-slate-500 text-xs line-clamp-2">{post.excerpt}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {post.published ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 border border-slate-500/20 text-slate-400">
                            Draft
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
                      <div className="flex flex-wrap gap-1">
                        {post.tags?.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                            {tag}
                          </span>
                        ))}
                        {post.tags?.length > 2 && (
                          <span className="text-[10px] px-1.5 py-0.5 text-slate-600">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditForm(post)}
                          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id!)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogManager;
