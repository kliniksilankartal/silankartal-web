import Link from 'next/link';
import { getSiteContent } from '@/lib/content';
import {
  FaNewspaper, FaHandHoldingMedical, FaQuestion,
  FaArrowRight, FaExternalLinkAlt
} from 'react-icons/fa';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const content = getSiteContent();

  const stats = [
    {
      label: 'Blog Yazısı',
      value: content.blogPosts?.length || 0,
      icon: FaNewspaper,
      href: '/admin/blog',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Hizmet',
      value: content.services?.length || 0,
      icon: FaHandHoldingMedical,
      href: '/admin/hizmetler',
      color: 'text-teal-600 bg-teal-50',
    },
    {
      label: 'Sık Sorulan Soru',
      value: content.faq?.length || 0,
      icon: FaQuestion,
      href: '/admin/sss',
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  const recentPosts = (content.blogPosts || []).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Başlık */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
          <span className="text-[11px] font-bold tracking-widest text-teal-700 uppercase">
            Şilan Kartal Klinik
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Genel Bakış</h1>
        <p className="text-sm text-slate-500 mt-1">
          Sitenizdeki içerikleri buradan yönetebilirsiniz.
        </p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.href}
              href={stat.href}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-teal-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{stat.value}</div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Yönet</span>
                <FaArrowRight size={11} className="text-teal-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Hızlı Erişim */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Hızlı Erişim</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Yeni Blog Yaz', href: '/admin/blog/yeni', emoji: '✍️' },
            { label: 'Anasayfa Düzenle', href: '/admin/anasayfa', emoji: '🏠' },
            { label: 'Görselleri Güncelle', href: '/admin/gorseller', emoji: '🖼️' },
            { label: 'İletişim Bilgileri', href: '/admin/iletisim', emoji: '📞' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-teal-300 hover:bg-teal-50/30 transition-all text-center"
            >
              <div className="text-2xl mb-1">{item.emoji}</div>
              <div className="text-xs font-semibold text-slate-700">{item.label}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Son Blog Yazıları */}
      {recentPosts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Son Blog Yazıları</h2>
            <Link href="/admin/blog" className="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-1">
              Tümü <FaArrowRight size={10} />
            </Link>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/blog/${post.id}`}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-800 truncate">{post.title}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-400">{post.date}</span>
                  <FaArrowRight size={11} className="text-slate-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Siteyi Gör */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-teal-900">Sitenizi Görüntüleyin</div>
          <div className="text-xs text-teal-700 mt-0.5">Değişikliklerinizi canlı olarak inceleyin.</div>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-colors"
        >
          <FaExternalLinkAlt size={11} />
          Siteyi Aç
        </a>
      </div>
    </div>
  );
}
