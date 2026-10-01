'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaPhone, FaWhatsapp, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/lib/constants';
import { SiteContent } from '@/lib/content-types';

export default function Hero({ initialContent }: { initialContent?: SiteContent }) {
  const [content, setContent] = useState<SiteContent | null>(initialContent || null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error('Hero content loading error:', err));
  }, []);

  const featureCards = content?.featureCards && content.featureCards.length > 0
    ? content.featureCards
    : [
        { id: '1', title: 'Omurga Sağlığı', description: 'Bel ve boyun fıtığında ameliyatsız kalıcı yaklaşım.', createdAt: '' },
        { id: '2', title: 'Birebir Seans', description: 'Her seansta kesintisiz 50–60 dk detaylı manuel terapi.', createdAt: '' },
        { id: '3', title: 'Kök Neden Odaklı', description: 'Fasya, visseral organlar ve postüral denge analizi.', createdAt: '' }
      ];

  const featuredCards = featureCards.slice(0, 3);
  const remainingCards = featureCards.slice(3);

  // Dinamik Veriler
  const heroImage = content?.images?.heroImage || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80';
  const doctorName = content?.general?.doctorName || 'Fzt. Şilan Kartal';
  const clinicName = content?.header?.clinicName || 'Özel Sağlık Meslek Hizmet Birimi';
  const address = content?.general?.address || CONTACT_INFO.address;
  const phone = content?.general?.phone || CONTACT_INFO.phone;
  const phoneRaw = phone.replace(/[^0-9]/g, '');

  const badge = content?.hero?.badge || `Başakşehir Kliniği — ${CONTACT_INFO.shortAddress}`;
  const badgeSub = content?.hero?.badgeSub || 'Ortopedik Manuel Terapi & Klinik Fizyoterapi';
  const titlePrefix = content?.hero?.titlePrefix || 'Bedeni bir bütün olarak dinliyor,';
  const titleHighlight = content?.hero?.titleHighlight || 'ağrının gerçek kaynağını';
  const titleSuffix = content?.hero?.titleSuffix || 'çözüyoruz.';
  const description = content?.hero?.description || 
    'Omurga, bel ve boyun fıtıklarında sadece semptomları baskılamak yerine; kas-iskelet biyomekaniği, eklem mobilitesi ve postüral dengeyi kanıtlanmış manuel terapi teknikleriyle restore ediyoruz. Her danışan için birebir, sakin ve kişiselleştirilmiş bir rehabilitasyon süreci.';

  return (
    <section className="relative bg-[#FAFCFB] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-100/80 overflow-hidden">
      
      {/* Arka Plan Zarif Işıltı Efektleri */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E8F3F0] rounded-full blur-3xl pointer-events-none opacity-60 -z-10" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#F0F7F4] rounded-full blur-2xl pointer-events-none opacity-80 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Üst Zarif Lokasyon ve Uzmanlık Etiketi */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#155E54]/15 shadow-2xs text-xs font-semibold text-[#155E54]">
            <span className="w-2 h-2 rounded-full bg-[#155E54] animate-pulse" />
            <span>{badge}</span>
          </div>
          {badgeSub && (
            <span className="hidden sm:inline text-xs text-[#526663] font-medium">
              {badgeSub}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Sol Kolon: Tıbbi & İnsani Mesaj */}
          <div className="lg:col-span-7 space-y-7">
            
            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-[#192624] tracking-tight leading-[1.18]">
              {titlePrefix}{' '}
              <span className="text-[#155E54] relative inline-block">
                {titleHighlight}
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-[#155E54]/30" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>{' '}
              {titleSuffix}
            </h1>

            <p className="text-[#526663] text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              {description}
            </p>

            {/* DİNAMİK KART SİSTEMİ (EN YENİ 3 KART VİTRİNDE) */}
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {featuredCards.map((card, idx) => (
                  <div
                    key={card.id || idx}
                    className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#155E54]/30 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EBF5F3] text-[#155E54] flex items-center justify-center text-xs font-bold mb-2.5">
                      ✓
                    </div>
                    <div className="text-sm font-bold text-[#192624] mb-1 group-hover:text-[#155E54] transition-colors">
                      {card.title}
                    </div>
                    <p className="text-xs text-[#526663] leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Açılır / Kapanır Diğer Kartlar */}
              {remainingCards.length > 0 && (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-3 gap-3 overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-96 opacity-100 pt-1' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  {remainingCards.map((card, idx) => (
                    <div
                      key={card.id || idx}
                      className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#155E54]/30 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#EBF5F3] text-[#155E54] flex items-center justify-center text-xs font-bold mb-2.5">
                        ✓
                      </div>
                      <div className="text-sm font-bold text-[#192624] mb-1 group-hover:text-[#155E54] transition-colors">
                        {card.title}
                      </div>
                      <p className="text-xs text-[#526663] leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {remainingCards.length > 0 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#155E54] hover:text-[#0E433C] py-1 transition-colors cursor-pointer"
                >
                  <span>
                    {isExpanded ? 'Daha Az Göster' : `Diğer Uzmanlık ve Yöntemleri Gör (+${remainingCards.length})`}
                  </span>
                  {isExpanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                </button>
              )}
            </div>

            {/* Eylemler ve Hızlı İletişim */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center gap-2.5 bg-[#155E54] hover:bg-[#0E433C] text-white px-7 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FaPhone size={14} />
                <span>İletişime Geç</span>
              </Link>
              <a
                href={content?.general?.whatsapp ? `https://wa.me/${content.general.whatsapp.replace(/[^0-9]/g, '')}` : SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm"
              >
                <FaWhatsapp size={17} />
                <span>WhatsApp ile Danışın</span>
              </a>
              <a
                href={`tel:${phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 text-[#192624] hover:text-[#155E54] text-xs font-semibold px-4 py-3 transition-colors"
              >
                <FaPhone size={11} className="text-[#155E54]" />
                <span>{phone}</span>
              </a>
            </div>

          </div>

          {/* Sağ Kolon: Dinamik Hero Seans / Profil Fotoğrafı */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Ana Görsel Çerçevesi - Dinamik */}
              <div className="relative h-[460px] sm:h-[520px] w-full rounded-3xl overflow-hidden shadow-xl border-2 border-white bg-slate-900">
                <Image
                  src={heroImage}
                  alt={`${doctorName} Kliniği - Fizyoterapi ve Manuel Terapi`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  unoptimized={Boolean(heroImage && heroImage.startsWith('data:'))}
                />
                
                {/* Karartma ve Bilgi Bandı */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-[11px] font-bold tracking-[0.2em] text-[#A3E0D4] uppercase">
                    {doctorName}
                  </div>
                  <div className="text-base font-semibold text-white mt-1">
                    {clinicName}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                    {address}
                  </p>
                </div>
              </div>

              {/* Sol Üst Şık Vurgu Kartı (Dinamik) */}
              <div className="hidden sm:block absolute -top-4 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-lg max-w-[240px]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#155E54] mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#155E54]" />
                  <span>{content?.hero?.quoteTitle || 'Bütüncül Yaklaşım'}</span>
                </div>
                <p className="text-[11px] text-[#526663] leading-snug">
                  {content?.hero?.quoteText || '"Ağrı nerede olursa olsun, kaynak biyomekanik zincirin başka bir halkasında olabilir."'}
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
