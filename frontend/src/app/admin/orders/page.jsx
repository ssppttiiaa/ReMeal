"use client";

import { useMemo, useState } from "react";
import { ADMIN_DEV_MODE } from "../../../lib/adminDevMode";
import { AdminOrdersApi } from "../_components/AdminApiViews";

const orderStatuses = [
  "Menunggu Pembayaran",
  "Diproses",
  "Siap Diambil",
  "Selesai",
  "Dibatalkan",
];
const paymentStatuses = ["Menunggu", "Berhasil", "Gagal", "Dikembalikan"];
const dateFilters = ["Semua Waktu", "Hari Ini", "7 Hari Terakhir", "30 Hari Terakhir"];
const referenceDate = "2026-10-04";
const pageSize = 10;

const orders = [
  {
    id: "RM-1024",
    productName: "Roti Cokelat",
    quantity: 2,
    unitPrice: 8000,
    storeName: "Roti & Rasa",
    storeLocation: "Yogyakarta",
    consumerName: "Septiana",
    consumerEmail: "septi@remeal.id",
    total: 16000,
    paymentStatus: "Berhasil",
    orderStatus: "Selesai",
    orderDate: "2026-10-04T14:20:00+07:00",
    pickupDeadline: "4 Okt 2026, 19:30",
    paymentMethod: "Pembayaran Digital",
    qrStatus: "Terverifikasi",
  },
  {
    id: "RM-1023",
    productName: "Rice Bowl Ayam Teriyaki",
    quantity: 1,
    unitPrice: 21000,
    storeName: "Dapur Mbak Sari",
    storeLocation: "Yogyakarta",
    consumerName: "Bima",
    consumerEmail: "bima@remeal.id",
    total: 21000,
    paymentStatus: "Berhasil",
    orderStatus: "Siap Diambil",
    orderDate: "2026-10-04T14:05:00+07:00",
    pickupDeadline: "4 Okt 2026, 19:00",
    paymentMethod: "Pembayaran Digital",
    qrStatus: "Belum Digunakan",
  },
  {
    id: "RM-1022",
    productName: "Brownies Cokelat",
    quantity: 2,
    unitPrice: 19000,
    storeName: "Manis Bakery",
    storeLocation: "Bantul",
    consumerName: "Nadia",
    consumerEmail: "nadia@remeal.id",
    total: 38000,
    paymentStatus: "Berhasil",
    orderStatus: "Diproses",
    orderDate: "2026-10-04T13:42:00+07:00",
    pickupDeadline: "4 Okt 2026, 18:30",
    paymentMethod: "Pembayaran Digital",
    qrStatus: "Belum Digunakan",
  },
  {
    id: "RM-1021",
    productName: "Donat Cokelat",
    quantity: 1,
    unitPrice: 7000,
    storeName: "Roti & Rasa",
    storeLocation: "Yogyakarta",
    consumerName: "Rafi",
    consumerEmail: "rafi@remeal.id",
    total: 7000,
    paymentStatus: "Menunggu",
    orderStatus: "Menunggu Pembayaran",
    orderDate: "2026-10-04T13:30:00+07:00",
    pickupDeadline: "4 Okt 2026, 19:00",
    paymentMethod: "Pembayaran Digital",
    qrStatus: "Belum Digunakan",
  },
  {
    id: "RM-1020",
    productName: "Es Kopi Susu Gula Aren",
    quantity: 1,
    unitPrice: 15000,
    storeName: "Kopi Senja",
    storeLocation: "Sleman",
    consumerName: "Citra",
    consumerEmail: "citra@remeal.id",
    total: 15000,
    paymentStatus: "Dikembalikan",
    orderStatus: "Dibatalkan",
    orderDate: "2026-10-03T18:55:00+07:00",
    pickupDeadline: "—",
    paymentMethod: "Pembayaran Digital",
    qrStatus: "Belum Digunakan",
  },
  {
    id: "RM-1019",
    productName: "Paket Nasi Ayam",
    quantity: 1,
    unitPrice: 18000,
    storeName: "Dapur Mbak Sari",
    storeLocation: "Yogyakarta",
    consumerName: "Dimas",
    consumerEmail: "dimas@remeal.id",
    total: 18000,
    paymentStatus: "Berhasil",
    orderStatus: "Selesai",
    orderDate: "2026-10-03T17:20:00+07:00",
    pickupDeadline: "3 Okt 2026, 20:00",
    paymentMethod: "Pembayaran Digital",
    qrStatus: "Terverifikasi",
  },
  {
    id: "RM-1018",
    productName: "Roti Sobek Keju",
    quantity: 1,
    unitPrice: 14000,
    storeName: "Roti & Rasa",
    storeLocation: "Yogyakarta",
    consumerName: "Sinta",
    consumerEmail: "sinta@remeal.id",
    total: 14000,
    paymentStatus: "Berhasil",
    orderStatus: "Diproses",
    orderDate: "2026-10-02T16:48:00+07:00",
    pickupDeadline: "2 Okt 2026, 19:30",
    paymentMethod: "Pembayaran Digital",
    qrStatus: "Belum Digunakan",
  },
  {
    id: "RM-1017",
    productName: "Salad Buah",
    quantity: 1,
    unitPrice: 12000,
    storeName: "Segar Berkah",
    storeLocation: "Gunungkidul",
    consumerName: "Yoga",
    consumerEmail: "yoga@remeal.id",
    total: 12000,
    paymentStatus: "Gagal",
    orderStatus: "Menunggu Pembayaran",
    orderDate: "2026-10-01T15:10:00+07:00",
    pickupDeadline: "2 Okt 2026, 18:00",
    paymentMethod: "Pembayaran Digital",
    qrStatus: "Belum Digunakan",
  },
  {
    id: "RM-1016",
    productName: "Puding Cokelat",
    quantity: 2,
    unitPrice: 9000,
    storeName: "Manis Bakery",
    storeLocation: "Bantul",
    consumerName: "Alya",
    consumerEmail: "alya@remeal.id",
    total: 18000,
    paymentStatus: "Berhasil",
    orderStatus: "Siap Diambil",
    orderDate: "2026-09-30T14:35:00+07:00",
    pickupDeadline: "30 Sep 2026, 18:30",
    paymentMethod: "Pembayaran Digital",
    qrStatus: "Belum Digunakan",
  },
  {
    id: "RM-1015",
    productName: "Paket Snack",
    quantity: 1,
    unitPrice: 11000,
    storeName: "Kedai Nusantara",
    storeLocation: "Yogyakarta",
    consumerName: "Fajar",
    consumerEmail: "fajar@remeal.id",
    total: 11000,
    paymentStatus: "Berhasil",
    orderStatus: "Selesai",
    orderDate: "2026-09-28T12:15:00+07:00",
    pickupDeadline: "28 Sep 2026, 17:00",
    paymentMethod: "Pembayaran Digital",
    qrStatus: "Terverifikasi",
  },
  {
    id: "RM-1014",
    productName: "Nasi Gudeg",
    quantity: 1,
    unitPrice: 20000,
    storeName: "Warung Pagi",
    storeLocation: "Sleman",
    consumerName: "Intan",
    consumerEmail: "intan@remeal.id",
    total: 20000,
    paymentStatus: "Berhasil",
    orderStatus: "Selesai",
    orderDate: "2026-09-24T11:45:00+07:00",
    pickupDeadline: "24 Sep 2026, 16:00",
    paymentMethod: "Pembayaran Digital",
    qrStatus: "Terverifikasi",
  },
  {
    id: "RM-1013",
    productName: "Roti Pisang",
    quantity: 2,
    unitPrice: 8000,
    storeName: "Teras Roti",
    storeLocation: "Yogyakarta",
    consumerName: "Wulan",
    consumerEmail: "wulan@remeal.id",
    total: 16000,
    paymentStatus: "Berhasil",
    orderStatus: "Selesai",
    orderDate: "2026-09-14T09:20:00+07:00",
    pickupDeadline: "14 Sep 2026, 13:00",
    paymentMethod: "Pembayaran Digital",
    qrStatus: "Terverifikasi",
  },
];

const orderStatusStyles = {
  "Menunggu Pembayaran": "bg-[#F8E7A8] text-[#29261F]",
  Diproses: "bg-[#E89B3C] text-[#29261F]",
  "Siap Diambil": "bg-[#F4C542] text-[#29261F]",
  Selesai: "bg-[#F4C542] text-[#29261F]",
  Dibatalkan: "bg-[#29261F] text-white",
};

const paymentStatusStyles = {
  Menunggu: "bg-[#F8E7A8] text-[#29261F]",
  Berhasil: "bg-[#F4C542] text-[#29261F]",
  Gagal: "bg-[#29261F] text-white",
  Dikembalikan: "bg-[#F8E7A8] text-[#29261F]",
};

function formatPrice(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

function OrderStatusBadge({ status }) {
  return (
    <span className={`inline-flex w-fit whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${orderStatusStyles[status]}`}>
      {status}
    </span>
  );
}

function PaymentStatusBadge({ status }) {
  return (
    <span className={`inline-flex w-fit whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${paymentStatusStyles[status]}`}>
      {status}
    </span>
  );
}

function DetailField({ label, children }) {
  return (
    <div className="min-w-0 border-b border-[#29261F]/[0.07] py-3">
      <dt className="text-xs text-[#8B8172]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold text-[#29261F]">{children}</dd>
    </div>
  );
}

function OrderDetailDialog({ order, onClose }) {
  const subtotal = order.unitPrice * order.quantity;

  return (
    <div
      aria-labelledby="order-detail-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#FFF9EF]/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
    >
      <section className="my-auto w-full max-w-2xl rounded-xl bg-[#FFF9EF] p-5 shadow-xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#29261F]" id="order-detail-title">
              Detail Pesanan
            </h2>
            <p className="mt-1 break-all text-xs text-[#8B8172]">{order.id}</p>
          </div>
          <button
            aria-label="Tutup detail pesanan"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg text-[#8B8172] transition hover:bg-[#F7F1E7]"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <section aria-label="Informasi Pesanan">
            <h3 className="text-sm font-bold text-[#29261F]">A. Informasi Pesanan</h3>
            <dl className="mt-1 grid gap-x-5 sm:grid-cols-2">
              <DetailField label="ID Pesanan">{order.id}</DetailField>
              <DetailField label="Waktu Pesanan">{formatDate(order.orderDate)}</DetailField>
              <DetailField label="Status Pesanan"><OrderStatusBadge status={order.orderStatus} /></DetailField>
            </dl>
          </section>

          <section aria-label="Produk">
            <h3 className="text-sm font-bold text-[#29261F]">B. Produk</h3>
            <dl className="mt-1 grid gap-x-5 sm:grid-cols-2">
              <DetailField label="Nama Produk">{order.productName}</DetailField>
              <DetailField label="Jumlah">{order.quantity} item</DetailField>
              <DetailField label="Harga">{formatPrice(order.unitPrice)}</DetailField>
              <DetailField label="Subtotal">{formatPrice(subtotal)}</DetailField>
            </dl>
          </section>

          <section aria-label="UMKM">
            <h3 className="text-sm font-bold text-[#29261F]">C. UMKM</h3>
            <dl className="mt-1 grid gap-x-5 sm:grid-cols-2">
              <DetailField label="Nama Toko">{order.storeName}</DetailField>
              <DetailField label="Lokasi">{order.storeLocation}</DetailField>
            </dl>
          </section>

          <section aria-label="Konsumen">
            <h3 className="text-sm font-bold text-[#29261F]">D. Konsumen</h3>
            <dl className="mt-1 grid gap-x-5 sm:grid-cols-2">
              <DetailField label="Nama">{order.consumerName}</DetailField>
              <DetailField label="Email">{order.consumerEmail}</DetailField>
            </dl>
          </section>

          <section aria-label="Pembayaran">
            <h3 className="text-sm font-bold text-[#29261F]">E. Pembayaran</h3>
            <dl className="mt-1 grid gap-x-5 sm:grid-cols-2">
              <DetailField label="Metode Pembayaran">{order.paymentMethod}</DetailField>
              <DetailField label="Total">{formatPrice(order.total)}</DetailField>
              <DetailField label="Status Pembayaran"><PaymentStatusBadge status={order.paymentStatus} /></DetailField>
            </dl>
          </section>

          <section aria-label="Pickup">
            <h3 className="text-sm font-bold text-[#29261F]">F. Pickup</h3>
            <dl className="mt-1 grid gap-x-5 sm:grid-cols-2">
              <DetailField label="Batas Pengambilan">{order.pickupDeadline}</DetailField>
              <DetailField label="Status QR">
                {order.paymentStatus === "Berhasil" ? order.qrStatus : "Tidak tersedia"}
              </DetailField>
            </dl>
          </section>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#FFF9EF] px-5 text-sm font-semibold text-white transition hover:bg-[#E89B3C]"
            onClick={onClose}
            type="button"
          >
            Tutup
          </button>
        </div>
      </section>
    </div>
  );
}

function OrderCard({ order, onView }) {
  return (
    <article className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-all text-sm font-bold text-[#29261F]">{order.id}</p>
          <p className="mt-1 text-[11px] text-[#8B8172]">{formatDate(order.orderDate)}</p>
        </div>
        <OrderStatusBadge status={order.orderStatus} />
      </div>
      <p className="mt-4 break-words text-sm font-semibold leading-5 text-[#29261F]">
        {order.productName} ×{order.quantity}
      </p>
      <p className="mt-1 break-words text-xs text-[#8B8172]">{order.storeName}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#29261F]/[0.07] pt-3 text-xs">
        <div>
          <p className="text-[#8B8172]">Total</p>
          <p className="mt-1 font-semibold text-[#29261F]">{formatPrice(order.total)}</p>
        </div>
        <div>
          <p className="text-[#8B8172]">Pembayaran</p>
          <div className="mt-1"><PaymentStatusBadge status={order.paymentStatus} /></div>
        </div>
      </div>
      <button
        className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-[#FFF9EF] px-3 text-sm font-semibold text-white transition hover:bg-[#E89B3C]"
        onClick={() => onView(order)}
        type="button"
      >
        Lihat Detail
      </button>
    </article>
  );
}

function Pagination({ currentPage, totalPages, onChange }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Pagination pesanan" className="flex flex-wrap items-center justify-center gap-1.5">
      <button
        className="min-h-10 rounded-lg border border-[#29261F]/10 px-3 text-xs font-semibold text-[#29261F] transition hover:bg-[#F7F1E7] disabled:cursor-not-allowed disabled:opacity-40"
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
        type="button"
      >
        Sebelumnya
      </button>
      {pages.map((page) => (
        <button
          aria-current={currentPage === page ? "page" : undefined}
          className={`grid h-10 min-w-10 place-items-center rounded-lg px-3 text-xs font-semibold transition ${
            currentPage === page
              ? "bg-[#FFF9EF] text-white"
              : "border border-[#29261F]/10 text-[#29261F] hover:bg-[#F7F1E7]"
          }`}
          key={page}
          onClick={() => onChange(page)}
          type="button"
        >
          {page}
        </button>
      ))}
      <button
        className="min-h-10 rounded-lg border border-[#29261F]/10 px-3 text-xs font-semibold text-[#29261F] transition hover:bg-[#F7F1E7] disabled:cursor-not-allowed disabled:opacity-40"
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
        type="button"
      >
        Selanjutnya
      </button>
    </nav>
  );
}

function matchesDateFilter(order, dateFilter) {
  if (dateFilter === "Semua Waktu") return true;
  const date = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(new Date(order.orderDate));
  const elapsedDays =
    (Date.parse(`${referenceDate}T00:00:00Z`) - Date.parse(`${date}T00:00:00Z`)) / 86400000;

  if (dateFilter === "Hari Ini") return elapsedDays === 0;
  if (dateFilter === "7 Hari Terakhir") return elapsedDays >= 0 && elapsedDays < 7;
  return elapsedDays >= 0 && elapsedDays < 30;
}

function AdminOrdersMock() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Semua Status");
  const [dateFilter, setDateFilter] = useState("Semua Waktu");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const normalizedSearch = search.trim().toLocaleLowerCase("id-ID");

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const searchText = `${order.id} ${order.productName} ${order.storeName}`.toLocaleLowerCase("id-ID");
        const matchesSearch = !normalizedSearch || searchText.includes(normalizedSearch);
        const matchesStatus = status === "Semua Status" || order.orderStatus === status;
        return matchesSearch && matchesStatus && matchesDateFilter(order, dateFilter);
      }),
    [dateFilter, normalizedSearch, status],
  );

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const visibleOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const summaryCards = [
    { label: "Total Pesanan", value: orders.length, mark: "P", tone: "bg-[#F4C542] text-[#29261F]" },
    { label: "Menunggu Pembayaran", value: orders.filter((order) => order.orderStatus === "Menunggu Pembayaran").length, mark: "M", tone: "bg-[#F8E7A8] text-[#29261F]" },
    { label: "Diproses", value: orders.filter((order) => order.orderStatus === "Diproses").length, mark: "D", tone: "bg-[#E89B3C] text-[#29261F]" },
    { label: "Siap Diambil", value: orders.filter((order) => order.orderStatus === "Siap Diambil").length, mark: "A", tone: "bg-[#F4C542] text-[#29261F]" },
    { label: "Selesai", value: orders.filter((order) => order.orderStatus === "Selesai").length, mark: "✓", tone: "bg-[#F4C542] text-[#29261F]" },
  ];

  function changeFilters(update) {
    update();
    setCurrentPage(1);
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">Manajemen platform</p>
        <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#29261F] sm:text-[30px]">
          Orders
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#8B8172]">
          Pantau pesanan, pembayaran, dan pengambilan produk di toko ReMeal.
        </p>
      </header>

      <section aria-label="Ringkasan pesanan" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {summaryCards.map((summary) => (
          <article className="min-w-0 rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-5" key={summary.label}>
            <div className="flex items-start justify-between gap-2">
              <p className="min-h-8 text-xs font-medium leading-4 text-[#8B8172]">{summary.label}</p>
              <span className={`grid h-8 min-w-8 shrink-0 place-items-center rounded-lg px-1.5 text-xs font-bold ${summary.tone}`}>
                {summary.mark}
              </span>
            </div>
            <p className="mt-3 break-words text-[23px] font-bold leading-none tracking-[-0.04em] text-[#29261F] sm:text-[26px]">
              {summary.value.toLocaleString("id-ID")}
            </p>
            <p className="mt-2.5 text-[10px] leading-4 text-[#8B8172]">pesanan contoh</p>
          </article>
        ))}
      </section>

      <section
        aria-label="Cari dan filter pesanan"
        className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-5"
      >
        <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_minmax(190px,220px)_minmax(180px,210px)]">
          <label className="relative block">
            <span className="sr-only">Cari pesanan, produk, atau toko</span>
            <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8172]">⌕</span>
            <input
              className="h-11 w-full min-w-0 rounded-lg border border-[#29261F]/10 bg-white pl-9 pr-3 text-sm text-[#29261F] outline-none transition placeholder:text-[#8B8172] focus:border-[#29261F] focus:ring-2 focus:ring-[#E89B3C]"
              onChange={(event) => changeFilters(() => setSearch(event.target.value))}
              placeholder="Cari ID pesanan, produk, atau toko..."
              type="search"
              value={search}
            />
          </label>
          <label className="block">
            <span className="sr-only">Filter status pesanan</span>
            <select
              className="h-11 w-full min-w-0 rounded-lg border border-[#29261F]/10 bg-white px-3 text-sm text-[#29261F] outline-none focus:border-[#29261F] focus:ring-2 focus:ring-[#E89B3C]"
              onChange={(event) => changeFilters(() => setStatus(event.target.value))}
              value={status}
            >
              <option>Semua Status</option>
              {orderStatuses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Filter tanggal pesanan</span>
            <select
              className="h-11 w-full min-w-0 rounded-lg border border-[#29261F]/10 bg-white px-3 text-sm text-[#29261F] outline-none focus:border-[#29261F] focus:ring-2 focus:ring-[#E89B3C]"
              onChange={(event) => changeFilters(() => setDateFilter(event.target.value))}
              value={dateFilter}
            >
              {dateFilters.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section aria-label="Daftar pesanan" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-[#29261F]">Daftar Pesanan</h2>
          <span className="text-xs text-[#8B8172]">
            {filteredOrders.length === 0
              ? "0 pesanan"
              : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredOrders.length)} dari ${filteredOrders.length} pesanan`}
          </span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] px-5 py-12 text-center">
            <h3 className="text-sm font-bold text-[#29261F]">Pesanan tidak ditemukan</h3>
            <p className="mt-1.5 text-sm text-[#8B8172]">
              Coba ubah kata kunci atau filter yang digunakan.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 lg:hidden">
              {visibleOrders.map((order) => (
                <OrderCard key={order.id} onView={setSelectedOrder} order={order} />
              ))}
            </div>

            <div className="hidden overflow-x-auto rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] lg:block">
              <table className="w-full min-w-[1450px] table-fixed text-left">
                <colgroup>
                  <col className="w-[9%]" />
                  <col className="w-[14%]" />
                  <col className="w-[11%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                  <col className="w-[11%]" />
                  <col className="w-[12%]" />
                  <col className="w-[14%]" />
                  <col className="w-[9%]" />
                </colgroup>
                <thead className="border-b border-[#29261F]/[0.07] bg-[#F7F1E7]">
                  <tr className="text-[11px] font-semibold text-[#8B8172]">
                    <th className="px-4 py-3.5">ID Pesanan</th>
                    <th className="px-4 py-3.5">Produk</th>
                    <th className="px-4 py-3.5">UMKM</th>
                    <th className="px-4 py-3.5">Konsumen</th>
                    <th className="px-4 py-3.5">Total</th>
                    <th className="px-4 py-3.5">Pembayaran</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Waktu</th>
                    <th className="px-4 py-3.5">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#29261f]/[0.07]">
                  {visibleOrders.map((order) => (
                    <tr className="text-xs text-[#29261F]" key={order.id}>
                      <td className="break-all px-4 py-3.5 font-bold">{order.id}</td>
                      <td className="break-words px-4 py-3.5">
                        <span className="font-medium">{order.productName}</span>
                        <span className="mt-1 block text-[10px] text-[#8B8172]">×{order.quantity}</span>
                      </td>
                      <td className="break-words px-4 py-3.5">{order.storeName}</td>
                      <td className="break-words px-4 py-3.5">{order.consumerName}</td>
                      <td className="px-4 py-3.5 font-semibold">{formatPrice(order.total)}</td>
                      <td className="px-4 py-3.5"><PaymentStatusBadge status={order.paymentStatus} /></td>
                      <td className="px-4 py-3.5"><OrderStatusBadge status={order.orderStatus} /></td>
                      <td className="px-4 py-3.5 text-[#8B8172]">{formatDate(order.orderDate)}</td>
                      <td className="px-4 py-3.5">
                        <button
                          className="whitespace-nowrap text-xs font-semibold text-[#29261F] transition hover:text-[#29261F]"
                          onClick={() => setSelectedOrder(order)}
                          type="button"
                        >
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 ? (
              <Pagination currentPage={currentPage} onChange={setCurrentPage} totalPages={totalPages} />
            ) : null}
          </>
        )}
      </section>

      <p className="text-center text-[11px] text-[#8B8172]">
        Daftar pesanan contoh — belum terhubung ke database.
      </p>

      {selectedOrder ? (
        <OrderDetailDialog onClose={() => setSelectedOrder(null)} order={selectedOrder} />
      ) : null}
    </div>
  );
}

export default function AdminOrdersPage() {
  return ADMIN_DEV_MODE ? <AdminOrdersMock /> : <AdminOrdersApi />;
}
