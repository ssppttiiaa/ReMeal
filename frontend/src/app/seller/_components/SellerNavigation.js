"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export function Icon({ name, className = "h-5 w-5" }) {
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

export function NavigationLinks({ mobile = false }) {
  const pathname = usePathname();

  return navigation.map((item) => {
    const active =
      item.href === "/seller"
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
      >
        <Icon className="h-[18px] w-[18px] shrink-0" name={item.icon} />
        <span>{item.label}</span>
        {active && !mobile ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#52672b]" /> : null}
      </Link>
    );
  });
}
