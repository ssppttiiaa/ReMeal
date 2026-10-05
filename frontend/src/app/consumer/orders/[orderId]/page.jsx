'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, QrCode, Star } from 'lucide-react';
import { apiRequest, formatDateTime, formatRupiah, getAccessToken, getConsumerOrder, getStoredReview, saveStoredReview, statusLabel } from '../../../../lib/consumer-api';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewId, setReviewId] = useState('');
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  async function reload() {
    const token = getAccessToken();
    if (!token) throw new Error('Masuk untuk melihat detail pesanan.');
    setOrder(await getConsumerOrder(orderId, token));
  }

  useEffect(() => {
    reload().catch(requestError => setError(requestError.message));
  }, [orderId]);

  useEffect(() => {
    try {
      const savedReview = getStoredReview(orderId);
      if (savedReview) {
        setReviewId(savedReview.id);
        setRating(savedReview.rating);
        setComment(savedReview.comment || '');
      }
    } catch (storageError) {
      setError(storageError.message);
    }
  }, [orderId]);

  async function cancelOrder() {
    setBusy(true);
    setError('');
    try {
      await apiRequest(`/orders/${orderId}/cancel`, { method: 'POST', token: getAccessToken() });
      await reload();
      setNotice('Pesanan berhasil dibatalkan.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitReview(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const review = await apiRequest(reviewId ? `/reviews/${reviewId}` : `/orders/${orderId}/review`, {
        method: reviewId ? 'PATCH' : 'POST',
        token: getAccessToken(),
        body: JSON.stringify({ rating, ...(comment.trim() ? { comment: comment.trim() } : {}) }),
      });
      const saved = { id: review.id || reviewId, rating, comment: comment.trim() };
      if (saved.id) {
        saveStoredReview(orderId, saved);
        setReviewId(saved.id);
      }
      await reload();
      setNotice(reviewId ? 'Ulasan berhasil diperbarui.' : 'Terima kasih, ulasanmu berhasil dikirim.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitComplaint(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await apiRequest('/complaints', {
        method: 'POST',
        token: getAccessToken(),
        body: JSON.stringify({ order_id: orderId, subject: complaintSubject.trim(), description: complaintDescription.trim() }),
      });
      setComplaintSubject('');
      setComplaintDescription('');
      setNotice('Keluhan terkait pesanan berhasil dikirim.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  if (error && !order) return <p className="form-error" role="alert">{error}</p>;
  if (!order) return <p className="page-subtitle">Memuat detail pesanan…</p>;

  const product = order.product || {};
  const store = product.store || {};
  return <>
    <Link href="/consumer/orders" className="text-link"><ArrowLeft size={14} /> Semua pesanan</Link>
    <div className="section-heading" style={{ marginTop: 18 }}><div><span className="eyebrow">Detail pesanan</span><h1 className="page-title">{order.order_code || order.id}</h1><p className="page-subtitle">{formatDateTime(order.created_at)}</p></div><span className="status">{statusLabel(order.status)}</span></div>
    {error && <p className="form-error" role="alert">{error}</p>}{notice && <p className="form-success" role="status">{notice}</p>}
    <div className="checkout-layout"><div>
      <section className="panel"><h2>Status pesanan</h2><p className="page-subtitle">{statusLabel(order.status)}</p>{order.payment_expires_at && order.status === 'pending_payment' && <p className="page-subtitle">Batas pembayaran: {formatDateTime(order.payment_expires_at)}</p>}{order.status === 'pending_payment' && <button type="button" className="button-outline" disabled={busy} onClick={cancelOrder}>Batalkan pesanan</button>}</section>
      <section className="panel"><h2>Lokasi pengambilan</h2><p className="page-subtitle" style={{ lineHeight: 1.7 }}><MapPin size={14} /> {store.name || 'Toko'}<br />{store.address || 'Alamat toko tidak tersedia.'}</p><p className="page-subtitle">Batas pickup: {formatDateTime(order.pickup_deadline_at)}</p>{order.product_lookup_error && <p className="form-error">Rincian produk tidak tersedia: {order.product_lookup_error}</p>}</section>
    </div><aside className="panel"><h2>Ringkasan pesanan</h2><div className="line-item"><span className="mini-art">{product.photo_url ? <img src={product.photo_url} alt="" className="mini-image" /> : '🍽️'}</span><div className="line-item-copy"><strong>{product.name || 'Produk'}</strong><small>{order.quantity} item</small></div><b>{formatRupiah(order.total_price)}</b></div><div className="summary-line total"><span>Total</span><span>{formatRupiah(order.total_price)}</span></div>
      {order.status === 'pending_payment' && <Link className="button-secondary full-button" href={`/consumer/payment?orderId=${order.id}`}>Lanjut pembayaran</Link>}
      {order.qr_code && <Link className="button-secondary full-button" href={`/consumer/qr?orderId=${order.id}`}><QrCode size={15} /> Buka QR pickup</Link>}
    </aside></div>
    {order.status === 'completed' && (!order.has_review || reviewId) && <form className="panel" onSubmit={submitReview} style={{ marginTop: 16 }}><h2>{reviewId ? 'Perbarui ulasan' : 'Beri ulasan'}</h2><p className="page-subtitle">Bagaimana pengalamanmu dengan pesanan ini?</p><div style={{ display: 'flex', gap: 7, margin: '14px 0' }}>{[1, 2, 3, 4, 5].map(value => <button type="button" key={value} className="button-outline" aria-label={`${value} bintang`} aria-pressed={rating === value} onClick={() => setRating(value)}><Star size={16} fill={rating >= value ? 'currentColor' : 'none'} /></button>)}</div><textarea value={comment} onChange={event => setComment(event.target.value)} maxLength={1000} placeholder="Ceritakan pengalamanmu..." style={{ width: '100%', minHeight: 75, border: '1px solid #e2e1e7', borderRadius: 8, padding: 10, resize: 'vertical' }} /><button disabled={!rating || busy} className="button-secondary full-button" type="submit">{busy ? 'Mengirim…' : reviewId ? 'Simpan perubahan' : 'Kirim ulasan'}</button></form>}
    {order.has_review && <p className="form-success">Ulasan untuk pesanan ini sudah dikirim.</p>}
    <details className="panel" style={{ marginTop: 16 }}><summary className="text-link">Laporkan masalah pada pesanan</summary><form className="auth-form" onSubmit={submitComplaint} style={{ marginTop: 14 }}><label className="field"><span>Subjek</span><input required value={complaintSubject} onChange={event => setComplaintSubject(event.target.value)} /></label><label className="field"><span>Penjelasan</span><textarea required value={complaintDescription} onChange={event => setComplaintDescription(event.target.value)} /></label><button type="submit" className="button-secondary" disabled={busy}>{busy ? 'Mengirim…' : 'Kirim keluhan'}</button></form></details>
  </>;
}
