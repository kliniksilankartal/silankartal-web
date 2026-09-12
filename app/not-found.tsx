import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 bg-slate-50/50">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm text-center">
        <div className="text-5xl font-extrabold text-teal-700 mb-2">404</div>
        <h1 className="text-xl font-bold text-slate-900 mb-3">
          Sayfa Bulunamadı
        </h1>
        <p className="text-slate-600 text-sm mb-8 leading-relaxed">
          Ulaşmaya çalıştığınız sayfa taşınmış veya kaldırılmış olabilir. Anasayfaya dönerek klinik hizmetlerimizi inceleyebilirsiniz.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          Anasayfaya Dön
        </Link>
      </div>
    </div>
  );
}
