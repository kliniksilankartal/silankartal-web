'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPhone, FaBars, FaTimes, FaEnvelope, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { NAV_LINKS, CONTACT_INFO, SITE_CONFIG } from '@/lib/constants';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Bar - Minimalist Clinical Info */}
      <div
        className={`bg-slate-900 text-slate-300 text-xs transition-all duration-300 ${
          isScrolled ? 'max-h-0 opacity-0 overflow-hidden py-0' : 'py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-5">
            <span className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <FaMapMarkerAlt className="text-teal-400" size={11} />
              <span>{CONTACT_INFO.city}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <FaClock className="text-teal-400" size={11} />
              <span>{CONTACT_INFO.workingHoursShort}</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <FaEnvelope className="text-teal-400" size={11} />
              <span>{CONTACT_INFO.email}</span>
            </a>
            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="flex items-center gap-1.5 text-teal-400 font-semibold hover:text-teal-300 transition-colors"
            >
              <FaPhone size={10} />
              <span>{CONTACT_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div
        className={`transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-slate-200 py-3'
            : 'bg-white border-slate-100 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Professional Clinic Typography Brand */}
            <Link href="/" className="group flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#192624] group-hover:text-[#155E54] transition-colors">
                Fzt. {SITE_CONFIG.name}
              </span>
              <span className="text-[10px] sm:text-[11px] tracking-[0.18em] font-semibold text-[#155E54] uppercase">
                {SITE_CONFIG.subTitle}
              </span>
            </Link>

            {/* Desktop Navigation (Exactly 5 items requested) */}
            <nav className="hidden lg:flex items-center space-x-7">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#192624] hover:text-[#155E54] transition-colors duration-200 text-sm font-semibold tracking-wide relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#155E54] hover:after:w-full after:transition-all after:duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                href="/iletisim"
                className="bg-[#155E54] hover:bg-[#0E433C] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 shadow-2xs hover:shadow-xs"
              >
                İletişime Geç
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#192624] hover:text-[#155E54] transition-colors"
              aria-label={isMobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            >
              {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 pb-2 border-t border-slate-100 animate-fadeIn">
              <nav className="flex flex-col space-y-3">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[#192624] hover:text-[#155E54] hover:bg-[#EBF5F3] px-3 py-2 rounded-lg transition-colors text-base font-semibold"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="flex items-center justify-center space-x-2 text-[#155E54] font-bold py-2.5 bg-[#EBF5F3] rounded-lg text-sm"
                >
                  <FaPhone size={13} />
                  <span>{CONTACT_INFO.phone}</span>
                </a>
                <Link
                  href="/iletisim"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center bg-[#155E54] hover:bg-[#0E433C] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-2xs"
                >
                  İletişime Geç
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
