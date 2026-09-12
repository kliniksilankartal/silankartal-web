import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import { Service } from '@/lib/types';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200/80 overflow-hidden flex flex-col transition-all duration-200">
      {/* Real Clinical Photo */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
        {service.category && (
          <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-teal-800 text-[11px] font-semibold tracking-wide uppercase rounded">
            {service.category}
          </span>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
            {service.title}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {service.shortDescription}
          </p>
        </div>

        <Link
          href={`/hizmetler/${service.slug}`}
          className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-900 font-semibold text-sm pt-3 border-t border-slate-100 transition-colors"
        >
          <span>Detaylı Bilgi</span>
          <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
