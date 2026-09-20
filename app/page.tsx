import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaUserMd, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import Hero from '@/components/Hero';
import SectionTitle from '@/components/SectionTitle';
import ServiceCard from '@/components/ServiceCard';
import ConditionsList from '@/components/ConditionsList';
import BlogCard from '@/components/BlogCard';
import GoogleMap from '@/components/GoogleMap';
import { services as defaultServices } from '@/lib/services';
import { getLatestPosts } from '@/lib/mdx';
import { SITE_CONFIG, CONTACT_INFO } from '@/lib/constants';
import { getSiteContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const content = getSiteContent();
  return {
    title: content.seo?.homeTitle || `${SITE_CONFIG.name} – ${SITE_CONFIG.subTitle}`,
    description: content.seo?.homeDescription || SITE_CONFIG.description,
  };
}

export default function HomePage() {
  const content = getSiteContent();
  const latestPosts = getLatestPosts(3);
  const activeServices = content.services && content.services.length > 0 ? content.services : defaultServices;

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Yöntemler & Hizmetler Grid */}
      <section id="yontemler" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="YÖNTEMLER & UYGULAMALAR"
            title="Klinik Fizyoterapi & Manuel Terapi"
            subtitle="Kas-iskelet sistemi, omurga biyomekaniği ve eklem sağlığı için uluslararası kanıta dayalı manuel terapi teknikleri."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {activeServices.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Terapist Hakkında & Klinik Yaklaşım Özeti */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 relative">
              <div className="relative h-[440px] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100 flex items-center justify-center">
                <Image
                  src={content.images.profileImage || '/avatar-placeholder.png'}
                  alt={`${content.general.doctorName || SITE_CONFIG.name} - Fizyoterapist`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-contain p-8"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-lg font-bold">{content.general.doctorName || SITE_CONFIG.name}</div>
                  <div className="text-sm text-teal-300 font-medium">{content.header.credentials || SITE_CONFIG.credentials}</div>
                  <div className="text-xs text-slate-300 mt-1">İstanbul Üniversitesi Fizik Tedavi & Rehabilitasyon</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold tracking-[0.2em] text-teal-700 uppercase">
                KLİNİK FELSEFEMİZ
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Ağrıyı Değil, Ağrıyı Ortaya Çıkaran Mekanizmayı Tedavi Ediyoruz.
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                İnsan vücudu parçalardan oluşan bir makine değil, tüm kas-iskelet ve eklem sistemlerinin birbiriyle sürekli
                iletişim halinde olduğu entegre bir bütündür. Bir boyun ağrısını sadece boyun kaslarına
                masaj yaparak çözmek çoğu zaman geçici bir rahatlama sağlar.
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                Kliniğimizde detaylı ortopedik ve postüral muayene ile omurganın mekanik dizilimini, eklem kısıtlılıklarını,
                sinir mobilizasyonunu ve kas kuvvet dengesini bir arada
                değerlendirerek kalıcı iyileşmeyi hedefliyoruz.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm text-slate-800 font-medium">
                  <FaCheckCircle className="text-teal-600 shrink-0" size={15} />
                  <span>Kişiye özel birebir 50-60 dk seans</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-800 font-medium">
                  <FaCheckCircle className="text-teal-600 shrink-0" size={15} />
                  <span>Bilimsel ve kanıta dayalı manuel terapi</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-800 font-medium">
                  <FaCheckCircle className="text-teal-600 shrink-0" size={15} />
                  <span>Egzersiz ve ev reçetesi desteği</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-800 font-medium">
                  <FaCheckCircle className="text-teal-600 shrink-0" size={15} />
                  <span>Pazar dahil her gün 08:00 - 22:00</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/hakkimda"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 group"
                >
                  <FaUserMd size={14} />
                  <span>Detaylı Özgeçmiş ve Sertifikalar</span>
                  <FaArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sık Karşılaşılan Rahatsızlıklar */}
      <ConditionsList />

      {/* Son Blog Yazıları */}
      {latestPosts.length > 0 && (
        <section className="py-16 lg:py-24 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-bold tracking-[0.2em] text-teal-700 uppercase">
                  BİLGİ MERKEZİ
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Son Eklenen Sağlık Makaleleri
                </h2>
              </div>
              <Link
                href="/blog"
                className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 group"
              >
                <span>Tüm Yazıları Gör</span>
                <FaArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {latestPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Harita & Konum Section */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Harita */}
            <div className="lg:col-span-7 h-[420px] rounded-2xl overflow-hidden shadow-sm border border-slate-200">
              <GoogleMap />
            </div>

            {/* Lokasyon Bilgileri */}
            <div className="lg:col-span-5 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
              <div className="space-y-4">
                <span className="text-xs font-bold tracking-[0.2em] text-teal-700 uppercase">
                  LOKASYON &amp; RANDEVU
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {content.header.clinicName || SITE_CONFIG.clinicName}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {content.general.address || CONTACT_INFO.address}
                </p>
                <div className="pt-2 border-t border-slate-100 space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Çalışma Saatleri:</span>
                    <span className="font-semibold text-teal-800">{content.general.workingHours || CONTACT_INFO.workingHoursShort}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pazar Günü:</span>
                    <span className="font-semibold text-emerald-600">Açık (08:00 - 22:00)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Telefon:</span>
                    <a href={`tel:${content.general.phone.replace(/[^0-9]/g, '')}`} className="font-bold text-teal-700 hover:underline">
                      {content.general.phone || CONTACT_INFO.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  href="/iletisim"
                  className="w-full inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white py-3.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  <span>İletişime Geç</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
