'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaArrowLeft, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import ImageUploadZone from '@/components/admin/ImageUploadZone';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function BlogDuzenle({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [date, setDate] = useState('');
  const [published, setPublished] = useState(true);

  useEffect(() => {
    params.then(({ id: resolvedId }) => {
      setId(resolvedId);
      fetch(`/api/admin/blog/${resolvedId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) { setError(data.error); return; }
          setTitle(data.title || '');
          setSlug(data.slug || '');
          setExcerpt(data.excerpt || '');
          setContent(data.content || '');
          setCoverImage(data.coverImage || '');
          setDate(data.date || '');
          setPublished(data.published !== false);
        })
        .catch(() => setError('Yazı yüklenemedi.'))
        .finally(() => setLoading(false));
    });
  }, [params]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) { setError('Başlık ve içerik zorunludur.'); return; }
    setSaving(true); setError(''); setSuccess('');
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, excerpt, content, coverImage, date, published }),
      });
      const data = await res.json();
      if (res.ok) { setSuccess('Yazı başarıyla güncellendi!'); setTimeout(() => setSuccess(''), 3000); }
      else setError(data.error || 'Hata oluştu.');
    } catch { setError('Sunucu hatası.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      if (res.ok) { router.push('/admin/blog'); router.refresh(); }
      else setError('Silme işlemi başarısız.');
    } catch { setError('Sunucu hatası.'); }
    finally { setDeleting(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm text-slate-500">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Başlık */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
            <FaArrowLeft size={14} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Blog Yazısını Düzenle</h1>
            <p className="text-xs text-slate-500 mt-0.5">Değişiklikler kaydedildiğinde anında canlıya yansır.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {slug && (
            <a href={`/blog/${slug}`} target="_blank" rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 border border-slate-200 rounded-xl transition-colors">
              <FaExternalLinkAlt size={12} />
            </a>
          )}
          <button onClick={handleDelete} disabled={deleting}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-colors disabled:opacity-50 cursor-pointer">
            <FaTrash size={11} />
            {deleting ? 'Siliniyor...' : 'Sil'}
          </button>
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer">
            <FaSave size={12} />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-700">{error}</div>}
      {success && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-700">✓ {success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ana İçerik */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Başlık *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">URL (Slug)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 shrink-0">/blog/</span>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Özet</label>
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all resize-none" />
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">İçerik *</label>
            <p className="text-[11px] text-slate-400 mb-2">Markdown: ## Başlık, **kalın**, *italik*, - madde</p>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={20}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all resize-none leading-relaxed" />
          </div>
        </div>

        {/* Sağ Panel */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Yayın Ayarları</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tarih</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 transition-all" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">{published ? 'Yayında' : 'Taslak'}</span>
              <button type="button" onClick={() => setPublished(!published)}
                className={`w-11 h-6 rounded-full p-1 transition-colors ${published ? 'bg-teal-600' : 'bg-slate-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${published ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <ImageUploadZone
              label="Kapak Görseli"
              description="Sürükle-bırak veya cihazdan seçin. Blog listesinde ve detay sayfasında gösterilir."
              currentImage={coverImage}
              onImageUploaded={(url) => setCoverImage(url)}
              onImageRemoved={() => setCoverImage('')}
              aspectRatio="landscape"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
