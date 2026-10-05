"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSellerOrderById, confirmSellerOrder } from "../../../../services/orders";
import { formatOrderPrice, getOrderQuantity } from "../_data/orders";

const statusStyles = {
  "Menunggu Pembayaran": "bg-[#F8E7A8] text-[#29261F]",
  Diproses: "bg-[#E89B3C] text-[#29261F]",
  "Siap Diambil": "bg-[#F4C542] text-[#29261F]",
  Selesai: "bg-[#F4C542] text-[#29261F]",
  Dibatalkan: "bg-[#29261F] text-white",
  // Map API status as fallback
  pending: "bg-[#F8E7A8] text-[#29261F]",
  paid: "bg-[#E89B3C] text-[#29261F]",
  completed: "bg-[#F4C542] text-[#29261F]",
  cancelled: "bg-[#29261F] text-white",
};

const mapApiStatus = (s) => {
  if (s === 'pending') return "Menunggu Pembayaran";
  if (s === 'paid') return "Siap Diambil";
  if (s === 'completed') return "Selesai";
  if (s === 'cancelled') return "Dibatalkan";
  return s;
};

function DetailValue({ label, children }) {
  return (
    <div className="border-b border-[#29261F]/[0.07] py-3.5 last:border-0 last:pb-0">
      <dt className="text-xs text-[#8B8172]">{label}</dt>
      <dd className="mt-1.5 break-words text-sm font-semibold leading-5 text-[#29261F]">{children}</dd>
    </div>
  );
}

function OrderStatusInfo({ status, onConfirm, busy }) {
  const displayStatus = mapApiStatus(status);
  const messages = {
    "Menunggu Pembayaran": "Pesanan menunggu konsumen menyelesaikan pembayaran.",
    Diproses: "Pesanan ini sudah dibayar, silakan konfirmasi pesanan ini agar status berubah menjadi Siap Diambil.",
    "Siap Diambil": "Pesanan menunggu untuk diambil oleh konsumen melalui scan QR.",
    Selesai: "Pesanan ini sudah selesai diambil oleh konsumen.",
    Dibatalkan: "Pesanan ini telah dibatalkan.",
  };

  return (
    <div className="mt-5 rounded-lg border border-[#29261F]/[0.07] bg-[#F7F1E7] p-4">
      <p className="text-sm font-semibold text-[#29261F]">{messages[displayStatus] || displayStatus}</p>
      {status === "paid" ? (
        <button
          className="mt-3 min-h-10 cursor-pointer rounded-lg bg-[#E89B3C] px-4 text-sm font-semibold text-white transition hover:bg-[#F4C542] disabled:opacity-50"
          disabled={busy}
          onClick={onConfirm}
          type="button"
        >
          {busy ? "Mengonfirmasi..." : "Tandai Siap Diambil (Konfirmasi Pesanan)"}
        </button>
      ) : null}
    </div>
  );
}

export default function SellerOrderDetailPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    getSellerOrderById(orderId)
      .then((res) => {
        if (!active) return;
        setOrder(res);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [orderId]);

  async function handleConfirm() {
    setBusy(true);
    setError("");
    try {
      await confirmSellerOrder(orderId);
      const res = await getSellerOrderById(orderId);
      setOrder(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-5xl"><p className="text-sm text-[#8B8172]">Memuat pesanan...</p></div>;
  }

  if (error && !order) {
    return <div className="mx-auto max-w-5xl"><p className="text-sm font-semibold text-red-500">{error}</p></div>;
  }

  if (!order) {
    return <div className="mx-auto max-w-5xl"><p className="text-sm">Pesanan tidak ditemukan.</p></div>;
  }

  const items = order.items || [];
  const orderedAt = new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(new Date(order.created_at));
  let pickupDeadline = "Tidak tersedia";
  if (order.pickup_deadline_at) {
    pickupDeadline = new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(new Date(order.pickup_deadline_at));
  } else if (order.status === "cancelled") {
    pickupDeadline = "Tidak tersedia (pesanan dibatalkan)";
  }

  const consumerName = order.consumer_name || "Konsumen";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link
          className="inline-flex min-h-9 items-center text-sm font-semibold text-[#29261F] transition hover:text-[#29261F]"
          href="/seller/orders"
        >
          <span aria-hidden="true" className="mr-2">←</span>
          Kembali ke Pesanan
        </Link>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">Detail pesanan</p>
            <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#29261F] sm:text-[30px]">
              #{order.id.slice(0, 8)}
            </h1>
          </div>
          <span
            className={`inline-flex w-fit whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold ${statusStyles[mapApiStatus(order.status)] || "bg-gray-200"}`}
          >
            {mapApiStatus(order.status)}
          </span>
        </div>
      </div>
      
      {error && <p className="text-red-500 font-semibold">{error}</p>}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <section className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-5 sm:p-6">
          <h2 className="text-base font-bold text-[#29261F]">Informasi produk</h2>
          <div className="mt-4 divide-y divide-[#29261f]/[0.07]">
            {items.map((item, index) => (
              <article className="flex flex-wrap items-start justify-between gap-3 py-4 first:pt-0 last:pb-0" key={item.id || index}>
                <div className="min-w-0 flex-1">
                  <h3 className="break-words text-sm font-semibold leading-5 text-[#29261F]">{item.product_name || item.name}</h3>
                  <p className="mt-1 text-xs text-[#8B8172]">
                    {formatOrderPrice(item.unit_price || item.price || 0)} × {item.quantity || 1} item
                  </p>
                </div>
                <p className="text-sm font-semibold text-[#29261F]">
                  {formatOrderPrice((item.unit_price || item.price || 0) * (item.quantity || 1))}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#29261F]/[0.08] pt-4">
            <div>
              <p className="text-xs text-[#8B8172]">Jumlah item</p>
              <p className="mt-1 text-sm font-semibold text-[#29261F]">{getOrderQuantity(order)} item</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#8B8172]">Total pembayaran</p>
              <p className="mt-1 text-lg font-bold tracking-[-0.02em] text-[#29261F]">
                {formatOrderPrice(order.total_amount || order.total || 0)}
              </p>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-5 sm:p-6">
            <h2 className="text-base font-bold text-[#29261F]">Ringkasan</h2>
            <dl className="mt-2">
              <DetailValue label="Waktu pemesanan">{orderedAt}</DetailValue>
              <DetailValue label="Batas pengambilan">
                {pickupDeadline}
              </DetailValue>
              <DetailValue label="Konsumen">{consumerName}</DetailValue>
            </dl>
          </section>

          <section className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-5 sm:p-6">
            <h2 className="text-base font-bold text-[#29261F]">Informasi pembayaran</h2>
            <dl className="mt-2">
              <DetailValue label="Metode pembayaran">{order.payment_method || "QRIS"}</DetailValue>
              <DetailValue label="Status pembayaran">{order.payment_status || "Lunas"}</DetailValue>
              <DetailValue label="Total">{formatOrderPrice(order.total_amount || order.total || 0)}</DetailValue>
            </dl>
          </section>
        </aside>
      </div>

      <section className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-5 sm:p-6">
        <h2 className="text-base font-bold text-[#29261F]">Aksi pesanan</h2>
        <OrderStatusInfo busy={busy} onConfirm={handleConfirm} status={order.status} />
      </section>
    </div>
  );
}
