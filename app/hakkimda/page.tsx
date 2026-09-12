import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaGraduationCap, FaBriefcase, FaCertificate, FaPhone, FaCalendarCheck, FaExternalLinkAlt } from 'react-icons/fa';
import SectionTitle from '@/components/SectionTitle';
import { SITE_CONFIG, CONTACT_INFO } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Özgeçmiş | ${SITE_CONFIG.name}`,
  description: `${SITE_CONFIG.name} - Osteopati, Fizyoterapi ve Rehabilitasyon uzmanlık eğitimi, klinik deneyim ve sertifikalar.`,
};

const education = [
  {
    year: '2008 - 2012',
    title: 'Fizik Tedavi ve Rehabilitasyon (Lisans)',
    institution: 'İstanbul Üniversitesi (Çapa) Fizik Tedavi ve Rehabilitasyon Bölümü',
  },
  {
    year: '2012 - 2017',
    title: 'Osteopati Eğitimi (5 Yıl)',
    institution: 'TİFAO – Institut für Angewandte Osteopathie (Almanya)',
  },
  {
    year: '2017 - 2020',
    title: 'Klinik Psikonöroimmünoloji Master (kPNI)',
    institution: 'European Master of Science in Clinical Psychoneuroimmunology',
  },
  {
    year: '2022 - 2024',
    title: 'Fizyoterapi ve Rehabilitasyon Yüksek Lisans (Tezli)',
    institution: 'İstanbul Atlas Üniversitesi',
  },
];

const certifications = [
  {
    year: '2013',
    title: 'Kuru İğne Eğitimi (Profesyonel 4 Kur)',
    institution: 'David G. Simons Academy',
  },
  {
    year: '2015',
    title: 'Kinezyolojik Bantlama Eğitimi',
    institution: 'KT Academy',
  },
  {
    year: '2018',
    title: 'Nöral Mobilizasyon ve Manipülasyon Teknikleri',
    institution: 'OMT Academy',
  },
  {
    year: '2021',
    title: 'Osteopati Update & İleri Klinik Yaklaşımlar',
    institution: 'IFAO Osteopati Enstitüsü',
  },
];

const clinicExperience = [
  {
    year: '2012 - 2016',
    place: 'Bezmialem Vakıf Üniversitesi Tıp Fakültesi Hastanesi',
  },
  {
    year: '2016 - 2023',
    place: 'Liv Hospital Ulus',
  },
  {
    year: '2024 - Günümüz',
    place: 'Kendi Özel Kliniği (Nişantaşı, İstanbul)',
  },
];

export default function HakkimdaPage() {
  return (
    <div className="py-12 lg:py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-teal-700 transition-colors">Anasayfa</Link>
            <span>/</span>
            <span className="text-slate-800">Özgeçmiş</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sol Kolon: Fotoğraf ve İletişim Kartı */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
                <div className="relative h-[380px] w-full rounded-xl overflow-hidden bg-slate-100">
                  <Image
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=80"
                    alt={SITE_CONFIG.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-4 text-center">
                  <h1 className="text-2xl font-bold text-slate-900">{SITE_CONFIG.name}</h1>
                  <p className="text-sm font-semibold text-teal-700 mt-0.5">{SITE_CONFIG.credentials}</p>
                  <p className="text-xs text-slate-500 mt-1">{CONTACT_INFO.city}</p>
                </div>
              </div>

              {/* DoktorTakvimi ve Randevu Kutusu */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Görüş & Değerlendirmeler
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Danışan yorumlarını ve klinik değerlendirmeleri DoktorTakvimi üzerinden inceleyebilirsiniz.
                </p>
                <a
                  href="https://www.doktortakvimi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2.5 rounded-lg transition-colors"
                >
                  <span>DoktorTakvimi Profili</span>
                  <FaExternalLinkAlt size={10} />
                </a>

                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href="/iletisim"
                    className="inline-flex items-center justify-center gap-2 w-full bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold py-3 rounded-lg transition-colors shadow-sm"
                  >
                    <FaCalendarCheck size={14} />
                    <span>Randevu Oluştur</span>
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
                {SITE_CONFIG.name}
              </h2>
              <div className="space-y-3.5 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>
                  Lisans eğitimini <strong>İstanbul Üniversitesi (Çapa) Fizik Tedavi ve Rehabilitasyon Bölümü</strong>&apos;nde 2008-2012 yılları arasında tamamladı. 2012-2017 yılları arasında 5 yıl süren Osteopati eğitimini merkezi Almanya&apos;da bulunan <strong>Osteopati Enstitüsü (IFAO)</strong>&apos;nda tamamladı.
                </p>
                <p>
                  2017-2020 yılları arasında European Master of Science bünyesinde <strong>Klinik Psikonöroimmünoloji (kPNI - Fonksiyonel Tıp)</strong> eğitimini tamamladı. 2022-2024 tarihleri arasında ise <strong>İstanbul Atlas Üniversitesi</strong>&apos;nde Fizyoterapi ve Rehabilitasyon tezli yüksek lisansını tamamladı.
                </p>
                <p>
                  David G. Simons Academy&apos;de 4 kur süren kuru iğneleme eğitimi, KT Academy&apos;de kinezyolojik bantlama, OMT Academy&apos;de nöral mobilizasyon ve manipülasyon teknikleri ve IFAO Osteopati Enstitüsü&apos;nde osteopati update eğitimleri olmak üzere birçok uluslararası kurs ve eğitime katıldı.
                </p>
                <p>
                  <strong>Bezmialem Vakıf Üniversitesi Tıp Fakültesi Hastanesi</strong> ve <strong>Ulus Liv Hospital</strong>&apos;de çalıştı. 2024 yılından itibaren Nişantaşı&apos;nda bulunan özel kliniğinde danışan kabulüne devam etmektedir.
                </p>
                <div className="p-4 rounded-xl bg-[#EBF5F3] border border-[#155E54]/20 text-[#155E54] text-xs sm:text-sm font-medium">
                  <strong>Çalışma ve Uzmanlık Alanları:</strong> Özellikle omurga sorunları (bel ve boyun fıtığı), baş ağrısı, migren, çene eklemi &amp; diş sıkma (bruksizm), kulak çınlaması, vertigo ve spor yaralanmaları.
                </div>
              </div>
            </div>

            {/* Eğitim */}
            <div className="pt-8 border-t border-slate-100">
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[#EBF5F3] text-[#155E54] flex items-center justify-center">
                  <FaGraduationCap size={16} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">Eğitim</h3>
              </div>
              <div className="space-y-3">
                {education.map((item, index) => (
                  <div key={index} className="p-3.5 sm:p-4 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</h4>
                      <p className="text-slate-600 text-xs sm:text-sm mt-0.5">{item.institution}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#155E54] shrink-0 sm:text-right">
                      {item.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Klinik Deneyim */}
            <div className="pt-8 border-t border-slate-100">
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[#EBF5F3] text-[#155E54] flex items-center justify-center">
                  <FaBriefcase size={16} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">Klinik Deneyim</h3>
              </div>
              <div className="space-y-3">
                {clinicExperience.map((item, index) => (
                  <div key={index} className="p-3.5 sm:p-4 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 text-sm sm:text-base">{item.place}</span>
                    <span className="text-xs font-semibold text-[#155E54] shrink-0 sm:text-right">
                      {item.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Katılınan Kurs ve Eğitimler */}
            <div className="pt-8 border-t border-slate-100">
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[#EBF5F3] text-[#155E54] flex items-center justify-center">
                  <FaCertificate size={16} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">Katılınan Kurslar &amp; Sertifikalar</h3>
              </div>
              <div className="space-y-3">
                {certifications.map((item, index) => (
                  <div key={index} className="p-3.5 sm:p-4 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</h4>
                      <p className="text-slate-600 text-xs sm:text-sm mt-0.5">{item.institution}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#155E54] shrink-0 sm:text-right">
                      {item.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
