import Link from "next/link";

export const metadata = {
  title: "Dashboard Seller | ReMeal",
  description: "Kelola toko dan pantau penjualan ReMeal.",
};

const navigation = [
  { label: "Dashboard", href: "/seller", icon: "dashboard" },
  { label: "Produk", href: "/seller/products", icon: "products" },
  { label: "Pesanan", href: "/seller/orders", icon: "orders" },
  { label: "QR Pickup", href: "/seller/qr", icon: "qr" },
  { label: "Review", href: "/seller/reviews", icon: "reviews" },
  { label: "Toko", href: "/seller/store", icon: "store" },
  { label: "Pengaturan", href: "/seller/settings", icon: "settings" },
];

const iconPaths = {
  dashboard:
    "M3 3h7v7H3zM14 3h7v4h-7zM14 10h7v11h-7zM3 14h7v7H3z",
  products:
    "m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5M12 8v5",
  orders:
    "M5 3h14v18l-2-1.5L15 21l-3-1.5L9 21l-2-1.5L5 21V3ZM8 8h8M8 12h8M8 16h4",
  qr: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM19 14h2M14 19v2M19 18v3h2",
  reviews:
    "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z",
  store:
    "M4 10v10h16V10M3 10l2-6h14l2 6M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-6h6v6",
  settings:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 3.1-.2-.1a1.7 1.7 0 0 0-1.8.3l-.1.1h-3.6l-.1-.2a1.7 1.7 0 0 0-1.5-1l-.3.1-3.1-1.8.1-.2a1.7 1.7 0 0 0-.3-1.8l-.1-.1v-3.6l.2-.1a1.7 1.7 0 0 0 1-1.5l-.1-.3 1.8-3.1.2.1a1.7 1.7 0 0 0 1.8-.3l.1-.1h3.6l.1.2a1.7 1.7 0 0 0 1.5 1l.3-.1 3.1 1.8-.1.2a1.7 1.7 0 0 0 .3 1.8l.1.1v3.6Z",
  bell: "M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
};

function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

function NavigationLinks({ mobile = false }) {
  return navigation.map((item) => {
    const active = item.href === "/seller";

    return (
      <Link
        aria-current={active ? "page" : undefined}
        className={
          mobile
            ? `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-[#e2f27b] text-[#202a1e]"
                  : "text-white/65 hover:bg-white/10 hover:text-white"
              }`
            : `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[#e2f27b] text-[#202a1e]"
                  : "text-white/65 hover:bg-white/10 hover:text-white"
              }`
        }
        href={item.href}
        key={item.href}
      >
        <Icon className="h-[18px] w-[18px] shrink-0" name={item.icon} />
        <span>{item.label}</span>
        {active && !mobile ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#52672b]" /> : null}
      </Link>
    );
  });
}

export default function SellerLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f4f5ef] text-[#202a1e]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[250px] shrink-0 flex-col bg-[#202a1e] px-5 py-6 text-white lg:flex">
          <Link aria-label="ReMeal Seller, ke dashboard" className="flex items-center gap-3 px-2" href="/seller">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e2f27b] text-sm font-black text-[#202a1e]">
              R.
            </span>
            <span>
              <span className="block text-lg font-bold leading-tight tracking-[0.02em]">ReMeal</span>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Ruang Mitra
              </span>
            </span>
          </Link>

          <div className="mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
            Menu utama
          </div>
          <nav aria-label="Navigasi seller" className="mt-3 flex flex-col gap-1">
            <NavigationLinks />
          </nav>

          <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#e2f27b]">
              <span className="h-2 w-2 rounded-full bg-[#e2f27b]" />
              Toko aktif
            </div>
            <p className="mt-2 text-sm font-semibold">Dapur Nusa</p>
            <p className="mt-1 text-xs leading-5 text-white/45">Selamat menyelamatkan makanan hari ini.</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-[#202a1e]/[0.08] bg-[#fbfcf8]/95 backdrop-blur">
            <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-7 xl:px-10">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#202a1e] text-xs font-black text-[#e2f27b] lg:hidden">
                  R.
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">Dapur Nusa</p>
                  <p className="mt-0.5 text-xs text-[#727a6d]">Panel pengelolaan toko</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  aria-label="Notifikasi"
                  className="relative grid h-10 w-10 place-items-center rounded-full text-[#55604e] transition hover:bg-[#202a1e]/[0.06]"
                  type="button"
                >
                  <Icon name="bell" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[#fbfcf8] bg-[#e26f52]" />
                </button>
                <div className="hidden h-8 w-px bg-[#202a1e]/10 sm:block" />
                <button className="flex items-center gap-2.5 rounded-full text-left" type="button">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f0cf9e] text-xs font-bold text-[#57391f]">
                    DN
                  </span>
                  <span className="hidden sm:block">
                    <span className="block text-xs font-semibold">Dina N.</span>
                    <span className="mt-0.5 block text-[11px] text-[#727a6d]">Pemilik toko</span>
                  </span>
                </button>
              </div>
            </div>

            <nav
              aria-label="Navigasi seller"
              className="flex gap-1 overflow-x-auto border-t border-[#202a1e]/[0.06] px-4 py-2 lg:hidden"
            >
              <NavigationLinks mobile />
            </nav>
          </header>

          <div className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-7 sm:py-9 xl:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}