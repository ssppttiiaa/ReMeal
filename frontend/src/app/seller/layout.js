import Link from "next/link";
import { Icon, NavigationLinks } from "./_components/SellerNavigation";

export const metadata = {
  title: "Dashboard Seller | ReMeal",
  description: "Kelola toko dan pantau penjualan ReMeal.",
};

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