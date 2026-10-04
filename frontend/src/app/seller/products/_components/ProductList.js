"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPrice, productCategories, sampleProducts } from "../_data/products";

const statusStyles = {
  Tersedia: "bg-[#e9eedf] text-[#637844]",
  Habis: "bg-[#f8e5c9] text-[#8b5924]",
  "Penjualan Ditutup": "bg-[#ecece8] text-[#666b61]",
  "Segera Berakhir": "bg-[#f5dfd8] text-[#a34d3e]",
};

function ProductImage({ product, className = "" }) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-lg bg-[#eeeadd] ${className}`}>
      <Image alt={product.name} className="object-cover" fill sizes="64px" src={product.image} unoptimized />
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex w-fit rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

function ProductActions({ product, onDelete }) {
  return (
    <div className="flex items-center gap-3">
      <Link
        className="text-sm font-semibold text-[#637844] transition hover:text-[#40532c]"
        href={`/seller/products/${product.id}/edit`}
      >
        Edit
      </Link>
      <button
        className="text-sm font-semibold text-[#a34d3e] transition hover:text-[#7e382e]"
        onClick={() => onDelete(product.id)}
        type="button"
      >
        Hapus
      </button>
    </div>
  );
}

function EmptyState({ filtered }) {
  return (
    <div className="px-5 py-14 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#edf1e4] text-xl text-[#71854a]" aria-hidden="true">
        {filtered ? "⌕" : "+"}
      </span>
      <h2 className="mt-4 text-base font-bold text-[#30392c]">
        {filtered ? "Produk tidak ditemukan" : "Belum ada produk"}
      </h2>
      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-[#858c7d]">
        {filtered
          ? "Coba ubah kata kunci atau filter yang dipilih."
          : "Tambahkan produk pertama agar calon pembeli dapat menemukannya."}
      </p>
      {!filtered ? (
        <Link
          className="mt-5 inline-flex rounded-lg bg-[#202a1e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#35432f]"
          href="/seller/products/new"
        >
          Tambah Produk
        </Link>
      ) : null}
    </div>
  );
}

export default function ProductList() {
  const [products, setProducts] = useState(sampleProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua kategori");
  const [status, setStatus] = useState("Semua status");

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("id-ID");

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLocaleLowerCase("id-ID").includes(normalizedSearch) ||
        product.category.toLocaleLowerCase("id-ID").includes(normalizedSearch);
      const matchesCategory = category === "Semua kategori" || product.category === category;
      const matchesStatus = status === "Semua status" || product.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [category, products, search, status]);

  function handleDelete(productId) {
    const product = products.find((item) => item.id === productId);
    if (!product || !window.confirm(`Hapus produk "${product.name}" dari daftar contoh?`)) return;

    setProducts((currentProducts) => currentProducts.filter((item) => item.id !== productId));
  }

  const hasFilters = Boolean(search.trim()) || category !== "Semua kategori" || status !== "Semua status";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8b927f]">Katalog toko</p>
          <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#202a1e] sm:text-[30px]">
            Produk Saya
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#727a6d]">
            Kelola makanan surplus yang sedang kamu tawarkan di ReMeal.
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg bg-[#202a1e] px-4 text-sm font-semibold text-white transition hover:bg-[#35432f] sm:self-auto"
          href="/seller/products/new"
        >
          <span aria-hidden="true" className="text-lg leading-none">+</span>
          Tambah Produk
        </Link>
      </div>

      <section className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4 sm:p-5" aria-label="Cari dan filter produk">
        <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_200px_190px]">
          <label className="relative block">
            <span className="sr-only">Cari produk</span>
            <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#858c7d]">⌕</span>
            <input
              className="h-11 w-full rounded-lg border border-[#202a1e]/10 bg-white pl-9 pr-3 text-sm text-[#30392c] outline-none transition placeholder:text-[#a0a497] focus:border-[#8b9d5e] focus:ring-2 focus:ring-[#dfe8ca]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama atau kategori produk"
              type="search"
              value={search}
            />
          </label>
          <label className="block">
            <span className="sr-only">Filter kategori</span>
            <select
              className="h-11 w-full rounded-lg border border-[#202a1e]/10 bg-white px-3 text-sm text-[#4d5548] outline-none focus:border-[#8b9d5e] focus:ring-2 focus:ring-[#dfe8ca]"
              onChange={(event) => setCategory(event.target.value)}
              value={category}
            >
              <option>Semua kategori</option>
              {productCategories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Filter status</span>
            <select
              className="h-11 w-full rounded-lg border border-[#202a1e]/10 bg-white px-3 text-sm text-[#4d5548] outline-none focus:border-[#8b9d5e] focus:ring-2 focus:ring-[#dfe8ca]"
              onChange={(event) => setStatus(event.target.value)}
              value={status}
            >
              <option>Semua status</option>
              {Object.keys(statusStyles).map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa]" aria-label="Daftar produk">
        {filteredProducts.length === 0 ? (
          <EmptyState filtered={hasFilters || products.length > 0} />
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-[#202a1e]/[0.07] px-4 py-4 sm:px-5">
              <h2 className="text-sm font-bold text-[#30392c]">Semua produk</h2>
              <span className="text-xs text-[#858c7d]">{filteredProducts.length} produk</span>
            </div>

            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[820px] table-fixed text-left">
                <colgroup>
                  <col className="w-[34%]" />
                  <col className="w-[18%]" />
                  <col className="w-[8%]" />
                  <col className="w-[18%]" />
                  <col className="w-[12%]" />
                  <col className="w-[10%]" />
                </colgroup>
                <thead className="bg-[#f8f9f4] text-xs font-semibold uppercase tracking-[0.08em] text-[#727a6d]">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Produk</th>
                    <th className="px-4 py-3 font-semibold">Harga</th>
                    <th className="px-4 py-3 font-semibold">Stok</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Berakhir</th>
                    <th className="px-5 py-3 text-right font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#202a1e]/[0.06]">
                  {filteredProducts.map((product) => (
                    <tr className="transition hover:bg-[#fafbf7]" key={product.id}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <ProductImage className="h-12 w-12" product={product} />
                          <div className="min-w-0">
                            <p className="max-w-[230px] truncate text-sm font-semibold text-[#30392c]">{product.name}</p>
                            <p className="mt-1 text-xs text-[#858c7d]">{product.category} · Ditambahkan {product.createdAt}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="block text-sm font-semibold text-[#30392c]">{formatPrice(product.remealPrice)}</span>
                        <span className="mt-0.5 block text-xs text-[#858c7d] line-through">{formatPrice(product.price)}</span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold tabular-nums text-[#30392c]">{product.stock}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={product.status} /></td>
                      <td className="px-4 py-3.5 text-sm text-[#626a5d]">{product.endsAt}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end"><ProductActions onDelete={handleDelete} product={product} /></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#202a1e]/[0.07] xl:hidden">
              {filteredProducts.map((product) => (
                <article className="flex gap-3 p-4" key={product.id}>
                  <ProductImage className="h-[68px] w-[68px]" product={product} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-sm font-semibold leading-5 text-[#30392c]">{product.name}</h3>
                        <p className="mt-1 text-xs text-[#858c7d]">{product.category}</p>
                      </div>
                      <StatusBadge status={product.status} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#727a6d]">
                      <span className="font-semibold text-[#30392c]">{formatPrice(product.remealPrice)}</span>
                      <span className="text-xs text-[#92988a] line-through">{formatPrice(product.price)}</span>
                      <span>Stok {product.stock}</span>
                      <span>Berakhir {product.endsAt}</span>
                    </div>
                    <div className="mt-3"><ProductActions onDelete={handleDelete} product={product} /></div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
      <p className="text-center text-[10px] text-[#9aa092]">Data contoh untuk pratinjau manajemen produk</p>
    </div>
  );
}