import { NavLink, FAQItem } from './types';

/** Site genel bilgileri */
export const SITE_CONFIG = {
  name: 'Şilan Kartal',
  title: 'Fzt. Şilan Kartal – Osteopati & Fizyoterapi ve Rehabilitasyon',
  description: 'Bel ve boyun fıtığı, omurga sağlığı, kranial ve visseral osteopati alanlarında kanıta dayalı, bütüncül klinik yaklaşım.',
  url: 'https://silankartal.com',
  locale: 'tr_TR',
  credentials: 'Fizyoterapist & Osteopat',
  subTitle: 'Osteopati & Fizyoterapi ve Rehabilitasyon',
} as const;

/** İletişim bilgileri */
export const CONTACT_INFO = {
  phone: '+90 555 555 55 55',
  phoneRaw: '905555555555',
  email: 'iletisim@silankartal.com',
  address: 'Valikonağı Caddesi No:48, Kat:3, Nişantaşı, Şişli / İstanbul',
  city: 'Nişantaşı / Şişli, İstanbul',
  workingHours: 'Pazartesi - Cumartesi: 09:00 - 19:00',
  workingHoursShort: 'Pzt-Cts 09:00 - 19:00',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.6416629983193!2d28.988894176509827!3d41.04875391717387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab76e7368297b%3A0xe5567b458b6eb74a!2sValikona%C4%9F%C4%B1%20Cd.%2C%20%C5%9Ei%C5%9Fli%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1710000000000!5m2!1str!2str',
  doctorCalendarUrl: 'https://www.doktortakvimi.com',
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
    answer: 'Bir fizyoterapi seansı genellikle 45-60 dakika sürer. İlk seansta detaylı değerlendirme yapıldığı için süre biraz daha uzun olabilir. Tedavi planınız, şikayetlerinize ve ihtiyaçlarınıza göre kişiselleştirilir.',
  },
  {
    question: 'Osteopati nedir ve fizyoterapiden farkı nedir?',
    answer: 'Osteopati, vücudu bir bütün olarak ele alan manuel bir tedavi yöntemidir. Fizyoterapi daha çok kas-iskelet sistemi rehabilitasyonuna odaklanırken, osteopati vücuttaki tüm sistemlerin (kas-iskelet, sinir, dolaşım, iç organlar) birbiriyle olan ilişkisini değerlendirir ve ağrının kök nedenini bulmayı hedefler.',
  },
  {
    question: 'Kaç seans tedavi görmem gerekir?',
    answer: 'Tedavi süresi kişinin şikayetine, şikayetin süresine ve genel sağlık durumuna göre değişir. Akut problemlerde 3-6 seans yeterli olabilirken, kronik durumlarda 8-12 seans gerekebilir. İlk değerlendirmeden sonra size özel bir tedavi planı oluşturulur.',
  },
  {
    question: 'Tedavi ağrılı mıdır?',
    answer: 'Tedavi sırasında hafif bir rahatsızlık hissedebilirsiniz, ancak şiddetli ağrı olmamalıdır. Terapistiniz her zaman sizin konfor seviyenize göre teknik uygular. Tedavi sonrası hafif bir ağrı veya hassasiyet normal olup genellikle 24-48 saat içinde geçer.',
  },
  {
    question: 'Randevu almadan gelebilir miyim?',
    answer: 'Size en iyi hizmeti verebilmek ve bekleme süresini minimuma indirmek için randevu ile çalışmaktayız. Telefon, WhatsApp veya web sitemiz üzerinden kolayca randevu alabilirsiniz.',
  },
  {
    question: 'Hangi rahatsızlıklarda fizyoterapi uygulanır?',
    answer: 'Bel ve boyun fıtığı, spor yaralanmaları, migren, fibromiyalji, donuk omuz, tenisçi dirseği, kireçlenme, ameliyat sonrası rehabilitasyon, postür bozuklukları ve daha birçok kas-iskelet sistemi rahatsızlığında fizyoterapi uygulanabilir.',
  },
  {
    question: 'Spor yaralanmalarında ne zaman fizyoterapiye başlamalıyım?',
    answer: 'Akut yaralanmalarda ilk 48-72 saatlik dinlenme ve soğuk uygulama döneminden sonra fizyoterapiye başlanabilir. Erken müdahale, iyileşme süresini kısaltır ve komplikasyon riskini azaltır. Yaralanmanın ciddiyetine göre terapistiniz size uygun başlangıç zamanını belirleyecektir.',
  },
  {
    question: 'SGK veya özel sağlık sigortası geçerli mi?',
    answer: 'Kliniğimizde özel sağlık sigortası ile tedavi imkanı bulunmaktadır. Anlaşmalı sigorta şirketleri hakkında detaylı bilgi almak için lütfen bizimle iletişime geçin. SGK kapsamında hizmet verilmemektedir.',
  },
];
