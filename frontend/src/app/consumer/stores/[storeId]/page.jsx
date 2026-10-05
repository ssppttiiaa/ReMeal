'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, ImagePlus, MapPin, Star } from 'lucide-react';
import { apiRequest, formatRupiah, getAccessToken } from '../../../../lib/consumer-api';

function ReviewCard({ review }) {
  const [reason, setReason] = useState('inappropriate');
  const [description, setDescription] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  async function report(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    try {
      const token = getAccessToken();
      if (!token) throw new Error('Masuk untuk melaporkan ulasan.');
      const result = await apiRequest(`/reviews/${review.id}/report`, {
        method: 'POST',
        token,
        body: JSON.stringify({ reason, ...(description.trim() ? { description: description.trim() } : {}) }),
      });
      setNotice(result.message || 'Laporan berhasil dikirim.');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return <article className="panel review-card" key={review.id}>
    <div className="rating"><Star size={13} fill="currentColor" /> {review.rating} · {review.consumer_name || 'Konsumen'}</div>
    <p>{review.comment || 'Tidak ada komentar.'}</p><small>{new Date(review.created_at).toLocaleDateString('id-ID')}</small>
    <details><summary className="text-link">Laporkan ulasan</summary><form className="auth-form" onSubmit={report} style={{ marginTop: 10 }}><label className="field"><span>Alasan</span><select value={reason} onChange={event => setReason(event.target.value)}><option value="inappropriate">Tidak pantas</option><option value="spam">Spam</option><option value="false_information">Informasi tidak benar</option><option value="other">Lainnya</option></select></label><label className="field"><span>Penjelasan (opsional)</span><textarea value={description} onChange={event => setDescription(event.target.value)} /></label><button type="submit" className="button-outline">Kirim laporan</button></form></details>
    {error && <p className="form-error" role="alert">{error}</p>}{notice && <p className="form-success" role="status">{notice}</p>}
  </article>;
}

export default function StoreDetailPage() {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      apiRequest(`/stores/${storeId}`, { signal: controller.signal }),
      apiRequest(`/stores/${storeId}/reviews?limit=20`, { signal: controller.signal }),
      apiRequest('/products?limit=100', { signal: controller.signal }),
    ]).then(([storeResult, reviewResult, productResult]) => {
      setStore(storeResult);
      setReviews(reviewResult.data || []);
      setProducts((productResult.data || []).filter(product => product.store?.id === storeId));
    }).catch(requestError => { if (requestError.name !== 'AbortError') setError(requestError.message); });
    return () => controller.abort();
  }, [storeId]);

  if (error) return <p className="form-error" role="alert">{error}</p>;
  if (!store) return <p className="page-subtitle">Memuat informasi toko…</p>;
  const hours = store.opening_hours || [];

  return <>
    <Link href="/consumer/products" className="text-link"><ArrowLeft size={14} /> Kembali</Link>
    {store.photo_url ? <img src={store.photo_url} alt={store.name} className="store-cover" style={{ marginTop: 16 }} /> : <div className="store-cover" style={{ marginTop: 16 }} />}
    <div className="store-profile"><span className="store-avatar">{store.name?.charAt(0) || 'R'}</span><div><h1>{store.name}</h1><p>{store.business_type} · <MapPin size={11} /> {store.address}</p></div></div>
    <div className="detail-meta" style={{ marginTop: 24 }}><span><Star size={14} fill="currentColor" /> {store.average_rating ?? '—'} dari {store.review_count ?? 0} ulasan</span><span>{hours.map(item => `${item.day} ${item.open}–${item.close}`).join(' · ') || 'Jam operasional tidak tersedia'}</span></div>
    <div className="section-heading"><div><span className="eyebrow">Produk tersedia</span><h2>Produk dari toko ini</h2></div></div>
    {products.length ? <div className="product-grid">{products.map(product => <Link className="product-card" href={`/consumer/products/${product.id}`} key={product.id}><div className={`product-visual${product.photo_url ? ' has-photo' : ''}`}>{product.photo_url ? <img src={product.photo_url} alt={product.name} className="product-image" /> : <span className="product-placeholder"><ImagePlus size={27} /><span>Foto dari seller</span></span>}</div><div className="product-info"><h3>{product.name}</h3><div className="price-row"><span className="price">{formatRupiah(product.discount_price)}</span>{product.normal_price > product.discount_price && <span className="old-price">{formatRupiah(product.normal_price)}</span>}</div><div className="product-bottom"><span>Stok {product.stock}</span><span className="rating"><Star size={11} fill="currentColor" /> {product.average_rating ?? '—'}</span></div></div></Link>)}</div> : <div className="empty-state">Toko ini belum memiliki produk yang tersedia.</div>}
    <div className="section-heading"><div><span className="eyebrow">Ulasan</span><h2>Pengalaman pelanggan</h2></div></div>
    {reviews.length ? reviews.map(review => <ReviewCard review={review} key={review.id} />) : <div className="empty-state">Belum ada ulasan untuk toko ini.</div>}
  </>;
}
