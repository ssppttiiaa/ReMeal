'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Clock3,
  Compass,
  ImagePlus,
  Leaf,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { apiRequest, formatRupiah, useCountdown } from '../../lib/consumer-api';

function ProductCard({ item }) {
  const countdown = useCountdown(item.order_deadline_at);

  return (
    <Link className="product-card" href={`/consumer/products/${item.id}`}>
      <div className={`product-visual${item.photo_url ? ' has-photo' : ''}`}>
        {item.photo_url
          ? <img src={item.photo_url} alt={item.name} className="product-image" />
          : <span className="product-placeholder"><ImagePlus size={27} /><span>Foto dari seller</span></span>}
        {item.normal_price > item.discount_price && <span className="discount-tag">DISKON</span>}
        {item.order_deadline_at && <span className="time-tag"><Clock3 size={11} />{countdown}</span>}
      </div>
      <div className="product-info">
        <div className="product-store"><MapPin size={11} />{item.store?.name || 'Informasi toko tidak tersedia'}</div>
        <h3>{item.name}</h3>
        <div className="price-row">
          <span className="price">{formatRupiah(item.discount_price)}</span>
          {item.normal_price > item.discount_price && <span className="old-price">{formatRupiah(item.normal_price)}</span>}
        </div>
        <div className="product-bottom">
          <span>Stok {item.stock}</span>
          <span className="rating"><Star size={11} fill="currentColor" />{item.average_rating ?? '—'}</span>
        </div>
      </div>
    </Link>
  );
}

export default function ConsumerHome() {
  const [urgentProducts, setUrgentProducts] = useState([]);
  const [nearbyProducts, setNearbyProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest('/products?sort=ending_soon&limit=3'),
      apiRequest('/products?sort=nearest&limit=4'),
      apiRequest('/categories'),
    ])
      .then(([urgentResult, nearbyResult, categoryResult]) => {
        if (!active) return;
        setUrgentProducts(urgentResult.data || []);
        setNearbyProducts(nearbyResult.data || []);
        setCategories(categoryResult || []);
      })
      .catch(requestError => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="home-page">
      <section className="home-intro" aria-labelledby="home-title">
        <div className="home-intro-icon"><Sparkles size={21} /></div>
        <div className="home-intro-copy">
          <span className="eyebrow">Selamat datang di ReMeal</span>
          <h1 id="home-title">Penyelamatan makanan hari ini</h1>
          <p>Temukan makanan lezat dari toko lokal, dengan harga yang lebih bersahabat.</p>
        </div>
        <div className="intro-badge"><Leaf size={15} /> Hemat makanan, mulai dari sini</div>
      </section>

      <form className="home-search" action="/consumer/products">
        <Search size={17} aria-hidden="true" />
        <input type="search" name="q" placeholder="Cari makanan atau toko..." aria-label="Cari makanan atau toko" />
        <button className="button-primary" type="submit">Cari makanan <ArrowRight size={15} /></button>
      </form>

      <nav className="home-categories" aria-label="Jelajahi kategori">
        <Link className="category-chip active" href="/consumer/products">Semua makanan</Link>
        {categories.map(category => (
          <Link
            className="category-chip"
            href={`/consumer/products?category_id=${encodeURIComponent(category.id)}`}
            key={category.id}
          >
            <span>{category.icon || '•'}</span>{category.name}
          </Link>
        ))}
        {!categories.length && !loading && !error && <span className="category-empty">Kategori segera hadir</span>}
      </nav>

      {error && <p className="form-error" role="alert">{error}</p>}

      <section className="home-section" aria-labelledby="urgent-heading">
        <div className="section-heading home-section-heading">
          <div>
            <span className="eyebrow">Jangan sampai terlewat</span>
            <h2 id="urgent-heading"><span className="heading-icon urgent-icon"><Clock3 size={16} /></span>Segera Berakhir <span className="heading-note">· waktu pengambilan terbatas</span></h2>
          </div>
          <Link className="text-link" href="/consumer/products?sort=ending_soon">Lihat semua <ArrowRight size={13} /></Link>
        </div>
        {loading
          ? <p className="page-subtitle">Memuat makanan yang segera berakhir…</p>
          : urgentProducts.length
            ? <div className="product-grid urgent-grid">{urgentProducts.map(item => <ProductCard item={item} key={item.id} />)}</div>
            : !error && <div className="empty-state">Belum ada makanan yang segera berakhir.</div>}
      </section>

      <section className="home-section map-section" aria-labelledby="map-heading">
        <div className="section-heading home-section-heading">
          <div>
            <span className="eyebrow">Temukan yang dekat</span>
            <h2 id="map-heading"><span className="heading-icon map-heading-icon"><MapPin size={16} /></span>Peta penyelamatan</h2>
          </div>
          <span className="map-status"><span />Lokasi diperlukan</span>
        </div>
        <div className="map-preview">
          <div className="map-art" aria-hidden="true">
            <span className="map-road map-road-one" />
            <span className="map-road map-road-two" />
            <span className="map-road map-road-three" />
            <span className="map-park map-park-one" />
            <span className="map-park map-park-two" />
          </div>
          <div className="map-overlay">
            <span className="map-overlay-icon"><Compass size={18} /></span>
            <div><strong>Jelajahi di sekitarmu</strong><p>Aktifkan lokasi dari halaman jelajahi untuk melihat pilihan terdekat.</p></div>
            <Link className="button-outline map-action" href="/consumer/products">Temukan lokasi <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      <section className="home-section nearby-section" aria-labelledby="nearby-heading">
        <div className="section-heading home-section-heading">
          <div>
            <span className="eyebrow">Pilihan segar di sekitarmu</span>
            <h2 id="nearby-heading"><span className="heading-icon nearby-icon"><MapPin size={16} /></span>Makanan Terdekat di Sekitar Anda</h2>
          </div>
          <Link className="text-link" href="/consumer/products">Jelajahi semua <ArrowRight size={13} /></Link>
        </div>
        {loading
          ? <p className="page-subtitle">Memuat makanan terdekat…</p>
          : nearbyProducts.length
            ? <div className="product-grid nearby-grid">{nearbyProducts.map(item => <ProductCard item={item} key={item.id} />)}</div>
            : !error && <div className="empty-state">Belum ada makanan terdekat yang tersedia.</div>}
      </section>

      <section className="promo-strip home-promo">
        <div className="promo-icon"><ShieldCheck size={21} /></div>
        <div>
          <h2>Selamatkan makanan, nikmati lebih hemat.</h2>
          <p>Setiap pilihan kecil membantu mengurangi makanan yang terbuang.</p>
        </div>
        <Link className="button-secondary" href="/consumer/products">Mulai jelajahi <ArrowRight size={14} /></Link>
      </section>
    </div>
  );
}
