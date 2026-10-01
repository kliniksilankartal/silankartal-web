'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
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

export default function YeniBlogPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [published, setPublished] = useState(true);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(slugify(val));
  };

  const handleSave = async () => {
    if (!title.trim()) { setError('Başlık zorunludur.'); return; }
    if (!slug.trim()) { setError('Slug zorunludur.'); return; }
    if (!content.trim()) { setError('İçerik zorunludur.'); return; }

    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          coverImage: coverImage.trim(),
          date,
          published,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/admin/blog');
        router.refresh();
      } else {
        setError(data.error || 'Kayıt sırasında hata oluştu.');
      }
    } catch {
      setError('Sunucu hatası. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Başlık */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <FaArrowLeft size={14} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Yeni Blog Yazısı</h1>
            <p className="text-xs text-slate-500 mt-0.5">Yazıyı kaydettiğinizde otomatik olarak yeni bir sayfa açılır.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview(!preview)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            {preview ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
            {preview ? 'Editör' : 'Önizleme'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <FaSave size={12} />
            {saving ? 'Kaydediliyor...' : 'Yayınla'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ana İçerik */}
        <div className="lg:col-span-2 space-y-4">
          {/* Başlık */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Yazı Başlığı *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Örn: Bel Fıtığında Ameliyatsız Tedavi"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                URL (Slug)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 shrink-0">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="bel-fitigi-ameliyatsiz-tedavi"
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Özet (Kart Açıklaması)
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Yazının kısa özeti, blog listesinde görünür..."
                rows={2}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          {/* İçerik */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Yazı İçeriği *
            </label>
            <p className="text-[11px] text-slate-400 mb-3">
              Markdown kullanabilirsiniz: ## Başlık, **kalın**, *italik*, - madde
            </p>
            {preview ? (
              <div
                className="prose prose-sm max-w-none min-h-[400px] p-3 bg-slate-50 rounded-xl text-sm text-slate-800 leading-relaxed"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {content || <span className="text-slate-400 italic">İçerik girilmemiş...</span>}
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`## Giriş\n\nYazınızı buraya yazın...\n\n## Alt Başlık\n\nDevam eden içerik...`}
                rows={20}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all resize-none leading-relaxed"
              />
            )}
          </div>
        </div>

        {/* Sağ Panel */}
        <div className="space-y-4">
          {/* Yayın Ayarları */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Yayın Ayarları</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tarih</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 transition-all"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                {published ? 'Yayında' : 'Taslak'}
              </span>
              <button
                type="button"
                onClick={() => setPublished(!published)}
                className={`w-11 h-6 rounded-full p-1 transition-colors ${published ? 'bg-teal-600' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${published ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>

          {/* Kapak Görseli */}
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
