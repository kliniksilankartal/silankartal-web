'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaImage, FaThLarge, FaBlog, FaPhone, 
  FaSave, FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaCheck, 
  FaExternalLinkAlt, FaCloudUploadAlt, FaSignOutAlt, FaHome,
  FaUserMd, FaStethoscope, FaQuestionCircle, FaSearch, FaHeading,
  FaGithub, FaCheckCircle, FaExclamationCircle, FaEdit, FaTimes, FaEye
} from 'react-icons/fa';
import { SiteContent, FeatureCard, BlogPostItem, ServiceItem, FAQItemData } from '@/lib/content';

type TabType = 
  | 'general' 
  | 'header_footer' 
  | 'hero' 
  | 'about' 
  | 'services' 
  | 'faq' 
  | 'seo' 
  | 'cards' 
  | 'images' 
  | 'blog';

export default function AdminPage() {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [githubStatus, setGithubStatus] = useState<{ committed?: boolean; error?: string; sha?: string } | null>(null);

  // Card & Blog State
  const [newCard, setNewCard] = useState({ title: '', description: '', icon: 'spine' });

  // Blog State (Add / Edit)
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [newBlog, setNewBlog] = useState({
    title: '',
    slug: '',
    excerpt: '',
    readTime: '',
    coverImage: '',
    content: '',
  });
  const [uploadingBlogImage, setUploadingBlogImage] = useState(false);

  // FAQ Item State
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  // Service State (Add / Edit)
  const [editingServiceSlug, setEditingServiceSlug] = useState<string | null>(null);
  const [newService, setNewService] = useState<ServiceItem>({
    slug: '',
    title: '',
    category: 'Kas-İskelet Sistemi',
    shortDescription: '',
    image: '',
    detailedDescription: '',
    benefits: ['Ağrısız hareket kapasitesi', 'Fonksiyonel düzelme'],
  });
  const [uploadingServiceImage, setUploadingServiceImage] = useState(false);
  const [benefitInput, setBenefitInput] = useState('');

  // Education & Certification inputs
  const [newEdu, setNewEdu] = useState('');
  const [newCert, setNewCert] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/content');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setContent(data);
    } catch {
      showMessage('error', 'İçerik yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
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
        if (result.github?.committedToGithub) {
          setGithubStatus({ committed: true, sha: result.github.commitSha });
          showMessage('success', 'Değişiklikler GitHub repo\'suna aktarıldı! Vercel canlı yayına alıyor (~30sn).');
        } else {
          setGithubStatus({ committed: false, error: result.github?.error });
          showMessage('success', 'Değişiklikler başarıyla kaydedildi!');
        }
      } else {
        showMessage('error', result.error || 'Kayıt başarısız.');
      }
    } catch {
      showMessage('error', 'Bağlantı hatası oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  const [dragActiveKey, setDragActiveKey] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const uploadImageFile = async (file: File, key: 'heroImage' | 'profileImage' | 'clinicImage') => {
    if (!content) return;
    if (!file.type.startsWith('image/')) {
      showMessage('error', 'Lütfen geçerli bir görsel dosyası seçin (JPG, PNG, WEBP).');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadingKey(key);
      showMessage('info', 'Görsel yükleniyor...');
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        const updatedImages = { ...content.images, [key]: data.url };
        setContent({ ...content, images: updatedImages });
        handleSave({ images: updatedImages });
        showMessage('success', 'Görsel başarıyla yüklendi ve kaydedildi!');
      } else {
        showMessage('error', data.error || 'Görsel yüklenemedi.');
      }
    } catch {
      showMessage('error', 'Yükleme sırasında hata oluştu.');
    } finally {
      setUploadingKey(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, key: 'heroImage' | 'profileImage' | 'clinicImage') => {
    if (!e.target.files || !e.target.files[0]) return;
    uploadImageFile(e.target.files[0], key);
  };

  // 1. CARDS
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

  const uploadCustomImage = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) {
      showMessage('error', 'Lütfen geçerli bir görsel dosyası seçin (PNG, JPG, WEBP).');
      return null;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      showMessage('info', 'Fotoğraf yükleniyor...');
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        showMessage('success', 'Fotoğraf cihazdan başarıyla yüklendi!');
        return data.url;
      }
      showMessage('error', data.error || 'Yükleme başarısız.');
      return null;
    } catch {
      showMessage('error', 'Görsel yükleme hatası.');
      return null;
    }
  };

  // 2. BLOG HANDLERS
  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.excerpt || !content) return;

    const slug = newBlog.slug || newBlog.title.toLowerCase().replace(/[^a-z0-9ğüşıöç]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingBlogId) {
      // Update existing post
      const updatedPosts = content.blogPosts.map((p) => {
        if (p.id === editingBlogId || p.slug === editingBlogId) {
          return {
            ...p,
            title: newBlog.title,
            slug,
            excerpt: newBlog.excerpt,
            readTime: newBlog.readTime || '4 dk',
            coverImage: newBlog.coverImage,
            content: newBlog.content,
          };
        }
        return p;
      });
      setContent({ ...content, blogPosts: updatedPosts });
      handleSave({ blogPosts: updatedPosts });
      setEditingBlogId(null);
      setNewBlog({
        title: '',
        slug: '',
        excerpt: '',
        readTime: '',
        coverImage: '',
        content: '',
      });
      showMessage('success', 'Blog yazısı başarıyla güncellendi!');
    } else {
      // Add new post
      const createdBlog: BlogPostItem = {
        id: 'blog-' + Date.now(),
        title: newBlog.title,
        slug,
        excerpt: newBlog.excerpt,
        date: new Date().toISOString().split('T')[0],
        readTime: '',
        coverImage: newBlog.coverImage,
        content: newBlog.content,
        published: true,
      };

      const updatedPosts = [createdBlog, ...content.blogPosts];
      setContent({ ...content, blogPosts: updatedPosts });
      handleSave({ blogPosts: updatedPosts });
      setNewBlog({
        title: '',
        slug: '',
        excerpt: '',
        readTime: '',
        coverImage: '',
        content: '',
      });
      showMessage('success', 'Yeni blog makalesi eklendi ve yayına alındı!');
    }
  };

  const handleEditBlog = (post: BlogPostItem) => {
    setEditingBlogId(post.id || post.slug);
    setNewBlog({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      readTime: post.readTime || '',
      coverImage: post.coverImage || '',
      content: post.content || '',
    });
    // Scroll smoothly to form
    window.scrollTo({ top: 300, behavior: 'smooth' });
    showMessage('info', `"${post.title}" düzenleniyor.`);
  };

  const handleCancelBlogEdit = () => {
    setEditingBlogId(null);
    setNewBlog({
      title: '',
      slug: '',
      excerpt: '',
      readTime: '',
      coverImage: '',
      content: '',
    });
  };

  const handleDeleteBlog = (idOrSlug: string) => {
    if (!content) return;
    if (!confirm('Bu blog makalesini silmek istediğinize emin misiniz?')) return;
    const updated = content.blogPosts.filter((p) => p.id !== idOrSlug && p.slug !== idOrSlug);
    setContent({ ...content, blogPosts: updated });
    handleSave({ blogPosts: updated });
    if (editingBlogId === idOrSlug) {
      handleCancelBlogEdit();
    }
    showMessage('success', 'Blog makalesi kaldırıldı.');
  };

  // 3. FAQ
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaq.question || !newFaq.answer || !content) return;
    const updatedFaq = [...content.faq, newFaq];
    setContent({ ...content, faq: updatedFaq });
    handleSave({ faq: updatedFaq });
    setNewFaq({ question: '', answer: '' });
    showMessage('success', 'Yeni soru eklendi!');
  };

  const handleDeleteFaq = (index: number) => {
    if (!content) return;
    const updatedFaq = content.faq.filter((_, i) => i !== index);
    setContent({ ...content, faq: updatedFaq });
    handleSave({ faq: updatedFaq });
    showMessage('success', 'Soru silindi.');
  };

  // 4. SERVICES HANDLERS
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title || !newService.shortDescription || !content) return;
    const slug = newService.slug || newService.title.toLowerCase().replace(/[^a-z0-9ğüşıöç]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingServiceSlug) {
      // Edit existing
      const updatedServices = content.services.map((s) => {
        if (s.slug === editingServiceSlug) {
          return {
            ...newService,
            slug,
          };
        }
        return s;
      });
      setContent({ ...content, services: updatedServices });
      handleSave({ services: updatedServices });
      setEditingServiceSlug(null);
      setNewService({
        slug: '',
        title: '',
        category: 'Kas-İskelet Sistemi',
        shortDescription: '',
        image: '',
        detailedDescription: '',
        benefits: ['Ağrısız hareket kapasitesi', 'Fonksiyonel düzelme'],
      });
      showMessage('success', 'Klinik hizmet başarıyla güncellendi!');
    } else {
      // Add new
      const serviceToAdd: ServiceItem = { ...newService, slug };
      const updatedServices = [...content.services, serviceToAdd];
      setContent({ ...content, services: updatedServices });
      handleSave({ services: updatedServices });
      setNewService({
        slug: '',
        title: '',
        category: 'Kas-İskelet Sistemi',
        shortDescription: '',
        image: '',
        detailedDescription: '',
        benefits: ['Ağrısız hareket kapasitesi'],
      });
      showMessage('success', 'Yeni klinik hizmet eklendi!');
    }
  };

  const handleEditService = (service: ServiceItem) => {
    setEditingServiceSlug(service.slug);
    setNewService({ ...service });
    window.scrollTo({ top: 300, behavior: 'smooth' });
    showMessage('info', `"${service.title}" düzenleniyor.`);
  };

  const handleCancelServiceEdit = () => {
    setEditingServiceSlug(null);
    setNewService({
      slug: '',
      title: '',
      category: 'Kas-İskelet Sistemi',
      shortDescription: '',
      image: '',
      detailedDescription: '',
      benefits: ['Ağrısız hareket kapasitesi'],
    });
  };

  const handleDeleteService = (slug: string) => {
    if (!content) return;
    if (!confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return;
    const updatedServices = content.services.filter((s) => s.slug !== slug);
    setContent({ ...content, services: updatedServices });
    handleSave({ services: updatedServices });
    if (editingServiceSlug === slug) {
      handleCancelServiceEdit();
    }
    showMessage('success', 'Hizmet kaldırıldı.');
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
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-9 h-9 rounded-xl bg-[#155E54] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              ŞK
            </span>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                {content.general.doctorName} — Klinik Yönetim Paneli
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-[#155E54] font-bold uppercase tracking-wider bg-[#EBF5F3] px-2 py-0.5 rounded">
                  {content.header.clinicName}
                </span>
                {githubStatus?.committed ? (
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <FaCheckCircle size={10} /> GitHub Senkronize
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                    <FaGithub size={10} /> Çift Yönlü Kayıt Modu
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link 
              href="/" 
              target="_blank" 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <span>Siteyi Aç</span>
              <FaExternalLinkAlt size={10} />
            </Link>

            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 bg-[#155E54] hover:bg-[#0E433C] text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-60"
            >
              <FaSave size={12} />
              <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Güvenli Çıkış Yap"
            >
              <FaSignOutAlt size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Notifications */}
      {message && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className={`px-5 py-3 rounded-2xl shadow-xl text-xs font-bold text-white flex items-center gap-2.5 ${
            message.type === 'success' ? 'bg-emerald-600' : message.type === 'info' ? 'bg-teal-600' : 'bg-rose-600'
          }`}>
            <FaCheck />
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-8 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
          {[
            { id: 'general', label: 'İletişim & Lokasyon', icon: FaPhone },
            { id: 'header_footer', label: 'Header & Footer', icon: FaHeading },
            { id: 'hero', label: 'Anasayfa Karşılama', icon: FaHome },
            { id: 'about', label: 'Hakkımda & Özgeçmiş', icon: FaUserMd },
            { id: 'services', label: 'Hizmetler', icon: FaStethoscope, count: content.services.length },
            { id: 'faq', label: 'Sık Sorulan Sorular', icon: FaQuestionCircle, count: content.faq.length },
            { id: 'cards', label: 'Klinik Kartları (Vitrin)', icon: FaThLarge, count: content.featureCards.length },
            { id: 'images', label: 'Görseller (Sürükle-Bırak)', icon: FaImage },
            { id: 'blog', label: 'Blog Makaleleri', icon: FaBlog, count: content.blogPosts.length },
            { id: 'seo', label: 'SEO & Başlıklar', icon: FaSearch },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive ? 'bg-[#155E54] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={12} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: GENEL & İLETİŞİM */}
        {activeTab === 'general' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs max-w-3xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Klinik & İletişim Bilgileri</h3>
              <p className="text-xs text-slate-500 mt-1">Sitenin her yerinde (header, footer, iletişim sayfası) kullanılan iletişim bilgileri.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hekim / Terapist Adı</label>
                <input
                  type="text"
                  value={content.general.doctorName}
                  onChange={(e) => setContent({ ...content, general: { ...content.general, doctorName: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Genel Unvan</label>
                <input
                  type="text"
                  value={content.general.title}
                  onChange={(e) => setContent({ ...content, general: { ...content.general, title: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Telefon Numarası</label>
                <input
                  type="text"
                  value={content.general.phone}
                  onChange={(e) => setContent({ ...content, general: { ...content.general, phone: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Numarası (Ülke kodu ile)</label>
                <input
                  type="text"
                  value={content.general.whatsapp}
                  onChange={(e) => setContent({ ...content, general: { ...content.general, whatsapp: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">E-posta Adresi</label>
                <input
                  type="email"
                  value={content.general.email}
                  onChange={(e) => setContent({ ...content, general: { ...content.general, email: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Şehir / İlçe</label>
                <input
                  type="text"
                  value={content.general.city}
                  onChange={(e) => setContent({ ...content, general: { ...content.general, city: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Açık Adres</label>
                <input
                  type="text"
                  value={content.general.address}
                  onChange={(e) => setContent({ ...content, general: { ...content.general, address: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Çalışma Saatleri Metni</label>
                <input
                  type="text"
                  value={content.general.workingHours}
                  onChange={(e) => setContent({ ...content, general: { ...content.general, workingHours: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                />
              </div>
            </div>

            <button
              onClick={() => handleSave()}
              className="px-6 py-2.5 bg-[#155E54] hover:bg-[#0E433C] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Bilgileri Kaydet
            </button>
          </div>
        )}

        {/* TAB 2: HEADER & FOOTER */}
        {activeTab === 'header_footer' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs max-w-3xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Header ve Footer Metinleri</h3>
              <p className="text-xs text-slate-500 mt-1">Sitenin üst barında ve alt bilgi bölümünde yer alan marka/kurum yazıları.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Header Altındaki Kurum/Birim Adı</label>
                <input
                  type="text"
                  value={content.header.clinicName}
                  onChange={(e) => setContent({ ...content, header: { ...content.header, clinicName: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                />
                <p className="text-[11px] text-slate-400 mt-1">Örn: Özel Sağlık Merkezi veya Şilan Kartal Özel Sağlık Meslek Hizmet Birimi</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Uzmanlık Unvanı (Header ve Kartlarda)</label>
                <input
                  type="text"
                  value={content.header.credentials}
                  onChange={(e) => setContent({ ...content, header: { ...content.header, credentials: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Footer Açıklama Metni</label>
                <textarea
                  rows={3}
                  value={content.footer.description}
                  onChange={(e) => setContent({ ...content, footer: { ...content.footer, description: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Telif Hakkı (Copyright) Metni</label>
                <input
                  type="text"
                  value={content.footer.copyright}
                  onChange={(e) => setContent({ ...content, footer: { ...content.footer, copyright: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                />
              </div>
            </div>

            <button
              onClick={() => handleSave()}
              className="px-6 py-2.5 bg-[#155E54] hover:bg-[#0E433C] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Kaydet
            </button>
          </div>
        )}

        {/* TAB 3: HERO / ANASAYFA */}
        {activeTab === 'hero' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs max-w-3xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Anasayfa Hero (Karşılama) Metinleri</h3>
              <p className="text-xs text-slate-500 mt-1">Ziyaretçinin anasayfayı ilk açtığında gördüğü büyük başlık ve sloganlar.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Üst Rozet 1 (Konum)</label>
                  <input
                    type="text"
                    value={content.hero.badge}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Üst Rozet 2 (Disiplin)</label>
                  <input
                    type="text"
                    value={content.hero.badgeSub}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, badgeSub: e.target.value } })}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Başlık Başlangıcı</label>
                <input
                  type="text"
                  value={content.hero.titlePrefix}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, titlePrefix: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vurgulanacak Kelime (Renkli Alan)</label>
                <input
                  type="text"
                  value={content.hero.titleHighlight}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, titleHighlight: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54] text-[#155E54] font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Başlık Sonu</label>
                <input
                  type="text"
                  value={content.hero.titleSuffix}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, titleSuffix: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hero Açıklama Paragrafı</label>
                <textarea
                  rows={3}
                  value={content.hero.description}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                />
              </div>
            </div>

            <button
              onClick={() => handleSave()}
              className="px-6 py-2.5 bg-[#155E54] hover:bg-[#0E433C] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Hero Alanını Kaydet
            </button>
          </div>
        )}

        {/* TAB 4: HAKKIMDA */}
        {activeTab === 'about' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs max-w-4xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Hakkımda & Özgeçmiş Sayfası</h3>
              <p className="text-xs text-slate-500 mt-1">Özgeçmiş sayfası, biyografi, mezuniyet ve sertifikasyon listesi.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sayfa Başlığı</label>
                  <input
                    type="text"
                    value={content.about.title}
                    onChange={(e) => setContent({ ...content, about: { ...content.about, title: e.target.value } })}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alt Başlık</label>
                  <input
                    type="text"
                    value={content.about.subtitle}
                    onChange={(e) => setContent({ ...content, about: { ...content.about, subtitle: e.target.value } })}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Biyografi & Mezuniyet Bilgisi</label>
                <textarea
                  rows={4}
                  value={content.about.bio}
                  onChange={(e) => setContent({ ...content, about: { ...content.about, bio: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Klinik Deneyim & Çalışma Yaklaşımı</label>
                <textarea
                  rows={3}
                  value={content.about.clinicExperience}
                  onChange={(e) => setContent({ ...content, about: { ...content.about, clinicExperience: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                />
              </div>

              {/* Education List */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Eğitim ve Akademik Geçmiş</label>
                <div className="space-y-2 mb-3">
                  {content.about.education.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = content.about.education.filter((_, i) => i !== idx);
                          setContent({ ...content, about: { ...content.about, education: updated } });
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <FaTrash size={11} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Yeni eğitim ekle..."
                    value={newEdu}
                    onChange={(e) => setNewEdu(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newEdu.trim()) return;
                      setContent({ ...content, about: { ...content.about, education: [...content.about.education, newEdu.trim()] } });
                      setNewEdu('');
                    }}
                    className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl"
                  >
                    Ekle
                  </button>
                </div>
              </div>

              {/* Certifications List */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Uzmanlık & Sertifikalar</label>
                <div className="space-y-2 mb-3">
                  {content.about.certifications.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = content.about.certifications.filter((_, i) => i !== idx);
                          setContent({ ...content, about: { ...content.about, certifications: updated } });
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <FaTrash size={11} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Yeni sertifika ekle..."
                    value={newCert}
                    onChange={(e) => setNewCert(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newCert.trim()) return;
                      setContent({ ...content, about: { ...content.about, certifications: [...content.about.certifications, newCert.trim()] } });
                      setNewCert('');
                    }}
                    className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl"
                  >
                    Ekle
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSave()}
              className="px-6 py-2.5 bg-[#155E54] hover:bg-[#0E433C] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Özgeçmişi Kaydet
            </button>
          </div>
        )}

        {/* TAB 5: HİZMETLER (DÜZENLEME + CİHAZDAN FOTOĞRAF SEÇME) */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#155E54] font-bold text-sm">
                  {editingServiceSlug ? <FaEdit /> : <FaPlus />}
                  <span>{editingServiceSlug ? 'Klinik Hizmeti Düzenle' : 'Yeni Klinik Hizmet Ekle'}</span>
                </div>
                {editingServiceSlug && (
                  <button
                    type="button"
                    onClick={handleCancelServiceEdit}
                    className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-bold bg-rose-50 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <FaTimes size={10} />
                    <span>İptal</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveService} className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hizmet Başlığı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Kuru İğneleme & Bantlama"
                    value={newService.title}
                    onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                    <input
                      type="text"
                      placeholder="Örn: Kas-İskelet Sistemi"
                      value={newService.category}
                      onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">URL / Slug</label>
                    <input
                      type="text"
                      placeholder="kuru-igneleme"
                      value={newService.slug}
                      onChange={(e) => setNewService({ ...newService, slug: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kısa Açıklama (Kart Metni)</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Anasayfa kartında görünecek kısa özet..."
                    value={newService.shortDescription}
                    onChange={(e) => setNewService({ ...newService, shortDescription: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                  />
                </div>

                {/* Cihazdan Görsel Seçme & Sürükle-Bırak Alanı */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Hizmet Görseli (Cihazdan Seç veya Sürükle)
                  </label>

                  <div
                    onDragOver={(e) => { e.preventDefault(); }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        setUploadingServiceImage(true);
                        const url = await uploadCustomImage(e.dataTransfer.files[0]);
                        if (url) setNewService((prev) => ({ ...prev, image: url }));
                        setUploadingServiceImage(false);
                      }
                    }}
                    className="border-2 border-dashed border-slate-300 hover:border-[#155E54] bg-slate-50/60 rounded-2xl p-4 text-center transition-all"
                  >
                    {uploadingServiceImage ? (
                      <div className="py-2 flex items-center justify-center gap-2 text-xs font-bold text-[#155E54]">
                        <div className="w-4 h-4 border-2 border-[#155E54] border-t-transparent rounded-full animate-spin" />
                        <span>Fotoğraf Yükleniyor...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <FaCloudUploadAlt size={22} className="text-[#155E54]" />
                        <span className="text-xs font-bold text-slate-700">Görseli buraya bırakın</span>
                        <label className="mt-1 px-3 py-1.5 bg-[#155E54] hover:bg-[#0E433C] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors">
                          <span>Cihazdan Dosya Seç</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                setUploadingServiceImage(true);
                                const url = await uploadCustomImage(e.target.files[0]);
                                if (url) setNewService((prev) => ({ ...prev, image: url }));
                                setUploadingServiceImage(false);
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="veya görsel linki: https://images.unsplash.com/..."
                    value={newService.image}
                    onChange={(e) => setNewService({ ...newService, image: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Detaylı Açıklama (Hizmet Sayfası)</label>
                  <textarea
                    rows={3}
                    placeholder="Uygulama şekli, klinik süreç..."
                    value={newService.detailedDescription}
                    onChange={(e) => setNewService({ ...newService, detailedDescription: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  {editingServiceSlug && (
                    <button
                      type="button"
                      onClick={handleCancelServiceEdit}
                      className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-all"
                    >
                      İptal
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#155E54] hover:bg-[#0E433C] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    {editingServiceSlug ? 'Değişiklikleri Güncelle' : '+ Hizmeti Ekle'}
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Yayındaki Klinik Hizmetler ({content.services.length})</h3>
                <span className="text-xs text-slate-400 font-medium">Düzenlemek için kaleme tıklayın</span>
              </div>

              <div className="space-y-3">
                {content.services.map((s) => (
                  <div
                    key={s.slug}
                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      editingServiceSlug === s.slug ? 'border-[#155E54] bg-[#EBF5F3]/50 shadow-xs' : 'border-slate-200 bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-start space-x-3.5 min-w-0">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-200 border border-slate-200">
                        <Image src={s.image} alt={s.title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-[#155E54] uppercase tracking-wider">{s.category}</span>
                        <h4 className="font-bold text-slate-900 text-sm truncate">{s.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{s.shortDescription}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <Link
                        href={`/hizmetler/${s.slug}`}
                        target="_blank"
                        className="p-2 text-slate-500 hover:text-[#155E54] hover:bg-white rounded-lg transition-colors"
                        title="Sayfayı Gör"
                      >
                        <FaEye size={13} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleEditService(s)}
                        className="p-2 text-teal-700 hover:text-teal-900 hover:bg-teal-50 rounded-lg transition-colors"
                        title="Hizmeti Düzenle"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(s.slug)}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hizmeti Sil"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FAQ */}
        {activeTab === 'faq' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-[#155E54] font-bold text-sm">
                <FaPlus />
                <span>Yeni Soru & Cevap Ekle</span>
              </div>
              <form onSubmit={handleAddFaq} className="space-y-3.5 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Soru</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Seans ücretleri nedir?"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cevap</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Detaylı yanıt..."
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-[#155E54] hover:bg-[#0E433C] text-white text-xs font-bold rounded-xl transition-all shadow-sm">
                  + Soru Ekle
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900">Sık Sorulan Sorular ({content.faq.length})</h3>
              {content.faq.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{item.question}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.answer}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteFaq(idx)}
                    className="p-2 text-rose-500 hover:text-rose-700 shrink-0"
                    title="Soruyu Sil"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: CARDS */}
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

        {/* TAB 8: GÖRSELLER (SÜRÜKLE & BIRAK / DOSYA SEÇ) */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900">Klinik Fotoğraf ve Portre Yönetimi</h3>
              <p className="text-xs text-slate-500 mt-1">
                Görselleri doğrudan bilgisayarınızdan sürükleyip bırakabilir, &ldquo;Dosya Seç&rdquo; butonu ile yükleyebilir veya doğrudan görsel linki yapıştırabilirsiniz.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  key: 'heroImage' as const,
                  badge: 'Hero Görseli',
                  title: 'Karşılama Seans Fotoğrafı',
                  desc: 'Anasayfanın en üstünde çıkan ana seans görseli.',
                  recommendation: 'Önerilen: 1200×800px (Yatay)',
                  currentUrl: content.images.heroImage,
                },
                {
                  key: 'profileImage' as const,
                  badge: 'Hekim Portresi',
                  title: 'Özgeçmiş Portre Fotoğrafı',
                  desc: 'Hakkımda sayfasında ve anasayfa biyografi kartında görünür.',
                  recommendation: 'Önerilen: 800×1000px (Dikey)',
                  currentUrl: content.images.profileImage,
                },
                {
                  key: 'clinicImage' as const,
                  badge: 'Klinik Mekanı',
                  title: 'Başakşehir Kliniği Görseli',
                  desc: 'Klinik mekanı ve ortam fotoğrafları.',
                  recommendation: 'Önerilen: 1200×800px (Yatay)',
                  currentUrl: content.images.clinicImage,
                },
              ].map((item) => {
                const isDragging = dragActiveKey === item.key;
                const isUploading = uploadingKey === item.key;

                return (
                  <div
                    key={item.key}
                    className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-5"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#155E54] bg-[#EBF5F3] px-2.5 py-1 rounded-md">
                          {item.badge}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.recommendation}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-2.5">{item.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>

                      {/* Mevcut Görsel Önizleme */}
                      <div className="relative h-52 w-full rounded-2xl overflow-hidden bg-slate-100 mt-4 border border-slate-200/80 group">
                        {item.currentUrl ? (
                          <Image
                            src={item.currentUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                            Görsel Tanımlanmamış
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold pointer-events-none">
                          Önizleme
                        </div>
                      </div>
                    </div>

                    {/* Sürükle Bırak / Dosya Seçme Alanı */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragActiveKey(item.key);
                      }}
                      onDragLeave={() => setDragActiveKey(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragActiveKey(null);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          uploadImageFile(e.dataTransfer.files[0], item.key);
                        }
                      }}
                      className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
                        isDragging
                          ? 'border-[#155E54] bg-[#EBF5F3] scale-[1.01]'
                          : 'border-slate-300 hover:border-[#155E54]/70 bg-slate-50/70'
                      }`}
                    >
                      {isUploading ? (
                        <div className="py-4 flex flex-col items-center justify-center gap-2">
                          <div className="w-7 h-7 border-3 border-[#155E54] border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs font-bold text-[#155E54]">Görsel Yükleniyor...</span>
                        </div>
                      ) : (
                        <div className="py-2 flex flex-col items-center justify-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-white shadow-xs text-[#155E54] flex items-center justify-center">
                            <FaCloudUploadAlt size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              Görseli buraya sürükleyip bırakın
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              veya bilgisayarınızdan seçin
                            </p>
                          </div>

                          <label className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 bg-[#155E54] hover:bg-[#0E433C] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-all active:scale-[0.98]">
                            <span>Dosya Seç</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, item.key)}
                            />
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Manuel URL Girişi Seçeneği */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-600">
                        veya Doğrudan Görsel URL Linki:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.currentUrl}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = { ...content.images, [item.key]: val };
                            setContent({ ...content, images: updated });
                          }}
                          placeholder="https://images.unsplash.com/..."
                          className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                        />
                        <button
                          type="button"
                          onClick={() => handleSave()}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl"
                        >
                          Uygula
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 10: BLOG (DÜZENLEME, CİHAZDAN FOTOĞRAF SEÇME & GEÇMİŞ YAZILAR) */}
        {activeTab === 'blog' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#155E54] font-bold text-sm">
                  {editingBlogId ? <FaEdit /> : <FaPlus />}
                  <span>{editingBlogId ? 'Blog Makalesini Düzenle' : 'Yeni Blog Makalesi Ekle'}</span>
                </div>
                {editingBlogId && (
                  <button
                    type="button"
                    onClick={handleCancelBlogEdit}
                    className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-bold bg-rose-50 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <FaTimes size={10} />
                    <span>İptal</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveBlog} className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Makale Başlığı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Bel Fıtığında Manuel Tedavi"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL / Slug</label>
                  <input
                    type="text"
                    placeholder="bel-fitiginda-tedavi"
                    value={newBlog.slug}
                    onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Özet (Giriş Paragrafı)</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Kartlarda ve arama sonuçlarında çıkacak kısa özet..."
                    value={newBlog.excerpt}
                    onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                  />
                </div>

                {/* Cihazdan Görsel Seçme & Sürükle-Bırak Alanı */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Kapak Görseli (Cihazdan Seç veya Sürükle)
                  </label>

                  <div
                    onDragOver={(e) => { e.preventDefault(); }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        setUploadingBlogImage(true);
                        const url = await uploadCustomImage(e.dataTransfer.files[0]);
                        if (url) setNewBlog((prev) => ({ ...prev, coverImage: url }));
                        setUploadingBlogImage(false);
                      }
                    }}
                    className="border-2 border-dashed border-slate-300 hover:border-[#155E54] bg-slate-50/60 rounded-2xl p-4 text-center transition-all"
                  >
                    {uploadingBlogImage ? (
                      <div className="py-2 flex items-center justify-center gap-2 text-xs font-bold text-[#155E54]">
                        <div className="w-4 h-4 border-2 border-[#155E54] border-t-transparent rounded-full animate-spin" />
                        <span>Fotoğraf Yükleniyor...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <FaCloudUploadAlt size={22} className="text-[#155E54]" />
                        <span className="text-xs font-bold text-slate-700">Görseli buraya bırakın</span>
                        <label className="mt-1 px-3 py-1.5 bg-[#155E54] hover:bg-[#0E433C] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors">
                          <span>Cihazdan Dosya Seç</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                setUploadingBlogImage(true);
                                const url = await uploadCustomImage(e.target.files[0]);
                                if (url) setNewBlog((prev) => ({ ...prev, coverImage: url }));
                                setUploadingBlogImage(false);
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="veya doğrudan görsel linki..."
                    value={newBlog.coverImage}
                    onChange={(e) => setNewBlog({ ...newBlog, coverImage: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Makale İçeriği (Markdown Formatı)
                  </label>
                  <textarea
                    rows={8}
                    placeholder="## Başlık&#10;&#10;Paragraf metni...&#10;&#10;- Madde 1&#10;- Madde 2"
                    value={newBlog.content || ''}
                    onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">İpucu: ## ile alt başlık, - ile madde listesi oluşturabilirsiniz.</p>
                </div>

                <div className="flex gap-2 pt-2">
                  {editingBlogId && (
                    <button
                      type="button"
                      onClick={handleCancelBlogEdit}
                      className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-all"
                    >
                      İptal
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#155E54] hover:bg-[#0E433C] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    {editingBlogId ? 'Değişiklikleri Güncelle' : '+ Yayına Al'}
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Yayındaki Yazılar ({content.blogPosts.length})</h3>
                <span className="text-xs text-slate-400 font-medium">Düzenlemek için kaleme tıklayın</span>
              </div>

              {content.blogPosts.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Henüz blog yazısı eklenmemiş. Soldaki formdan ekleyebilirsiniz.
                </div>
              ) : (
                <div className="space-y-3">
                  {content.blogPosts.map((post) => (
                    <div
                      key={post.id || post.slug}
                      className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                        editingBlogId === (post.id || post.slug) ? 'border-[#155E54] bg-[#EBF5F3]/50 shadow-xs' : 'border-slate-200 bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-start space-x-3.5 min-w-0">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-200 border border-slate-200">
                          {post.coverImage ? (
                            <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">Resim Yok</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm truncate">{post.title}</h4>
                          <span className="text-[11px] text-slate-500 block mt-0.5">{post.date}</span>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{post.excerpt}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 text-slate-500 hover:text-[#155E54] hover:bg-white rounded-lg transition-colors"
                          title="Yazıyı Sitede Gör"
                        >
                          <FaEye size={13} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleEditBlog(post)}
                          className="p-2 text-teal-700 hover:text-teal-900 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Yazıyı Düzenle"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBlog(post.id || post.slug)}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Yazıyı Sil"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 11: SEO */}
        {activeTab === 'seo' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs max-w-3xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Google & Arama Motoru Optimizasyonu (SEO)</h3>
              <p className="text-xs text-slate-500 mt-1">Google arama sonuçlarında çıkacak başlık ve açıklama etiketleri.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Google Arama Başlığı (Title)</label>
                <input
                  type="text"
                  value={content.seo.homeTitle}
                  onChange={(e) => setContent({ ...content, seo: { ...content.seo, homeTitle: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Google Arama Açıklaması (Meta Description)</label>
                <textarea
                  rows={3}
                  value={content.seo.homeDescription}
                  onChange={(e) => setContent({ ...content, seo: { ...content.seo, homeDescription: e.target.value } })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#155E54]"
                />
              </div>

              {/* Google SERP Preview */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Google Arama Önizlemesi</span>
                <div className="text-[#1a0dab] text-base font-semibold hover:underline cursor-pointer line-clamp-1">
                  {content.seo.homeTitle}
                </div>
                <div className="text-emerald-700 text-xs font-medium">https://silankartal.com.tr</div>
                <div className="text-slate-600 text-xs line-clamp-2">
                  {content.seo.homeDescription}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSave()}
              className="px-6 py-2.5 bg-[#155E54] hover:bg-[#0E433C] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              SEO Bilgilerini Kaydet
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
