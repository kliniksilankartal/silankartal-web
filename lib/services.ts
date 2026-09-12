import { Service } from './types';

/** Klinik yöntem ve hizmet verileri (cihatseyrek.com modelinde) */
export const services: Service[] = [
  {
    slug: 'osteopati',
    title: 'Osteopati',
    category: 'Bütüncül Manuel Terapi',
    shortDescription: 'Vücuttaki problemi sadece ağrı olan bölgede aramaz; kas-iskelet, organ ve sinir sistemi arasındaki dengeyi kurarak ağrının kaynağını hedefler.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    detailedDescription: `Osteopati; kas-iskelet sistemi, iç organlar, omurga, vücut zarları (fasya), sinir sistemi ve dolaşım sistemi üzerinde çalışarak, sağlığın devamlılığı için bunların uyum içinde işleyebilmelerini sağlamayı hedefleyen bütüncül bir disiplindir.

Geleneksel semptomatik yaklaşımların aksine, osteopati ağrının hissedildiği bölgeye hapsolmaz. Örneğin, kronik bir boyun ağrısının kaynağı karaciğer kapsülündeki bir gerginlik, geçirilmiş bir ayak bileği burkulması veya çene eklemindeki bir kapanış bozukluğu olabilir.

Osteopatik muayene sırasında dokuların hareketliliği, doku gerginlikleri, kranial ritim ve postüral denge elle detaylı biçimde test edilir. Tedavi tamamen kişiye özeldir ve vücudun kendini iyileştirme mekanizmalarını harekete geçirir.`,
    benefits: [
      'Kronik bel, boyun ve sırt fıtıkları',
      'Geçmeyen kas ve eklem ağrıları',
      'Duruş bozuklukları ve omurga eğrilikleri',
      'Sinir sıkışmaları (siyatik, torasik çıkış sendromu)',
      'Kronik stres ve uyku kalitesi düşüklüğü',
      'Cerrahi operasyon sonrası yapışıklık ve fonksiyon kayıpları',
    ],
  },
  {
    slug: 'craniosacral-osteopati',
    title: 'Craniosacral Terapi',
    category: 'Kranial Sistem & Otonom Denge',
    shortDescription: 'Kafatası kemikleri ile kuyruk sokumu arasındaki serebrospinal sıvı ritmini dengeleyen, merkezi sinir sistemine odaklı nazik bir terapi.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    detailedDescription: `Craniosacral osteopati, kafatası kemikleri (cranium) ile kuyruk sokumu (sacrum) arasında omurilik boyunca salınan beyin-omurilik sıvısının (BOS) ritmini temel alır. Son derece hafif, hassas ve mikrometrik dokunuşlarla uygulanır.

Merkezi sinir sistemini çevreleyen dura mater zarındaki gerginlikler; migren, baş dönmesi (vertigo), kulak çınlaması (tinnitus) ve çene eklemi (TME) rahatsızlıkları gibi pek çok tabloya zemin hazırlayabilir.

Craniosacral terapi ile sempatik sinir sistemi regüle edilir, vücut derin bir parasempatik (onarım ve dinlenme) evresine geçer. Bu yöntem bebeklerden ileri yaştaki bireylere kadar güvenle uygulanabilir.`,
    benefits: [
      'Migren ve gerilim tipi baş ağrıları',
      'Kulak çınlaması (Tinnitus) ve vertigo',
      'Bruksizm (diş sıkma ve gıcırdatma)',
      'Kronik yorgunluk ve tükenmişlik',
      'Uyku problemleri ve konsantrasyon güçlüğü',
      'Travma sonrası boyun ağrıları (Whiplash sendromu)',
    ],
  },
  {
    slug: 'visseral-osteopati',
    title: 'Visseral Osteopati',
    category: 'İç Organ Mobilizasyonu',
    shortDescription: 'İç organların doğal hareketliliğini, fasya bağlarını ve kan dolaşımını restore ederek organ kaynaklı yansıyan ağrıları giderir.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    detailedDescription: `İç organlarımızın (mide, karaciğer, bağırsaklar, böbrekler) her nefes alışverişimizde ve vücut hareketlerimizde belirli bir eksen etrafında mikro-hareketleri vardır. Geçirilmiş enfeksiyonlar, ameliyat skarları, beslenme problemleri veya kronik stres bu organların fasyal bağlarında yapışıklıklara ve hareket kısıtlılıklarına yol açar.

Visseral osteopati, iç organların çevre dokularla olan mekanik ilişkisini ve kan-lenf dolaşımını elle muayene edip düzenler. Örneğin karaciğer-safra bölgesindeki gerginlikler sağ omuz ağrısına, bağırsak hareket kısıtlılıkları ise inatçı bel ağrılarına neden olabilir.

Bu yaklaşım ile organların fizyolojik işleyişi desteklenir ve kas-iskelet sistemine yansıyan kronik ağrılar kalıcı olarak çözülür.`,
    benefits: [
      'Reflü, gastrit ve şişkinlik problemleri',
      'Kronik kabızlık ve bağırsak disfonksiyonları',
      'İç organ kaynaklı açıklanamayan bel ve sırt ağrıları',
      'Ameliyat sonrası gelişen karın içi yapışıklıklar',
      'Dolaşım ve lenfatik drenaj bozuklukları',
      'Solunum kısıtlılıkları ve diyafram spazmları',
    ],
  },
  {
    slug: 'parietal-osteopati',
    title: 'Ortopedik Manuel Terapi',
    category: 'Kas-İskelet Sistemi & Biyomekanik',
    shortDescription: 'Eklem kilitlenmeleri, omurga blokajları ve kas spazmlarını kanıta dayalı manipülatif tekniklerle tedavi eder.',
    image: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1200&q=80',
    detailedDescription: `Parietal osteopati veya Ortopedik Manuel Terapi, kas-iskelet sistemini oluşturan omurga eklemleri, periferik eklemler, ligamentler ve kas dokusunun biyomekanik işlev bozukluklarını düzeltmeyi amaçlar.

Hızlı ve kontrollü manipülasyonlar (thrust), ritmik mobilizasyonlar, kas enerjisi teknikleri (MET) ve miyofasyal gevşetmeler uygulanarak kısıtlanmış eklem hareket açıklığı yeniden kazandırılır.

Ağrılı eklemlerde sinir iletimi rahatlatılır, çevre kaslardaki koruyucu spazm çözülür ve doku beslenmesi hızla normale döner.`,
    benefits: [
      'Akut bel tutulması ve lumbago',
      'Boyun düzleşmesi ve servikal omurga blokajları',
      'Donuk omuz ve omuz sıkışma sendromu',
      'Tenisçi ve golfçü dirseği (lateral epikondilalji)',
      'Kalça sıkışması ve diz menisküs/kıkırdak yüklenmeleri',
      'Spor yaralanmaları sonrası eklem kısıtlılıkları',
    ],
  },
  {
    slug: 'psikonoroimmunoloji',
    title: 'Psikonöroimmünoloji (PNI)',
    category: 'Fonksiyonel Tıp & Bütüncül İyileşme',
    shortDescription: 'Zihin, sinir sistemi, bağışıklık ve endokrin sistem arasındaki etkileşimi inceleyerek kronik ağrının kökenine iner.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    detailedDescription: `Klinik Psikonöroimmünoloji (cPNI), insan sağlığını psikoloji, nöroloji, immünoloji ve endokrinolojinin ortak kesişiminde inceleyen modern ve kanıta dayalı bir bilim dalıdır.

Kronik ağrıların, fibromiyaljinin veya tekrarlayan kas spazmlarının altında genellikle düşük dereceli kronik inflamasyon, bağırsak geçirgenliği, sirkadiyen ritim bozulması veya uzun süreli sempatik stres aktivasyonu yatar.

PNI yaklaşımında danışanın beslenme alışkanlıkları, uyku döngüsü, hareket biyolojisi ve stres faktörleri detaylı analiz edilir. Kişiye özel yaşam tarzı ve egzersiz müdahaleleriyle kronik inflamasyon baskılanır ve kalıcı iyileşme sağlanır.`,
    benefits: [
      'Fibromiyalji ve yaygın vücut ağrıları',
      'Kronik yorgunluk ve düşük enerji sendromu',
      'Tekrarlayan iltihabi eklem rahatsızlıkları',
      'Stres kaynaklı kas gerginlikleri ve spazmlar',
      'Metabolik kaynaklı omurga ağrıları',
      'Bağışıklık dengesizlikleri ve hücresel iyileşme desteği',
    ],
  },
];

/** Slug'a göre hizmet getir */
export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** Tüm hizmet slug'larını getir */
export function getAllServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}
