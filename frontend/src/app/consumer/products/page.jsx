'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Clock3, ImagePlus, MapPin, Search, SlidersHorizontal, Star } from 'lucide-react';
import { apiRequest, formatRupiah, useCountdown } from '../../../lib/consumer-api';

function CatalogProductCard({ item }) {
  const countdown = useCountdown(item.order_deadline_at);
  return <Link className="product-card" href={`/consumer/products/${item.id}`}>
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
      <div className="product-bottom"><span>Stok {item.stock}</span><span className="rating"><Star size={11} fill="currentColor" />{item.average_rating ?? '—'}</span></div>
    </div>
  </Link>;
}

export default function ProductsPage() {
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sort, setSort] = useState('almost_gone');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [radius, setRadius] = useState('5');
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get('category_id');
    const requestedQuery = params.get('q');
    if (requestedCategory) setCategoryId(requestedCategory);
    if (requestedQuery) setQuery(requestedQuery);
    apiRequest('/categories')
      .then(result => { if (active) setCategories(result || []); })
      .catch(requestError => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      setError('Harga minimum tidak boleh melebihi harga maksimum.');
      setLoading(false);
      return () => controller.abort();
    }
    const params = new URLSearchParams({ sort, limit: '100' });
    if (query.trim()) params.set('q', query.trim());
    if (categoryId) params.set('category_id', categoryId);
    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);
    if (minRating) params.set('min_rating', minRating);
    if (location) {
      params.set('latitude', String(location.latitude));
      params.set('longitude', String(location.longitude));
      params.set('radius_km', radius);
    }
    setLoading(true);
    setError('');
    apiRequest(`/products?${params}`, { signal: controller.signal })
      .then(result => setProducts(result.data || []))
      .catch(requestError => {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [query, categoryId, sort, location, minPrice, maxPrice, minRating, radius]);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError('Browser ini tidak mendukung akses lokasi.');
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      position => {
        setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setSort('nearest');
        setLocationLoading(false);
      },
      locationError => {
        setError(`Lokasi tidak dapat diakses: ${locationError.message}`);
        setLocationLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  return <>
    <div className="section-heading" style={{ marginTop: 0 }}><div><span className="eyebrow">Selamat berburu</span><h1 className="page-title">Makanan di sekitarmu</h1><p className="page-subtitle">Cari produk yang tersedia dari toko terverifikasi.</p></div></div>
    <div className="catalog-toolbar">
      <label className="searchbar"><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari makanan atau nama toko..." /></label>
      <select className="button-outline" value={sort} onChange={event => setSort(event.target.value)} aria-label="Urutkan produk">
        <option value="nearest" disabled={!location}>Terdekat (aktifkan lokasi)</option><option value="almost_gone">Hampir habis</option><option value="cheapest">Harga termurah</option><option value="highest_rating">Rating tertinggi</option><option value="ending_soon">Segera tutup</option>
      </select>
      <button className="button-outline" type="button" onClick={useMyLocation} disabled={locationLoading}>{locationLoading ? 'Mencari lokasi…' : location ? 'Lokasi aktif' : 'Gunakan lokasi saya'}</button>
    </div>
    <div className="catalog-filters">
      <label className="field"><span>Harga minimum</span><input type="number" min="0" value={minPrice} onChange={event => setMinPrice(event.target.value)} placeholder="Rp" /></label>
      <label className="field"><span>Harga maksimum</span><input type="number" min="0" value={maxPrice} onChange={event => setMaxPrice(event.target.value)} placeholder="Rp" /></label>
      <label className="field"><span>Rating minimum</span><select value={minRating} onChange={event => setMinRating(event.target.value)}><option value="">Semua rating</option><option value="3">3+</option><option value="4">4+</option><option value="4.5">4,5+</option></select></label>
      <label className="field"><span>Radius (km)</span><input type="number" min="1" step="1" value={radius} disabled={!location} onChange={event => setRadius(event.target.value)} /></label>
    </div>
    <div className="filters-row">
      <button type="button" className={`filter-chip ${!categoryId ? 'selected' : ''}`} onClick={() => setCategoryId('')}>Semua</button>
      {categories.map(category => <button key={category.id} type="button" className={`filter-chip ${categoryId === category.id ? 'selected' : ''}`} onClick={() => setCategoryId(category.id)}>{category.name}</button>)}
    </div>
    <div className="section-heading" style={{ marginTop: 20 }}><h2>Produk tersedia</h2><span className="result-count"><SlidersHorizontal size={13} />{products.length} produk</span></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    {loading ? <p className="page-subtitle">Memuat katalog…</p> : products.length
      ? <div className="product-grid">{products.map(item => <CatalogProductCard item={item} key={item.id} />)}</div>
      : !error && <div className="empty-state">Belum ada produk yang cocok. Coba kata kunci atau kategori lain.</div>}
  </>;
}
