'use client';

import { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';
import ImageUploadZone from '@/components/admin/ImageUploadZone';

export default function HakkimdaAdminPage() {
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutSubtitle, setAboutSubtitle] = useState('');
  const [bio, setBio] = useState('');
  const [clinicExperience, setClinicExperience] = useState('');
  const [educationText, setEducationText] = useState('');
  const [certificationsText, setCertificationsText] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => r.json())
      .then((data) => {
        setAboutTitle(data.about?.title ?? data.aboutTitle ?? '');
        setAboutSubtitle(data.about?.subtitle ?? data.aboutSubtitle ?? '');
        setBio(data.about?.bio ?? data.bio ?? '');
        setClinicExperience(data.about?.clinicExperience ?? data.clinicExperience ?? '');
        
        const edu = data.about?.education ?? data.education ?? [];
        setEducationText(Array.isArray(edu) ? edu.join('\n') : edu);
        
        const certs = data.about?.certifications ?? data.certifications ?? [];
        setCertificationsText(Array.isArray(certs) ? certs.join('\n') : certs);
        
        setProfileImage(data.images?.profileImage ?? '');
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatus('idle');
    try {
      const education = educationText.split('\n').map((s) => s.trim()).filter(Boolean);
      const certifications = certificationsText.split('\n').map((s) => s.trim()).filter(Boolean);

      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          about: {
            title: aboutTitle,
            subtitle: aboutSubtitle,
            bio,
            clinicExperience,
            education,
            certifications,
          },
          images: {
            profileImage,
          },
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Hakkımda &amp; Profil Yönetimi</h1>
          <p className="text-sm text-slate-500 mt-1">Hekim profil fotoğrafı, biyografi ve klinik özgeçmiş bilgilerini düzenleyin.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <FaSave />
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>

      {/* Status */}
      {status === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">
          ✓ Değişiklikler başarıyla kaydedildi.
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
          ✗ {errorMsg}
        </div>
      )}

      {/* Doktor Profil Fotoğrafı */}
      <div className={cardClass}>
        <p className={sectionTitleClass}>Hekim Profil Fotoğrafı (Sürükle - Bırak veya Seç)</p>
        <div className="max-w-md">
          <ImageUploadZone
            label="Hekim Portre Fotoğrafı"
            description="Özgeçmiş sayfasında ve klinik tanıtımında sol sütunda yer alan dikey profil fotoğrafı."
            currentImage={profileImage}
            onImageUploaded={(url) => setProfileImage(url)}
            onImageRemoved={() => setProfileImage('')}
            aspectRatio="portrait"
          />
        </div>
      </div>

      {/* Sayfa Başlığı */}
      <div className={cardClass}>
        <p className={sectionTitleClass}>Sayfa Başlığı ve Ünvan</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Sayfa Başlığı</label>
            <input
              className={inputClass}
              value={aboutTitle}
              onChange={(e) => setAboutTitle(e.target.value)}
              placeholder="Örn: Fzt. Şilan Kartal Kimdir?"
            />
          </div>
          <div>
            <label className={labelClass}>Alt Başlık / Uzmanlık Vurgusu</label>
            <input
              className={inputClass}
              value={aboutSubtitle}
              onChange={(e) => setAboutSubtitle(e.target.value)}
              placeholder="Örn: Klinik Deneyim & Bütüncül Manuel Terapi Yaklaşımı"
            />
          </div>
        </div>
      </div>

      {/* Biyografi */}
      <div className={cardClass}>
        <p className={sectionTitleClass}>Biyografi &amp; Klinik Deneyim</p>
        <div>
          <label className={labelClass}>Mesleki Özgeçmiş (1. Paragraf)</label>
          <textarea
            className={`${inputClass} resize-none`}
            rows={5}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Mezuniyet, akademik geçmiş ve uzmanlık alanları..."
          />
        </div>
        <div>
          <label className={labelClass}>Klinik Yaklaşım ve Seans Deneyimi (2. Paragraf)</label>
          <textarea
            className={`${inputClass} resize-none`}
            rows={4}
            value={clinicExperience}
            onChange={(e) => setClinicExperience(e.target.value)}
            placeholder="Başakşehir kliniğinde uygulanan kanıta dayalı fizyoterapi hizmetleri..."
          />
        </div>
      </div>

      {/* Eğitim ve Sertifikalar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cardClass}>
          <p className={sectionTitleClass}>Eğitim ve Akademik Geçmiş</p>
          <div>
            <label className={labelClass}>Eğitim Bilgileri</label>
            <p className="text-[11px] text-slate-400 mb-2">Her satıra bir eğitim maddesi yazınız.</p>
            <textarea
              className={`${inputClass} resize-none font-mono text-xs`}
              rows={6}
              value={educationText}
              onChange={(e) => setEducationText(e.target.value)}
              placeholder="İstanbul Üniversitesi — Fizyoterapi ve Rehabilitasyon (Lisans)&#10;Uluslararası Ortopedik Manuel Terapi (OMT) İleri Düzey"
            />
          </div>
        </div>

        <div className={cardClass}>
          <p className={sectionTitleClass}>Uzmanlık &amp; Sertifikalar</p>
          <div>
            <label className={labelClass}>Sertifika Listesi</label>
            <p className="text-[11px] text-slate-400 mb-2">Her satıra bir sertifika maddesi yazınız.</p>
            <textarea
              className={`${inputClass} resize-none font-mono text-xs`}
              rows={6}
              value={certificationsText}
              onChange={(e) => setCertificationsText(e.target.value)}
              placeholder="Ortopedik Manuel Terapi & Eklem Mobilizasyonu&#10;Klinik Kuru İğneleme & Tetik Nokta&#10;Klinik Pilates Eğitmenliği"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <FaSave />
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>
    </div>
  );
}
