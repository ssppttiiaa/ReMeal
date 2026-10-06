import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Utensils,
  Leaf,
  CheckCircle2,
  Store,
  ShoppingBag,
  BookOpen,
  User,
  Smile,
  Sparkles,
  Recycle,
  Wallet,
  Search,
  QrCode,
  MapPin,
  Clock,
  Quote,
  Croissant,
  Tag,
} from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { homePage, getHomeSection } from './home-page-data';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap' });

export const metadata = {
  title: 'ReMeal — Makan enak, selamatkan makanan',
  description: homePage.purpose,
};

const INK = '#211f1c';
const card = 'rounded-[1.75rem] border-2 border-[#211f1c] shadow-[5px_5px_0px_0px_#211f1c]';
const chip = 'inline-flex items-center gap-1.5 rounded-full border-2 border-[#211f1c] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#211f1c]';

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */
function Logo({ small = false }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#211f1c] bg-[#ffc72c] shadow-[2px_2px_0px_0px_#211f1c]">
        <Utensils size={20} strokeWidth={2.5} className="text-[#211f1c]" />
      </span>
      <span className="text-2xl font-extrabold tracking-tight text-[#211f1c]">{homePage.footer.brand}</span>
      {!small && (
        <span className="hidden sm:inline-flex rounded-md border-2 border-[#211f1c] bg-[#ffe4a9] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#211f1c]">
          Food Rescue
        </span>
      )}
    </Link>
  );
}

function Navbar() {
  const links = homePage.navigation.slice(0, 4);
  const login = homePage.navigation[4];
  const register = homePage.navigation[5];
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[#211f1c] bg-[#fff9ef]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1 rounded-full border-2 border-[#211f1c] bg-[#fffdf8] p-1 shadow-[2px_2px_0px_0px_#211f1c]">
          {links.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={`rounded-full px-4 py-1.5 text-sm font-bold text-[#211f1c] transition-colors ${
                i === 0 ? 'border-2 border-[#211f1c] bg-[#ffe4a9]' : 'border-2 border-transparent hover:bg-[#ffe4a9]/60'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={login.href}
            id="nav-login"
            className="rounded-full border-2 border-[#211f1c] bg-[#fffdf8] px-4 py-1.5 text-sm font-bold text-[#211f1c] shadow-[2px_2px_0px_0px_#211f1c] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#211f1c]"
          >
            {login.label}
          </Link>
          <Link
            href={register.href}
            id="nav-register"
            className="rounded-full border-2 border-[#211f1c] bg-[#ffc72c] px-4 py-1.5 text-sm font-bold text-[#211f1c] shadow-[2px_2px_0px_0px_#211f1c] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#211f1c]"
          >
            {register.label}
          </Link>
          <Link
            href={login.href}
            id="nav-account"
            aria-label="Akun"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#211f1c] bg-[#211f1c] text-[#fff9ef] transition-colors hover:bg-[#ffc72c] hover:text-[#211f1c]"
          >
            <User size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
function FloatTag({ className = '', children }) {
  return (
    <span
      className={`absolute z-20 inline-flex items-center gap-1.5 rounded-full border-2 border-[#211f1c] bg-[#fffdf8] px-2.5 py-1 text-[11px] sm:text-xs font-extrabold text-[#211f1c] shadow-[2px_2px_0px_0px_#211f1c] ${className}`}
    >
      {children}
    </span>
  );
}

function HeroSection() {
  const data = getHomeSection('hero');
  return (
    <section className={`${card} relative overflow-hidden bg-[#fffaf0] p-6 sm:p-10`}>
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
        {/* Left */}
        <div>
          <span className={`${chip} bg-[#ffe4a9]`}>
            <Sparkles size={12} strokeWidth={3} /> Penyelamat Kuliner Lokal No. 1
          </span>

          <h1 className="mt-6 text-[2.6rem] sm:text-6xl lg:text-[4.1rem] font-extrabold uppercase leading-[0.98] tracking-[-0.03em] text-[#211f1c]">
            Makan Enak.
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">Selamatkan</span>
              <span aria-hidden="true" className="absolute inset-x-0 bottom-[0.06em] h-[0.26em] rounded-sm bg-[#ffc72c]" />
            </span>
            <br />
            Makanan.
          </h1>

          <p className="mt-6 max-w-lg text-base sm:text-lg font-medium leading-relaxed text-[#211f1c]/75">
            {data.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={data.actions[0].href}
              id="hero-find-food"
              className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#211f1c] bg-[#ffc72c] px-6 py-3 font-extrabold text-[#211f1c] shadow-[4px_4px_0px_0px_#211f1c] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#211f1c]"
            >
              Temukan Makanan
              <ShoppingBag size={18} strokeWidth={2.5} className="transition-transform group-hover:-rotate-12" />
            </Link>
            <Link
              href={data.actions[1].href}
              id="hero-learn"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#211f1c] bg-[#fffdf8] px-6 py-3 font-extrabold text-[#211f1c] shadow-[4px_4px_0px_0px_#211f1c] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#211f1c]"
            >
              Pelajari ReMeal
              <BookOpen size={18} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-[#211f1c]/80">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#3f8f4f]" strokeWidth={2.5} /> 100% Layak Konsumsi
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#3f8f4f]" strokeWidth={2.5} /> Mitra UMKM Terkurasi
            </span>
          </div>
        </div>

        {/* Right: showcase frame */}
        <div className="relative">
          <div className="overflow-hidden rounded-[1.5rem] border-2 border-[#211f1c] bg-[#fffdf8] shadow-[6px_6px_0px_0px_#211f1c] transition-transform duration-500 hover:-rotate-1">
            <div className="flex items-center gap-3 border-b-2 border-[#211f1c] bg-[#fff3d6] px-4 py-2.5">
              <span className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full border-2 border-[#211f1c] bg-[#f28b6b]" />
                <span className="h-3 w-3 rounded-full border-2 border-[#211f1c] bg-[#ffc72c]" />
                <span className="h-3 w-3 rounded-full border-2 border-[#211f1c] bg-[#8cc98a]" />
              </span>
              <span className="flex-1 text-center text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#211f1c]/70">
                Surplus Showcase • Live Radar
              </span>
            </div>

            <div className="relative aspect-[16/11] w-full">
              <Image
                src="/remeal-food-rescue.png"
                alt={data.visual}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
              <FloatTag className="left-3 top-3">
                <Croissant size={13} strokeWidth={2.5} /> Sourdough Croissant
                <span className="rounded-full bg-[#ffc72c] px-1.5 text-[10px]">-60%</span>
              </FloatTag>
              <FloatTag className="right-3 top-[34%]">
                <Utensils size={13} strokeWidth={2.5} /> Bento Teriyaki
                <span className="rounded-md bg-[#211f1c] px-1.5 text-[#ffc72c]">Rp 18.000</span>
              </FloatTag>
              <FloatTag className="left-3 bottom-[22%]">
                <Leaf size={13} strokeWidth={2.5} /> Fresh Salad Bowl
                <span className="rounded-full bg-[#dcebd3] px-1.5 text-[10px]">Diselamatkan</span>
              </FloatTag>
              <FloatTag className="right-3 bottom-3">
                <Tag size={13} strokeWidth={2.5} /> Artisan Pizza
                <span className="rounded-full bg-[#211f1c] px-1.5 text-[10px] text-[#fff9ef]">Siap Pickup</span>
              </FloatTag>
            </div>

            <div className="flex items-center justify-between gap-3 border-t-2 border-[#211f1c] bg-[#fffdf8] px-4 py-2.5 text-[11px] sm:text-xs font-bold text-[#211f1c]">
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3f8f4f] opacity-70" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#3f8f4f]" />
                </span>
                14 porsi surplus baru saja tersedia di Tebet &amp; Senopati
              </span>
              <span className="hidden sm:inline font-extrabold uppercase tracking-[0.1em] text-[#211f1c]/60">Update: Just now</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Stats                                                               */
/* ------------------------------------------------------------------ */
const stats = [
  { value: '12.450+', label: 'Porsi Makanan Terselamatkan', icon: Utensils, bg: '#ffe4a9' },
  { value: '320+', label: 'Mitra UMKM Kuliner Aktif', icon: Store, bg: '#fff3d6' },
  { value: '98%', label: 'Tingkat Kepuasan Konsumen', icon: Smile, bg: '#f7d4c9' },
];

function StatsRow() {
  return (
    <section id="dampak" className="grid scroll-mt-24 gap-4 sm:grid-cols-3">
      {stats.map(({ value, label, icon: Icon, bg }) => (
        <div
          key={label}
          className="flex items-center gap-4 rounded-2xl border-2 border-[#211f1c] bg-[#fffdf8] p-4 shadow-[4px_4px_0px_0px_#211f1c] transition-transform hover:-translate-y-1"
        >
          <span
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border-2 border-[#211f1c]"
            style={{ backgroundColor: bg }}
          >
            <Icon size={22} strokeWidth={2.5} className="text-[#211f1c]" />
          </span>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold leading-none tracking-tight text-[#211f1c]">{value}</p>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-[#211f1c]/65">{label}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* About / impact                                                      */
/* ------------------------------------------------------------------ */
const impacts = [
  {
    icon: Leaf,
    iconBg: '#dcebd3',
    title: 'Food Waste Berkurang',
    description: 'Mencegah makanan layak konsumsi terbuang sia-sia ke TPA dan mengurangi emisi gas metana secara langsung dari rantai pasok lokal.',
    metaLabel: 'Dampak Karbon',
    metaValue: '2,5 kg CO₂e / hari',
    metaClass: 'bg-[#ffe4a9] text-[#211f1c]',
  },
  {
    icon: Store,
    iconBg: '#ffe4a9',
    title: 'UMKM Lokal Terbantu',
    description: 'Membantu toko roti, resto bento, dan kafe lokal menutup potensi kerugian dari produk jam tutup yang belum sempat terserap konsumen reguler.',
    metaLabel: 'Penjualan Stok',
    metaValue: '60%+ Stok Terjual',
    metaClass: 'bg-[#ffc72c] text-[#211f1c]',
  },
  {
    icon: Wallet,
    iconBg: '#f7d4c9',
    title: 'Konsumen Lebih Hemat',
    description: 'Nikmati makanan enak berkualitas tinggi dari resto favoritmu dengan potongan diskon 50% hingga 70% setiap hari.',
    metaLabel: 'Potongan Harga',
    metaValue: 'Hemat s.d 70%',
    metaClass: 'bg-[#211f1c] text-[#fff9ef]',
  },
];

function AboutSection() {
  return (
    <section id="tentang" className={`${card} scroll-mt-24 bg-[#fff3d6] p-6 sm:p-10`}>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className={`${chip} bg-[#fffdf8]`}>
            <Recycle size={12} strokeWidth={3} /> Satu Makanan, Satu Dampak
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-[#211f1c]">
            Setiap Porsi yang Diselamatkan Berarti Nyata
          </h2>
          <p className="mt-3 text-base font-medium leading-relaxed text-[#211f1c]/70">
            Banyak makanan yang masih sangat lezat dan higienis berpotensi terbuang hanya karena jam operasional toko usai.
            ReMeal mengubah surplus menjadi kebaikan bersama.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-[#211f1c] bg-[#fffdf8] px-4 py-2 text-sm font-extrabold text-[#211f1c] shadow-[3px_3px_0px_0px_#211f1c]">
          <Leaf size={16} strokeWidth={2.5} className="text-[#3f8f4f]" /> Zero Food Waste Mission
        </span>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {impacts.map(({ icon: Icon, iconBg, title, description, metaLabel, metaValue, metaClass }) => (
          <article
            key={title}
            className="flex flex-col rounded-2xl border-2 border-[#211f1c] bg-[#fffdf8] p-5 shadow-[4px_4px_0px_0px_#211f1c] transition-transform hover:-translate-y-1"
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#211f1c]"
              style={{ backgroundColor: iconBg }}
            >
              <Icon size={20} strokeWidth={2.5} className="text-[#211f1c]" />
            </span>
            <h3 className="mt-4 text-lg font-extrabold text-[#211f1c]">{title}</h3>
            <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-[#211f1c]/70">{description}</p>
            <div className="mt-5 flex items-center justify-between gap-2 border-t-2 border-dashed border-[#211f1c]/25 pt-4">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#211f1c]/60">{metaLabel}</span>
              <span className={`rounded-full border-2 border-[#211f1c] px-2.5 py-0.5 text-xs font-extrabold ${metaClass}`}>{metaValue}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */
const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Cari Makanan',
    description: 'Buka platform ReMeal, cek radar toko di sekitarmu, dan temukan kuliner lezat yang siap diselamatkan sebelum jam operasional berakhir.',
    footIcon: MapPin,
    foot: 'Radar radius 2–5 km aktif',
    bg: '#ffe4a9',
    circle: '#ffc72c',
  },
  {
    number: '02',
    icon: ShoppingBag,
    title: 'Pesan & Kunci',
    description: 'Kunci stok seketika, selesaikan pembayaran aman via QRIS atau e-wallet pilihanmu, dan dapatkan tiket pesanan berisi QR Code.',
    footIcon: QrCode,
    foot: 'QRIS & E-Wallet Terintegrasi',
    bg: '#fffdf8',
    circle: '#fff3d6',
  },
  {
    number: '03',
    icon: Store,
    title: 'Pickup di Toko',
    description: 'Datang ke gerai UMKM sebelum batas waktu habis, tunjukkan QR Code pada staf kasir, dan bawa pulang makanan segarmu dengan senyum.',
    footIcon: Clock,
    foot: 'Ambil tepat waktu',
    bg: '#f7d4c9',
    circle: '#fffdf8',
  },
];

function HowItWorks() {
  return (
    <section id="cara-kerja" className={`${card} scroll-mt-24 bg-[#fffdf8] p-6 sm:p-10`}>
      <div className="mx-auto max-w-2xl text-center">
        <span className={`${chip} bg-[#ffe4a9]`}>Alur Mudah &amp; Cepat</span>
        <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#211f1c]">Cara Kerja ReMeal</h2>
        <p className="mt-3 text-base font-medium text-[#211f1c]/70">
          Cuma butuh 3 langkah sederhana untuk menikmati makanan nikmat sekaligus menjaga kelestarian bumi.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {steps.map(({ number, icon: Icon, title, description, footIcon: FootIcon, foot, bg, circle }, i) => (
          <article
            key={number}
            className="flex flex-col rounded-2xl border-2 border-[#211f1c] p-5 shadow-[4px_4px_0px_0px_#211f1c] transition-transform hover:-translate-y-1"
            style={{ backgroundColor: bg }}
          >
            <div className="flex items-center justify-between">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#211f1c] text-lg font-extrabold text-[#211f1c] shadow-[2px_2px_0px_0px_#211f1c]"
                style={{ backgroundColor: circle }}
              >
                {number}
              </span>
              <span className="rounded-full border-2 border-[#211f1c] bg-[#fffdf8] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#211f1c]">
                Langkah {i + 1}
              </span>
            </div>
            <h3 className="mt-5 flex items-center gap-2 text-lg font-extrabold text-[#211f1c]">
              {number} — <Icon size={18} strokeWidth={2.5} /> {title}
            </h3>
            <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-[#211f1c]/75">{description}</p>
            <span className="mt-5 inline-flex w-full items-center gap-2 rounded-xl border-2 border-[#211f1c] bg-[#fffdf8] px-3 py-2 text-xs font-bold text-[#211f1c]">
              <FootIcon size={14} strokeWidth={2.5} /> {foot}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Why ReMeal                                                          */
/* ------------------------------------------------------------------ */
const whys = [
  {
    tag: 'Hemat 50% – 70%',
    tagIcon: Wallet,
    tagBg: '#ffc72c',
    title: 'Harga Super Miring',
    description: 'Beli menu resto, artisan bakery, dan pastry premium dengan harga miring setiap sore hingga malam hari.',
  },
  {
    tag: 'Dampak Nyata',
    tagIcon: Recycle,
    tagBg: '#dcebd3',
    title: 'Kurangi Food Waste',
    description: 'Dapatkan laporan jejak karbon personal dan pantau berapa kilogram makanan yang berhasil kamu selamatkan.',
  },
  {
    tag: 'Mitra Lokal',
    tagIcon: Store,
    tagBg: '#f7d4c9',
    title: 'Dukung UMKM Tumbuh',
    description: 'Bantu bisnis kuliner di lingkunganmu tetap berdaya, menjaga arus kas, dan meminimalkan beban sisa tak terjual.',
  },
];

function WhyReMeal() {
  return (
    <section id="kenapa-remeal" className={`${card} scroll-mt-24 bg-[#fff3d6] p-6 sm:p-10`}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#211f1c]">Kenapa Pilih ReMeal?</h2>
        <p className="mt-3 text-base font-medium text-[#211f1c]/70">
          Solusi menang-menang untuk perut kenyang, dompet tenang, dan bumi senang.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {whys.map(({ tag, tagIcon: TagIcon, tagBg, title, description }) => (
          <article
            key={title}
            className="rounded-2xl border-2 border-[#211f1c] bg-[#fffdf8] p-5 shadow-[4px_4px_0px_0px_#211f1c] transition-transform hover:-translate-y-1"
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#211f1c] px-2.5 py-0.5 text-[11px] font-extrabold text-[#211f1c]"
              style={{ backgroundColor: tagBg }}
            >
              <TagIcon size={12} strokeWidth={3} /> {tag}
            </span>
            <h3 className="mt-4 text-lg font-extrabold text-[#211f1c]">{title}</h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-[#211f1c]/70">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA                                                                 */
/* ------------------------------------------------------------------ */
function CallToAction() {
  const data = getHomeSection('cta');
  return (
    <section className={`${card} relative overflow-hidden bg-[#ffd75e] px-6 py-12 sm:py-14 text-center`}>
      <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#211f1c] bg-[#fffdf8] px-4 py-1.5 text-sm font-bold italic text-[#211f1c] shadow-[2px_2px_0px_0px_#211f1c]">
        <Quote size={14} strokeWidth={2.5} /> “Makanan berlebih hari ini, bisa jadi pilihan hebatmu.”
      </span>
      <h2 className="mx-auto mt-6 max-w-3xl text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#211f1c]">
        Siap Menyelamatkan Makanan Hari Ini?
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-base font-medium text-[#211f1c]/80">
        Gabung bersama ribuan pahlawan penyelamat makanan di Jakarta dan sekitarnya. Temukan surplus lezat favoritmu sekarang!
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href={data.actions[0].href}
          id="cta-start"
          className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#211f1c] bg-[#211f1c] px-7 py-3 font-extrabold text-[#fff9ef] shadow-[4px_4px_0px_0px_#fffdf8] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#fffdf8]"
        >
          Mulai Sekarang
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href={data.actions[1].href}
          id="cta-explore"
          className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#211f1c] bg-[#fffdf8] px-7 py-3 font-extrabold text-[#211f1c] shadow-[4px_4px_0px_0px_#211f1c] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#211f1c]"
        >
          Jelajahi Makanan
          <Croissant size={18} strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */
const footerGroups = [
  {
    title: 'Navigasi',
    links: [
      { label: 'Tentang Kami', href: '#tentang' },
      { label: 'Cara Kerja', href: '#cara-kerja' },
      { label: 'Dampak', href: '#dampak' },
      { label: 'Hubungi Kami', href: 'mailto:halo@remeal.id' },
    ],
  },
  {
    title: 'Legal & Bantuan',
    links: [
      { label: 'Pusat Bantuan', href: '#' },
      { label: 'Kebijakan Privasi', href: '#' },
      { label: 'Syarat & Ketentuan', href: '#' },
      { label: 'Standar Higienitas', href: '#' },
    ],
  },
];

function Footer() {
  const { footer } = homePage;
  return (
    <footer className="w-full border-t-2 border-[#211f1c] bg-[#fff9ef]">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo small />
            <p className="mt-4 max-w-xs text-sm font-medium leading-relaxed text-[#211f1c]/70">{footer.tagline}</p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-[#211f1c] bg-[#fffdf8] px-3 py-1.5 text-xs font-bold text-[#211f1c] shadow-[2px_2px_0px_0px_#211f1c]">
              <Leaf size={14} strokeWidth={2.5} className="text-[#3f8f4f]" /> Gerakan Pangan Lestari Indonesia
            </span>
          </div>

          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#211f1c]">{group.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm font-semibold text-[#211f1c]/70 transition-colors hover:text-[#211f1c] hover:underline underline-offset-4 decoration-[#ffc72c] decoration-2">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t-2 border-[#211f1c]/15 pt-5 text-xs font-semibold text-[#211f1c]/60 sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          <p className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#3f8f4f]" /> #AksiPenyelamatanPanganAktif
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <div
      className={`${jakarta.className} flex min-h-screen flex-col bg-[#f7efe0] text-[#211f1c] selection:bg-[#ffc72c] selection:text-[#211f1c]`}
      style={{ color: INK }}
    >
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 overflow-x-hidden px-4 py-6 sm:gap-8 sm:px-6 sm:py-8">
        <HeroSection />
        <StatsRow />
        <AboutSection />
        <HowItWorks />
        <WhyReMeal />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}