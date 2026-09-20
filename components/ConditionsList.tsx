'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FaCheck, 
  FaQuoteLeft, 
  FaArrowRight, 
  FaPhoneAlt,
  FaShieldAlt,
  FaHeartbeat
} from 'react-icons/fa';

interface ConditionItem {
  name: string;
  category: string;
}

const CONDITIONS_WITH_CATEGORY: ConditionItem[] = [
  { name: 'Bel Fıtığı (Lomber Disk Hernisi)', category: 'Omurga' },
  { name: 'Boyun Fıtığı (Servikal Disk Hernisi)', category: 'Omurga' },
  { name: 'Boyun Düzleşmesi & Sırt Ağrısı', category: 'Omurga' },
  { name: 'Siyatik & Piriformis Sendromu', category: 'Sinir Sıkışması' },
  { name: 'Baş Ağrısı ve Gerilim Tipi Migren', category: 'Nörolojik' },
  { name: 'Kulak Çınlaması (Somatosensoriyel Tinnitus)', category: 'Baş-Boyun' },
  { name: 'Diş Sıkma (Bruksizm)', category: 'Çene & TME' },
  { name: 'Çene Eklemi Rahatsızlıkları (TME)', category: 'Çene & TME' },
  { name: 'Donuk Omuz & Omuz Sıkışması', category: 'Eklem' },
  { name: 'Diz Kireçlenmesi (Gonartroz) & Menisküs', category: 'Eklem' },
  { name: 'Sporcu Yaralanmaları & Spora Dönüş', category: 'Sporcu' },
  { name: 'Fibromiyalji & Kronik Ağrı Sendromu', category: 'Miyofasyal' },
];

export default function ConditionsList() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF5F3] text-[#155E54] text-xs font-bold uppercase tracking-wider mb-3">
            <FaHeartbeat className="text-[#155E54]" />
            <span>Klinik Tedavi Alanlarımız</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Sık Karşılaştığımız Rahatsızlıklar &amp; Çözümler
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Ağrıyı sadece baskılamak yerine; kök nedene inen biyomekanik ve manuel terapi odaklı klinik yaklaşım.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Sol Kolon: Klinik Felsefesi & Hekim Vurgusu (Kart Tasarımı) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-br from-[#103D37] via-[#155E54] to-[#0A2E29] rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
            {/* Dekoratif Işık Efekti */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-bold uppercase tracking-wider">
                <FaShieldAlt size={12} />
                <span>Bütüncül Manuel Terapi</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug tracking-tight text-white">
                Vücuttaki problemi sadece ağrı olan bölgede aramıyoruz.
              </h3>

              <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
                Ağrının kaynağını tespit ederek kas-iskelet ve eklem biyomekaniğini kalıcı biçimde restore ediyoruz. Omurga hizalanması, miyofasyal gerginlikler ve hareket kısıtlılıkları üzerinde çalışarak fonksiyonel dengeyi yeniden kazandırıyoruz.
              </p>

              {/* Alıntı Kutusu */}
              <div className="relative bg-black/25 backdrop-blur-md border border-white/15 rounded-2xl p-5 sm:p-6 text-xs sm:text-sm leading-relaxed text-emerald-50">
                <FaQuoteLeft className="text-emerald-400/40 text-2xl absolute top-3 right-4 pointer-events-none" />
                <p className="italic font-medium">
                  &ldquo;Sadece semptomları geçici olarak rahatlatmak yerine; postüral zinciri, eklem biyomekaniğini ve kişiye özel klinik egzersizleri birleştirerek kalıcı ve ameliyatsız iyileşme sağlıyoruz.&rdquo;
                </p>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200">
                  <span className="font-bold text-white">Fzt. Şilan Kartal</span>
                  <span className="text-emerald-300/80">Klinik Direktörü</span>
                </div>
              </div>
            </div>

            {/* Alt Eylem Butonu */}
            <div className="relative z-10 pt-8 mt-6 border-t border-white/10">
              <Link
                href="/iletisim"
                className="w-full inline-flex items-center justify-center gap-2.5 bg-white hover:bg-emerald-50 text-[#155E54] font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-[0.99]"
              >
                <FaPhoneAlt size={13} />
                <span>Danışmanlık &amp; Seans Al</span>
                <FaArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Sağ Kolon: Rahatsızlık Kartları Grid */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {CONDITIONS_WITH_CATEGORY.map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-white hover:bg-emerald-50/40 p-4 rounded-2xl border border-slate-200/90 hover:border-[#155E54]/40 transition-all duration-200 shadow-2xs hover:shadow-sm flex items-start gap-3.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#EBF5F3] text-[#155E54] group-hover:bg-[#155E54] group-hover:text-white transition-colors flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <FaCheck size={12} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#155E54] block mb-0.5">
                      {item.category}
                    </span>
                    <h4 className="text-slate-900 font-bold text-xs sm:text-sm leading-snug tracking-tight group-hover:text-[#155E54] transition-colors">
                      {item.name}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

            {/* Alt Dipnot & Güven Rozeti */}
            <div className="mt-6 p-4 rounded-2xl bg-white border border-slate-200/80 flex items-start sm:items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1 sm:mt-0 animate-pulse" />
              <p className="text-xs text-slate-600 leading-relaxed">
                * Belirtilen rahatsızlıkların yanı sıra ameliyat öncesi/sonrası fizik tedavi, postür analizi ve kişiye özel klinik egzersiz programı uygulanmaktadır.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
