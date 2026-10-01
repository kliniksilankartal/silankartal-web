'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import ImageUploadZone from '@/components/admin/ImageUploadZone';
import { 
  defaultPhilosophy, 
  defaultConditions, 
  defaultHomeSections,
  ClinicPhilosophy, 
  ClinicConditions,
  HomeSections,
  ConditionItemData
} from '@/lib/content-types';

interface FeatureCard {
  title: string;
  description: string;
}

export default function AnasayfaAdminPage() {
  // 1. Hero
  const [badge, setBadge] = useState('');
  const [badgeSub, setBadgeSub] = useState('');
  const [titlePrefix, setTitlePrefix] = useState('');
  const [titleHighlight, setTitleHighlight] = useState('');
  const [titleSuffix, setTitleSuffix] = useState('');
  const [description, setDescription] = useState('');
  
  // Hero Görsel & Sol Üst Vurgu Kartı
  const [heroImage, setHeroImage] = useState('');
  const [quoteTitle, setQuoteTitle] = useState('');
  const [quoteText, setQuoteText] = useState('');

  // Vitrin Kartları
  const [featureCards, setFeatureCards] = useState<FeatureCard[]>([]);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDesc, setNewCardDesc] = useState('');

  // 2. Klinik Felsefemiz
  const [philosophy, setPhilosophy] = useState<ClinicPhilosophy>(defaultPhilosophy);
  const [checklistText, setChecklistText] = useState('');

  // 3. Klinik Tedavi Alanlarımız (Conditions)
  const [conditions, setConditions] = useState<ClinicConditions>(defaultConditions);
  const [newConditionName, setNewConditionName] = useState('');
  const [newConditionCategory, setNewConditionCategory] = useState('');

  // 4. Anasayfa Ek Bölümleri (Hizmetler, Blog, Harita)
  const [homeSections, setHomeSections] = useState<HomeSections>(defaultHomeSections);

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => r.json())
      .then((data) => {
        // Hero
        setBadge(data.hero?.badge ?? '');
        setBadgeSub(data.hero?.badgeSub ?? '');
        setTitlePrefix(data.hero?.titlePrefix ?? '');
        setTitleHighlight(data.hero?.titleHighlight ?? '');
        setTitleSuffix(data.hero?.titleSuffix ?? '');
        setDescription(data.hero?.description ?? '');
        setQuoteTitle(data.hero?.quoteTitle ?? 'Bütüncül Yaklaşım');
        setQuoteText(data.hero?.quoteText ?? '"Ağrı nerede olursa olsun, kaynak biyomekanik zincirin başka bir halkasında olabilir."');
        setHeroImage(data.images?.heroImage ?? '');
        setFeatureCards(data.featureCards ?? []);

        // Philosophy
        const phil = data.philosophy ? { ...defaultPhilosophy, ...data.philosophy } : defaultPhilosophy;
        setPhilosophy(phil);
        setChecklistText(phil.checklist ? phil.checklist.join('\n') : defaultPhilosophy.checklist.join('\n'));

        // Conditions
        const cond = data.conditions ? {
          ...defaultConditions,
          ...data.conditions,
          items: data.conditions.items && data.conditions.items.length > 0 ? data.conditions.items : defaultConditions.items
        } : defaultConditions;
        setConditions(cond);

        // Home Sections
        const hSec = data.homeSections ? { ...defaultHomeSections, ...data.homeSections } : defaultHomeSections;
        setHomeSections(hSec);
      })
      .catch(() => {});
  }, []);

  // Feature Card Handlers
  const updateCard = (index: number, field: keyof FeatureCard, value: string) => {
    setFeatureCards((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const deleteCard = (index: number) => {
    setFeatureCards((prev) => prev.filter((_, i) => i !== index));
  };

  const addCard = () => {
    if (!newCardTitle.trim()) return;
    setFeatureCards((prev) => [...prev, { title: newCardTitle.trim(), description: newCardDesc.trim() }]);
    setNewCardTitle('');
    setNewCardDesc('');
  };

  // Conditions Item Handlers
  const updateConditionItem = (index: number, field: keyof ConditionItemData, value: string) => {
    setConditions((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    }));
  };

  const deleteConditionItem = (index: number) => {
    setConditions((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const addConditionItem = () => {
    if (!newConditionName.trim()) return;
    setConditions((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: newConditionName.trim(),
          category: newConditionCategory.trim() || 'Genel'
        }
      ]
    }));
    setNewConditionName('');
    setNewConditionCategory('');
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus('idle');
    try {
      const parsedChecklist = checklistText.split('\n').map((s) => s.trim()).filter(Boolean);

      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hero: {
            badge,
            badgeSub,
            titlePrefix,
            titleHighlight,
            titleSuffix,
            description,
            quoteTitle,
            quoteText,
          },
          images: {
            heroImage,
          },
          featureCards,
          philosophy: {
            ...philosophy,
            checklist: parsedChecklist.length > 0 ? parsedChecklist : defaultPhilosophy.checklist,
          },
          conditions,
          homeSections,
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
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Anasayfa Yönetimi</h1>
          <p className="text-sm text-slate-500 mt-1">Hero alanı, Klinik Felsefemiz, Tedavi Alanları ve vitrin başlıklarını düzenleyin.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <FaSave />
          {saving ? 'Kaydediliyor...' : 'Tüm Değişiklikleri Kaydet'}
        </button>
      </div>

      {/* Status */}
      {status === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">
          ✓ Değişiklikler başarıyla kaydedildi ve anasayfaya yansıtıldı.
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
          ✗ {errorMsg}
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. HERO BÖLÜMÜ & GÖRSELLER */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-teal-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-600" />
          1. Hero &amp; Karşılama Bölümü
        </h2>

        {/* Hero Ana Fotoğrafı ve Sol Üst Vurgu Kartı */}
        <div className={cardClass}>
          <p className={sectionTitleClass}>Hero Karşılama Fotoğrafı &amp; Görsel Üzeri Vurgu Mesajı</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Fotoğraf Yükleme Alanı (Canlıdaki çerçeveye birebir uygun) */}
            <div className="lg:col-span-5">
              <ImageUploadZone
                label="Hero Ana Karşılama & Seans Fotoğrafı"
                description="Canlı sitenin en üst sağında yer alan büyük dikey çerçeve fotoğrafı."
                currentImage={heroImage}
                onImageUploaded={(url) => setHeroImage(url)}
                onImageRemoved={() => setHeroImage('')}
                aspectRatio="portrait"
              />
            </div>

            {/* Fotoğraf Üzerindeki Vurgu Kartı Yönetimi */}
            <div className="lg:col-span-7 space-y-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Fotoğrafın Sol Üstündeki Vurgu Kartı
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Canlı sitede fotoğrafın sol üst köşesine binen şık beyaz kartın başlık ve alıntı metnini buradan yönetebilirsiniz.
              </p>

              <div>
                <label className={labelClass}>Vurgu Kartı Başlığı (Yeşil Noktalı)</label>
                <input
                  className={inputClass}
                  value={quoteTitle}
                  onChange={(e) => setQuoteTitle(e.target.value)}
                  placeholder="Örn: Bütüncül Yaklaşım"
                />
              </div>

              <div>
                <label className={labelClass}>Vurgu Kartı Alıntı Mesajı</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={3}
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  placeholder='Örn: "Ağrı nerede olursa olsun, kaynak biyomekanik zincirin başka bir halkasında olabilir."'
                />
              </div>
            </div>

          </div>
        </div>

        {/* Hero Metinleri */}
        <div className={cardClass}>
          <p className={sectionTitleClass}>Hero Başlık ve Açıklamaları</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Üst Rozet Metni (Badge)</label>
              <input className={inputClass} value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Örn: Başakşehir Kliniği — İstanbul" />
            </div>
            <div>
              <label className={labelClass}>Rozet Alt Metin (Uzmanlık)</label>
              <input className={inputClass} value={badgeSub} onChange={(e) => setBadgeSub(e.target.value)} placeholder="Örn: Ortopedik Manuel Terapi & Klinik Fizyoterapi" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Başlık Ön Eki</label>
            <input className={inputClass} value={titlePrefix} onChange={(e) => setTitlePrefix(e.target.value)} placeholder="Örn: Bedeni bir bütün olarak dinliyor," />
          </div>
          <div>
            <label className={labelClass}>Ana Başlıktaki Yeşil Renkli Kelime / Vurgu</label>
            <input className={inputClass} value={titleHighlight} onChange={(e) => setTitleHighlight(e.target.value)} placeholder="Örn: ağrının gerçek kaynağını" />
          </div>
          <div>
            <label className={labelClass}>Başlık Son Eki</label>
            <input className={inputClass} value={titleSuffix} onChange={(e) => setTitleSuffix(e.target.value)} placeholder="Örn: çözüyoruz." />
          </div>
          <div>
            <label className={labelClass}>Hero Açıklama Paragrafı</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Hero bölümünde görünecek açıklama metni..."
            />
          </div>
        </div>

        {/* Feature Cards */}
        <div className={cardClass}>
          <p className={sectionTitleClass}>Hero Vitrin Kartları (Öne Çıkan 3 Madde)</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featureCards.map((card, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-700">Kart #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => deleteCard(index)}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
                  >
                    × Sil
                  </button>
                </div>
                <div>
                  <label className={labelClass}>Başlık</label>
                  <input
                    className={inputClass}
                    value={card.title}
                    onChange={(e) => updateCard(index, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Açıklama</label>
                  <textarea
                    className={`${inputClass} resize-none`}
                    rows={3}
                    value={card.description}
                    onChange={(e) => updateCard(index, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-teal-50/60 border border-teal-200/80 rounded-xl p-4 space-y-3 mt-4">
            <p className="text-xs font-bold text-teal-800">+ Yeni Vitrin Kartı Ekle</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Başlık</label>
                <input
                  className={inputClass}
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  placeholder="Örn: Birebir Seans"
                />
              </div>
              <div>
                <label className={labelClass}>Açıklama</label>
                <input
                  className={inputClass}
                  value={newCardDesc}
                  onChange={(e) => setNewCardDesc(e.target.value)}
                  placeholder="Örn: Her seansta kesintisiz 50–60 dk..."
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addCard}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all"
            >
              + Kartı Ekle
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. YÖNTEMLER & HİZMETLER VİTRİNİ BAŞLIKLARI */}
      {/* ======================================================== */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-base font-extrabold text-teal-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-600" />
          2. Yöntemler &amp; Hizmetler Vitrini Başlıkları
        </h2>

        <div className={cardClass}>
          <p className={sectionTitleClass}>Hizmetler Bölümü Tanıtım Başlıkları</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Bölüm Üst Rozeti</label>
              <input
                className={inputClass}
                value={homeSections.servicesBadge}
                onChange={(e) => setHomeSections({ ...homeSections, servicesBadge: e.target.value })}
                placeholder="Örn: YÖNTEMLER & UYGULAMALAR"
              />
            </div>
            <div>
              <label className={labelClass}>Bölüm Ana Başlığı</label>
              <input
                className={inputClass}
                value={homeSections.servicesTitle}
                onChange={(e) => setHomeSections({ ...homeSections, servicesTitle: e.target.value })}
                placeholder="Örn: Klinik Fizyoterapi & Manuel Terapi"
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Bölüm Alt Açıklaması</label>
            <input
              className={inputClass}
              value={homeSections.servicesSubtitle}
              onChange={(e) => setHomeSections({ ...homeSections, servicesSubtitle: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. KLİNİK FELSEFEMİZ BÖLÜMÜ */}
      {/* ======================================================== */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-base font-extrabold text-teal-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-600" />
          3. Klinik Felsefemiz Bölümü
        </h2>

        <div className={cardClass}>
          <p className={sectionTitleClass}>Felsefe Metinleri ve Açıklamalar</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Bölüm Üst Rozeti (Badge)</label>
              <input
                className={inputClass}
                value={philosophy.badge}
                onChange={(e) => setPhilosophy({ ...philosophy, badge: e.target.value })}
                placeholder="Örn: KLİNİK FELSEFEMİZ"
              />
            </div>
            <div>
              <label className={labelClass}>Fotoğraf Altı Unvan / Mezuniyet Notu</label>
              <input
                className={inputClass}
                value={philosophy.subNote}
                onChange={(e) => setPhilosophy({ ...philosophy, subNote: e.target.value })}
                placeholder="Örn: İstanbul Üniversitesi Fizik Tedavi & Rehabilitasyon"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Felsefe Ana Başlığı</label>
            <input
              className={inputClass}
              value={philosophy.title}
              onChange={(e) => setPhilosophy({ ...philosophy, title: e.target.value })}
              placeholder="Örn: Ağrıyı Değil, Ağrıyı Ortaya Çıkaran Mekanizmayı Tedavi Ediyoruz."
            />
          </div>

          <div>
            <label className={labelClass}>1. Paragraf Açıklaması</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={4}
              value={philosophy.p1}
              onChange={(e) => setPhilosophy({ ...philosophy, p1: e.target.value })}
            />
          </div>

          <div>
            <label className={labelClass}>2. Paragraf Açıklaması</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={4}
              value={philosophy.p2}
              onChange={(e) => setPhilosophy({ ...philosophy, p2: e.target.value })}
            />
          </div>

          <div>
            <label className={labelClass}>4'lü Onay Maddeleri (Checklist)</label>
            <p className="text-[11px] text-slate-400 mb-2">Her satıra bir onay maddesi yazınız (yeşil onay ikonlarıyla görünür).</p>
            <textarea
              className={`${inputClass} resize-none font-mono text-xs`}
              rows={5}
              value={checklistText}
              onChange={(e) => setChecklistText(e.target.value)}
              placeholder="Kişiye özel birebir 50-60 dk seans&#10;Bilimsel ve kanıta dayalı manuel terapi"
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. KLİNİK TEDAVİ ALANLARIMIZ BÖLÜMÜ */}
      {/* ======================================================== */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-base font-extrabold text-teal-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-600" />
          4. Klinik Tedavi Alanlarımız &amp; Rahatsızlıklar
        </h2>

        {/* Başlık ve Sol Kolon Alıntı Kutusu */}
        <div className={cardClass}>
          <p className={sectionTitleClass}>Bölüm Başlıkları &amp; Sol Kolon Vurgu Kartı</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Bölüm Üst Rozeti</label>
              <input
                className={inputClass}
                value={conditions.badge}
                onChange={(e) => setConditions({ ...conditions, badge: e.target.value })}
                placeholder="Örn: Klinik Tedavi Alanlarımız"
              />
            </div>
            <div>
              <label className={labelClass}>Bölüm Ana Başlığı</label>
              <input
                className={inputClass}
                value={conditions.title}
                onChange={(e) => setConditions({ ...conditions, title: e.target.value })}
                placeholder="Örn: Sık Karşılaştığımız Rahatsızlıklar & Çözümler"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Bölüm Alt Açıklaması</label>
            <input
              className={inputClass}
              value={conditions.subtitle}
              onChange={(e) => setConditions({ ...conditions, subtitle: e.target.value })}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <span className="text-xs font-bold text-slate-700 uppercase">Sol Kolondaki Koyu Renkli Vurgu Kartı</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Kart Üst Rozeti</label>
                <input
                  className={inputClass}
                  value={conditions.cardBadge}
                  onChange={(e) => setConditions({ ...conditions, cardBadge: e.target.value })}
                  placeholder="Örn: Bütüncül Manuel Terapi"
                />
              </div>
              <div>
                <label className={labelClass}>Kart Ana Başlığı</label>
                <input
                  className={inputClass}
                  value={conditions.cardTitle}
                  onChange={(e) => setConditions({ ...conditions, cardTitle: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Kart Paragraf Açıklaması</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={3}
                value={conditions.cardDesc}
                onChange={(e) => setConditions({ ...conditions, cardDesc: e.target.value })}
              />
            </div>

            <div>
              <label className={labelClass}>Alıntı Metni (Tırnak İçinde)</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={3}
                value={conditions.quote}
                onChange={(e) => setConditions({ ...conditions, quote: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Alıntı Sahibi</label>
                <input
                  className={inputClass}
                  value={conditions.quoteAuthor}
                  onChange={(e) => setConditions({ ...conditions, quoteAuthor: e.target.value })}
                  placeholder="Örn: Fzt. Şilan Kartal"
                />
              </div>
              <div>
                <label className={labelClass}>Alıntı Sahibi Unvanı</label>
                <input
                  className={inputClass}
                  value={conditions.quoteRole}
                  onChange={(e) => setConditions({ ...conditions, quoteRole: e.target.value })}
                  placeholder="Örn: Klinik Direktörü"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Alt Bilgilendirme Notu (*)</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={2}
                value={conditions.bottomNote}
                onChange={(e) => setConditions({ ...conditions, bottomNote: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* 12 Tedavi Edilen Rahatsızlık Kartları Grid Yönetimi */}
        <div className={cardClass}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Tedavi Edilen Rahatsızlıklar Listesi ({conditions.items.length})
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {conditions.items.map((item, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-teal-700">#{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => deleteConditionItem(index)}
                    className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors"
                  >
                    <FaTrash size={10} />
                  </button>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Kategori</label>
                  <input
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-teal-800 focus:outline-none focus:border-teal-500"
                    value={item.category}
                    onChange={(e) => updateConditionItem(index, 'category', e.target.value)}
                    placeholder="Örn: Omurga"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Rahatsızlık Adı</label>
                  <input
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 font-medium focus:outline-none focus:border-teal-500"
                    value={item.name}
                    onChange={(e) => updateConditionItem(index, 'name', e.target.value)}
                    placeholder="Örn: Bel Fıtığı"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Yeni Rahatsızlık Ekle */}
          <div className="bg-teal-50/60 border border-teal-200/80 rounded-xl p-4 space-y-3 mt-4">
            <p className="text-xs font-bold text-teal-800">+ Yeni Rahatsızlık Kartı Ekle</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Kategori</label>
                <input
                  className={inputClass}
                  value={newConditionCategory}
                  onChange={(e) => setNewConditionCategory(e.target.value)}
                  placeholder="Örn: Eklem, Omurga, Nörolojik..."
                />
              </div>
              <div>
                <label className={labelClass}>Rahatsızlık Adı</label>
                <input
                  className={inputClass}
                  value={newConditionName}
                  onChange={(e) => setNewConditionName(e.target.value)}
                  placeholder="Örn: Boyun Fıtığı (Servikal Disk Hernisi)"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addConditionItem}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all"
            >
              <FaPlus size={11} /> Rahatsızlığı Listeye Ekle
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. BLOG VİTRİNİ & HARİTA / LOKASYON BÖLÜMÜ */}
      {/* ======================================================== */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-base font-extrabold text-teal-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-600" />
          5. Blog Vitrini ve Harita / Lokasyon Başlıkları
        </h2>

        {/* Blog Vitrini Başlıkları */}
        <div className={cardClass}>
          <p className={sectionTitleClass}>Blog / Bilgi Merkezi Vitrin Başlıkları</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Bölüm Üst Rozeti</label>
              <input
                className={inputClass}
                value={homeSections.blogBadge}
                onChange={(e) => setHomeSections({ ...homeSections, blogBadge: e.target.value })}
                placeholder="Örn: BİLGİ MERKEZİ"
              />
            </div>
            <div>
              <label className={labelClass}>Bölüm Ana Başlığı</label>
              <input
                className={inputClass}
                value={homeSections.blogTitle}
                onChange={(e) => setHomeSections({ ...homeSections, blogTitle: e.target.value })}
                placeholder="Örn: Son Eklenen Sağlık Makaleleri"
              />
            </div>
            <div>
              <label className={labelClass}>Buton Metni</label>
              <input
                className={inputClass}
                value={homeSections.blogButtonText}
                onChange={(e) => setHomeSections({ ...homeSections, blogButtonText: e.target.value })}
                placeholder="Örn: Tüm Yazıları Gör"
              />
            </div>
          </div>
        </div>

        {/* Harita & Lokasyon Başlıkları */}
        <div className={cardClass}>
          <p className={sectionTitleClass}>Harita &amp; Randevu Kutusu Başlıkları</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Bölüm Üst Rozeti</label>
              <input
                className={inputClass}
                value={homeSections.locationBadge}
                onChange={(e) => setHomeSections({ ...homeSections, locationBadge: e.target.value })}
                placeholder="Örn: LOKASYON & RANDEVU"
              />
            </div>
            <div>
              <label className={labelClass}>Pazar Günü Durum Metni</label>
              <input
                className={inputClass}
                value={homeSections.sundayText}
                onChange={(e) => setHomeSections({ ...homeSections, sundayText: e.target.value })}
                placeholder="Örn: Açık (08:00 - 22:00)"
              />
            </div>
            <div>
              <label className={labelClass}>İletişim Butonu Metni</label>
              <input
                className={inputClass}
                value={homeSections.locationButtonText}
                onChange={(e) => setHomeSections({ ...homeSections, locationButtonText: e.target.value })}
                placeholder="Örn: İletişime Geç"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sayfa Altı Kaydet Butonu */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <FaSave />
          {saving ? 'Kaydediliyor...' : 'Tüm Değişiklikleri Kaydet'}
        </button>
      </div>
    </div>
  );
}
