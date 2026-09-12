import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';
import BlogCard from '@/components/BlogCard';
import SectionTitle from '@/components/SectionTitle';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Blog & Sağlık Rehberi | ${SITE_CONFIG.name}`,
  description: 'Bel ve boyun fıtığı, manuel terapi, osteopati ve omurga sağlığı hakkında bilimsel ve klinik bilgilendirme yazıları.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="py-12 lg:py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <li><Link href="/" className="hover:text-teal-700 transition-colors">Anasayfa</Link></li>
            <li>/</li>
            <li className="text-slate-800 font-semibold">Blog</li>
          </ol>
        </nav>

        <SectionTitle
          badge="BİLGİ MERKEZİ & MAKALELER"
          title="Fizyoterapi ve Osteopati Rehberi"
          subtitle="Kas-iskelet sistemi rahatsızlıkları, fonksiyonel tıp yaklaşımları ve sağlıklı yaşam üzerine klinik makaleler."
        />

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-base">Henüz yazı yayınlanmamıştır.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
