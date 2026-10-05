'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { apiRequest, formatDateTime, formatRupiah, getAccessToken, statusLabel } from '../../../lib/consumer-api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setError('Masuk ke akun konsumen untuk melihat riwayat pesanan.');
      setLoading(false);
      return;
    }
    apiRequest('/orders?limit=100', { token })
      .then(async result => {
        const enrichedOrders = await Promise.all((result.data || []).map(async order => {
          if (order.product || !order.product_id) return order;
          try {
            return { ...order, product: await apiRequest(`/products/${order.product_id}`) };
          } catch (lookupError) {
            return { ...order, product_lookup_error: lookupError.message };
          }
        }));
        setOrders(enrichedOrders);
      })
      .catch(requestError => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const visible = orders.filter(order => filter === 'all'
    || (filter === 'active' && ['pending_payment', 'paid', 'confirmed'].includes(order.status))
    || (filter === 'completed' && ['completed', 'cancelled', 'expired'].includes(order.status)));

  return <>
    <span className="eyebrow">Semua aktivitasmu</span><h1 className="page-title">Pesanan</h1><p className="page-subtitle">Pantau pesanan dan status pickup.</p>
    <div className="filters-row"><button type="button" className={`filter-chip ${filter === 'all' ? 'selected' : ''}`} onClick={() => setFilter('all')}>Semua</button><button type="button" className={`filter-chip ${filter === 'active' ? 'selected' : ''}`} onClick={() => setFilter('active')}>Berlangsung</button><button type="button" className={`filter-chip ${filter === 'completed' ? 'selected' : ''}`} onClick={() => setFilter('completed')}>Selesai / tutup</button></div>
    {error && <p className="form-error" role="alert">{error} <Link href="/consumer/auth?next=%2Fconsumer%2Forders" className="text-link">Masuk</Link></p>}
    {loading ? <p className="page-subtitle">Memuat pesanan…</p> : visible.map(order => <article className="order-card" key={order.id}>
      <div><span className="order-id">{order.order_code || order.id} · {formatDateTime(order.created_at)}</span><h3>{order.product?.store?.name || order.product?.store_name || 'Pesanan'}</h3><p>{order.product?.name || 'Rincian produk'} · {order.quantity} item</p>{order.product_lookup_error && <small className="form-error">Rincian produk tidak tersedia: {order.product_lookup_error}</small>}</div>
      <span className={`status ${order.status === 'pending_payment' ? 'pending' : ''}`}>{statusLabel(order.status)}</span>
      <div className="order-card-bottom"><strong>{formatRupiah(order.total_price)}</strong><Link className="text-link" href={`/consumer/orders/${order.id}`}>Detail pesanan <ArrowRight size={13} /></Link></div>
    </article>)}
    {!loading && !error && !visible.length && <div className="empty-state">Belum ada pesanan pada bagian ini.</div>}
  </>;
}
