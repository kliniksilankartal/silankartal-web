'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaLock, FaUser, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Sayfa açıldığında sunucudan kilit durumunu sorgula
  useEffect(() => {
    fetch('/api/admin/login')
      .then((res) => res.json())
      .then((data) => {
        if (data.locked && data.remainingSeconds > 0) {
          setLockoutSeconds(data.remainingSeconds);
          setError(`Güvenlik kilidi devrede. Lütfen bekleyin.`);
        }
      })
      .catch(() => {});
  }, []);

  // Geri sayım sayacı
  useEffect(() => {
    if (lockoutSeconds <= 0) return;

    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setError('Kilit süresi doldu. Tekrar giriş yapabilirsiniz.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const isLocked = lockoutSeconds > 0;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('admin_session_active', '1');
        }
        router.push('/admin');
        router.refresh();
      } else {
        if (res.status === 429 || data.locked) {
          setLockoutSeconds(data.remainingSeconds || 30);
          setError(data.error || 'Çok fazla hatalı deneme yapıldı. Giriş kilitlendi.');
        } else {
          setError(data.error || 'Kullanıcı adı veya şifre hatalı.');
        }
      }
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center mx-auto mb-4 shadow-sm p-2 overflow-hidden">
            <Image
              src="/icon.png"
              alt="Şilan Kartal Klinik"
              width={64}
              height={64}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">Şilan Kartal Klinik</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Yönetim Paneli</p>
        </div>

        {/* Kart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          {/* Kilit Uyarısı */}
          {isLocked && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-1.5 animate-pulse">
              <div className="flex items-center gap-2 font-bold text-red-700">
                <FaShieldAlt size={14} className="text-red-600" />
                <span>Güvenlik Kilidi Devrede!</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                3 veya daha fazla hatalı giriş yapıldı. Sistem güvenliği için giriş geçici olarak engellendi.
              </p>
              <div className="pt-1 flex items-center justify-between font-mono font-bold text-red-600">
                <span>Kalan Kilit Süresi:</span>
                <span className="text-sm bg-red-100 px-2 py-0.5 rounded-lg border border-red-200">
                  {lockoutSeconds} sn
                </span>
              </div>
            </div>
          )}

          {/* Normal Hata Mesajı */}
          {!isLocked && error && (
            <div className={`mb-5 p-3 rounded-xl text-xs font-medium ${
              error.includes('Kilit süresi doldu') 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Kullanıcı Adı */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınız"
                  required
                  autoComplete="username"
                  disabled={loading || isLocked}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <FaUser size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Şifre */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  disabled={loading || isLocked}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <FaLock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLocked}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-40"
                >
                  {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || isLocked}
              className={`w-full mt-2 py-3 text-white text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer ${
                isLocked 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-teal-700 hover:bg-teal-800'
              }`}
            >
              {loading ? (
                'Giriş yapılıyor...'
              ) : isLocked ? (
                `Kilitlendi (${lockoutSeconds} sn)`
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          Şilan Kartal Klinik © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
