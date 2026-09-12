import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import { FaCalendarAlt, FaUserMd, FaPhone, FaCalendarCheck } from 'react-icons/fa';
import { getAllPostSlugs, getPostBySlug, formatDate, getLatestPosts } from '@/lib/mdx';
import BlogCard from '@/components/BlogCard';
import { SITE_CONFIG, CONTACT_INFO } from '@/lib/constants';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | ${SITE_CONFIG.name}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { content } = await compileMDX({
    source: post.content,
    options: { parseFrontmatter: false },
  });

  const relatedPosts = getLatestPosts(4).filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="py-10 lg:py-16 bg-slate-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <li><Link href="/" className="hover:text-teal-700 transition-colors">Anasayfa</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-teal-700 transition-colors">Blog</Link></li>
            <li>/</li>
            <li className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-md">{post.title}</li>
          </ol>
        </nav>

        {/* Post Title & Metadata */}
        <div className="mb-8">
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mb-3">
            <span className="flex items-center gap-1.5 text-teal-700 font-semibold uppercase tracking-wider">
              <FaUserMd size={13} />
              {SITE_CONFIG.name}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <FaCalendarAlt size={12} />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>
        </div>

        {/* Real Cover Image */}
        {post.coverImage && (
          <div className="relative h-[280px] sm:h-[400px] w-full rounded-2xl overflow-hidden shadow-sm mb-10 bg-slate-100 border border-slate-200">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* MDX Article Body */}
        <article className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-strong:text-slate-900">
          {content}
        </article>

        {/* Clinician Signature Card */}
        <div className="mt-10 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80"
              alt={SITE_CONFIG.name}
              fill
              className="object-cover object-top"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="text-base font-bold text-slate-900">{SITE_CONFIG.name}</div>
            <div className="text-xs font-semibold text-teal-700">{SITE_CONFIG.credentials}</div>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Bu makale kas-iskelet sistemi, omurga biyomekaniği ve osteopatik yaklaşımlar hakkında bilgilendirme amacıyla kaleme alınmıştır.
            </p>
          </div>
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-5 py-3 rounded-lg transition-colors shrink-0 shadow-sm"
          >
            <FaCalendarCheck size={13} />
            <span>Klinikten Randevu Al</span>
          </Link>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">İlginizi Çekebilecek Diğer Yazılar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
