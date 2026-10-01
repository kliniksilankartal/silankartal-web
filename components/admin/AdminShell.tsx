'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaHome, FaNewspaper, FaUserMd, FaHandHoldingMedical,
  FaQuestion, FaPhone, FaPalette, FaSearch,
  FaBars, FaTimes, FaExternalLinkAlt, FaSignOutAlt,
  FaChartBar, FaChevronRight
} from 'react-icons/fa';

const navGroups = [
  {
    title: 'GENEL',
    items: [
      { href: '/admin', label: 'Genel Bakış', icon: FaChartBar, exact: true },
    ],
  },
  {
    title: 'SAYFALAR VE İÇERİKLER',
    items: [
      { href: '/admin/anasayfa', label: 'Anasayfa & Görseller', icon: FaHome },
      { href: '/admin/hakkimda', label: 'Hakkımda & Profil', icon: FaUserMd },
      { href: '/admin/hizmetler', label: 'Hizmetler', icon: FaHandHoldingMedical },
      { href: '/admin/blog', label: 'Blog Yazıları', icon: FaNewspaper },
      { href: '/admin/sss', label: 'Sık Sorulan Sorular', icon: FaQuestion },
    ],
  },
  {
    title: 'KLİNİK AYARLARI',
    items: [
      { href: '/admin/iletisim', label: 'İletişim & Klinik', icon: FaPhone },
      { href: '/admin/tema', label: 'Tema & Renkler', icon: FaPalette },
      { href: '/admin/seo', label: 'Google & SEO', icon: FaSearch },
    ],
  },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_session_active');
    }
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="w-64 h-full bg-white flex flex-col border-r border-slate-200">
      {/* Üst Logo ve Başlık — En Yukarı Hizalı */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-white border border-slate-200/90 flex items-center justify-center shadow-xs group-hover:border-teal-400 group-hover:shadow-sm transition-all shrink-0 p-1">
            <Image
              src="/icon.png"
              alt="Şilan Kartal İkonu"
              width={36}
              height={36}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 leading-tight">Şilan Kartal</div>
            <div className="text-[11px] text-teal-700 font-semibold leading-tight">Yönetim Paneli</div>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors">
            <FaTimes size={16} />
          </button>
        )}
      </div>

      {/* Navigasyon — Sabit ve Kaydırılabilir */}
      <nav className="flex-1 py-3 px-2 space-y-4 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.title}>
            <span className="px-3 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase block mb-1">
              {group.title}
            </span>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, (item as any).exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-teal-700 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={14} className={active ? 'text-white' : 'text-slate-400'} />
                    <span>{item.label}</span>
                    {active && <FaChevronRight size={10} className="ml-auto opacity-70" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Alt Hızlı İşlemler */}
      <div className="p-3 border-t border-slate-100 space-y-1 shrink-0 bg-slate-50/40">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-white border border-transparent hover:border-slate-200 transition-all shadow-2xs"
        >
          <FaExternalLinkAlt size={11} className="text-teal-600" />
          <span>Canlı Siteyi Aç</span>
          <span className="ml-auto text-[10px] text-slate-400">↗</span>
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 transition-all cursor-pointer"
        >
          <FaSignOutAlt size={12} />
          <span>Güvenli Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Oturum kontrolü: Tarayıcı kapatılıp açılmışsa veya yeni sekmede gelinmişse otomatik girişe izin verme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isActive = sessionStorage.getItem('admin_session_active');
      if (!isActive) {
        fetch('/api/admin/logout', { method: 'POST' }).finally(() => {
          router.push('/admin/login');
        });
      }
    }
  }, [router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] text-slate-900">
      {/* Sabit Desktop Sol Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed top-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobil Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 left-0 w-64 h-full shadow-2xl overflow-y-auto z-10">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Ana Çalışma Alanı (Gereksiz üst bar ve footer kaldırıldı) */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 h-screen overflow-hidden">
        {/* Yalnızca Mobilde görünen minimal toggle çubuğu */}
        <div className="lg:hidden h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <FaBars size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg overflow-hidden border border-slate-200/90 flex items-center justify-center shrink-0 p-0.5 bg-white">
              <Image
                src="/icon.png"
                alt="Şilan Kartal İkonu"
                width={24}
                height={24}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs font-bold text-slate-800">Şilan Kartal Panel</span>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
          >
            Siteye Git ↗
          </a>
        </div>

        {/* Odaklanmış Sayfa İçeriği */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
          <div className="max-w-5xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
