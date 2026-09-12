import type { Metadata } from 'next';
import Link from 'next/link';
import { FaPhone, FaWhatsapp } from 'react-icons/fa';
import FAQAccordion from '@/components/FAQAccordion';
import SectionTitle from '@/components/SectionTitle';
import { FAQ_DATA, SITE_CONFIG, CONTACT_INFO, SOCIAL_LINKS } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Sık Sorulan Sorular | ${SITE_CONFIG.name}`,
  description: 'Osteopati, fizyoterapi seansları, tedavi süreci ve klinik randevuları hakkında merak edilen sorular.',
};

export default function SSSPage() {
  return (
    <div className="py-12 lg:py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <li><Link href="/" className="hover:text-teal-700 transition-colors">Anasayfa</Link></li>
            <li>/</li>
            <li className="text-slate-800 font-semibold">Sık Sorulan Sorular</li>
          </ol>
        </nav>

        <SectionTitle
          badge="MERAK EDİLENLER"
          title="Sık Sorulan Sorular"
          subtitle="Osteopati seansları, seans süreleri, seans sıklığı ve tedavi süreci ile ilgili en çok yöneltilen sorular."
        />

        <div className="max-w-3xl mx-auto mb-16">
          <FAQAccordion items={FAQ_DATA} />
        </div>

        {/* Yardım Kutusu */}
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Sorunuza Yanıt Bulamadınız mı?
          </h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
            Özel durumunuzu veya MR/tetkik sonuçlarınızı iletmek ve seans uygunluğunuzu öğrenmek için doğrudan ulaşabilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/iletisim"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              <span>İletişim Formu</span>
            </Link>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
            >
              <FaWhatsapp size={16} />
              <span>WhatsApp'tan Sorun</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
