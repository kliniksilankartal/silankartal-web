import { NavLink, FAQItem } from './types';

/** Site genel bilgileri */
export const SITE_CONFIG = {
  name: 'Şilan Kartal',
  clinicName: 'Özel Sağlık Meslek Hizmet Birimi',
  title: 'Fzt. Şilan Kartal – Fizyoterapi ve Rehabilitasyon & Manuel Terapi',
  description: 'Bel ve boyun fıtığı, omurga sağlığı, ortopedik manuel terapi ve klinik rehabilitasyon alanlarında kanıta dayalı fizyoterapi yaklaşımı.',
  url: 'https://silankartal.com.tr',
  locale: 'tr_TR',
  credentials: 'Uzm. Fizyoterapist',
  subTitle: 'Fizyoterapi ve Rehabilitasyon & Manuel Terapi',
} as const;

/** İletişim bilgileri */
export const CONTACT_INFO = {
  phone: '0545 190 10 60',
  phoneFormatted: '+90 545 190 10 60',
  phoneRaw: '905451901060',
  email: 'info@silankartal.com.tr',
  address: 'Necmettin Erbakan Caddesi, Ebik İş Merkezi, Kat: 2, Daire: 10, Başakşehir / İstanbul',
  shortAddress: 'Ebik İş Merkezi K:2 D:10, Necmettin Erbakan Cd.',
  city: 'Başakşehir, İstanbul',
  workingHours: 'Pazartesi - Pazar (Her Gün): 08:00 - 22:00',
  workingHoursShort: 'Her Gün 08:00 - 22:00',
  mapEmbedUrl: 'https://maps.google.com/maps?q=Necmettin+Erbakan+Caddesi+Ba%C5%9Fak%C5%9Fehir+%C4%B0stanbul&t=&z=15&ie=UTF8&iwloc=&output=embed',
} as const;

/** Sosyal medya linkleri */
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/',
  twitter: 'https://twitter.com/',
  linkedin: 'https://linkedin.com/',
  whatsapp: `https://wa.me/${CONTACT_INFO.phoneRaw}`,
} as const;

/** Navigasyon menüsü */
export const NAV_LINKS: NavLink[] = [
  { label: 'Anasayfa', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Sık Sorulan Sorular', href: '/sss' },
  { label: 'Özgeçmiş', href: '/hakkimda' },
  { label: 'İletişim', href: '/iletisim' },
];

/** Tedavi edilen rahatsızlıklar */
export const CONDITIONS = [
  'Bel fıtığı',
  'Boyun fıtığı',
  'Baş ağrısı ve migren',
  'Kulak çınlaması (Tinnitus)',
  'Siyatik ve piriformis sendromu',
  'Diş sıkma (Bruksizm)',
  'Boyun düzleşmesi',
  'Spor yaralanmaları',
  'Fibromiyalji sendromu',
  'Donuk omuz',
  'Çene eklemi rahatsızlıkları (TME)',
  'Diz kireçlenmesi (Gonartroz)',
] as const;

/** SSS verileri */
export const FAQ_DATA: FAQItem[] = [
  {
    question: 'Fizyoterapi seansı ne kadar sürer?',
    answer: 'Bir fizyoterapi seansı genellikle 50-60 dakika sürer. İlk seansta detaylı klinik değerlendirme yapıldığı için süre biraz daha uzun olabilir. Tedavi planınız, şikayetlerinize ve ihtiyaçlarınıza göre kişiselleştirilir.',
  },
  {
    question: 'Manuel terapi nedir ve nasıl uygulanır?',
    answer: 'Manuel terapi; eklem, kas ve sinir sistemine yönelik özel el teknikleriyle uygulanan kanıta dayalı bir fizyoterapi yöntemidir. Ağrıyı hafifletir, hareket kısıtlılığını giderir ve fonksiyonel iyileşmeyi hızlandırır.',
  },
  {
    question: 'Kaç seans tedavi görmem gerekir?',
    answer: 'Tedavi süresi kişinin şikayetine, şikayetin süresine ve doku yanıtına göre değişir. Akut problemlerde 3-6 seans yeterli olabilirken, kronik durumlarda 8-12 seans gerekebilir. İlk değerlendirmeden sonra size özel bir tedavi planı oluşturulur.',
  },
  {
    question: 'Tedavi ağrılı mıdır?',
    answer: 'Tedavi sırasında hafif bir rahatsızlık hissedebilirsiniz, ancak şiddetli ağrı olmamalıdır. Terapistiniz her zaman sizin konfor seviyenize göre teknik uygular. Tedavi sonrası hafif bir kas hassasiyeti normal olup genellikle 24-48 saat içinde geçer.',
  },
  {
    question: 'Randevu almadan gelebilir miyim?',
    answer: 'Size en iyi hizmeti sunabilmek ve seans kalitesini korumak için birebir randevu sistemi ile çalışmaktayız. Telefon veya WhatsApp üzerinden kolayca seans saatinizi belirleyebilirsiniz.',
  },
  {
    question: 'Hangi rahatsızlıklarda fizyoterapi uygulanır?',
    answer: 'Bel ve boyun fıtığı, spor yaralanmaları, duruş bozuklukları, fibromiyalji, donuk omuz, tenisçi dirseği, diz kireçlenmesi, ameliyat sonrası rehabilitasyon ve kas-iskelet sistemi ağrılarında fizyoterapi uygulanabilir.',
  },
  {
    question: 'Kliniğiniz hangi gün ve saatlerde açık?',
    answer: 'Kliniğimiz Pazar günleri de dahil olmak üzere haftanın her günü 08:00 - 22:00 saatleri arasında kesintisiz hizmet vermektedir.',
  },
  {
    question: 'Kliniğin tam konumu ve adresi neresidir?',
    answer: 'Kliniğimiz İstanbul Başakşehir\\\'de, Necmettin Erbakan Caddesi Ebik İş Merkezi Kat: 2, Daire: 10 adresindedir.',
  },
];
