import Link from "next/link";
import PanelTheme from "../_components/PanelPreferences";
import PanelAuthGuard from "../_components/PanelAuthGuard";
import { Icon, NavigationLinks } from "./_components/SellerNavigation";

export const metadata = {
  title: "Dashboard Seller | ReMeal",
  description: "Kelola toko dan pantau penjualan ReMeal.",
};

export default function SellerLayout({ children }) {
  return (
    <PanelAuthGuard role="seller">
      <div className="remeal-panel min-h-screen bg-[#F7F1E7] text-[#29261F]">
      <PanelTheme />
      <div className="flex min-h-screen">
        <aside className="hidden w-[250px] shrink-0 flex-col border-r px-5 py-6 lg:flex">
          <Link aria-label="ReMeal Seller, ke dashboard" className="flex items-center gap-3 px-2" href="/seller">
            <span className="panel-brand-mark grid h-10 w-10 place-items-center rounded-xl text-sm font-black">
              R.
            </span>
            <span>
              <span className="block text-lg font-bold leading-tight tracking-[0.02em]">ReMeal</span>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Ruang Mitra
              </span>
            </span>
          </Link>

          <div className="mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#29261F]">
            Menu utama
          </div>
          <nav aria-label="Navigasi seller" className="mt-3 flex flex-col gap-1">
            <NavigationLinks />
          </nav>

          <div className="mt-auto rounded-xl border bg-[#FFF9EF] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#29261F]">
              <span className="h-2 w-2 rounded-full bg-[#FFF9EF]" />
              Toko aktif
            </div>
            <p className="mt-2 text-sm font-semibold">Dapur Nusa</p>
            <p className="mt-1 text-xs leading-5 text-[#29261F]">Selamat menyelamatkan makanan hari ini.</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-[#29261F]/[0.08] bg-[#FFF9EF]/95 backdrop-blur">
            <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-7 xl:px-10">
              <div className="flex min-w-0 items-center gap-3">
                <span className="panel-brand-mark grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-black lg:hidden">
                  R.
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">Dapur Nusa</p>
                  <p className="mt-0.5 text-xs text-[#8B8172]">Panel pengelolaan toko</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  aria-label="Notifikasi"
                  className="panel-header-action relative grid h-10 w-10 place-items-center rounded-full text-[#29261F] transition hover:bg-[#FFF9EF]/[0.06]"
                  type="button"
                >
                  <Icon name="bell" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[#29261F] bg-[#E89B3C]" />
                </button>
                <div className="hidden h-8 w-px bg-[#FFF9EF]/10 sm:block" />
                <button className="panel-header-action flex items-center gap-2.5 rounded-full px-2 py-1 text-left" type="button">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#F8E7A8] text-xs font-bold text-[#29261F]">
                    DN
                  </span>
                  <span className="hidden sm:block">
                    <span className="block text-xs font-semibold">Dina N.</span>
                    <span className="mt-0.5 block text-[11px] text-[#8B8172]">Pemilik toko</span>
                  </span>
                </button>
              </div>
            </div>

            <nav
              aria-label="Navigasi seller"
              className="flex gap-1 overflow-x-auto border-t border-[#29261F]/[0.06] px-4 py-2 lg:hidden"
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
    </PanelAuthGuard>
  );
}