'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaPlus } from 'react-icons/fa';
import ImageUploadZone from '@/components/admin/ImageUploadZone';

interface Service {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  detailedDescription: string;
  image: string;
  benefits: string[];
}

function slugify(text: string): string {
  const turkishMap: Record<string, string> = {
    ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', İ: 'i',
    ö: 'o', Ö: 'o', ş: 's', Ş: 's', ü: 'u', Ü: 'u',
  };
  return text
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (match) => turkishMap[match] || match)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const emptyService = (): Service => ({
  slug: '',
  title: '',
  category: '',
  shortDescription: '',
  detailedDescription: '',
  image: '',
  benefits: [],
});

function ServiceCard({
  service,
  index,
  onChange,
  onDelete,
  onSaveIndividual,
}: {
  service: Service;
  index: number;
  onChange: (index: number, updated: Service) => void;
  onDelete: (index: number) => void;
  onSaveIndividual: (index: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const update = (field: keyof Service, value: string | string[]) => {
    const updated = { ...service, [field]: value };
    if (field === 'title') {
      updated.slug = slugify(value as string);
    }
    onChange(index, updated);
  };

  const inputClass =
    'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all';
  const labelClass = 'block text-xs font-semibold text-slate-600 mb-1';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm flex-shrink-0">
            {index + 1}
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">{service.title || <span className="text-slate-400">İsimsiz Hizmet</span>}</p>
            <p className="text-xs text-slate-500">{service.category || 'Kategori yok'} · <span className="font-mono text-teal-600">{service.slug || '—'}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSaveIndividual(index);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer"
          >
            <FaSave className="text-xs" />
            Kaydet
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Bu hizmeti silmek istediğinize emin misiniz?')) {
                onDelete(index);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-all border border-red-200 cursor-pointer"
          >
            Sil
          </button>
          <span className="text-xs text-slate-400 ml-1">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Hizmet Adı *</label>
              <input
                className={inputClass}
                value={service.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Örn: Manuel Terapi"
              />
            </div>
            <div>
              <label className={labelClass}>Kategori</label>
              <input
                className={inputClass}
                value={service.category}
                onChange={(e) => update('category', e.target.value)}
                placeholder="Örn: Terapi"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Slug (otomatik)</label>
            <input
              className={`${inputClass} font-mono text-teal-700 bg-teal-50 border-teal-200`}
              value={service.slug}
              onChange={(e) => update('slug', e.target.value)}
              placeholder="manuel-terapi"
            />
          </div>

          <div>
            <label className={labelClass}>Kısa Açıklama</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={2}
              value={service.shortDescription}
              onChange={(e) => update('shortDescription', e.target.value)}
              placeholder="Hizmetin kısa tanımı..."
            />
          </div>

          <div>
            <label className={labelClass}>Detaylı Açıklama</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={5}
              value={service.detailedDescription}
              onChange={(e) => update('detailedDescription', e.target.value)}
              placeholder="Hizmetin detaylı açıklaması..."
            />
          </div>

          {/* Sürükle Bırak / Cihazdan Görsel Seç (URL kutusu kaldırıldı) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <ImageUploadZone
              label="Hizmet Kapak Fotoğrafı"
              description="Hizmet kartında ve detay sayfasında görünecek seans/tedavi fotoğrafını sürükleyip bırakın veya cihazınızdan seçin."
              currentImage={service.image}
              onImageUploaded={(url) => update('image', url)}
              onImageRemoved={() => update('image', '')}
              aspectRatio="video"
            />
          </div>

          <div>
            <label className={labelClass}>Hangi Durumlarda Tercih Edilir? (Her satıra bir fayda yazın)</label>
            <textarea
              className={`${inputClass} resize-none font-mono text-xs`}
              rows={4}
              value={service.benefits.join('\n')}
              onChange={(e) =>
                update(
                  'benefits',
                  e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                )
              }
              placeholder="Akut ve kronik bel tutulması&#10;Boyun düzleşmesi&#10;Donuk omuz sendromu"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => onSaveIndividual(index)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <FaSave />
              Bu Hizmeti Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HizmetlerAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState<Service>(emptyService());
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => r.json())
      .then((data) => {
        setServices(data.services ?? []);
      })
      .catch(() => {});
  }, []);

  const handleChange = (index: number, updated: Service) => {
    setServices((prev) => prev.map((s, i) => (i === index ? updated : s)));
  };

  const handleDelete = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setStatus('idle');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services }),
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

  const handleSaveIndividual = async (index: number) => {
    setSaving(true);
    setStatus('idle');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services }),
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

  const updateNew = (field: keyof Service, value: string | string[]) => {
    const updated = { ...newService, [field]: value };
    if (field === 'title') {
      updated.slug = slugify(value as string);
    }
    setNewService(updated);
  };

  const handleAddService = () => {
    if (!newService.title.trim()) {
      alert('Lütfen hizmet adı girin');
      return;
    }
    const serviceToAdd = {
      ...newService,
      slug: newService.slug || slugify(newService.title),
    };
    setServices((prev) => [...prev, serviceToAdd]);
    setNewService(emptyService());
    setShowAddForm(false);
  };

  const inputClass =
    'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all';
  const labelClass = 'block text-xs font-semibold text-slate-600 mb-1';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Hizmetler Yönetimi</h1>
          <p className="text-sm text-slate-500 mt-1">Klinik hizmetlerini, detaylarını ve fotoğraflarını düzenleyin.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <FaPlus size={10} />
            Yeni Hizmet
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <FaSave />
            {saving ? 'Kaydediliyor...' : 'Tümünü Kaydet'}
          </button>
        </div>
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

      {/* Add New Service Form */}
      {showAddForm && (
        <div className="bg-white border-2 border-teal-600 rounded-2xl p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-teal-800 uppercase tracking-wider">+ Yeni Hizmet Ekle</h2>
            <button
              onClick={() => { setShowAddForm(false); setNewService(emptyService()); }}
              className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              × İptal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Hizmet Adı *</label>
              <input
                className={inputClass}
                value={newService.title}
                onChange={(e) => updateNew('title', e.target.value)}
                placeholder="Örn: Manuel Terapi"
              />
            </div>
            <div>
              <label className={labelClass}>Kategori</label>
              <input
                className={inputClass}
                value={newService.category}
                onChange={(e) => updateNew('category', e.target.value)}
                placeholder="Örn: Terapi"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Slug (otomatik oluşturulur)</label>
            <input
              className={`${inputClass} font-mono text-teal-700`}
              value={newService.slug}
              readOnly
              placeholder="slug-otomatik-olusturulur"
            />
          </div>

          <div>
            <label className={labelClass}>Kısa Açıklama</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={2}
              value={newService.shortDescription}
              onChange={(e) => updateNew('shortDescription', e.target.value)}
              placeholder="Kısa tanım..."
            />
          </div>

          <div>
            <label className={labelClass}>Detaylı Açıklama</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={4}
              value={newService.detailedDescription}
              onChange={(e) => updateNew('detailedDescription', e.target.value)}
              placeholder="Detaylı açıklama..."
            />
          </div>

          {/* Yeni Hizmet İçin Sürükle - Bırak Görsel */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <ImageUploadZone
              label="Hizmet Fotoğrafı (Sürükle - Bırak veya Seç)"
              description="Hizmet için cihazınızdan fotoğraf seçin veya sürükleyip bırakın."
              currentImage={newService.image}
              onImageUploaded={(url) => updateNew('image', url)}
              onImageRemoved={() => updateNew('image', '')}
              aspectRatio="video"
            />
          </div>

          <div>
            <label className={labelClass}>Hangi Durumlarda Tercih Edilir? (Her satıra bir tane)</label>
            <textarea
              className={`${inputClass} resize-none font-mono text-xs`}
              rows={3}
              value={newService.benefits.join('\n')}
              onChange={(e) =>
                updateNew(
                  'benefits',
                  e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                )
              }
              placeholder="Akut ve kronik bel tutulması&#10;Boyun düzleşmesi"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => { setShowAddForm(false); setNewService(emptyService()); }}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              İptal
            </button>
            <button
              onClick={handleAddService}
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Hizmeti Ekle
            </button>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-4">
        {services.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
            Henüz hizmet eklenmemiş. Yukarıdaki "Yeni Hizmet" butonunu kullanarak ekleyebilirsiniz.
          </div>
        ) : (
          services.map((service, index) => (
            <ServiceCard
              key={service.slug || index}
              service={service}
              index={index}
              onChange={handleChange}
              onDelete={handleDelete}
              onSaveIndividual={handleSaveIndividual}
            />
          ))
        )}
      </div>

      {/* Bottom Save */}
      {services.length > 0 && (
        <div className="flex justify-end pb-8">
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <FaSave />
            {saving ? 'Kaydediliyor...' : 'Tüm Değişiklikleri Kaydet'}
          </button>
        </div>
      )}
    </div>
  );
}
