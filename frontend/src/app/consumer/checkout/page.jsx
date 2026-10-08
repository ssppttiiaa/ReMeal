'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, ShieldCheck } from 'lucide-react';
import { apiRequest, clearCheckoutDraft, formatRupiah, getAccessToken, getCheckoutDraft } from '../../../lib/consumer-api';

export default function CheckoutPage() {
  const router = useRouter();
  const [draft, setDraft] = useState(null);
  const [product, setProduct] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let selected;
    try {
      selected = getCheckoutDraft();
    } catch (draftError) {
      setError(draftError.message);
      return;
    }
    if (!selected?.product?.id) {
      setError('Pilih produk dari katalog sebelum melanjutkan checkout.');
      return;
    }
    setDraft(selected);
    apiRequest(`/products/${selected.product.id}`)
      .then(setProduct)
      .catch(requestError => setError(requestError.message));
  }, []);

  async function createOrder(event) {
    event.preventDefault();
    const token = getAccessToken();
    if (!token) {
      router.push(`/login?next=${encodeURIComponent('/consumer/checkout')}`);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const order = await apiRequest('/orders', {
        method: 'POST',
        token,
        body: JSON.stringify({ product_id: product.id, quantity: draft.quantity, ...(note.trim() ? { note: note.trim() } : {}) }),
      });
      if (!order?.id) throw new Error('Backend tidak mengembalikan ID pesanan.');
      clearCheckoutDraft();
      router.push(`/consumer/payment?orderId=${encodeURIComponent(order.id)}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  if (!draft || !product) return <>{error ? <p className="form-error" role="alert">{error}</p> : <p className="page-subtitle">Memuat pesanan…</p>}<Link href="/consumer/products" className="text-link">Kembali ke katalog</Link></>;

  const store = product.store || {};
  const total = product.discount_price * draft.quantity;
  return <>
    <Link href={`/consumer/products/${product.id}`} className="text-link"><ArrowLeft size={14} /> Kembali ke produk</Link>
    <span className="eyebrow" style={{ display: 'block', marginTop: 17 }}>Konfirmasi pesanan</span><h1 className="page-title">Checkout</h1>
    <p className="page-subtitle">Stok akan dikunci sementara setelah pesanan dibuat.</p>
    <form className="checkout-layout" onSubmit={createOrder}>
      <div>
        <section className="panel"><h2><MapPin size={15} /> Detail pengambilan</h2><p className="page-subtitle">{store.name || 'Toko'}{store.address ? ` · ${store.address}` : ''}</p><p className="page-subtitle">Batas pengambilan: {product.pickup_deadline_at ? new Date(product.pickup_deadline_at).toLocaleString('id-ID') : 'Ikuti informasi dari toko.'}</p></section>
        <section className="panel"><h2>Pesananmu</h2><div className="line-item"><span className="mini-art">{product.photo_url ? <img src={product.photo_url} alt="" className="mini-image" /> : '🍽️'}</span><div className="line-item-copy"><strong>{product.name}</strong><small>{store.name || 'Toko'} · {draft.quantity} item</small></div><b>{formatRupiah(total)}</b></div><label className="field" style={{ marginTop: 16 }}><span>Catatan untuk toko (opsional)</span><textarea value={note} onChange={event => setNote(event.target.value)} maxLength={500} /></label></section>
      </div>
      <aside className="panel"><h2>Ringkasan pembayaran</h2><div className="summary-line"><span>{draft.quantity} × {formatRupiah(product.discount_price)}</span><span>{formatRupiah(total)}</span></div><div className="summary-line total"><span>Total</span><span>{formatRupiah(total)}</span></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button-secondary full-button" type="submit" disabled={loading || product.stock < draft.quantity}>{loading ? 'Membuat pesanan…' : 'Buat pesanan'}</button><small style={{ display: 'flex', gap: 6, color: '#85838d', fontSize: 9, marginTop: 12, lineHeight: 1.5 }}><ShieldCheck size={13} /> Pembayaran diproses lewat penyedia pembayaran. QR pickup baru tersedia setelah pembayaran berhasil.</small></aside>
    </form>
  </>;
}
