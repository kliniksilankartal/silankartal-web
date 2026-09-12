import { CONTACT_INFO } from '@/lib/constants';

export default function GoogleMap() {
  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg">
      <iframe
        src={CONTACT_INFO.mapEmbedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Klinik Konumu - Google Maps"
      />
    </div>
  );
}
