'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaImage, FaThLarge, FaBlog, FaPalette, FaPhone, 
  FaSave, FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaCheck, 
  FaExternalLinkAlt, FaCloudUploadAlt 
} from 'react-icons/fa';
import { SiteContent, FeatureCard, BlogPostItem } from '@/lib/content';

export default function AdminPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'cards' | 'images' | 'theme' | 'general' | 'blog'>('cards');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [newCard, setNewCard] = useState({ title: '', description: '', icon: 'spine' });
  const [newBlog, setNewBlog] = useState({
    title: '',
    slug: '',
    excerpt: '',
    readTime: '4 dk',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80'
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      setContent(data);
    } catch (err) {
      showMessage('error', 'İçerik yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSave = async (updatedData?: Partial<SiteContent>) => {
    try {
      setSaving(true);
      const toSend = updatedData || content;
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSend),
      });
      const result = await res.json();
      if (result.success) {
        setContent(result.data);
        showMessage('success', 'Değişiklikler kaydedildi!');
      } else {
        showMessage('error', 'Kayıt başarısız.');
      }
    } catch (err) {
      showMessage('error', 'Bağlantı hatası.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: 'heroImage' | 'profileImage' | 'clinicImage') => {
    if (!e.target.files || !e.target.files[0] || !content) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      showMessage('success', 'Görsel yükleniyor...');
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        const updatedImages = { ...content.images, [key]: data.url };
        setContent({ ...content, images: updatedImages });
        handleSave({ images: updatedImages });
        showMessage('success', 'Görsel güncellendi!');
      }
    } catch (err) {
      showMessage('error', 'Yükleme hatası.');
    }
  };

  // KUYRUK (FIFO): Yeni kart EN BAŞA geçer
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.title || !newCard.description || !content) return;

    const createdCard: FeatureCard = {
      id: 'card-' + Date.now(),
      title: newCard.title,
      description: newCard.description,
      icon: newCard.icon,
      createdAt: new Date().toISOString()
    };

    const updatedCards = [createdCard, ...content.featureCards];
    setContent({ ...content, featureCards: updatedCards });
    handleSave({ featureCards: updatedCards });
    setNewCard({ title: '', description: '', icon: 'spine' });
    showMessage('success', 'Yeni kart vitrinin 1. sırasına eklendi!');
  };

  const handleDeleteCard = (id: string) => {
    if (!content) return;
    const updated = content.featureCards.filter(c => c.id !== id);
    setContent({ ...content, featureCards: updated });
    handleSave({ featureCards: updated });
    showMessage('success', 'Kart silindi.');
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    if (!content) return;
    const cards = [...content.featureCards];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= cards.length) return;

    const temp = cards[index];
    cards[index] = cards[targetIndex];
    cards[targetIndex] = temp;

    setContent({ ...content, featureCards: cards });
    handleSave({ featureCards: cards });
  };

  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.excerpt || !content) return;

    const slug = newBlog.slug || newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const createdBlog: BlogPostItem = {
      id: 'blog-' + Date.now(),
      title: newBlog.title,
      slug,
      excerpt: newBlog.excerpt,
      date: new Date().toISOString().split('T')[0],
      readTime: newBlog.readTime || '4 dk',
      coverImage: newBlog.coverImage,
      published: true
    };

    const updatedPosts = [createdBlog, ...content.blogPosts];
    setContent({ ...content, blogPosts: updatedPosts });
    handleSave({ blogPosts: updatedPosts });
    setNewBlog({ title: '', slug: '', excerpt: '', readTime: '4 dk', coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80' });
    showMessage('success', 'Blog yazısı yayınlandı!');
  };

  if (loading || !content) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#155E54] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Yönetim Paneli Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20">
      
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-lg bg-[#155E54] text-white flex items-center justify-center font-bold text-sm">
              ŞK
            </span>
            <div>
              <h1 className="font-extrabold text-base text-slate-900 leading-tight">
                {content.general.doctorName} — Yönetim Paneli
              </h1>
              <span className="text-[11px] text-slate-500 font-medium">Klinik İçerik & Tasarım Özelleştirme</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link 
              href="/" 
              target="_blank" 
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <span>Siteyi Gör</span>
              <FaExternalLinkAlt size={10} />
            </Link>

            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#155E54] hover:bg-[#0E433C] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              <FaSave size={12} />
              <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
            </button>
          </div>
        </div>
      </header>

      {message && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}>
            <FaCheck />
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'cards' ? 'bg-[#155E54] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FaThLarge />
            <span>Klinik Kartları (Kuyruk & Vitrin)</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
              {content.featureCards.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'images' ? 'bg-[#155E54] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FaImage />
            <span>Fotoğraflar & Görseller</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'theme' ? 'bg-[#155E54] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FaPalette />
            <span>Tema & Renk Paleti</span>
          </button>

          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'blog' ? 'bg-[#155E54] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FaBlog />
            <span>Blog Makaleleri</span>
          </button>

          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'general' ? 'bg-[#155E54] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FaPhone />
            <span>İletişim & Lokasyon</span>
          </button>
        </div>

        {/* 1. KARTLAR */}
        {activeTab === 'cards' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-[#155E54] font-bold text-sm">
                <FaPlus />
                <span>Yeni Uzmanlık Kartı Ekle</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Eklenen her yeni kart <strong>en başa (1. sıraya)</strong> geçer. İlk 3 kart vitrinde kalır, gerisi <em>Genişlet (+X)</em> butonuyla açılır.
              </p>

              <form onSubmit={handleAddCard} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kart Başlığı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Klinik Pilates, Skolyoz Egzersizi"
                    value={newCard.title}
                    onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kısa Açıklama</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Omurga stabilizasyonu ve postür desteği"
                    value={newCard.description}
                    onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#155E54] hover:bg-[#0E433C] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
                >
                  + Vitrinin Başına Ekle
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Kayıtlı Kartlar ve Sıralama</h3>
              <div className="space-y-3">
                {content.featureCards.map((card, index) => {
                  const isFeatured = index < 3;
                  return (
                    <div 
                      key={card.id}
                      className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                        isFeatured 
                          ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs' 
                          : 'bg-slate-50 border-slate-200 opacity-90'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isFeatured ? 'bg-[#155E54] text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{card.title}</h4>
                            {isFeatured ? (
                              <span className="text-[10px] uppercase font-extrabold bg-[#155E54]/10 text-[#155E54] px-2 py-0.5 rounded-full">
                                Vitrinde
                              </span>
                            ) : (
                              <span className="text-[10px] uppercase font-extrabold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                                Genişletilince Görünür
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{card.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleMoveCard(index, 'up')}
                          disabled={index === 0}
                          className="p-2 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                        >
                          <FaArrowUp size={12} />
                        </button>
                        <button
                          onClick={() => handleMoveCard(index, 'down')}
                          disabled={index === content.featureCards.length - 1}
                          className="p-2 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                        >
                          <FaArrowDown size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="p-2 text-rose-500 hover:text-rose-700 ml-2"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. GÖRSELLER */}
        {activeTab === 'images' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#155E54] bg-[#EBF5F3] px-2 py-1 rounded-md">
                  Hero Görseli
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">Karşılama Seans Fotoğrafı</h3>
                <div className="relative h-56 w-full rounded-xl overflow-hidden bg-slate-100 mt-3">
                  <Image src={content.images.heroImage} alt="Hero" fill className="object-cover" />
                </div>
              </div>
              <label className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors border border-slate-200">
                <FaCloudUploadAlt size={16} />
                <span>Fotoğraf Değiştir</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'heroImage')} />
              </label>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#155E54] bg-[#EBF5F3] px-2 py-1 rounded-md">
                  Hekim Portresi
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">Özgeçmiş Profil Fotoğrafı</h3>
                <div className="relative h-56 w-full rounded-xl overflow-hidden bg-slate-100 mt-3">
                  <Image src={content.images.profileImage} alt="Profil" fill className="object-cover object-top" />
                </div>
              </div>
              <label className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors border border-slate-200">
                <FaCloudUploadAlt size={16} />
                <span>Portre Değiştir</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'profileImage')} />
              </label>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#155E54] bg-[#EBF5F3] px-2 py-1 rounded-md">
                  Klinik Mekanı
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">Nişantaşı Kliniği Görseli</h3>
                <div className="relative h-56 w-full rounded-xl overflow-hidden bg-slate-100 mt-3">
                  <Image src={content.images.clinicImage} alt="Klinik" fill className="object-cover" />
                </div>
              </div>
              <label className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors border border-slate-200">
                <FaCloudUploadAlt size={16} />
                <span>Klinik Görseli Değiştir</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'clinicImage')} />
              </label>
            </div>
          </div>
        )}

        {/* 3. TEMA */}
        {activeTab === 'theme' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs max-w-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Sitenin Ana Renk Teması</h3>
              <p className="text-xs text-slate-500 mt-1">Tek tıkla tüm sitenin havasını değiştirin.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'emerald', name: 'Zümrüt Yeşili', color: '#155E54', desc: 'Osteopati ve dinginlik' },
                { id: 'ocean', name: 'Okyanus Mavisi', color: '#0284C7', desc: 'Ferah ve kurumsal' },
                { id: 'terracotta', name: 'Terracotta', color: '#B45309', desc: 'Sıcak toprak tonları' },
                { id: 'slate', name: 'Modern Antrasit', color: '#334155', desc: 'Lüks ve minimalist' }
              ].map(t => (
                <div
                  key={t.id}
                  onClick={() => {
                    setContent({ ...content, theme: t.id as any });
                    handleSave({ theme: t.id as any });
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    content.theme === t.id ? 'border-[#155E54] bg-[#155E54]/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-lg" style={{ backgroundColor: t.color }} />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{t.name}</h4>
                      <span className="text-xs text-slate-500">{t.desc}</span>
                    </div>
                  </div>
                  {content.theme === t.id && <FaCheck className="text-[#155E54]" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. BLOG */}
        {activeTab === 'blog' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-[#155E54] font-bold text-sm">
                <FaPlus />
                <span>Yeni Blog Makalesi Ekle</span>
              </div>
              <form onSubmit={handleAddBlog} className="space-y-3.5 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Başlık</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Çene Eklemi ve Diş Sıkma Tedavisi"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Özet</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Kısa özet..."
                    value={newBlog.excerpt}
                    onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Görsel URL</label>
                  <input
                    type="text"
                    value={newBlog.coverImage}
                    onChange={(e) => setNewBlog({ ...newBlog, coverImage: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-[#155E54] hover:bg-[#0E433C] text-white text-xs font-bold rounded-xl transition-all shadow-sm">
                  + Yayına Al
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900">Yayındaki Yazılar</h3>
              {content.blogPosts.map(post => (
                <div key={post.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                      <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{post.title}</h4>
                      <span className="text-[11px] text-slate-500">{post.date} • {post.readTime}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const updated = content.blogPosts.filter(p => p.id !== post.id);
                      setContent({ ...content, blogPosts: updated });
                      handleSave({ blogPosts: updated });
                      showMessage('success', 'Yazı silindi.');
                    }}
                    className="p-2 text-rose-500 hover:text-rose-700"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'general' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs max-w-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Klinik Bilgileri</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hekim Adı</label>
                <input
                  type="text"
                  value={content.general.doctorName}
                  onChange={(e) => setContent({ ...content, general: { ...content.general, doctorName: e.target.value } })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefon</label>
                  <input
                    type="text"
                    value={content.general.phone}
                    onChange={(e) => setContent({ ...content, general: { ...content.general, phone: e.target.value } })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={content.general.whatsapp}
                    onChange={(e) => setContent({ ...content, general: { ...content.general, whatsapp: e.target.value } })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adres</label>
                <input
                  type="text"
                  value={content.general.address}
                  onChange={(e) => setContent({ ...content, general: { ...content.general, address: e.target.value } })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>
            </div>
            <button
              onClick={() => handleSave()}
              className="px-6 py-2.5 bg-[#155E54] hover:bg-[#0E433C] text-white text-xs font-bold rounded-xl shadow-sm"
            >
              Kaydet
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
