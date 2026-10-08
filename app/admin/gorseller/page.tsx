'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSave, FaImage, FaUserMd, FaClinicMedical, FaCheck, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';
import ImageUploadZone from '@/components/admin/ImageUploadZone';

export default function AdminGorsellerPage() {
  const [heroImage, setHeroImage] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [clinicImage, setClinicImage] = useState('');

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => r.json())
      .then((data) => {
        setHeroImage(data.images?.heroImage ?? '');
        setProfileImage(data.images?.profileImage ?? '');
        setClinicImage(data.images?.clinicImage ?? '');
      })
      .catch((err) => {
        console.error('İçerik yükleme hatası:', err);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatus('idle');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: {
            heroImage,
            profileImage,
            clinicImage,
          },
        }),
      });

      if (!res.ok) throw new Error('Görseller kaydedilemedi');
      setStatus('success');
    } catch (e: unknown) {
      setStatus('error');
      setErrorMsg(e instanceof Error ? e.message : 'Bir hata oluştu');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus('idle'), 3500);
    }
  };

  const cardClass = 'bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4';

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse inline-block" />
            <span className="text-[11px] font-bold tracking-widest text-teal-700 uppercase">
              Medya &amp; Fotoğraf Yönetimi
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Görselleri Güncelle</h1>
          <p className="text-sm text-slate-500 mt-1">
            Sitenizdeki anasayfa hero fotoğrafını, uzman profil resmini ve klinik görsellerini buradan yönetebilirsiniz.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <FaSave size={14} />
          {saving ? 'Kaydediliyor...' : 'Tüm Görselleri Kaydet'}
        </button>
      </div>

      {/* Durum Bildirimleri */}
      {status === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2 animate-fadeIn">
          <FaCheck className="text-emerald-600" />
          Görseller başarıyla kaydedildi ve tüm sitede güncellendi!
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
          <FaExclamationTriangle className="text-red-500" />
          {errorMsg}
        </div>
      )}

      {/* 1. Hero Ana Fotoğrafı */}
      <div className={cardClass}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <FaImage size={15} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">1. Hero Ana Karşılama &amp; Seans Fotoğrafı</h2>
              <p className="text-xs text-slate-400">Canlı sitenin anasayfasında en üst sağda yer alan dikey çerçeve fotoğrafı.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-2">
          <div className="md:col-span-6">
            <ImageUploadZone
              label="Hero Görseli (Dikey Formatta Tavsiye Edilir)"
              description="PNG, JPG, WEBP. Görseli kaldırmak için alttaki 'Görseli Kaldır' butonuna basabilirsiniz."
              currentImage={heroImage}
              onImageUploaded={(url) => setHeroImage(url)}
              onImageRemoved={() => setHeroImage('')}
              aspectRatio="portrait"
            />
          </div>

          <div className="md:col-span-6 bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Hero Görseli Hakkında Bilgi</h3>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
              <li>Bu görsel sitenizi ilk açan ziyaretçilerin gördüğü en büyük ve en önemli seans/klinik fotoğrafıdır.</li>
              <li>Eğer bu görseli kaldırırsanız ve boş bırakırsanız, anasayfada otomatik olarak zarif ve modern <strong>Fzt. Şilan Kartal klinik marka kartı</strong> gösterilir.</li>
              <li>Fotoğrafı kaldırdıktan veya yenisini yükledikten sonra yukarıdaki <strong>&ldquo;Tüm Görselleri Kaydet&rdquo;</strong> butonuna basmayı unutmayın.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Profil ve Klinik Fotoğrafları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Uzman Profil Fotoğrafı */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <FaUserMd size={15} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">2. Fzt. Şilan Kartal Profil Fotoğrafı</h2>
              <p className="text-xs text-slate-400">Hakkımda sayfası ve biyografi avatarı</p>
            </div>
          </div>

          <div className="pt-2">
            <ImageUploadZone
              label="Profil / Portre Fotoğrafı"
              description="Kare veya portre formatında uzman fotoğrafı."
              currentImage={profileImage}
              onImageUploaded={(url) => setProfileImage(url)}
              onImageRemoved={() => setProfileImage('')}
              aspectRatio="square"
            />
          </div>
        </div>

        {/* Klinik Mekan Görseli */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FaClinicMedical size={15} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">3. Klinik İç Mekan / Uygulama Fotoğrafı</h2>
              <p className="text-xs text-slate-400">Klinik ortamı ve tedavi alanları görseli</p>
            </div>
          </div>

          <div className="pt-2">
            <ImageUploadZone
              label="Klinik Görseli"
              description="Yatay veya geniş açılı klinik fotoğrafı."
              currentImage={clinicImage}
              onImageUploaded={(url) => setClinicImage(url)}
              onImageRemoved={() => setClinicImage('')}
              aspectRatio="landscape"
            />
          </div>
        </div>
      </div>

      {/* 3. Diğer Görsel Yönetim Alanları */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
          Hizmet &amp; Blog Görselleri
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/hizmetler"
            className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/20 transition-all group"
          >
            <div>
              <div className="text-sm font-bold text-slate-800">Hizmet Kapak Görselleri</div>
              <p className="text-xs text-slate-500 mt-0.5">Manuel terapi, kuru iğneleme vb. hizmet fotoğrafları</p>
            </div>
            <FaArrowRight size={12} className="text-teal-600 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin/blog"
            className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/20 transition-all group"
          >
            <div>
              <div className="text-sm font-bold text-slate-800">Blog Yazısı Kapak Görselleri</div>
              <p className="text-xs text-slate-500 mt-0.5">Makalelerin vitrin ve detay fotoğrafları</p>
            </div>
            <FaArrowRight size={12} className="text-teal-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
