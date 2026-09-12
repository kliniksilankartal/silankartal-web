'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaPhone, FaCalendarCheck, FaWhatsapp, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/lib/constants';
import { SiteContent } from '@/lib/content';

export default function Hero() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error('Hero content loading error:', err));
  }, []);

  const featureCards = content?.featureCards || [
    { id: '1', title: 'Omurga Sağlığı', description: 'Bel ve boyun fıtığında ameliyatsız kalıcı yaklaşım.' },
    { id: '2', title: 'Birebir Seans', description: 'Her seansta kesintisiz 50–60 dk detaylı manuel terapi.' },
    { id: '3', title: 'Kök Neden Odaklı', description: 'Fasya, visseral organlar ve postüral denge analizi.' }
  ];

  // En yeni ilk 3 kart vitrinde
  const featuredCards = featureCards.slice(0, 3);
  // Kuyruktan çıkan diğer eski kartlar
  const remainingCards = featureCards.slice(3);

  const heroImage = content?.images?.heroImage || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80';
  const doctorName = content?.general?.doctorName || 'Fzt. Şilan Kartal';

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
            <span>Nişantaşı Kliniği — {CONTACT_INFO.city}</span>
          </div>
          <span className="hidden sm:inline text-xs text-[#526663] font-medium">
            Bütüncül Osteopati & Ortopedik Manuel Terapi
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Sol Kolon: Tıbbi & İnsani Mesaj */}
          <div className="lg:col-span-7 space-y-7">
            
            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-[#192624] tracking-tight leading-[1.18]">
              Bedeni bir bütün olarak dinliyor,{' '}
              <span className="text-[#155E54] relative inline-block">
                ağrının gerçek kaynağını
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-[#155E54]/30" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>{' '}
              çözüyoruz.
            </h1>

            <p className="text-[#526663] text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Omurga, bel ve boyun fıtıklarında sadece semptomları baskılamak yerine;
              kas-iskelet sistemi, iç organ fasyası ve kranial sinir ritmi arasındaki
              doğal dengeyi yeniden kuruyoruz. Her danışan için birebir, sakin ve kanıta dayalı
              bir iyileşme süreci.
            </p>

            {/* DİNAMİK KART SİSTEMİ (EN YENİ 3 KART VİTRİNDE) */}
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {featuredCards.map((card) => (
                  <div key={card.id} className="p-3.5 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                    <div className="text-xs font-bold text-[#155E54] uppercase tracking-wider mb-1 line-clamp-1">
                      {card.title}
                    </div>
                    <div className="text-xs text-[#526663] leading-snug line-clamp-2">
                      {card.description}
                    </div>
                  </div>
                ))}
              </div>

              {/* KUYRUKTAN ÇIKAN ESKİ KARTLAR İÇİN GENİŞLETİLEBİLİR ALT SATIR */}
              {isExpanded && remainingCards.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 animate-fadeIn">
                  {remainingCards.map((card) => (
                    <div key={card.id} className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/90 shadow-2xs">
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 line-clamp-1">
                        {card.title}
                      </div>
                      <div className="text-xs text-slate-500 leading-snug line-clamp-2">
                        {card.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* GENİŞLET / DARALT BUTONU */}
              {remainingCards.length > 0 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155E54] hover:text-[#0E433C] pt-1 transition-colors"
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
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm"
              >
                <FaWhatsapp size={17} />
                <span>WhatsApp ile Danışın</span>
              </a>
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="inline-flex items-center justify-center gap-2 text-[#192624] hover:text-[#155E54] text-xs font-semibold px-4 py-3 transition-colors"
              >
                <FaPhone size={11} className="text-[#155E54]" />
                <span>{CONTACT_INFO.phone}</span>
              </a>
            </div>

          </div>

          {/* Sağ Kolon: Dinamik Hero Seans Fotoğrafı */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Ana Görsel Çerçevesi */}
              <div className="relative h-[460px] sm:h-[520px] w-full rounded-3xl overflow-hidden shadow-xl border-2 border-white bg-slate-100">
                <Image
                  src={heroImage}
                  alt={`${doctorName} Kliniği - Osteopati Seansı`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />
                
                {/* Karartma ve Bilgi Bandı */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-[11px] font-bold tracking-[0.2em] text-[#A3E0D4] uppercase">
                    {doctorName}
                  </div>
                  <div className="text-base font-semibold text-white mt-1">
                    Osteopati & Fizyoterapi ve Rehabilitasyon
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Valikonağı Caddesi, Nişantaşı / Şişli
                  </p>
                </div>
              </div>

              {/* Sol Üst Şık Vurgu Kartı */}
              <div className="hidden sm:block absolute -top-4 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-lg max-w-[220px]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#155E54] mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#155E54]" />
                  <span>Bütüncül Yaklaşım</span>
                </div>
                <p className="text-[11px] text-[#526663] leading-snug">
                  "Ağrı nerede olursa olsun, kaynak biyomekanik zincirin başka bir halkasında olabilir."
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
