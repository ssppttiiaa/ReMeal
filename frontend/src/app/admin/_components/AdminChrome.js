"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Users", href: "/admin/users", icon: "users" },
  { label: "Stores", href: "/admin/stores", icon: "stores" },
  { label: "Categories", href: "/admin/categories", icon: "categories" },
  { label: "Orders", href: "/admin/orders", icon: "orders" },
  { label: "Reviews & Reports", href: "/admin/reviews", icon: "reviews" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

const iconPaths = {
  dashboard:
    "M3 3h7v7H3zM14 3h7v4h-7zM14 10h7v11h-7zM3 14h7v7H3z",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6M23 11h-6",
  stores:
    "M4 10v10h16V10M3 10l2-6h14l2 6M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-6h6v6",
  categories:
    "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  orders:
    "M5 3h14v18l-2-1.5L15 21l-3-1.5L9 21l-2-1.5L5 21V3ZM8 8h8M8 12h8M8 16h4",
  reviews:
    "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z",
  settings:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM19.4 15l1.1 1.8-1.8 3.1-2.1-.4-1.6.9-.9 1.6h-3.6l-.9-1.6-1.6-.9-2.1.4-1.8-3.1L5.2 15v-2l-1.1-1.8 1.8-3.1 2.1.4 1.6-.9.9-1.6h3.6l.9 1.6 1.6.9 2.1-.4 1.8 3.1-1.1 1.8v2Z",
  bell: "M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
};

function AdminIcon({ name, className = "h-[18px] w-[18px]" }) {
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

export function AdminNavigation({ mobile = false }) {
  const pathname = usePathname();

  return navigation.map((item) => {
    const active =
      item.href === "/admin"
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`);

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
        prefetch={item.href === "/admin" ? undefined : false}
      >
        <AdminIcon name={item.icon} />
        <span>{item.label}</span>
        {active && !mobile ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#52672b]" /> : null}
      </Link>
    );
  });
}

export function AdminHeader() {
  const pathname = usePathname();
  const currentItem = navigation.find((item) => item.href === pathname);
  const title =
    currentItem?.label ??
    navigation.find((item) => item.href !== "/admin" && pathname.startsWith(`${item.href}/`))?.label ??
    "Admin";

  return (
    <header className="sticky top-0 z-20 border-b border-[#202a1e]/[0.08] bg-[#fbfcf8]/95 backdrop-blur">
      <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-7 xl:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#202a1e] text-xs font-black text-[#e2f27b] lg:hidden">
            R.
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#202a1e]">{title}</p>
            <p className="mt-0.5 text-xs text-[#727a6d]">Panel administrasi ReMeal</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            aria-label="Notifikasi"
            className="relative grid h-10 w-10 place-items-center rounded-full text-[#55604e] transition hover:bg-[#202a1e]/[0.06]"
            type="button"
          >
            <AdminIcon className="h-5 w-5" name="bell" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[#fbfcf8] bg-[#e26f52]" />
          </button>
          <div className="hidden h-8 w-px bg-[#202a1e]/10 sm:block" />
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#dce9e7] text-xs font-bold text-[#3c6861]">
              AR
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate text-xs font-semibold text-[#30392c]">Admin ReMeal</span>
              <span className="mt-0.5 block truncate text-[11px] text-[#727a6d]">admin@remeal.id</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
