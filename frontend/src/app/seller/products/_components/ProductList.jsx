"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  closeSellerProduct,
  deleteSellerProduct,
  getAllSellerProducts,
  getProductCategories,
} from "@/services/products";

import { formatPrice } from "../_data/products";

const statusStyles = {
  Tersedia: "bg-[#F4C542] text-[#29261F]",
  Habis: "bg-[#29261F] text-white",
  "Penjualan Ditutup": "bg-[#E89B3C] text-[#29261F]",
  "Segera Berakhir": "bg-[#F8E7A8] text-[#29261F]",
};

const statusLabels = {
  available: "Tersedia",
  ending_soon: "Segera Berakhir",
  closed: "Penjualan Ditutup",
  sold_out: "Habis",
};

const deadlineFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDeadline(value) {
  if (!value) return "Tanggal tidak tersedia";

  const deadline = new Date(value);
  return Number.isNaN(deadline.getTime())
    ? "Tanggal tidak tersedia"
    : deadlineFormatter.format(deadline);
}

function mapApiProduct(product, categoryNames) {
  return {
    id: product.id,
    name: product.name,
    category: categoryNames.get(product.category_id) ?? "Kategori tidak tersedia",
    price: product.normal_price,
    remealPrice: product.discount_price,
    stock: product.stock,
    status: statusLabels[product.status] ?? "Status tidak diketahui",
    endsAt: formatDeadline(product.order_deadline_at),
    image: product.photo_url || "",
    description: product.description,
  };
}

function ProductImage({ product, className = "" }) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-lg bg-[#F8E7A8] ${className}`}>
      {product.image ? (
        <Image alt={product.name} className="object-cover" fill sizes="64px" src={product.image} unoptimized />
      ) : null}
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex w-fit rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${statusStyles[status] ?? "bg-[#F7F1E7] text-[#29261F]"}`}>
      {status}
    </span>
  );
}

function ProductActions({ product, onDelete, onClose }) {
  return (
    <div className="flex items-center gap-2 flex-nowrap">
      <Link
        className="inline-flex items-center justify-center rounded-lg bg-[#F4C542] px-3 py-1.5 text-xs font-bold text-[#29261F] transition hover:bg-[#E89B3C]"
        href={`/seller/products/${product.id}/edit`}
      >
        Edit
      </Link>
      <button
        className="inline-flex items-center justify-center rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-200"
        onClick={() => onDelete(product.id)}
        type="button"
      >
        Hapus
      </button>
      {!["Penjualan Ditutup", "Habis"].includes(product.status) ? (
        <button
          className="inline-flex items-center justify-center rounded-lg border border-[#29261F]/20 bg-white px-3 py-1.5 text-xs font-bold text-[#29261F] transition hover:bg-gray-50"
          onClick={() => onClose(product.id)}
          type="button"
        >
          Tutup Penjualan
        </button>
      ) : null}
    </div>
  );
}

function EmptyState({ filtered }) {
  return (
    <div className="px-5 py-14 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#F4C542] text-xl text-[#29261F]" aria-hidden="true">
        {filtered ? "⌕" : "+"}
      </span>
      <h2 className="mt-4 text-base font-bold text-[#29261F]">
        {filtered ? "Produk tidak ditemukan" : "Belum ada produk"}
      </h2>
      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-[#8B8172]">
        {filtered
          ? "Coba ubah kata kunci atau filter yang dipilih."
          : "Tambahkan produk pertama agar calon pembeli dapat menemukannya."}
      </p>
      {!filtered ? (
        <Link
          className="mt-5 inline-flex rounded-lg bg-[#FFF9EF] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#E89B3C]"
          href="/seller/products/new"
        >
          Tambah Produk
        </Link>
      ) : null}
    </div>
  );
}

export default function ProductList() {
  const [apiProducts, setApiProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [closeError, setCloseError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua kategori");
  const [status, setStatus] = useState("Semua status");

 
useEffect(() => {
  let active = true;

  async function loadProducts() {
    setLoading(true);
    try {
      const products = await getAllSellerProducts();
      if (active) {
        setApiProducts(products);
        setLoadError("");
      }
    } catch (error) {
      if (active) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "Gagal memuat produk. Silakan coba lagi.",
        );
      }
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  }

  async function loadCategories() {
    try {
      const categoriesResponse = await getProductCategories();
      if (!Array.isArray(categoriesResponse)) {
        throw new Error("Format daftar kategori tidak valid.");
      }
      if (active) {
        setCategories(categoriesResponse);
        setCategoryError("");
      }
    } catch {
      if (active) {
        setCategories([]);
        setCategoryError("Kategori tidak dapat dimuat; nama kategori mungkin tidak tersedia.");
      }
    }
  }

  loadProducts();
  loadCategories();

  return () => {
    active = false;
  };
}, []);

  const categoryNames = useMemo(
    () => new Map(categories.map((item) => [item.id, item.name])),
    [categories],
  );
  const products = useMemo(
    () => apiProducts.map((product) => mapApiProduct(product, categoryNames)),
    [apiProducts, categoryNames],
  );

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

  async function handleDelete(productId) {
    const product = products.find((item) => item.id === productId);
    if (!product || !window.confirm(`Hapus produk "${product.name}"?`)) return;

    setDeleteError("");
    try {
      await deleteSellerProduct(productId);
      setApiProducts((currentProducts) =>
        currentProducts.filter((item) => item.id !== productId),
      );
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Gagal menghapus produk. Silakan coba lagi.",
      );
    }
  }

  async function handleClose(productId) {
    const product = products.find((item) => item.id === productId);
    if (
      !product ||
      ["Penjualan Ditutup", "Habis"].includes(product.status) ||
      !window.confirm(`Tutup penjualan produk "${product.name}"?`)
    ) {
      return;
    }

    setCloseError("");
    try {
      const closedProduct = await closeSellerProduct(productId);
      if (closedProduct?.id && closedProduct.status === "closed") {
        setApiProducts((currentProducts) =>
          currentProducts.map((item) =>
            item.id === productId ? closedProduct : item,
          ),
        );
      }
      try {
        const refreshedProducts = await getAllSellerProducts();
        setApiProducts(refreshedProducts);
      } catch (error) {
        setCloseError(
          error instanceof Error
            ? `Penjualan berhasil ditutup, tetapi daftar gagal diperbarui: ${error.message}`
            : "Penjualan berhasil ditutup, tetapi daftar gagal diperbarui.",
        );
      }
    } catch (error) {
      setCloseError(
        error instanceof Error
          ? error.message
          : "Gagal menutup penjualan. Silakan coba lagi.",
      );
    }
  }

  const hasFilters = Boolean(search.trim()) || category !== "Semua kategori" || status !== "Semua status";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">Katalog toko</p>
          <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#29261F] sm:text-[30px]">
            Produk Saya
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#8B8172]">
            Kelola makanan surplus yang sedang kamu tawarkan di ReMeal.
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg bg-[#FFF9EF] px-4 text-sm font-semibold text-white transition hover:bg-[#E89B3C] sm:self-auto"
          href="/seller/products/new"
        >
          <span aria-hidden="true" className="text-lg leading-none">+</span>
          Tambah Produk
        </Link>
      </div>

      <section className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-5" aria-label="Cari dan filter produk">
        {categoryError ? (
          <p className="mb-3 text-sm text-[#29261F]" role="status">{categoryError}</p>
        ) : null}
        <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_200px_190px]">
          <label className="relative block">
            <span className="sr-only">Cari produk</span>
            <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8172]">⌕</span>
            <input
              className="h-11 w-full rounded-lg border border-[#29261F]/10 bg-white pl-9 pr-3 text-sm text-[#29261F] outline-none transition placeholder:text-[#8B8172] focus:border-[#29261F] focus:ring-2 focus:ring-[#E89B3C]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama atau kategori produk"
              type="search"
              value={search}
            />
          </label>
          <label className="block">
            <span className="sr-only">Filter kategori</span>
            <select
              className="h-11 w-full rounded-lg border border-[#29261F]/10 bg-white px-3 text-sm text-[#29261F] outline-none focus:border-[#29261F] focus:ring-2 focus:ring-[#E89B3C]"
              onChange={(event) => setCategory(event.target.value)}
              value={category}
            >
              <option>Semua kategori</option>
              {categories.map((item) => <option key={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Filter status</span>
            <select
              className="h-11 w-full rounded-lg border border-[#29261F]/10 bg-white px-3 text-sm text-[#29261F] outline-none focus:border-[#29261F] focus:ring-2 focus:ring-[#E89B3C]"
              onChange={(event) => setStatus(event.target.value)}
              value={status}
            >
              <option>Semua status</option>
              {Object.keys(statusStyles).map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF]" aria-label="Daftar produk">
        {deleteError ? (
          <p className="border-b border-[#29261F]/[0.07] px-4 py-3 text-sm text-[#29261F] sm:px-5" role="alert">
            {deleteError}
          </p>
        ) : null}
        {closeError ? (
          <p className="border-b border-[#29261F]/[0.07] px-4 py-3 text-sm text-[#29261F] sm:px-5" role="alert">
            {closeError}
          </p>
        ) : null}
        {loading ? (
          <p className="px-5 py-14 text-center text-sm text-[#8B8172]" role="status">
            Memuat produk...
          </p>
        ) : loadError ? (
          <p className="px-5 py-14 text-center text-sm text-[#29261F]" role="alert">
            {loadError}
          </p>
        ) : filteredProducts.length === 0 ? (
          <EmptyState filtered={hasFilters || products.length > 0} />
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-[#29261F]/[0.07] px-4 py-4 sm:px-5">
              <h2 className="text-sm font-bold text-[#29261F]">Semua produk</h2>
              <span className="text-xs text-[#8B8172]">{filteredProducts.length} produk</span>
            </div>

            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[960px] table-fixed text-left">
                <colgroup>
                  <col className="w-[26%]" />
                  <col className="w-[15%]" />
                  <col className="w-[7%]" />
                  <col className="w-[15%]" />
                  <col className="w-[12%]" />
                  <col className="w-[25%]" />
                </colgroup>
                <thead className="bg-[#F7F1E7] text-xs font-semibold uppercase tracking-[0.08em] text-[#8B8172]">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Produk</th>
                    <th className="px-4 py-3 font-semibold">Harga</th>
                    <th className="px-4 py-3 font-semibold">Stok</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Berakhir</th>
                    <th className="px-5 py-3 text-right font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#29261f]/[0.06]">
                  {filteredProducts.map((product) => (
                    <tr className="transition hover:bg-[#F7F1E7]" key={product.id}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <ProductImage className="h-12 w-12" product={product} />
                          <div className="min-w-0">
                            <p className="max-w-[230px] truncate text-sm font-semibold text-[#29261F]">{product.name}</p>
                            <p className="mt-1 text-xs text-[#8B8172]">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="block text-sm font-semibold text-[#29261F]">{formatPrice(product.remealPrice)}</span>
                        <span className="mt-0.5 block text-xs text-[#8B8172] line-through">{formatPrice(product.price)}</span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold tabular-nums text-[#29261F]">{product.stock}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={product.status} /></td>
                      <td className="px-4 py-3.5 text-sm text-[#29261F]">{product.endsAt}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end"><ProductActions onClose={handleClose} onDelete={handleDelete} product={product} /></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#29261f]/[0.07] xl:hidden">
              {filteredProducts.map((product) => (
                <article className="flex gap-3 p-4" key={product.id}>
                  <ProductImage className="h-[68px] w-[68px]" product={product} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-sm font-semibold leading-5 text-[#29261F]">{product.name}</h3>
                        <p className="mt-1 text-xs text-[#8B8172]">{product.category}</p>
                      </div>
                      <StatusBadge status={product.status} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#8B8172]">
                      <span className="font-semibold text-[#29261F]">{formatPrice(product.remealPrice)}</span>
                      <span className="text-xs text-[#8B8172] line-through">{formatPrice(product.price)}</span>
                      <span>Stok {product.stock}</span>
                      <span>Berakhir {product.endsAt}</span>
                    </div>
                    <div className="mt-3"><ProductActions onClose={handleClose} onDelete={handleDelete} product={product} /></div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
      <p className="text-center text-[10px] text-[#8B8172]">Data produk toko di ReMeal</p>
    </div>
  );
}