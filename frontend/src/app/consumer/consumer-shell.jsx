'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Search,
  MapPin,
  User,
  ClipboardList,
  Home,
  ArrowRight,
  Leaf,
} from 'lucide-react';
import { getAccessToken } from '../../lib/consumer-api';

const navItems = [
  {
    href: '/consumer',
    label: 'Beranda',
    icon: Home,
  },
  {
    href: '/consumer/products',
    label: 'Jelajahi',
    icon: Search,
  },
  {
    href: '/consumer/orders',
    label: 'Pesanan',
    icon: ClipboardList,
  },
  {
    href: '/consumer/profile',
    label: 'Profil',
    icon: User,
  },
];

export default function ConsumerShell({ children }) {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(Boolean(getAccessToken()));
  }, [pathname]);

  return (
    <div className="consumer-app">

      {/* =========================
          TOPBAR
      ========================== */}
      <header className="topbar">
        <div className="topbar-inner">

          {/* Logo */}
          <Link
            href="/consumer"
            className="brand"
            aria-label="ReMeal beranda"
          >
            <span className="brand-mark">
              <ShoppingBag size={19} strokeWidth={2.5} />
            </span>

            <span>
              re<span>meal</span>
            </span>
          </Link>

          {/* Lokasi */}
          <Link
            href="/consumer/products"
            className="location-pill"
          >
            <MapPin size={14} />

            <span>
              <b>Lokasi pickup</b>
            </span>
          </Link>

          {/* Navigasi Desktop */}
          <nav
            className="desktop-nav"
            aria-label="Navigasi utama"
          >
            {navItems.map(({ href, label }) => {
              const isActive =
                pathname === href ||
                (href !== '/consumer' &&
                  pathname.startsWith(`${href}/`));

              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link ${
                    isActive ? 'active' : ''
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {!authenticated && <Link className="text-link" href={`/consumer/auth?next=${encodeURIComponent(pathname)}`}>Masuk</Link>}

          {/* Keranjang */}
          <Link
            href="/consumer/checkout"
            className="cart-button"
            aria-label="Keranjang"
          >
            <ShoppingBag size={19} />
          </Link>

        </div>
      </header>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main className="page-wrap">
        {children}
      </main>

      {/* =========================
          MOBILE NAVIGATION
      ========================== */}
      <nav
        className="mobile-nav"
        aria-label="Navigasi mobile"
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== '/consumer' &&
              pathname.startsWith(`${href}/`));

          return (
            <Link
              key={href}
              href={href}
              className={`mobile-nav-item ${
                isActive ? 'active' : ''
              }`}
            >
              <Icon
                size={19}
                strokeWidth={isActive ? 2.5 : 2}
              />

              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="site-footer">
        <div className="footer-brand">
          <Link href="/consumer" className="brand" aria-label="ReMeal beranda">
            <span className="brand-mark"><ShoppingBag size={17} strokeWidth={2.5} /></span>
            <span>re<span>meal</span></span>
          </Link>
          <p>Makan lebih hemat, bantu bumi tetap sehat.</p>
          <span className="footer-impact"><Leaf size={13} /> Belanja baik untuk bumi</span>
        </div>
        <div className="footer-column">
          <strong>Jelajahi</strong>
          <Link href="/consumer/products">Semua makanan</Link>
          <Link href="/consumer/orders">Pesanan saya</Link>
        </div>
        <div className="footer-column">
          <strong>Akun & bantuan</strong>
          <Link href="/consumer/profile">Profil saya</Link>
          <Link href="/consumer/auth">Masuk atau daftar</Link>
        </div>
        <div className="footer-note">
          <span>© 2026 ReMeal</span>
          <span>Setiap makanan punya kesempatan kedua.</span>
          <Link className="footer-top-link" href="/consumer">Kembali ke atas <ArrowRight size={12} /></Link>
        </div>
      </footer>

    </div>
  );
}