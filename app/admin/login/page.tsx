'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaLock, FaUser, FaShieldAlt, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Lütfen kullanıcı adı ve şifrenizi girin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Giriş yapılamadı.');
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
        if (data.isLocked) {
          setIsLocked(true);
        }
      }
    } catch {
      setError('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#155E54] text-white shadow-lg mb-4">
            <FaShieldAlt size={28} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Klinik Yönetim Paneli
          </h2>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Özel Sağlık Merkezi — Yönetici Girişi
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/80 shadow-sm">
          {error && (
            <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 text-xs font-semibold ${
              isLocked 
                ? 'bg-rose-50 text-rose-800 border border-rose-200' 
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              <FaExclamationTriangle className="shrink-0 mt-0.5 text-base" />
              <div>
                <p>{error}</p>
                {remainingAttempts !== null && remainingAttempts > 0 && (
                  <p className="mt-1 font-bold text-amber-900">
                    Dikkat: 3 hatalı denemede sistem 15 dakika kilitlenir!
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Kullanıcı Adı / Kimlik
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FaUser size={14} />
                </div>
                <input
                  type="text"
                  required
                  disabled={loading || isLocked}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="block w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 focus:border-[#155E54] focus:ring-2 focus:ring-[#155E54]/20 outline-none transition-all disabled:bg-slate-100 disabled:opacity-60 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Yönetici Şifresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FaLock size={14} />
                </div>
                <input
                  type="password"
                  required
                  disabled={loading || isLocked}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 focus:border-[#155E54] focus:ring-2 focus:ring-[#155E54]/20 outline-none transition-all disabled:bg-slate-100 disabled:opacity-60 text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || isLocked}
              className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#155E54] hover:bg-[#0E433C] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-md transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Giriş Yapılıyor...</span>
                </div>
              ) : (
                'Güvenli Giriş Yap'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#155E54] transition-colors"
            >
              <FaArrowLeft size={10} />
              <span>Ana Sayfaya Dön</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
