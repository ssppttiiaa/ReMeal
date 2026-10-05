'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import { apiRequest, formatDateTime, formatRupiah, getAccessToken, getConsumerOrder } from '../../../lib/consumer-api';

export default function PaymentPage() {
  const [orderId, setOrderId] = useState('');
  const [method, setMethod] = useState('qris');
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function refreshOrder() {
    const token = getAccessToken();
    if (!token) throw new Error('Silakan masuk untuk melihat pesanan.');
    setOrder(await getConsumerOrder(orderId, token));
  }

  useEffect(() => {
    const requestedOrderId = new URLSearchParams(window.location.search).get('orderId');
    if (!requestedOrderId) {
      setError('ID pesanan tidak ditemukan. Silakan buat pesanan terlebih dahulu.');
      return;
    }
    setOrderId(requestedOrderId);
    getConsumerOrder(requestedOrderId, getAccessToken())
      .then(setOrder)
      .catch(requestError => setError(requestError.message));
  }, []);

  async function startPayment() {
    setError('');
    setLoading(true);
    try {
      const token = getAccessToken();
      if (!token) throw new Error('Silakan masuk untuk melanjutkan pembayaran.');
      const result = await apiRequest(`/orders/${orderId}/payment`, {
        method: 'POST',
        token,
        body: JSON.stringify({ method }),
      });
      setPayment(result);

      if (result?.payment_url?.includes('.example.test')) {
        const externalId = result.payment_url.split('/').pop();
        await apiRequest(`/payments/simulate`, {
          method: 'POST',
          token,
          body: JSON.stringify({ external_id: externalId }),
        });
      }

      await refreshOrder();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function simulatePaymentSuccess() {
    if (!payment?.payment_url?.includes('.example.test')) return;
    setError('');
    setLoading(true);
    try {
      const token = getAccessToken();
      if (!token) throw new Error('Silakan masuk untuk melanjutkan.');
      // Ekstrak external_id dari payment_url mock
      const externalId = payment.payment_url.split('/').pop();
      await apiRequest(`/payments/simulate`, {
        method: 'POST',
        token,
        body: JSON.stringify({ external_id: externalId }),
      });
      await refreshOrder();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return <>
    <Link href="/consumer/checkout" className="text-link"><ArrowLeft size={14} /> Kembali</Link>
    <span className="eyebrow" style={{ display: 'block', marginTop: 17 }}>Pembayaran</span><h1 className="page-title">Pilih cara bayar</h1>
    {error && <p className="form-error" role="alert">{error}</p>}
    {!order ? <p className="page-subtitle">Memuat pesanan…</p> : <div className="checkout-layout" style={{ marginTop: 23 }}>
      <section className="panel">
        <h2>Metode pembayaran</h2>
        {[
          ['qris', 'QRIS', 'Bayar melalui QRIS', CreditCard],
          ['ewallet', 'E-Wallet', 'Pembayaran dompet digital', Wallet],
          ['virtual_account', 'Virtual account', 'Transfer melalui virtual account', CreditCard],
        ].map(([value, title, desc, Icon]) => <label className="payment-method" key={value}><input type="radio" name="method" checked={method === value} onChange={() => setMethod(value)} /><Icon size={18} /><span style={{ flex: 1 }}>{title}<small style={{ display: 'block', color: '#85838d', fontWeight: 400, marginTop: 4 }}>{desc}</small></span></label>)}
      </section>
      <aside className="panel">
        <h2>Ringkasan pesanan</h2><p className="page-subtitle">{order.order_code || `Pesanan ${order.id}`}</p>
        <div className="summary-line"><span>{order.quantity} × {order.product?.name || 'Produk'}</span><span>{formatRupiah(order.total_price)}</span></div>
        {order.product_lookup_error && <p className="page-subtitle">Nama produk tidak tersedia: {order.product_lookup_error}</p>}
        <div className="summary-line total"><span>Total</span><span>{formatRupiah(order.total_price)}</span></div>
        {!payment && order.status === 'pending_payment' && <button className="button-secondary full-button" type="button" disabled={loading} onClick={startPayment}>{loading ? 'Menyiapkan pembayaran…' : 'Mulai pembayaran'}</button>}
        {payment && <div className="payment-result"><p>Status pembayaran: <strong>{payment.status}</strong></p><p>Berlaku sampai: {formatDateTime(payment.expires_at)}</p>{payment.qris_payload && <p className="page-subtitle">Payload QRIS dari backend: <code>{payment.qris_payload}</code></p>}{payment.payment_url && (payment.payment_url.includes('.example.test') ? <><p className="page-subtitle">Gateway mock aktif. URL ini bukan halaman pembayaran nyata.</p><button className="button-secondary full-button" type="button" onClick={simulatePaymentSuccess} disabled={loading} style={{ marginTop: 10 }}>{loading ? 'Mensimulasikan...' : 'Simulasi Pembayaran Berhasil'}</button></> : <p><a className="text-link" href={payment.payment_url} target="_blank" rel="noreferrer">Buka instruksi pembayaran dari penyedia</a></p>)}</div>}
        {order.qr_code && <p className="form-success">Pembayaran berhasil. QR pickup tersedia pada detail pesanan.</p>}
        {payment && !order.qr_code && <button className="button-outline full-button" type="button" onClick={() => refreshOrder().catch(requestError => setError(requestError.message))}>Perbarui status pembayaran</button>}
        <Link className="button-outline full-button" href={`/consumer/orders/${order.id}`}>Lihat detail pesanan</Link>
        <p className="page-subtitle">Kode pickup hanya akan muncul setelah backend mengonfirmasi pembayaran.</p>
      </aside>
    </div>}
  </>;
}
