import { Service } from './types';

/** Klinik yöntem ve hizmet verileri (cihatseyrek.com modelinde) */
export const services: Service[] = [
  {
    slug: 'manuel-terapi',
    title: 'Ortopedik Manuel Terapi',
    category: 'Kas-İskelet Sistemi & Biyomekanik',
    shortDescription: 'Eklem kilitlenmeleri, omurga blokajları ve kas spazmlarını kanıta dayalı manipülatif ve mobilizasyon teknikleriyle tedavi eder.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    detailedDescription: `Ortopedik Manuel Terapi; kas-iskelet sistemini oluşturan omurga eklemleri, periferik eklemler, bağlar ve kas dokusundaki fonksiyon bozukluklarını el ile değerlendirip tedavi eden bilimsel bir fizyoterapi yöntemidir.

Ritmik eklem mobilizasyonları, traksiyon, miyofasyal gevşetme ve kas enerjisi teknikleri uygulanarak kısıtlanmış hareket açısı yeniden kazandırılır ve ağrı baskılanır.

Ağrılı eklemlerde sinir iletimi rahatlatılır, çevre kaslardaki koruyucu spazm çözülür ve doku beslenmesi hızla normale döner.`,
    benefits: [
      'Akut ve kronik bel tutulması, lumbago',
      'Boyun düzleşmesi ve servikal omurga blokajları',
      'Donuk omuz ve omuz sıkışma sendromu',
      'Tenisçi ve golfçü dirseği',
      'Kalça ve diz eklem kısıtlılıkları',
      'Miyofasyal ağrı sendromu ve kulunçlar',
    ],
  },
  {
    slug: 'bel-ve-boyun-fitigi-rehabilitasyonu',
    title: 'Omurga Sağlığı & Fıtık Tedavisi',
    category: 'Klinik Omurga Rehabilitasyonu',
    shortDescription: 'Bel ve boyun fıtıklarında cerrahiye gerek kalmadan, sinir basısını ve ağrıyı ortadan kaldıran kişiye özel klinik rehabilitasyon.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    detailedDescription: `Bel ve boyun fıtıklarında omurlar arasındaki disklerin sinir köklerine yaptığı bası; bacaklara veya kollara vuran ağrı, uyuşma ve hareket kısıtlılığı yaratır.

Kliniğimizde uygulanan klinik omurga rehabilitasyonu ile omurga biyomekaniği yeniden düzenlenir, dekompresyon ve traksiyon teknikleri ile sinir üzerindeki mekanik baskı azaltılır.

Doğru kas kuvvet dengesi ve core stabilizasyonu sağlanarak fıtığın nüksetmesi önlenir ve kalıcı iyileşme hedeflenir.`,
    benefits: [
      'Bel fıtığı (Lomber disk hernisi) ve siyatik ağrısı',
      'Boyun fıtığı (Servikal disk hernisi) ve kola vuran uyuşmalar',
      'Kanal daralması (Spinal stenoz) kaynaklı yürüme güçlüğü',
      'Faset eklem sendromu ve sabah tutuklukları',
      'Omurga eğrilikleri ve postür bozuklukları',
    ],
  },
  {
    slug: 'sporcu-rehabilitasyonu',
    title: 'Sporcu Rehabilitasyonu',
    category: 'Performans & Spora Dönüş',
    shortDescription: 'Spor yaralanmaları sonrası fonksiyonel hareket kapasitesini geri kazandıran, spora güvenli ve güçlü dönüşü sağlayan program.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    detailedDescription: `Sporcularda ve aktif bireylerde meydana gelen bağ, menisküs, tendon ve kas yaralanmalarında doku iyileşme fazlarına uygun rehabilitasyon protokolleri uygulanır.

Erken dönemde ödem ve ağrı kontrolü sağlanırken, subakut ve kronik dönemlerde propriyosepsiyon, denge, reaktif kuvvet ve spora özgü hareket paternleri çalışılır.

Amaç sadece ağrısız olmak değil, sporcunun sahaya yaralanma öncesinden daha güçlü ve güvenli dönmesini sağlamaktır.`,
    benefits: [
      'Ön çapraz bağ (ÖÇB) ve menisküs rehabilitasyonu',
      'Ayak bileği burkulmaları ve bağ lezyonları',
      'Kas yırtıkları ve hamstring zorlanmaları',
      'Aşil tendinopatisi ve patellar tendinit',
      'Omuz labrum ve rotator cuff lezyonları',
    ],
  },
  {
    slug: 'kuru-igneleme-ve-bantlama',
    title: 'Kuru İğneleme & Kinezyotape',
    category: 'Tamamlayıcı Manuel Teknikler',
    shortDescription: 'Kas tetik noktalarını (kulunç) etkisiz hale getiren kuru iğneleme ve dolaşımı destekleyen kinezyolojik bantlama uygulamaları.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    detailedDescription: `Kuru iğneleme (dry needling), kas dokusu içindeki ağrılı tetik noktaların ince akupunktur benzeri iğnelerle uyarılması esasına dayanır. İğne içinde herhangi bir ilaç bulunmaz; etki tamamen mekanik nörofizyolojik gevşemedir.

Kinezyolojik bantlama ise cildi mikro düzeyde yukarı kaldırarak lenfatik ve venöz dolaşımı artırır, eklem hareket açıklığını kısıtlamadan dokuya destek verir.

Bu iki yöntem manuel terapi ve klinik egzersizle kombine edildiğinde hızlı ağrı kesici ve fonksiyon açıcı etki sağlar.`,
    benefits: [
      'Kronik boyun, sırt ve omuz tutuklukları',
      'Miyofasyal tetik noktalar (kulunçlar)',
      'Gerilim tipi baş ağrıları ve boyun kaynaklı migren',
      'Tendon ve eklem çevresi ödem kontrolü',
      'Kas spazmlarının hızlı çözülmesi',
    ],
  },
  {
    slug: 'klinik-egzersiz-ve-postur-analizi',
    title: 'Klinik Egzersiz & Postür Analizi',
    category: 'Duruş & Biyomekanik Denge',
    shortDescription: 'Omurga dizilimi ve kas dengesizliklerini bilgisayarlı/klinik testlerle belirleyip kişiye özel düzeltici egzersiz reçetesi sunar.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    detailedDescription: `Masa başı çalışma, sedanter yaşam veya yanlış yüklenmeler omurgada kifoz, skolyoz, hiperlordoz veya boyun düzleşmesi gibi postür bozukluklarına zemin hazırlar.

Klinik değerlendirme sonrasında zayıf kas grupları kuvvetlendirilir, kısalmış ve gergin fasyal yapılar mobilize edilir.

Danışana sadece seansta uygulanan tedavi değil; günlük yaşamında, çalışma ortamında ve evinde sürdürebileceği kanıta dayalı bir biyomekanik alışkanlık kazandırılır.`,
    benefits: [
      'Boyun düzleşmesi ve kamburluk (torakal kifoz)',
      'Skolyoz ve omurga asimetrileri',
      'Masa başı çalışanlarda duruş bozuklukları',
      'Core kas zayıflığı ve pelvis instabilitesi',
      'Tekrarlayan iş ve duruş kaynaklı kas ağrıları',
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
