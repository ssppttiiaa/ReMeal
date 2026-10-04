"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  formatOrderPrice,
  getOrderProductsLabel,
  getOrderQuantity,
  orderStatuses,
  sampleOrders,
} from "../_data/orders";

const statusStyles = {
  "Menunggu Pembayaran": "bg-[#f8e9d4] text-[#94621f]",
  Diproses: "bg-[#dce9e7] text-[#3c6861]",
  "Siap Diambil": "bg-[#e9eedf] text-[#637844]",
  Selesai: "bg-[#e7edda] text-[#536738]",
  Dibatalkan: "bg-[#f5dfd8] text-[#a34d3e]",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex w-fit whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function OrderLink({ order, className }) {
  return (
    <Link className={className} href={`/seller/orders/${order.id}`}>
      Lihat Detail
    </Link>
  );
}

function MobileOrderCard({ order }) {
  return (
    <article className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[#30392c]">#{order.id}</p>
          <p className="mt-1 text-xs text-[#858c7d]">{order.time}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <p className="mt-4 break-words text-sm font-semibold leading-5 text-[#30392c]">
        {getOrderProductsLabel(order)}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#202a1e]/[0.07] pt-3 text-xs">
        <div>
          <p className="text-[#858c7d]">Jumlah</p>
          <p className="mt-1 font-semibold text-[#30392c]">{getOrderQuantity(order)} item</p>
        </div>
        <div>
          <p className="text-[#858c7d]">Total</p>
          <p className="mt-1 font-semibold text-[#30392c]">{formatOrderPrice(order.total)}</p>
        </div>
      </div>
      <OrderLink
        className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-[#202a1e] px-3 text-sm font-semibold text-white transition hover:bg-[#35432f]"
        order={order}
      />
    </article>
  );
}

export default function OrderList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Semua status");
  const normalizedSearch = search.trim().toLocaleLowerCase("id-ID");

  const filteredOrders = useMemo(
    () =>
      sampleOrders.filter((order) => {
        const searchText = `${order.id} ${getOrderProductsLabel(order)}`.toLocaleLowerCase("id-ID");
        return (
          (!normalizedSearch || searchText.includes(normalizedSearch)) &&
          (status === "Semua status" || order.status === status)
        );
      }),
    [normalizedSearch, status],
  );

  const orderCounts = orderStatuses.map((item) => ({
    status: item,
    count: sampleOrders.filter((order) => order.status === item).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8b927f]">Kelola transaksi</p>
        <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#202a1e] sm:text-[30px]">
          Pesanan
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#727a6d]">
          Pantau status dan detail pesanan toko. Data saat ini hanya contoh untuk pratinjau.
        </p>
      </div>

      <section aria-label="Ringkasan pesanan berdasarkan status" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {orderCounts.map(({ status: item, count }) => (
          <article className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4" key={item}>
            <p className="min-h-8 text-xs font-medium leading-4 text-[#727a6d]">{item}</p>
            <p className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[#202a1e]">{count}</p>
            <p className="mt-1 text-[11px] text-[#8b927f]">pesanan contoh</p>
          </article>
        ))}
      </section>

      <section
        aria-label="Cari dan filter pesanan"
        className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4 sm:p-5"
      >
        <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_230px]">
          <label className="relative block">
            <span className="sr-only">Cari pesanan</span>
            <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#858c7d]">
              ⌕
            </span>
            <input
              className="h-11 w-full rounded-lg border border-[#202a1e]/10 bg-white pl-9 pr-3 text-sm text-[#30392c] outline-none transition placeholder:text-[#a0a497] focus:border-[#8b9d5e] focus:ring-2 focus:ring-[#dfe8ca]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nomor atau nama produk"
              type="search"
              value={search}
            />
          </label>
          <label className="block">
            <span className="sr-only">Filter status pesanan</span>
            <select
              className="h-11 w-full rounded-lg border border-[#202a1e]/10 bg-white px-3 text-sm text-[#4d5548] outline-none focus:border-[#8b9d5e] focus:ring-2 focus:ring-[#dfe8ca]"
              onChange={(event) => setStatus(event.target.value)}
              value={status}
            >
              <option>Semua status</option>
              {orderStatuses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section aria-label="Daftar pesanan" className="space-y-3 lg:space-y-0">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-[#30392c]">Daftar pesanan</h2>
          <span className="text-xs text-[#858c7d]">{filteredOrders.length} pesanan</span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] px-5 py-12 text-center">
            <h3 className="text-sm font-bold text-[#30392c]">Pesanan tidak ditemukan</h3>
            <p className="mt-1.5 text-sm text-[#858c7d]">Coba ubah kata kunci atau status yang dipilih.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 lg:hidden">
              {filteredOrders.map((order) => <MobileOrderCard key={order.id} order={order} />)}
            </div>

            <div className="hidden overflow-x-auto rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] lg:block">
              <table className="w-full min-w-[900px] table-fixed text-left">
                <colgroup>
                  <col className="w-[12%]" />
                  <col className="w-[24%]" />
                  <col className="w-[9%]" />
                  <col className="w-[14%]" />
                  <col className="w-[17%]" />
                  <col className="w-[10%]" />
                  <col className="w-[14%]" />
                </colgroup>
                <thead className="border-b border-[#202a1e]/[0.07] bg-[#f8f9f4]">
                  <tr className="text-[11px] font-semibold text-[#727a6d]">
                    <th className="px-4 py-3.5">Pesanan</th>
                    <th className="px-4 py-3.5">Produk</th>
                    <th className="px-4 py-3.5">Jumlah</th>
                    <th className="px-4 py-3.5">Total</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Waktu</th>
                    <th className="px-4 py-3.5">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#202a1e]/[0.07]">
                  {filteredOrders.map((order) => (
                    <tr className="text-sm text-[#30392c]" key={order.id}>
                      <td className="px-4 py-4 font-bold">#{order.id}</td>
                      <td className="break-words px-4 py-4 font-medium leading-5">{getOrderProductsLabel(order)}</td>
                      <td className="px-4 py-4">{getOrderQuantity(order)} item</td>
                      <td className="px-4 py-4 font-semibold">{formatOrderPrice(order.total)}</td>
                      <td className="px-4 py-4"><StatusBadge status={order.status} /></td>
                      <td className="px-4 py-4 text-[#727a6d]">{order.time}</td>
                      <td className="px-4 py-4">
                        <OrderLink
                          className="whitespace-nowrap text-xs font-semibold text-[#637844] transition hover:text-[#40532c]"
                          order={order}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <p className="text-center text-[11px] text-[#9aa092]">Data pesanan contoh — belum terhubung ke database.</p>
    </div>
  );
}
