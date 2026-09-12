export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-primary-light border-t-primary rounded-full animate-spin" />
        <p className="mt-4 text-text-secondary text-sm">Yükleniyor...</p>
      </div>
    </div>
  );
}
