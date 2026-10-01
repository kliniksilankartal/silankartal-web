import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaGraduationCap, FaCertificate, FaPhone } from 'react-icons/fa';
import SectionTitle from '@/components/SectionTitle';
import { SITE_CONFIG, CONTACT_INFO } from '@/lib/constants';
import { getSiteContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `Özgeçmiş | ${SITE_CONFIG.name}`,
  description: `${SITE_CONFIG.name} - Fizyoterapi ve Rehabilitasyon uzmanlık eğitimi, klinik deneyim ve sertifikalar.`,
};

export default function HakkimdaPage() {
  const content = getSiteContent();

  return (
    <div className="py-12 lg:py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <li><Link href="/" className="hover:text-teal-700 transition-colors">Anasayfa</Link></li>
            <li>/</li>
            <li className="text-slate-800 font-semibold">Özgeçmiş</li>
          </ol>
        </nav>

        <SectionTitle
          badge="UZMAN ÖZGEÇMİŞİ"
          title={content.about.title || `Fzt. ${SITE_CONFIG.name}`}
          subtitle={content.about.subtitle || 'Klinik Deneyim & Bütüncül Manuel Terapi Yaklaşımı'}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Sol Kolon: Fotoğraf & Hızlı İletişim */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="relative aspect-3/4 w-full rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-white">
                <Image
                  src={content.images.profileImage || '/images/avatar-placeholder.png'}
                  alt={`Fzt. ${SITE_CONFIG.name}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover object-top"
                  priority
                  unoptimized={Boolean(content.images?.profileImage && content.images.profileImage.startsWith('data:'))}
                />
              </div>

              {/* Hızlı Bilgi Kartı */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs text-slate-500 font-medium">Uzmanlık</span>
                  <span className="text-xs font-bold text-teal-800">{content.header.credentials || SITE_CONFIG.credentials}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs text-slate-500 font-medium">Kurum</span>
                  <span className="text-xs font-bold text-slate-800">{content.header.clinicName || SITE_CONFIG.clinicName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs text-slate-500 font-medium">Lokasyon</span>
                  <span className="text-xs font-bold text-slate-800">{content.general.city || CONTACT_INFO.city}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500 font-medium">Çalışma Saatleri</span>
                  <span className="text-xs font-bold text-emerald-700">{content.general.workingHours || CONTACT_INFO.workingHoursShort}</span>
                </div>
              </div>

              {/* Randevu & İletişim Kutusu */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Randevu &amp; Danışmanlık
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Detaylı değerlendirme ve kişiye özel seans planlaması için bizimle doğrudan iletişime geçebilirsiniz.
                </p>
                <div>
                  <Link
                    href="/iletisim"
                    className="inline-flex items-center justify-center gap-2 w-full bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold py-3 rounded-lg transition-colors shadow-sm"
                  >
                    <FaPhone size={13} />
                    <span>İletişime Geç</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Klinik Geçmiş ve Detaylar */}
          <div className="lg:col-span-8 space-y-12 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
            
            {/* Mesleki Tanıtım */}
            <div className="space-y-4">
              <span className="text-xs font-bold tracking-[0.2em] text-[#155E54] uppercase">
                Özgeçmiş
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {content.general.doctorName || SITE_CONFIG.name}
              </h2>
              <div className="space-y-3.5 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>{content.about.bio}</p>
                <p>{content.about.clinicExperience}</p>
                <div className="p-4 rounded-xl bg-[#EBF5F3] border border-[#155E54]/20 text-[#155E54] text-xs sm:text-sm font-medium">
                  <strong>Çalışma ve Uzmanlık Alanları:</strong> Omurga sağlığı (bel ve boyun fıtığı), ortopedik manuel terapi, duruş bozuklukları (postür analizi), baş ağrısı, çene eklemi &amp; diş sıkma (bruksizm), siyatik ve spor yaralanmaları rehabilitasyonu.
                </div>
              </div>
            </div>

            {/* Eğitim */}
            {content.about.education && content.about.education.length > 0 && (
              <div className="pt-8 border-t border-slate-100">
                <div className="flex items-center space-x-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-[#EBF5F3] text-[#155E54] flex items-center justify-center">
                    <FaGraduationCap size={16} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">Eğitim ve Akademik Geçmiş</h3>
                </div>
                <div className="space-y-3">
                  {content.about.education.map((item, index) => (
                    <div key={index} className="p-3.5 sm:p-4 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center">
                      <h4 className="font-semibold text-slate-900 text-sm">{item}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sertifikalar */}
            {content.about.certifications && content.about.certifications.length > 0 && (
              <div className="pt-8 border-t border-slate-100">
                <div className="flex items-center space-x-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-[#EBF5F3] text-[#155E54] flex items-center justify-center">
                    <FaCertificate size={15} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">Uzmanlık &amp; Sertifikalar</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {content.about.certifications.map((item, index) => (
                    <div key={index} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 flex items-start space-x-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#155E54] mt-1.5 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-slate-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
