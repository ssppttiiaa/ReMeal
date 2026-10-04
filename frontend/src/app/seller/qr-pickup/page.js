"use client";

import { useState } from "react";
import {
  formatOrderPrice,
  getOrderQuantity,
  sampleOrders,
} from "../orders/_data/orders";

const pickupOrders = [
  {
    ...sampleOrders[0],
    status: "Siap Diambil",
  },
  sampleOrders[1],
  sampleOrders[2],
];

const statusStyles = {
  "Siap Diambil": "bg-[#e9eedf] text-[#637844]",
  Selesai: "bg-[#e7edda] text-[#536738]",
  "QR Tidak Valid": "bg-[#f5dfd8] text-[#a34d3e]",
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex w-fit rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

function ScannerMark() {
  return (
    <svg aria-hidden="true" className="h-12 w-12 text-[#71854a]" fill="none" viewBox="0 0 48 48">
      <path
        d="M7 18V9a2 2 0 0 1 2-2h9M30 7h9a2 2 0 0 1 2 2v9M41 30v9a2 2 0 0 1-2 2h-9M18 41H9a2 2 0 0 1-2-2v-9M16 16h6v6h-6zM27 16h5v5h-5zM16 27h5v5h-5zM27 27h5v5h-5z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function SellerQrPickupPage() {
  const [orders, setOrders] = useState(pickupOrders);
  const [scanResult, setScanResult] = useState(null);
  const [feedback, setFeedback] = useState("");

  const readyOrder = orders.find((order) => order.status === "Siap Diambil");
  const scannedOrder = scanResult?.valid
    ? orders.find((order) => order.id === scanResult.orderId)
    : null;

  function simulateScan(valid = true) {
    setFeedback("");
    if (!valid) {
      setScanResult({ valid: false });
      return;
    }

    const order = orders.find((item) => item.status === "Siap Diambil");
    if (!order) {
      setScanResult({ valid: false });
      return;
    }
    setScanResult({ valid: true, orderId: order.id });
  }

  function confirmPickup() {
    if (!scannedOrder || scannedOrder.status !== "Siap Diambil") return;

    const pickupTime = new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === scannedOrder.id
          ? { ...order, status: "Selesai", pickupTime }
          : order,
      ),
    );
    setFeedback("Pesanan berhasil diselesaikan. Perubahan ini hanya tersimpan sementara di halaman.");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8b927f]">Validasi pengambilan</p>
        <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#202a1e] sm:text-[30px]">
          QR Pickup
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#727a6d]">
          Verifikasi pesanan konsumen saat pengambilan.
        </p>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)]">
        <section
          aria-label="Simulasi pemindaian QR"
          className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4 sm:p-6"
        >
          <div className="mx-auto flex min-h-[290px] max-w-xl flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#cbd5b4] bg-[#f8f9f4] px-4 py-8 text-center sm:min-h-[340px]">
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-[#e9eedf]">
              <ScannerMark />
            </div>
            <h2 className="mt-5 text-base font-bold text-[#30392c]">Area scan QR Code</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[#858c7d]">
              Pemindaian kamera belum tersedia. Gunakan simulasi untuk memeriksa pesanan siap diambil.
            </p>
            <div className="mt-6 flex w-full max-w-sm flex-col gap-2 sm:flex-row">
              <button
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[#202a1e] px-4 text-sm font-semibold text-white transition hover:bg-[#35432f] disabled:cursor-not-allowed disabled:bg-[#202a1e]/40"
                disabled={!readyOrder}
                onClick={() => simulateScan(true)}
                type="button"
              >
                Simulasikan Scan QR
              </button>
              <button
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#202a1e]/10 px-4 text-sm font-semibold text-[#68754b] transition hover:bg-[#edf1e4]"
                onClick={() => simulateScan(false)}
                type="button"
              >
                Simulasi gagal
              </button>
            </div>
            {!readyOrder ? (
              <p className="mt-3 text-xs text-[#858c7d]">Tidak ada pesanan siap diambil pada data contoh.</p>
            ) : null}
          </div>
          <p className="mt-4 text-center text-[11px] text-[#9aa092]">
            Simulasi lokal — API verifikasi belum dipanggil.
          </p>
        </section>

        <section aria-live="polite" className="space-y-4">
          {scanResult === null ? (
            <div className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-5 sm:p-6">
              <h2 className="text-base font-bold text-[#30392c]">Hasil verifikasi</h2>
              <p className="mt-2 text-sm leading-6 text-[#858c7d]">
                Hasil scan dan informasi pesanan akan muncul di sini.
              </p>
            </div>
          ) : scanResult.valid && scannedOrder ? (
            <article className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base font-bold text-[#30392c]">Hasil verifikasi</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e7edda] px-2.5 py-1.5 text-[11px] font-bold text-[#536738]">
                  <span aria-hidden="true">✓</span>
                  QR Code Valid
                </span>
              </div>

              <dl className="mt-4 divide-y divide-[#202a1e]/[0.07]">
                <div className="py-3 first:pt-0">
                  <dt className="text-xs text-[#858c7d]">Nomor pesanan</dt>
                  <dd className="mt-1 text-sm font-bold text-[#30392c]">#{scannedOrder.id}</dd>
                </div>
                <div className="py-3">
                  <dt className="text-xs text-[#858c7d]">Produk</dt>
                  <dd className="mt-1 break-words text-sm font-semibold leading-5 text-[#30392c]">
                    {scannedOrder.items.map((item) => item.name).join(", ")}
                  </dd>
                </div>
                <div className="grid grid-cols-2 gap-3 py-3">
                  <div>
                    <dt className="text-xs text-[#858c7d]">Jumlah</dt>
                    <dd className="mt-1 text-sm font-semibold text-[#30392c]">
                      {getOrderQuantity(scannedOrder)} item
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#858c7d]">Total</dt>
                    <dd className="mt-1 text-sm font-semibold text-[#30392c]">
                      {formatOrderPrice(scannedOrder.total)}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 py-3">
                  <dt className="text-xs text-[#858c7d]">Status pesanan</dt>
                  <dd><StatusBadge status={scannedOrder.status} /></dd>
                </div>
                <div className="py-3 last:pb-0">
                  <dt className="text-xs text-[#858c7d]">Waktu pengambilan</dt>
                  <dd className="mt-1 text-sm font-semibold text-[#30392c]">
                    {scannedOrder.pickupTime ?? "Belum dikonfirmasi"}
                  </dd>
                </div>
              </dl>

              {scannedOrder.status === "Siap Diambil" ? (
                <button
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#202a1e] px-4 text-sm font-semibold text-white transition hover:bg-[#35432f]"
                  onClick={confirmPickup}
                  type="button"
                >
                  Konfirmasi Pengambilan
                </button>
              ) : null}
            </article>
          ) : (
            <div className="rounded-xl border border-[#e8b9ae] bg-[#fffefa] p-5 sm:p-6">
              <h2 className="text-base font-bold text-[#30392c]">Hasil verifikasi</h2>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#f5dfd8] px-4 py-3 text-sm font-bold text-[#a34d3e]">
                <span aria-hidden="true">×</span>
                QR Code Tidak Valid
              </div>
              <p className="mt-3 text-sm leading-6 text-[#858c7d]">
                Pastikan QR terkait pesanan yang valid dan belum selesai diambil.
              </p>
            </div>
          )}

          {feedback ? (
            <p className="rounded-lg border border-[#cbd5b4] bg-[#edf3df] px-4 py-3 text-sm font-semibold leading-5 text-[#536738]">
              {feedback}
            </p>
          ) : null}
        </section>
      </div>

      <p className="text-center text-[11px] text-[#9aa092]">
        Status dan waktu pengambilan hanya berubah sementara di halaman ini; belum tersimpan ke database.
      </p>
    </div>
  );
}
