'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaFacebookF, FaLinkedinIn, FaClock } from 'react-icons/fa';
import { SITE_CONFIG, CONTACT_INFO, SOCIAL_LINKS, NAV_LINKS } from '@/lib/constants';

export default function Footer() {
  const pathname = usePathname();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch(() => {});
  }, []);

  // Admin sayfalarında Footer tamamen gizlenir
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const phone = content?.general?.phone || CONTACT_INFO.phone;
  const phoneRaw = phone.replace(/[^0-9]/g, '');
  const clinicName = content?.header?.clinicName || SITE_CONFIG.clinicName;
  const address = content?.general?.address || CONTACT_INFO.address;
  const workingHours = content?.general?.workingHours || CONTACT_INFO.workingHours;
  const doctorName = content?.general?.doctorName || SITE_CONFIG.name;
  const footerDesc = content?.footer?.description || 
    "Kas-iskelet sistemi, omurga biyomekaniği ve ortopedik manuel terapi uygulamaları ile ağrının kökenine inen kanıta dayalı klinik yaklaşım.";

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Açıklama */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold text-white tracking-tight block">
                {doctorName}
              </span>
              <span className="text-[10px] tracking-[0.14em] text-teal-400 uppercase font-medium">
                {clinicName}
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              {footerDesc}
            </p>
            {/* Sosyal Medya */}
            <div className="flex items-center space-x-3 pt-2">
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 bg-slate-800 hover:bg-teal-700 text-slate-300 hover:text-white rounded-lg flex items-center justify-center transition-colors">
                <FaInstagram size={15} />
              </a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 bg-slate-800 hover:bg-teal-700 text-slate-300 hover:text-white rounded-lg flex items-center justify-center transition-colors">
                <FaFacebookF size={15} />
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 bg-slate-800 hover:bg-teal-700 text-slate-300 hover:text-white rounded-lg flex items-center justify-center transition-colors">
                <FaLinkedinIn size={15} />
              </a>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Hızlı Linkler</h3>
            <nav className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* İletişim Bilgileri */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">İletişim</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary mt-1 shrink-0" size={14} />
                <span className="text-sm text-gray-400">{address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-primary shrink-0" size={14} />
                <a href={`tel:${phoneRaw}`} className="text-sm text-gray-400 hover:text-primary transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-primary shrink-0" size={14} />
                <a href={`mailto:${content?.general?.email || CONTACT_INFO.email}`} className="text-sm text-gray-400 hover:text-primary transition-colors">
                  {content?.general?.email || CONTACT_INFO.email}
                </a>
              </div>
            </div>
          </div>

          {/* Çalışma Saatleri */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Çalışma Saatleri</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <FaClock className="text-primary shrink-0" size={14} />
                <span className="text-sm text-gray-400">{workingHours}</span>
              </div>
              <p className="text-sm text-teal-400 font-medium mt-2">Pazar günleri de dahil her gün açığız.</p>
            </div>
          </div>
        </div>

        {/* Disclaimer + Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-500 mb-4">
            Sitede yer alan tüm içerikler bilgilendirme amaçlıdır, tanı ve tedavi için lütfen doktorunuza başvurun.
          </p>
          <p className="text-sm text-gray-500">
            {content?.footer?.copyright || `© ${currentYear} ${doctorName}. Tüm hakları saklıdır.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
