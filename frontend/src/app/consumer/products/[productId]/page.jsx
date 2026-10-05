'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Clock3, MapPin, Minus, Plus, Star } from 'lucide-react';
import { apiRequest, formatRupiah, saveCheckoutDraft, useCountdown } from '../../../../lib/consumer-api';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const countdown = useCountdown(product?.order_deadline_at);

  useEffect(() => {
    const controller = new AbortController();
    apiRequest(`/products/${productId}`, { signal: controller.signal })
      .then(setProduct)
      .catch(requestError => { if (requestError.name !== 'AbortError') setError(requestError.message); });
    return () => controller.abort();
  }, [productId]);

  function checkout() {
    saveCheckoutDraft(product, quantity);
    router.push('/consumer/checkout');
  }

  if (error) return <p className="form-error" role="alert">{error}</p>;
  if (!product) return <p className="page-subtitle">Memuat detail produk…</p>;

  const store = product.store || {};
  return <>
    <Link href="/consumer/products" className="text-link"><ArrowLeft size={14} /> Kembali ke produk</Link>
    <div className="detail-layout" style={{ marginTop: 18 }}>
      <div className="detail-art">{product.photo_url ? <img src={product.photo_url} alt={product.name} className="detail-image" /> : <span className="food-emoji">🍽️</span>}</div>
      <div className="detail-copy">
        <span className="eyebrow">{product.status === 'ending_soon' ? 'Segera tutup' : 'Produk tersedia'}</span>
        <h1>{product.name}</h1>
        <div className="rating"><Star size={13} fill="currentColor" />{product.average_rating ?? '—'} <span style={{ color: '#8b8994', fontWeight: 500 }}>({product.review_count ?? 0} ulasan)</span></div>
        <div className="detail-price">{formatRupiah(product.discount_price)} {product.normal_price > product.discount_price && <del>{formatRupiah(product.normal_price)}</del>}</div>
        <p>{product.description || 'Tidak ada deskripsi produk.'}</p>
        <div className="detail-meta"><span><Clock3 size={14} />Sisa waktu pemesanan: {countdown}</span><span><MapPin size={14} />{store.distance_km != null ? `${store.distance_km} km` : store.address || 'Lokasi toko tidak tersedia'}</span></div>
        <span className="eyebrow">Stok tersedia {product.stock}</span>
        <div className="store-row"><span className="store-avatar">{store.name?.charAt(0) || 'R'}</span><div style={{ flex: 1 }}><strong>{store.name || 'Toko ReMeal'}</strong><small>{store.business_type || ''} · {store.average_rating ?? '—'} <Star size={10} fill="currentColor" /></small></div>{store.id && <Link className="text-link" href={`/consumer/stores/${store.id}`}>Lihat toko</Link>}</div>
        <div className="action-row"><button className="button-outline" type="button" aria-label="Kurangi jumlah" disabled={quantity <= 1} onClick={() => setQuantity(value => Math.max(1, value - 1))}><Minus size={14} /></button><span className="button-outline">{quantity}</span><button className="button-outline" type="button" aria-label="Tambah jumlah" disabled={quantity >= product.stock} onClick={() => setQuantity(value => Math.min(product.stock, value + 1))}><Plus size={14} /></button><button className="button-primary" type="button" disabled={product.stock < 1 || product.status === 'closed' || product.status === 'sold_out' || countdown === '00:00:00'} onClick={checkout}>Lanjut checkout</button></div>
      </div>
    </div>
  </>;
}
