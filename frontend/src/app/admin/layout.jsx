import PanelTheme from "../_components/PanelPreferences";
import PanelAuthGuard from "../_components/PanelAuthGuard";
import BrandLogo from "../_components/BrandLogo";
import { AdminHeader, AdminNavigation } from "./_components/AdminChrome";

export const metadata = {
  title: "Admin ReMeal",
  description: "Panel administrasi platform ReMeal.",
};

export default function AdminLayout({ children }) {
  return (
    <PanelAuthGuard role="super_admin">
      <div className="remeal-panel min-h-screen bg-[#F7F1E7] text-[#29261F]">
      <PanelTheme />
      <div className="flex min-h-screen">
        <aside className="hidden w-[250px] shrink-0 flex-col border-r px-5 py-6 lg:flex">
          <BrandLogo ariaLabel="ReMeal Admin, ke dashboard" href="/admin" subtitle="Admin Console" />

          <div className="mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#29261F]">
            Platform
          </div>
          <nav aria-label="Navigasi admin" className="mt-3 flex flex-col gap-1">
            <AdminNavigation />
          </nav>

          <div className="mt-auto rounded-xl border bg-[#FFF9EF] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#29261F]">
              <span className="h-2 w-2 rounded-full bg-[#FFF9EF]" />
              Mode development
            </div>
            <p className="mt-2 text-xs leading-5 text-[#29261F]">
              Ringkasan platform menggunakan data contoh.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <AdminHeader />
          <nav
            aria-label="Navigasi admin"
            className="flex gap-1 overflow-x-auto border-b border-[#29261F]/[0.06] bg-[#FFF9EF] px-3 py-2 lg:hidden"
          >
            <AdminNavigation mobile />
          </nav>
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-7 sm:py-8 xl:px-10">
            {children}
          </div>
        </main>
      </div>
      </div>
    </PanelAuthGuard>
  );
}
