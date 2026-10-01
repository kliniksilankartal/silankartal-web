'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaMagic, FaCheck, FaPalette, FaUndo } from 'react-icons/fa';
import { CustomColors, defaultCustomColors } from '@/lib/content-types';

// HEX -> RGB dönüştürücü
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// RGB -> HEX dönüştürücü
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// Bir renkten açık soft ton üretme (İkincil / Secondary için)
function generateSoftTone(hex: string): string {
  try {
    const { r, g, b } = hexToRgb(hex);
    // Beyaza doğru %88-92 oranında karıştır
    const factor = 0.90;
    const newR = r + (255 - r) * factor;
    const newG = g + (255 - g) * factor;
    const newB = b + (255 - b) * factor;
    return rgbToHex(newR, newG, newB);
  } catch {
    return '#EBF5F3';
  }
}

// Bir renkten koyu derin ton üretme (Dördüncül / Dark için)
function generateDarkTone(hex: string): string {
  try {
    const { r, g, b } = hexToRgb(hex);
    // Siyaha doğru %80-85 oranında koyulaştır
    const factor = 0.18;
    const newR = r * factor;
    const newG = g * factor;
    const newB = b * factor;
    return rgbToHex(newR, newG, newB);
  } catch {
    return '#192624';
  }
}

// Bir renkten canlı tamamlayıcı vurgu tonu üretme (Üçüncül / Accent için)
function generateAccentTone(hex: string): string {
  try {
    const { r, g, b } = hexToRgb(hex);
    // Doygunluğu artırıp yeşil/turkuaz kanalına canlılık kat
    const newR = Math.max(0, Math.min(255, r * 0.7));
    const newG = Math.max(0, Math.min(255, g * 1.35 + 25));
    const newB = Math.max(0, Math.min(255, b * 0.9));
    return rgbToHex(newR, newG, newB);
  } catch {
    return '#0D9488';
  }
}

// Hazır Önerilen Klinik Paletleri
const PRESET_PALETTES = [
  {
    name: 'Klinik Zümrüt (Orijinal)',
    desc: 'Huzurlu, medikal ve güven veren klasik yeşil tonu',
    colors: {
      primary: '#155E54',
      secondary: '#EBF5F3',
      accent: '#0D9488',
      dark: '#192624',
    }
  },
  {
    name: 'Safir & Okyanus Mavisi',
    desc: 'Modern tıp, teknoloji ve klinik güven hissi veren mavi tonları',
    colors: {
      primary: '#0369A1',
      secondary: '#E0F2FE',
      accent: '#0284C7',
      dark: '#0C2D48',
    }
  },
  {
    name: 'Doğal Sage & Adaçayı',
    desc: 'Bütüncül fizyoterapi, doğallık ve sakinleştirici etki',
    colors: {
      primary: '#2E6F5E',
      secondary: '#EFF6F3',
      accent: '#10B981',
      dark: '#143029',
    }
  },
  {
    name: 'Sıcak Terracotta & Toprak',
    desc: 'Dinamik, sıcak, manuel terapi odaklı enerjik tonlar',
    colors: {
      primary: '#B45309',
      secondary: '#FEF3C7',
      accent: '#D97706',
      dark: '#2E1A0A',
    }
  },
  {
    name: 'Modern Antrasit & Slate',
    desc: 'Minimalist, sade ve lüks klinik çizgisi',
    colors: {
      primary: '#334155',
      secondary: '#F1F5F9',
      accent: '#475569',
      dark: '#0F172A',
    }
  },
];

export default function TemaAdminPage() {
  const [colors, setColors] = useState<CustomColors>(defaultCustomColors);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [activePaletteIndex, setActivePaletteIndex] = useState<number | null>(0);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => r.json())
      .then((data) => {
        if (data.customColors) {
          setColors({
            ...defaultCustomColors,
            ...data.customColors,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Tek tıkla otomatik renk üretme
  const handleAutoGenerate = () => {
    const primary = colors.primary;
    const secondary = generateSoftTone(primary);
    const accent = generateAccentTone(primary);
    const dark = generateDarkTone(primary);

    setColors({
      primary,
      secondary,
      accent,
      dark,
    });
    setActivePaletteIndex(null);
  };

  const handleColorChange = (key: keyof CustomColors, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
    setActivePaletteIndex(null);
  };

  const handleApplyPreset = (index: number) => {
    const preset = PRESET_PALETTES[index];
    setColors(preset.colors);
    setActivePaletteIndex(index);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus('idle');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customColors: colors,
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

  const cardClass = 'bg-white border border-slate-200 rounded-2xl p-6 space-y-4';
  const sectionTitleClass =
    'text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Renk &amp; Tema Yönetimi</h1>
          <p className="text-sm text-slate-500 mt-1">
            Renk çemberinden seçin, HEX #kod girin veya tek renkten otomatik uyumlu palet üretin.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <FaSave />
          {saving ? 'Kaydediliyor...' : 'Renkleri Kaydet'}
        </button>
      </div>

      {/* Status */}
      {status === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">
          ✓ Renk paleti başarıyla kaydedildi ve tüm siteye yansıtıldı.
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
          ✗ {errorMsg}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4 RENK SEÇİCİ VE OTOMATİK OLUŞTURMA */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sol Kolon: Renk Ayarları */}
        <div className="lg:col-span-7 space-y-6">
          <div className={cardClass}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Özel Renk Paleti (Çember &amp; #KOD)
              </span>
              <button
                type="button"
                onClick={handleAutoGenerate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-lg border border-teal-200 transition-all cursor-pointer shadow-2xs"
                title="Birincil renge göre diğer 3 rengi otomatik olarak oluşturur"
              >
                <FaMagic size={11} className="text-teal-600" />
                <span>Uyumlu Renkleri Otomatik Üret</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Kare renk kutularına tıklayarak <strong>renk çemberinden / damlalıktan</strong> seçim yapabilir veya yanındaki kutuya doğrudan <strong>#HEX kodunu</strong> (örn: #155E54) yazabilirsiniz.
            </p>

            <div className="space-y-4">
              {/* 1. Birincil Renk */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={colors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-11 h-11 rounded-xl border-2 border-white shadow-sm cursor-pointer p-0 bg-transparent block"
                      style={{ WebkitAppearance: 'none' }}
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      1. Birincil Renk (Primary)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Ana butonlar, marka kimliği, linkler ve vurgu başlıkları
                    </span>
                  </div>
                </div>

                <div className="w-28 shrink-0">
                  <input
                    type="text"
                    value={colors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    placeholder="#155E54"
                    maxLength={7}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 uppercase focus:outline-none focus:border-teal-500 text-center"
                  />
                </div>
              </div>

              {/* 2. İkincil Renk */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={colors.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="w-11 h-11 rounded-xl border-2 border-white shadow-sm cursor-pointer p-0 bg-transparent block"
                      style={{ WebkitAppearance: 'none' }}
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      2. İkincil Renk (Secondary / Soft)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Açık rozet kutuları, yumuşak zeminler ve kart çerçeveleri
                    </span>
                  </div>
                </div>

                <div className="w-28 shrink-0">
                  <input
                    type="text"
                    value={colors.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    placeholder="#EBF5F3"
                    maxLength={7}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 uppercase focus:outline-none focus:border-teal-500 text-center"
                  />
                </div>
              </div>

              {/* 3. Üçüncül Renk */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={colors.accent}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      className="w-11 h-11 rounded-xl border-2 border-white shadow-sm cursor-pointer p-0 bg-transparent block"
                      style={{ WebkitAppearance: 'none' }}
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      3. Üçüncül Renk (Accent / Canlı)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Canlı ikonlar, dikkat çekici etiketler ve özel detaylar
                    </span>
                  </div>
                </div>

                <div className="w-28 shrink-0">
                  <input
                    type="text"
                    value={colors.accent}
                    onChange={(e) => handleColorChange('accent', e.target.value)}
                    placeholder="#0D9488"
                    maxLength={7}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 uppercase focus:outline-none focus:border-teal-500 text-center"
                  />
                </div>
              </div>

              {/* 4. Dördüncül Renk */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={colors.dark}
                      onChange={(e) => handleColorChange('dark', e.target.value)}
                      className="w-11 h-11 rounded-xl border-2 border-white shadow-sm cursor-pointer p-0 bg-transparent block"
                      style={{ WebkitAppearance: 'none' }}
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      4. Dördüncül Renk (Dark / Koyu Ton)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Koyu başlıklar, derin zeminli kartlar ve footer tonu
                    </span>
                  </div>
                </div>

                <div className="w-28 shrink-0">
                  <input
                    type="text"
                    value={colors.dark}
                    onChange={(e) => handleColorChange('dark', e.target.value)}
                    placeholder="#192624"
                    maxLength={7}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 uppercase focus:outline-none focus:border-teal-500 text-center"
                  />
                </div>
              </div>
            </div>

            {/* Sıfırla Butonu */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setColors(defaultCustomColors)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 font-medium transition-colors"
              >
                <FaUndo size={10} />
                <span>Orijinal Klinik Renklerine Dön</span>
              </button>
            </div>
          </div>

          {/* Hazır Klinik Paletleri */}
          <div className={cardClass}>
            <p className={sectionTitleClass}>Tavsiye Edilen Hazır Klinik Paletleri</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESET_PALETTES.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handleApplyPreset(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    activePaletteIndex === idx
                      ? 'border-teal-600 bg-teal-50/50 shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">{preset.name}</span>
                    {activePaletteIndex === idx && (
                      <span className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center text-[9px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1.5 mb-2">
                    <div className="w-6 h-6 rounded-md shadow-2xs" style={{ backgroundColor: preset.colors.primary }} />
                    <div className="w-6 h-6 rounded-md shadow-2xs" style={{ backgroundColor: preset.colors.secondary }} />
                    <div className="w-6 h-6 rounded-md shadow-2xs" style={{ backgroundColor: preset.colors.accent }} />
                    <div className="w-6 h-6 rounded-md shadow-2xs" style={{ backgroundColor: preset.colors.dark }} />
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">{preset.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sağ Kolon: Canlı Önizleme Simülatörü */}
        <div className="lg:col-span-5 sticky top-28 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FaPalette className="text-teal-600" />
                Canlı Önizleme
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Anlık Renk Testi
              </span>
            </div>

            {/* Simülasyon Kartı */}
            <div className="p-5 rounded-2xl border border-slate-100 space-y-4 bg-slate-50/50">
              {/* Rozet */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.primary,
                }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.primary }} />
                <span>BAŞAKŞEHİR KLİNİĞİ</span>
              </div>

              {/* Başlık */}
              <h3 className="text-lg font-black leading-snug" style={{ color: colors.dark }}>
                Bedeni bir bütün olarak dinliyor,{' '}
                <span style={{ color: colors.primary }} className="underline decoration-2 underline-offset-4">
                  ağrının gerçek kaynağını
                </span>{' '}
                çözüyoruz.
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                Omurga ve fıtık rahatsızlıklarında semptomları baskılamak yerine biyomekanik dengeyi restore ediyoruz.
              </p>

              {/* Butonlar */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  className="px-4 py-2 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  style={{ backgroundColor: colors.primary }}
                >
                  İletişime Geç (Primary)
                </button>
                <div
                  className="px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5"
                  style={{ backgroundColor: colors.secondary, color: colors.primary }}
                >
                  <FaCheck size={10} style={{ color: colors.accent }} />
                  <span>50-60 Dk Seans</span>
                </div>
              </div>

              {/* Koyu Vurgu Kartı Simülasyonu */}
              <div
                className="p-4 rounded-xl text-white space-y-2 mt-3 shadow-md"
                style={{ backgroundColor: colors.dark }}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: colors.accent }}>
                  Bütüncül Manuel Terapi
                </span>
                <p className="text-xs font-semibold leading-relaxed">
                  "Ağrı nerede olursa olsun, kaynak biyomekanik zincirin başka bir halkasında olabilir."
                </p>
                <div className="text-[10px] text-slate-300 pt-1 border-t border-white/10 flex justify-between">
                  <span>Fzt. Şilan Kartal</span>
                  <span style={{ color: colors.secondary }}>Klinik Direktörü</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Bu önizleme, renkler kaydedildiğinde canlı sitenizdeki butonların, kartların ve rozetlerin nasıl görüneceğini simüle eder.
            </p>
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
          {saving ? 'Kaydediliyor...' : 'Renkleri Kaydet ve Yayınla'}
        </button>
      </div>
    </div>
  );
}
