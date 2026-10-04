import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatOrderPrice,
  getOrderQuantity,
  sampleOrders,
} from "../_data/orders";

const statusStyles = {
  "Menunggu Pembayaran": "bg-[#f8e9d4] text-[#94621f]",
  Diproses: "bg-[#dce9e7] text-[#3c6861]",
  "Siap Diambil": "bg-[#e9eedf] text-[#637844]",
  Selesai: "bg-[#e7edda] text-[#536738]",
  Dibatalkan: "bg-[#f5dfd8] text-[#a34d3e]",
};

function DetailValue({ label, children }) {
  return (
    <div className="border-b border-[#202a1e]/[0.07] py-3.5 last:border-0 last:pb-0">
      <dt className="text-xs text-[#858c7d]">{label}</dt>
      <dd className="mt-1.5 break-words text-sm font-semibold leading-5 text-[#30392c]">{children}</dd>
    </div>
  );
}

function OrderStatusInfo({ status }) {
  const messages = {
    "Menunggu Pembayaran": "Pesanan menunggu konsumen menyelesaikan pembayaran.",
    Diproses: "Siapkan pesanan untuk konsumen. Aksi konfirmasi akan tersedia setelah API terhubung.",
    "Siap Diambil": "Pesanan menunggu untuk diambil. Fitur verifikasi pickup belum termasuk tahap ini.",
    Selesai: "Pesanan contoh ini sudah selesai.",
    Dibatalkan: "Pesanan contoh ini sudah dibatalkan.",
  };

  return (
    <div className="mt-5 rounded-lg border border-[#202a1e]/[0.07] bg-[#f8f9f4] p-4">
      <p className="text-sm font-semibold text-[#30392c]">{messages[status]}</p>
      {status === "Diproses" ? (
        <button
          className="mt-3 min-h-10 cursor-not-allowed rounded-lg bg-[#202a1e]/[0.12] px-4 text-sm font-semibold text-[#727a6d]"
          disabled
          type="button"
        >
          Konfirmasi Pesanan — API belum terhubung
        </button>
      ) : null}
    </div>
  );
}

export default async function SellerOrderDetailPage({ params }) {
  const { orderId } = await params;
  const order = sampleOrders.find((item) => item.id === orderId);

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link
          className="inline-flex min-h-9 items-center text-sm font-semibold text-[#637844] transition hover:text-[#40532c]"
          href="/seller/orders"
        >
          <span aria-hidden="true" className="mr-2">←</span>
          Kembali ke Pesanan
        </Link>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8b927f]">Detail pesanan</p>
            <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#202a1e] sm:text-[30px]">
              #{order.id}
            </h1>
          </div>
          <span
            className={`inline-flex w-fit whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold ${statusStyles[order.status]}`}
          >
            {order.status}
          </span>
        </div>
        <p className="mt-2 text-xs text-[#858c7d]">Data contoh — perubahan belum tersimpan ke database.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <section className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-5 sm:p-6">
          <h2 className="text-base font-bold text-[#30392c]">Informasi produk</h2>
          <div className="mt-4 divide-y divide-[#202a1e]/[0.07]">
            {order.items.map((item) => (
              <article className="flex flex-wrap items-start justify-between gap-3 py-4 first:pt-0 last:pb-0" key={item.name}>
                <div className="min-w-0 flex-1">
                  <h3 className="break-words text-sm font-semibold leading-5 text-[#30392c]">{item.name}</h3>
                  <p className="mt-1 text-xs text-[#858c7d]">
                    {formatOrderPrice(item.price)} × {item.quantity} item
                  </p>
                </div>
                <p className="text-sm font-semibold text-[#30392c]">
                  {formatOrderPrice(item.price * item.quantity)}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#202a1e]/[0.08] pt-4">
            <div>
              <p className="text-xs text-[#858c7d]">Jumlah item</p>
              <p className="mt-1 text-sm font-semibold text-[#30392c]">{getOrderQuantity(order)} item</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#858c7d]">Total pembayaran</p>
              <p className="mt-1 text-lg font-bold tracking-[-0.02em] text-[#202a1e]">
                {formatOrderPrice(order.total)}
              </p>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-5 sm:p-6">
            <h2 className="text-base font-bold text-[#30392c]">Ringkasan</h2>
            <dl className="mt-2">
              <DetailValue label="Waktu pemesanan">{order.orderedAt}</DetailValue>
              <DetailValue label="Batas pengambilan">
                {order.pickupDeadline ?? "Tidak tersedia (pesanan dibatalkan)"}
              </DetailValue>
              <DetailValue label="Konsumen">Belum tersedia dalam data contoh</DetailValue>
            </dl>
          </section>

          <section className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-5 sm:p-6">
            <h2 className="text-base font-bold text-[#30392c]">Informasi pembayaran</h2>
            <dl className="mt-2">
              <DetailValue label="Metode pembayaran">{order.paymentMethod}</DetailValue>
              <DetailValue label="Status pembayaran">{order.paymentStatus}</DetailValue>
              <DetailValue label="Total">{formatOrderPrice(order.total)}</DetailValue>
            </dl>
          </section>
        </aside>
      </div>

      <section className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-5 sm:p-6">
        <h2 className="text-base font-bold text-[#30392c]">Aksi pesanan</h2>
        <OrderStatusInfo status={order.status} />
      </section>
    </div>
  );
}
