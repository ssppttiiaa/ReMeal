'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ArrowLeft, Clock3, MapPin } from 'lucide-react';
import { formatDateTime, getAccessToken, getConsumerOrder, statusLabel } from '../../../lib/consumer-api';

export default function PickupQRPage() {
  const [order, setOrder] = useState(null);
  const [qrImage, setQrImage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const token = getAccessToken();
    const requestedOrderId = new URLSearchParams(window.location.search).get('orderId');
    if (!requestedOrderId || !token) {
      setError(!token ? 'Masuk untuk melihat QR pickup.' : 'ID pesanan tidak ditemukan.');
      return () => { active = false; };
    }
    getConsumerOrder(requestedOrderId, token)
      .then(async result => {
        if (!active) return;
        setOrder(result);
        if (result.qr_code) {
          if (/^(https?:\/\/|data:image\/)/i.test(result.qr_code)) setQrImage(result.qr_code);
          else setQrImage(await QRCode.toDataURL(result.qr_code, { margin: 1, width: 240 }));
        }
      })
      .catch(requestError => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, []);

  if (error) return <p className="form-error" role="alert">{error}</p>;
  if (!order) return <p className="page-subtitle">Memuat status pickup…</p>;
  const store = order.product?.store || {};
  const pickupExpired = order.pickup_deadline_at && Date.parse(order.pickup_deadline_at) < Date.now();

  return <>
    <Link href={`/consumer/orders/${order.id}`} className="text-link"><ArrowLeft size={14} /> Detail pesanan</Link>
    <div className="qr-wrap"><span className="eyebrow" style={{ display: 'block', marginTop: 23 }}>Pickup ReMeal</span><h1 className="page-title">{order.qr_code ? 'Tunjukkan QR saat pickup' : 'QR belum tersedia'}</h1><p className="page-subtitle">{order.qr_code ? 'QR hanya berlaku untuk pesanan ini dan diperiksa oleh toko.' : 'QR akan diterbitkan setelah pembayaran dikonfirmasi oleh backend.'}</p>
      <div className="qr-card">
        {qrImage && !pickupExpired ? <img className="pickup-qr-image" src={qrImage} alt={`QR pickup untuk ${order.order_code || order.id}`} /> : <div className="qr-unavailable">{pickupExpired ? 'Batas pickup telah lewat' : statusLabel(order.status)}</div>}
        <div className="qr-code-text">{order.order_code || order.id}</div>
      </div>
      <div className="panel" style={{ textAlign: 'left' }}><h2><MapPin size={15} /> {store.name || 'Toko'}</h2><p className="page-subtitle" style={{ lineHeight: 1.8 }}>{store.address || 'Alamat toko tidak tersedia.'}<br /><Clock3 size={13} /> Batas pickup: {formatDateTime(order.pickup_deadline_at)}</p></div>
      {order.product_lookup_error && <p className="page-subtitle">Informasi produk tidak tersedia: {order.product_lookup_error}</p>}
      <p className="page-subtitle">Status pesanan: {statusLabel(order.status)}</p>
    </div>
  </>;
}
