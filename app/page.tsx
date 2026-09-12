import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaUserMd, FaArrowRight, FaCheckCircle, FaCalendarCheck } from 'react-icons/fa';
import Hero from '@/components/Hero';
import SectionTitle from '@/components/SectionTitle';
import ServiceCard from '@/components/ServiceCard';
import ConditionsList from '@/components/ConditionsList';
import BlogCard from '@/components/BlogCard';
import GoogleMap from '@/components/GoogleMap';
import { services } from '@/lib/services';
import { getLatestPosts } from '@/lib/mdx';
import { SITE_CONFIG, CONTACT_INFO } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} – ${SITE_CONFIG.subTitle}`,
  description: SITE_CONFIG.description,
};

export default function HomePage() {
  const latestPosts = getLatestPosts(3);

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Yöntemler & Hizmetler Grid */}
      <section id="yontemler" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="YÖNTEMLER & UYGULAMALAR"
            title="Bütüncül Tedavi Yaklaşımları"
            subtitle="Kas-iskelet sistemi, iç organlar ve sinir sisteminin uyum içinde çalışması için uluslararası standartlarda osteopatik teknikler."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service) => (
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
              <div className="relative h-[440px] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                <Image
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=80"
                  alt={`${SITE_CONFIG.name} - Osteopat`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-lg font-bold">{SITE_CONFIG.name}</div>
                  <div className="text-sm text-teal-300 font-medium">{SITE_CONFIG.credentials}</div>
                  <div className="text-xs text-slate-300 mt-1">İstanbul Üniversitesi & Uluslararası Osteopati Eğitimi</div>
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
                İnsan vücudu parçalardan oluşan bir makine değil, tüm sistemlerin birbiriyle sürekli
                iletişim halinde olduğu entegre bir bütündür. Bir boyun ağrısını sadece boyun kaslarına
                masaj yaparak çözmek çoğu zaman geçici bir rahatlama sağlar.
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                Kliniğimizde osteopatik muayene ile omurganın mekanik dizilimini, iç organların çevre dokularla
                olan gerilimlerini (visseral), kranial ritmi ve psikonöroimmünolojik faktörleri bir arada
                değerlendirerek kalıcı iyileşmeyi hedefliyoruz.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm text-slate-800 font-medium">
                  <FaCheckCircle className="text-teal-600 shrink-0" size={15} />
                  <span>Kişiye özel birebir 60 dk seans</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-800 font-medium">
                  <FaCheckCircle className="text-teal-600 shrink-0" size={15} />
                  <span>Bilimsel ve kanıta dayalı yöntemler</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-800 font-medium">
                  <FaCheckCircle className="text-teal-600 shrink-0" size={15} />
                  <span>Egzersiz ve ev reçetesi desteği</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-800 font-medium">
                  <FaCheckCircle className="text-teal-600 shrink-0" size={15} />
                  <span>DoktorTakvimi doğrulanmış profil</span>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  href="/hakkimda"
                  className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-900 font-bold text-sm tracking-wide group"
                >
                  <span>Detaylı Özgeçmiş & Sertifikaları İncele</span>
                  <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tedavi Edilen Rahatsızlıklar */}
      <section id="rahatsizliklar" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="BELİRTİ VE RAHATSIZLIKLAR"
            title="Tedavi Edilen Rahatsızlıklar"
            subtitle="Hangi durumlarda osteopati ve fizik tedavi desteği alabilirsiniz?"
          />
          <ConditionsList />
        </div>
      </section>

      {/* Son Blog Yazıları */}
      {latestPosts.length > 0 && (
        <section className="py-16 lg:py-24 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
              <div>
                <span className="text-xs font-bold tracking-[0.2em] text-teal-700 uppercase block mb-2">
                  BİLGİ MERKEZİ
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Son Yazılarım
                </h2>
                <p className="text-slate-600 text-sm sm:text-base mt-2">
                  Omurga sağlığı, kas-iskelet problemleri ve bütüncül tıp üzerine makaleler.
                </p>
              </div>
              <Link
                href="/blog"
                className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-900 font-bold text-sm"
              >
                <span>Tüm Yazıları Gör</span>
                <FaArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {latestPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Google Maps & Klinik Lokasyonu */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="ULAŞIM & LOKASYON"
            title="Klinik ve Randevu Bilgileri"
            subtitle="Nişantaşı'ndaki kliniğimize metro, toplu taşıma ve araçla kolayca ulaşabilirsiniz."
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-8">
              <GoogleMap />
            </div>
            <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Fzt. Şilan Kartal Kliniği</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {CONTACT_INFO.address}
                </p>
                <div className="pt-2 border-t border-slate-100 space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Çalışma Saatleri:</span>
                    <span className="font-semibold">{CONTACT_INFO.workingHoursShort}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pazar:</span>
                    <span className="font-semibold text-rose-600">Kapalı</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Telefon:</span>
                    <a href={`tel:${CONTACT_INFO.phone}`} className="font-bold text-teal-700 hover:underline">
                      {CONTACT_INFO.phone}
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
