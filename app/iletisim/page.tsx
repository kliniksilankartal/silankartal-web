import type { Metadata } from 'next';
import Link from 'next/link';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp } from 'react-icons/fa';
import ContactForm from '@/components/ContactForm';
import GoogleMap from '@/components/GoogleMap';
import SectionTitle from '@/components/SectionTitle';
import { CONTACT_INFO, SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants';
import { getSiteContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `İletişim & Danışma | ${SITE_CONFIG.name}`,
  description: `${SITE_CONFIG.name} Başakşehir Kliniği iletişim ve ulaşım bilgileri.`,
};

export default function IletisimPage() {
  const content = getSiteContent();

  const phone = content.general?.phone || CONTACT_INFO.phone;
  const phoneRaw = phone.replace(/[^0-9]/g, '');
  const clinicName = content.header?.clinicName || SITE_CONFIG.clinicName;
  const address = content.general?.address || CONTACT_INFO.address;
  const workingHours = content.general?.workingHours || CONTACT_INFO.workingHours;
  const email = content.general?.email || CONTACT_INFO.email;
  const whatsappRaw = (content.general?.whatsapp || CONTACT_INFO.phoneRaw).replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappRaw}`;

  const cPage = content.contactPage || {
    formTitle: 'İletişim ve Danışma Formu',
    formSubtitle: clinicName,
    formDescription: 'Lütfen şikayetinizi ve uygun olduğunuz gün/saat aralığını belirtiniz. En kısa sürede geri dönüş yapılacaktır.',
    addressDetail: 'Ebik İş Merkezi Kat: 2 Daire: 10',
    whatsappText: 'WhatsApp üzerinden mesaj gönderin',
    sundayNote: 'Pazar günleri de dahil olmak üzere haftanın her günü açığız.',
  };

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
          title="Klinik İletişim ve Danışma"
          subtitle="Seans talebinde bulunmak, sorularınızı iletmek veya adres tarifimiz için bize dilediğiniz kanaldan ulaşabilirsiniz."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start">
          
          {/* İletişim Formu (Sol Taraf) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-1">{cPage.formTitle}</h3>
            <span className="text-xs text-teal-700 font-semibold block mb-3">{cPage.formSubtitle || clinicName}</span>
            <p className="text-slate-500 text-xs mb-6">
              {cPage.formDescription}
            </p>
            <ContactForm />
          </div>

          {/* İletişim Bilgileri Kartları (Sağ Taraf) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Adres */}
            <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center shrink-0">
                <FaMapMarkerAlt size={16} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Klinik Adresi</h4>
                <p className="text-slate-600 text-xs leading-relaxed">{address}</p>
                {cPage.addressDetail && (
                  <p className="text-[11px] text-teal-700 font-semibold mt-1">{cPage.addressDetail}</p>
                )}
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
                  href={`tel:${phoneRaw}`}
                  className="text-base font-bold text-teal-700 hover:text-teal-800 block"
                >
                  {phone}
                </a>
                <div className="mt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:underline"
                  >
                    <FaWhatsapp size={13} />
                    <span>{cPage.whatsappText || 'WhatsApp üzerinden mesaj gönderin'}</span>
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
                  href={`mailto:${email}`}
                  className="text-xs text-slate-600 hover:text-teal-700 transition-colors font-medium"
                >
                  {email}
                </a>
              </div>
            </div>

            {/* Çalışma Saatleri */}
            <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center shrink-0">
                <FaClock size={14} />
              </div>
              <div className="text-xs text-slate-600">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Çalışma Saatleri</h4>
                <p className="font-semibold text-slate-800">{workingHours}</p>
                {cPage.sundayNote && (
                  <p className="text-emerald-700 font-medium mt-1">{cPage.sundayNote}</p>
                )}
              </div>
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
