'use client';

import { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';

interface FaqItem {
  question: string;
  answer: string;
}

export default function SssAdminPage() {
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => r.json())
      .then((data) => {
        setFaq(data.faq ?? []);
      })
      .catch(() => {});
  }, []);

  const updateFaq = (index: number, field: keyof FaqItem, value: string) => {
    setFaq((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const deleteFaq = (index: number) => {
    setFaq((prev) => prev.filter((_, i) => i !== index));
  };

  const addFaq = () => {
    if (!newQuestion.trim()) return;
    setFaq((prev) => [...prev, { question: newQuestion.trim(), answer: newAnswer.trim() }]);
    setNewQuestion('');
    setNewAnswer('');
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus('idle');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faq }),
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
          <h1 className="text-2xl font-extrabold text-slate-900">SSS Yönetimi</h1>
          <p className="text-sm text-slate-500 mt-1">Sık sorulan soruları ekleyin, düzenleyin veya silin.</p>
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
          ✓ Değişiklikler başarıyla kaydedildi.
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
          ✗ {errorMsg}
        </div>
      )}

      {/* FAQ List */}
      <div className={cardClass}>
        <p className={sectionTitleClass}>Mevcut Sorular ({faq.length})</p>

        {faq.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">Henüz soru eklenmemiş.</p>
        ) : (
          <div className="space-y-4">
            {faq.map((item, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-700">Soru #{index + 1}</span>
                  <button
                    onClick={() => deleteFaq(index)}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
                  >
                    × Sil
                  </button>
                </div>
                <div>
                  <label className={labelClass}>Soru</label>
                  <input
                    className={inputClass}
                    value={item.question}
                    onChange={(e) => updateFaq(index, 'question', e.target.value)}
                    placeholder="Soru metni..."
                  />
                </div>
                <div>
                  <label className={labelClass}>Cevap</label>
                  <textarea
                    className={`${inputClass} resize-none`}
                    rows={4}
                    value={item.answer}
                    onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                    placeholder="Cevap metni..."
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New FAQ */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 space-y-4">
        <p className={sectionTitleClass.replace('border-slate-100', 'border-teal-100')}>+ Yeni Soru Ekle</p>
        <div>
          <label className={labelClass}>Yeni Soru</label>
          <input
            className={inputClass}
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Sık sorulan soru..."
          />
        </div>
        <div>
          <label className={labelClass}>Cevap</label>
          <textarea
            className={`${inputClass} resize-none`}
            rows={4}
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Bu sorunun cevabı..."
          />
        </div>
        <button
          onClick={addFaq}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all"
        >
          + Soru Ekle
        </button>
      </div>

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
