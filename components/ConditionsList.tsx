import { FaCheck } from 'react-icons/fa';
import { CONDITIONS } from '@/lib/constants';

export default function ConditionsList() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Left: Clinical Philosophy from Cihat Seyrek */}
      <div className="lg:col-span-5 space-y-5 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/80">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          Osteopati; vücuttaki problemi sadece ağrı olan bölgede aramaz.
        </h3>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Ağrının kaynağını tespit ederek sorunu kalıcı biçimde çözmeye çalışır. Kas-iskelet sistemi,
          iç organlar, omurga, vücut zarları (fasya), sinir sistemi ve dolaşım sistemi üzerinde
          çalışarak, sağlığın devamlılığı için bunların uyum içinde işleyebilmelerini sağlar.
        </p>
        <div className="p-4 bg-teal-900 text-teal-50 rounded-xl text-xs sm:text-sm leading-relaxed font-medium">
          "Geleneksel tıbbın aksine, sadece semptomları baskılamakla kalmaz; genetik yapı, yaşam tarzı,
          çevresel faktörler ve biyomekanik zinciri birlikte ele alarak kişiye özel bir tedavi süreci sunar."
        </div>
      </div>

      {/* Right: Conditions Grid */}
      <div className="lg:col-span-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {CONDITIONS.map((condition) => (
            <div
              key={condition}
              className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-slate-200/70 hover:border-teal-400/80 hover:bg-teal-50/20 transition-all duration-150"
            >
              <div className="w-6 h-6 rounded-full bg-teal-100/70 text-teal-700 flex items-center justify-center shrink-0">
                <FaCheck size={10} />
              </div>
              <span className="text-slate-800 text-sm font-semibold tracking-tight">
                {condition}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-5 italic">
          * Belirtilen rahatsızlıkların yanı sıra ameliyat öncesi/sonrası fizik tedavi ve duruş (postür) bozuklukları için de kişiye özel klinik program uygulanmaktadır.
        </p>
      </div>
    </div>
  );
}
