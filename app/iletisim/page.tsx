import type { Metadata } from 'next';
import Link from 'next/link';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp, FaExternalLinkAlt } from 'react-icons/fa';
import ContactForm from '@/components/ContactForm';
import GoogleMap from '@/components/GoogleMap';
import SectionTitle from '@/components/SectionTitle';
import { CONTACT_INFO, SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants';

export const metadata: Metadata = {
  title: `İletişim & Randevu | ${SITE_CONFIG.name}`,
  description: `${SITE_CONFIG.name} Fulya Şişli Kliniği randevu, iletişim ve ulaşım bilgileri.`,
};

export default function IletisimPage() {
  return (
    <div className="py-12 lg:py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <li><Link href="/" className="hover:text-teal-700 transition-colors">Anasayfa</Link></li>
            <li>/</li>
            <li className="text-slate-800 font-semibold">İletişim</li>
          </ol>
        </nav>

        <SectionTitle
          badge="İLETİŞİM & LOKASYON"
          title="Klinik Randevu ve Danışma"
          subtitle="Seans talebinde bulunmak, sorularınızı iletmek veya adres tarifimiz için bize dilediğiniz kanaldan ulaşabilirsiniz."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start">
          
          {/* İletişim Formu */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Randevu ve Bilgi Formu</h3>
            <p className="text-slate-500 text-xs mb-6">
              Lütfen şikayetinizi ve uygun olduğunuz gün/saat aralığını belirtiniz. En kısa sürede geri dönüş yapılacaktır.
            </p>
            <ContactForm />
          </div>

          {/* İletişim Bilgileri Kartları */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Adres */}
            <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center shrink-0">
                <FaMapMarkerAlt size={16} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Klinik Adresi</h4>
                <p className="text-slate-600 text-xs leading-relaxed">{CONTACT_INFO.address}</p>
                <p className="text-[11px] text-teal-700 font-semibold mt-1">Metrobüs, metro ve otopark imkanı mevcuttur.</p>
              </div>
            </div>

            {/* Telefon & WhatsApp */}
            <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center shrink-0">
                <FaPhone size={14} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Telefon ve WhatsApp</h4>
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="text-base font-bold text-teal-700 hover:text-teal-800 block"
                >
                  {CONTACT_INFO.phone}
                </a>
                <div className="mt-2">
                  <a
                    href={SOCIAL_LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:underline"
                  >
                    <FaWhatsapp size={13} />
                    <span>WhatsApp üzerinden mesaj gönderin</span>
                  </a>
                </div>
              </div>
            </div>

            {/* E-posta */}
            <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center shrink-0">
                <FaEnvelope size={14} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">E-posta</h4>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-xs text-slate-600 hover:text-teal-700 transition-colors font-medium"
                >
                  {CONTACT_INFO.email}
                </a>
              </div>
            </div>

            {/* Çalışma Saatleri */}
            <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center shrink-0">
                <FaClock size={14} />
              </div>
              <div className="text-xs text-slate-600">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Seans ve Çalışma Saatleri</h4>
                <p>{CONTACT_INFO.workingHours}</p>
                <p className="text-slate-400 mt-1">Pazar günleri ve resmi tatillerde kapalıyız.</p>
              </div>
            </div>

            {/* DoktorTakvimi Doğrulama */}
            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200/70 flex items-center justify-between text-xs">
              <span className="font-medium text-teal-900">DoktorTakvimi Profil & Değerlendirmeler</span>
              <a
                href="https://www.doktortakvimi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-teal-700 hover:underline"
              >
                <span>İncele</span>
                <FaExternalLinkAlt size={9} />
              </a>
            </div>

          </div>

        </div>

        {/* Harita */}
        <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200">
          <GoogleMap />
        </div>

      </div>
    </div>
  );
}
