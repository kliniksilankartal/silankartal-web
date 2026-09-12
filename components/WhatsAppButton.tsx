'use client';

import { FaWhatsapp } from 'react-icons/fa';
import { SOCIAL_LINKS } from '@/lib/constants';

export default function WhatsAppButton() {
  return (
    <a
      href={SOCIAL_LINKS.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile randevu ve bilgi alın"
      title="WhatsApp ile İletişim"
      className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 group"
    >
      <FaWhatsapp size={22} className="shrink-0 transition-transform group-hover:scale-110" />
      <span className="sr-only">WhatsApp ile Randevu Al</span>
    </a>
  );
}
