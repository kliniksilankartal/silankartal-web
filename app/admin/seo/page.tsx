'use client';

import { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';

export default function SeoAdminPage() {
  const [homeTitle, setHomeTitle] = useState('');
  const [homeDescription, setHomeDescription] = useState('');
  const [blogTitle, setBlogTitle] = useState('');
  const [blogDescription, setBlogDescription] = useState('');
  const [hakkimdaTitle, setHakkimdaTitle] = useState('');
  const [hakkimdaDescription, setHakkimdaDescription] = useState('');
  const [iletisimTitle, setIletisimTitle] = useState('');
  const [iletisimDescription, setIletisimDescription] = useState('');
  const [sssTitle, setSssTitle] = useState('');
  const [sssDescription, setSssDescription] = useState('');

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => r.json())
      .then((data) => {
        const seo = data.seo ?? {};
        setHomeTitle(seo.homeTitle ?? data.homeTitle ?? '');
        setHomeDescription(seo.homeDescription ?? data.homeDescription ?? '');
        setBlogTitle(seo.blogTitle ?? data.blogTitle ?? '');
        setBlogDescription(seo.blogDescription ?? data.blogDescription ?? '');
        setHakkimdaTitle(seo.hakkimdaTitle ?? data.hakkimdaTitle ?? '');
        setHakkimdaDescription(seo.hakkimdaDescription ?? data.hakkimdaDescription ?? '');
        setIletisimTitle(seo.iletisimTitle ?? data.iletisimTitle ?? '');
        setIletisimDescription(seo.iletisimDescription ?? data.iletisimDescription ?? '');
        setSssTitle(seo.sssTitle ?? data.sssTitle ?? '');
        setSssDescription(seo.sssDescription ?? data.sssDescription ?? '');
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatus('idle');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seo: {
            homeTitle,
            homeDescription,
            blogTitle,
            blogDescription,
            hakkimdaTitle,
            hakkimdaDescription,
            iletisimTitle,
            iletisimDescription,
            sssTitle,
            sssDescription,
          },
          homeTitle,
          homeDescription,
          blogTitle,
          blogDescription,
          hakkimdaTitle,
          hakkimdaDescription,
          iletisimTitle,
          iletisimDescription,
          sssTitle,
          sssDescription,
        }),
      });
      if (!res.ok) throw new Error('Kaydetme başarısız');
      setStatus('success');
    } catch (e: unknown) {
      setStatus('error');
      setErrorMsg(e instanceof Error ? e.message : 'Bir hata oluştu');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all';
  const cardClass = 'bg-white border border-slate-200 rounded-2xl p-6 space-y-4';
  const sectionTitleClass =
    'text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4';
  const labelClass = 'block text-xs font-semibold text-slate-600 mb-1';

  const CharHint = ({ value, max }: { value: string; max: number }) => {
    const len = value.length;
    const color = len > max ? 'text-red-500' : len > max * 0.85 ? 'text-amber-500' : 'text-slate-400';
    return (
      <span className={`text-xs ${color} mt-1 block`}>
        {len} / {max} karakter
      </span>
    );
  };

  const SeoSection = ({
    pageLabel,
    title,
    setTitle,
    description,
    setDescription,
  }: {
    pageLabel: string;
    title: string;
    setTitle: (v: string) => void;
    description: string;
    setDescription: (v: string) => void;
  }) => (
    <div className={cardClass}>
      <p className={sectionTitleClass}>{pageLabel}</p>
      <div>
        <label className={labelClass}>Sayfa Başlığı (Title) — max 60 karakter</label>
        <input
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sayfa başlığı (tarayıcı sekmesinde görünür)"
          maxLength={80}
        />
        <CharHint value={title} max={60} />
      </div>
      <div>
        <label className={labelClass}>Meta Açıklama (Description) — max 160 karakter</label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Arama motorlarında görünen sayfa açıklaması"
          maxLength={200}
        />
        <CharHint value={description} max={160} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">SEO Ayarları</h1>
          <p className="text-sm text-slate-500 mt-1">Her sayfa için meta başlık ve açıklamalarını düzenleyin.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <FaSave />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>

      {/* Status */}
      {status === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">
          ✓ SEO ayarları başarıyla kaydedildi.
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
          ✗ {errorMsg}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700">
        💡 <strong>İpucu:</strong> Başlık 50-60 karakter, açıklama 150-160 karakter arasında olduğunda arama motorlarında en iyi sonucu verir.
      </div>

      <SeoSection
        pageLabel="🏠 Anasayfa"
        title={homeTitle}
        setTitle={setHomeTitle}
        description={homeDescription}
        setDescription={setHomeDescription}
      />

      <SeoSection
        pageLabel="📝 Blog Sayfası"
        title={blogTitle}
        setTitle={setBlogTitle}
        description={blogDescription}
        setDescription={setBlogDescription}
      />

      <SeoSection
        pageLabel="👤 Hakkımda Sayfası"
        title={hakkimdaTitle}
        setTitle={setHakkimdaTitle}
        description={hakkimdaDescription}
        setDescription={setHakkimdaDescription}
      />

      <SeoSection
        pageLabel="📞 İletişim Sayfası"
        title={iletisimTitle}
        setTitle={setIletisimTitle}
        description={iletisimDescription}
        setDescription={setIletisimDescription}
      />

      <SeoSection
        pageLabel="❓ SSS Sayfası"
        title={sssTitle}
        setTitle={setSssTitle}
        description={sssDescription}
        setDescription={setSssDescription}
      />

      {/* Bottom Save */}
      <div className="flex justify-end pb-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <FaSave />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </div>
  );
}
