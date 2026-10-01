import Link from 'next/link';
import { getSiteContent } from '@/lib/content';
import { FaPlus, FaEdit, FaArrowRight, FaNewspaper } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

export default function AdminBlogPage() {
  const content = getSiteContent();
  const posts = content.blogPosts || [];

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-teal-700 uppercase block mb-1">
            İçerik Yönetimi
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">Blog Yazıları ({posts.length})</h1>
          <p className="text-sm text-slate-500 mt-1">
            Yeni yazı ekleyin, mevcutları düzenleyin veya silin.
          </p>
        </div>
        <Link
          href="/admin/blog/yeni"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
        >
          <FaPlus size={12} />
          Yeni Blog Yazısı
        </Link>
      </div>

      {/* Blog Listesi */}
      {posts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <FaNewspaper size={32} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Henüz blog yazısı eklenmemiş.</p>
          <Link
            href="/admin/blog/yeni"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-teal-700 text-white text-xs font-bold rounded-xl hover:bg-teal-800 transition-colors"
          >
            <FaPlus size={11} />
            İlk Yazıyı Ekle
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="divide-y divide-slate-100">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                {/* Kapak */}
                {post.coverImage && (
                  <div
                    className="w-14 h-14 rounded-xl bg-slate-200 bg-cover bg-center shrink-0"
                    style={{ backgroundImage: `url(${post.coverImage})` }}
                  />
                )}

                {/* Bilgi */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900 truncate">{post.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate">{post.excerpt}</div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-medium text-slate-400">{post.date}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      post.published !== false
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {post.published !== false ? 'Yayında' : 'Taslak'}
                    </span>
                  </div>
                </div>

                {/* Aksiyonlar */}
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                    title="Sayfayı Gör"
                  >
                    <FaArrowRight size={12} />
                  </a>
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <FaEdit size={11} />
                    Düzenle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
