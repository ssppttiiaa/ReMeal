import Link from "next/link";
import { AdminHeader, AdminNavigation } from "./_components/AdminChrome";

export const metadata = {
  title: "Admin ReMeal",
  description: "Panel administrasi platform ReMeal.",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f4f5ef] text-[#202a1e]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[250px] shrink-0 flex-col bg-[#202a1e] px-5 py-6 text-white lg:flex">
          <Link aria-label="ReMeal Admin, ke dashboard" className="flex items-center gap-3 px-2" href="/admin">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e2f27b] text-sm font-black text-[#202a1e]">
              R.
            </span>
            <span>
              <span className="block text-lg font-bold leading-tight tracking-[0.02em]">ReMeal</span>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Admin Console
              </span>
            </span>
          </Link>

          <div className="mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
            Platform
          </div>
          <nav aria-label="Navigasi admin" className="mt-3 flex flex-col gap-1">
            <AdminNavigation />
          </nav>

          <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#e2f27b]">
              <span className="h-2 w-2 rounded-full bg-[#e2f27b]" />
              Mode development
            </div>
            <p className="mt-2 text-xs leading-5 text-white/50">
              Ringkasan platform menggunakan data contoh.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <AdminHeader />
          <nav
            aria-label="Navigasi admin"
            className="flex gap-1 overflow-x-auto border-b border-[#202a1e]/[0.06] bg-[#202a1e] px-3 py-2 lg:hidden"
          >
            <AdminNavigation mobile />
          </nav>
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-7 sm:py-8 xl:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
