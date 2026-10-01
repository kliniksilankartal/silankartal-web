'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaPhone, FaMapMarkerAlt, FaEnvelope, FaClock, FaWhatsapp } from 'react-icons/fa';
import { ContactPageData, defaultContactPageData } from '@/lib/content-types';

export default function IletisimAdminPage() {
  // 1. Sol Form Başlıkları
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // 2. Sağ Bilgi Kartları
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [whatsappText, setWhatsappText] = useState('');
  const [email, setEmail] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [sundayNote, setSundayNote] = useState('');

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => r.json())
      .then((data) => {
        // Form Başlıkları
        setFormTitle(data.contactPage?.formTitle || defaultContactPageData.formTitle);
        setFormSubtitle(data.contactPage?.formSubtitle || data.header?.clinicName || defaultContactPageData.formSubtitle);
        setFormDescription(data.contactPage?.formDescription || defaultContactPageData.formDescription);

        // Sağ Kolon Bilgileri
        setAddress(data.general?.address || '');
        setAddressDetail(data.contactPage?.addressDetail || defaultContactPageData.addressDetail);
        setPhone(data.general?.phone || '');
        setWhatsapp(data.general?.whatsapp || '');
        setWhatsappText(data.contactPage?.whatsappText || defaultContactPageData.whatsappText);
        setEmail(data.general?.email || '');
        setWorkingHours(data.general?.workingHours || '');
        setSundayNote(data.contactPage?.sundayNote || defaultContactPageData.sundayNote);
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
          general: {
            address,
            phone,
            whatsapp,
            email,
            workingHours,
          },
          contactPage: {
            formTitle,
            formSubtitle,
            formDescription,
            addressDetail,
            whatsappText,
            sundayNote,
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
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">İletişim Sayfası Yönetimi</h1>
          <p className="text-sm text-slate-500 mt-1">
            İletişim sayfasındaki form başlıklarını ve sağdaki iletişim bilgi kartlarını düzenleyin.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <FaSave />
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>

      {/* Status */}
      {status === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">
          ✓ İletişim bilgileri ve form başlıkları başarıyla kaydedildi.
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
          ✗ {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ======================================================== */}
        {/* 1. SOL TARAF: İLETİŞİM FORMU BAŞLIKLARI */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          <div className={cardClass}>
            <p className={sectionTitleClass}>Sol Kolon: Form Başlıkları</p>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Ziyaretçilerin gördüğü iletişim formunun başlık ve yönlendirme metinlerini buradan güncelleyebilirsiniz.
            </p>

            <div>
              <label className={labelClass}>Form Ana Başlığı</label>
              <input
                className={inputClass}
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Örn: İletişim ve Danışma Formu"
              />
            </div>

            <div>
              <label className={labelClass}>Form Alt Başlığı / Klinik Ünvanı</label>
              <input
                className={inputClass}
                value={formSubtitle}
                onChange={(e) => setFormSubtitle(e.target.value)}
                placeholder="Örn: Özel Sağlık Meslek Hizmet Birimi"
              />
            </div>

            <div>
              <label className={labelClass}>Form Açıklama / Yönlendirme Metni</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={4}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Örn: Lütfen şikayetinizi ve uygun olduğunuz gün/saat aralığını belirtiniz..."
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. SAĞ TARAF: İLETİŞİM BİLGİ KARTLARI */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          <div className={cardClass}>
            <p className={sectionTitleClass}>Sağ Kolon: İletişim Bilgi Kartları</p>

            {/* Adres & Kat Notu */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
                <FaMapMarkerAlt className="text-teal-600" />
                <span>1. Klinik Adresi Kartı</span>
              </div>
              <div>
                <label className={labelClass}>Tam Açık Adres</label>
                <input
                  className={inputClass}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Necmettin Erbakan Caddesi, Ebik İş Merkezi, Kat: 2, Daire: 10, Başakşehir / İstanbul"
                />
              </div>
              <div>
                <label className={labelClass}>Adres Alt Detay / Kat Notu (Yeşil Yazı)</label>
                <input
                  className={inputClass}
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  placeholder="Örn: Ebik İş Merkezi Kat: 2 Daire: 10"
                />
              </div>
            </div>

            {/* Telefon & WhatsApp */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
                <FaPhone className="text-teal-600" />
                <span>2. Telefon &amp; WhatsApp Kartı</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Görünen Telefon Numarası</label>
                  <input
                    className={inputClass}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Örn: 0545 190 10 60"
                  />
                </div>
                <div>
                  <label className={labelClass}>WhatsApp Numarası (Ülke Kodlu)</label>
                  <input
                    className={inputClass}
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Örn: +905451901060"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>WhatsApp Buton / Link Metni</label>
                <input
                  className={inputClass}
                  value={whatsappText}
                  onChange={(e) => setWhatsappText(e.target.value)}
                  placeholder="Örn: WhatsApp üzerinden mesaj gönderin"
                />
              </div>
            </div>

            {/* E-posta */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
                <FaEnvelope className="text-teal-600" />
                <span>3. E-posta Kartı</span>
              </div>
              <div>
                <label className={labelClass}>Klinik E-posta Adresi</label>
                <input
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Örn: info@silankartal.com.tr"
                />
              </div>
            </div>

            {/* Çalışma Saatleri */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
                <FaClock className="text-teal-600" />
                <span>4. Çalışma Saatleri Kartı</span>
              </div>
              <div>
                <label className={labelClass}>Çalışma Saatleri Metni</label>
                <input
                  className={inputClass}
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="Örn: Her gün: 08:00 - 22:00"
                />
              </div>
              <div>
                <label className={labelClass}>Pazar Günü / Çalışma Notu (Yeşil Yazı)</label>
                <input
                  className={inputClass}
                  value={sundayNote}
                  onChange={(e) => setSundayNote(e.target.value)}
                  placeholder="Örn: Pazar günleri de dahil olmak üzere haftanın her günü açığız."
                />
              </div>
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
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>
    </div>
  );
}
