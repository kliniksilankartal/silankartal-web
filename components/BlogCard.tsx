import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import { BlogPost } from '@/lib/types';
import { formatDate } from '@/lib/mdx';

interface BlogCardProps {
  post: BlogPost;
}

const fallbackImage = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80';

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200/80 overflow-hidden flex flex-col transition-all duration-200">
      {/* Real Blog Image */}
      <Link href={`/blog/${post.slug}`} className="relative h-48 w-full overflow-hidden bg-slate-100 block">
        <Image
          src={post.coverImage || fallbackImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
      </Link>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-2.5">
            <FaCalendarAlt size={11} className="text-teal-600" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {post.excerpt}
          </p>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-900 font-semibold text-sm pt-3 border-t border-slate-100 transition-colors"
        >
          <span>Yazıyı Oku</span>
          <FaArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
