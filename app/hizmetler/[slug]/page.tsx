import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaCheck, FaPhone, FaCalendarCheck, FaClock, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import { services, getServiceBySlug, getAllServiceSlugs } from '@/lib/services';
import SectionTitle from '@/components/SectionTitle';
import ServiceCard from '@/components/ServiceCard';
import { CONTACT_INFO, SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: `${service.title} – ${SITE_CONFIG.name}`,
    description: service.shortDescription,
    openGraph: {
      title: `${service.title} | ${SITE_CONFIG.name}`,
      description: service.shortDescription,
      images: [{ url: service.image }],
    },
  };
}

export default async function HizmetDetayPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const otherServices = services.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <div className="py-10 lg:py-16 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <li><Link href="/" className="hover:text-teal-700 transition-colors">Anasayfa</Link></li>
            <li>/</li>
            <li><Link href="/#yontemler" className="hover:text-teal-700 transition-colors">Yöntemler</Link></li>
            <li>/</li>
            <li className="text-slate-900 font-semibold">{service.title}</li>
          </ol>
        </nav>

        {/* Hero Header with Real Clinical Photography */}
        <div className="relative h-[280px] sm:h-[380px] w-full rounded-2xl overflow-hidden shadow-md mb-12 bg-slate-900">
          <Image
            src={service.image}
            alt={service.title}
            fill
            priority
            className="object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 text-white max-w-3xl">
            {service.category && (
              <span className="inline-block px-3 py-1 bg-teal-600/90 text-white text-xs font-bold tracking-wider uppercase rounded mb-3">
                {service.category}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {service.title}
            </h1>
            <p className="text-slate-200 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              {service.shortDescription}
            </p>
          </div>
        </div>

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Description */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  {service.title} Nedir ve Nasıl Uygulanır?
                </h2>
                <div className="space-y-4 text-slate-600 text-base leading-relaxed">
                  {service.detailedDescription.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Endikasyonlar / Bu Tedavi Kimlere Uygulanır? */}
              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Hangi Şikayet ve Durumlarda Tercih Edilir?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                        <FaCheck size={9} />
                      </div>
                      <span className="text-slate-800 text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seans Süreci */}
              <div className="pt-8 border-t border-slate-100 space-y-3">
                <h3 className="text-xl font-bold text-slate-900">Seans Süreci ve İlk Değerlendirme</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Her seans yaklaşık 45–60 dakika sürmektedir. İlk seansta detaylı bir postüral, biyomekanik ve
                  dokusal muayene gerçekleştirilir. Hastanın getirdiği MR, röntgen ve tetkik sonuçları birlikte
                  incelenerek en uygun osteopatik tedavi stratejisi belirlenir.
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Appointment Sidebar */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold tracking-wider text-teal-700 uppercase block mb-1">
                  KİŞİYE ÖZEL SEANS
                </span>
                <h3 className="text-xl font-bold text-slate-900">Randevu ve Danışma</h3>
                <p className="text-slate-500 text-xs mt-1">
                  Tedavi planınız ve uygunluk durumunuz için iletişime geçebilirsiniz.
                </p>
              </div>

              <div className="space-y-3.5 text-sm text-slate-600 border-t border-b border-slate-100 py-4">
                <div className="flex items-center gap-3">
                  <FaClock className="text-teal-600 shrink-0" size={14} />
                  <span>{CONTACT_INFO.workingHoursShort}</span>
                </div>
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-teal-600 shrink-0 mt-1" size={14} />
                  <span className="text-xs leading-relaxed">Vital Fulya Plaza, Şişli / İstanbul</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-teal-600 shrink-0" size={14} />
                  <a href={`tel:${CONTACT_INFO.phone}`} className="font-bold text-slate-900 hover:text-teal-700">
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/iletisim"
                  className="w-full inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  <FaCalendarCheck size={14} />
                  <span>Randevu Formu</span>
                </Link>
                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3 rounded-lg text-sm font-semibold transition-colors"
                >
                  <FaWhatsapp size={16} />
                  <span>WhatsApp ile Yazın</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Diğer Yöntemler */}
        {otherServices.length > 0 && (
          <div className="mt-20 pt-16 border-t border-slate-200">
            <SectionTitle
              badge="DİĞER YÖNTEMLER"
              title="Diğer Klinik Uygulamalarımız"
              subtitle="Tedavi sürecinde uyguladığımız diğer osteopatik disiplinler."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherServices.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
