"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  createSellerProduct,
  getAllSellerProducts,
  getProductCategories,
  updateSellerProduct,
} from "@/services/products";
import { SELLER_DEV_MODE } from "@/lib/sellerDevMode";
import {
  createMockSellerProduct,
  getMockProductCategories,
  getMockSellerProducts,
  updateMockSellerProduct,
} from "../_data/sellerDevStore";

const fieldClassName =
  "mt-2 h-11 w-full rounded-lg border border-[#29261F]/10 bg-white px-3 text-sm text-[#29261F] outline-none transition placeholder:text-[#8B8172] focus:border-[#29261F] focus:ring-2 focus:ring-[#E89B3C]";

function FieldError({ children }) {
  return children ? <p className="mt-1.5 text-xs font-medium text-[#29261F]">{children}</p> : null;
}

function toDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function toIsoDateTime(value) {
  return new Date(value).toISOString();
}

const emptyForm = {
  name: "",
  description: "",
  categoryId: "",
  photoUrl: "",
  normalPrice: "",
  discountPrice: "",
  stock: "",
  saleStartAt: "",
  orderDeadlineAt: "",
  pickupDeadlineAt: "",
};

export default function ProductForm({ mode, productId }) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [productLoading, setProductLoading] = useState(isEdit);
  const [productError, setProductError] = useState("");
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const result = SELLER_DEV_MODE
          ? getMockProductCategories()
          : await getProductCategories();
        if (!Array.isArray(result)) throw new Error("Format daftar kategori tidak valid.");
        if (active) {
          setCategories(result);
          setCategoriesError("");
        }
      } catch {
        if (active) setCategoriesError("Gagal memuat kategori. Silakan coba lagi.");
      } finally {
        if (active) setCategoriesLoading(false);
      }
    }

    loadCategories();

    if (isEdit) {
      const productsPromise = SELLER_DEV_MODE
        ? Promise.resolve(getMockSellerProducts())
        : getAllSellerProducts();
      productsPromise
        .then((products) => {
          const product = products.find((item) => item.id === productId);
          if (!product) throw new Error("Produk tidak ditemukan.");
          if (active) {
            setForm({
              name: product.name ?? "",
              description: product.description ?? "",
              categoryId: product.category_id ?? "",
              photoUrl: product.photo_url ?? "",
              normalPrice: String(product.normal_price ?? ""),
              discountPrice: String(product.discount_price ?? ""),
              stock: String(product.stock ?? ""),
              saleStartAt: toDateTimeLocal(product.sale_start_at),
              orderDeadlineAt: toDateTimeLocal(product.order_deadline_at),
              pickupDeadlineAt: toDateTimeLocal(product.pickup_deadline_at),
            });
          }
        })
        .catch((error) => {
          if (active) {
            setProductError(
              error instanceof Error ? error.message : "Gagal memuat produk.",
            );
          }
        })
        .finally(() => {
          if (active) setProductLoading(false);
        });
    }

    return () => {
      active = false;
    };
  }, [isEdit, productId]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setRequestError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    const normalPrice = Number(form.normalPrice);
    const discountPrice = Number(form.discountPrice);
    const stock = Number(form.stock);
    const saleStart = new Date(form.saleStartAt).getTime();
    const orderDeadline = new Date(form.orderDeadlineAt).getTime();
    const pickupDeadline = new Date(form.pickupDeadlineAt).getTime();

    if (!form.name.trim()) nextErrors.name = "Nama produk wajib diisi.";
    if (!form.categoryId || !categories.some((item) => item.id === form.categoryId)) {
      nextErrors.categoryId = "Pilih kategori produk.";
    }
    if (form.normalPrice.trim() === "" || !Number.isInteger(normalPrice) || normalPrice < 0) {
      nextErrors.normalPrice = "Harga normal harus berupa bilangan bulat nol atau lebih.";
    }
    if (form.discountPrice.trim() === "" || !Number.isInteger(discountPrice) || discountPrice < 0) {
      nextErrors.discountPrice = "Harga ReMeal harus berupa bilangan bulat nol atau lebih.";
    } else if (Number.isInteger(normalPrice) && discountPrice > normalPrice) {
      nextErrors.discountPrice = "Harga ReMeal tidak boleh melebihi harga normal.";
    }
    if (form.stock.trim() === "" || !Number.isInteger(stock) || stock < 0) {
      nextErrors.stock = "Stok harus berupa bilangan bulat nol atau lebih.";
    }
    if (!form.saleStartAt || !Number.isFinite(saleStart)) {
      nextErrors.saleStartAt = "Waktu mulai penjualan wajib diisi.";
    }
    if (!form.orderDeadlineAt || !Number.isFinite(orderDeadline)) {
      nextErrors.orderDeadlineAt = "Batas pemesanan wajib diisi.";
    }
    if (!form.pickupDeadlineAt || !Number.isFinite(pickupDeadline)) {
      nextErrors.pickupDeadlineAt = "Batas pengambilan wajib diisi.";
    }
    if (
      Number.isFinite(saleStart) &&
      Number.isFinite(orderDeadline) &&
      saleStart >= orderDeadline
    ) {
      nextErrors.orderDeadlineAt = "Batas pemesanan harus setelah waktu mulai penjualan.";
    }
    if (
      Number.isFinite(orderDeadline) &&
      Number.isFinite(pickupDeadline) &&
      orderDeadline > pickupDeadline
    ) {
      nextErrors.pickupDeadlineAt = "Batas pengambilan harus sama atau setelah batas pemesanan.";
    }

    if (form.photoUrl.trim()) {
      try {
        new URL(form.photoUrl);
      } catch {
        nextErrors.photoUrl = "Masukkan URL foto yang valid.";
      }
    }

    setErrors(nextErrors);
    setSaved(false);
    setRequestError("");
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category_id: form.categoryId,
      normal_price: normalPrice,
      discount_price: discountPrice,
      stock,
      sale_start_at: toIsoDateTime(form.saleStartAt),
      order_deadline_at: toIsoDateTime(form.orderDeadlineAt),
      pickup_deadline_at: toIsoDateTime(form.pickupDeadlineAt),
      ...(form.photoUrl.trim() ? { photo_url: form.photoUrl.trim() } : {}),
    };

    setSubmitting(true);
    try {
      if (SELLER_DEV_MODE) {
        if (isEdit) {
          updateMockSellerProduct(productId, payload);
        } else {
          createMockSellerProduct(payload);
        }
      } else {
        if (isEdit) {
          await updateSellerProduct(productId, payload);
        } else {
          await createSellerProduct(payload);
        }
      }
      setSaved(true);
      window.setTimeout(() => router.replace("/seller/products"), 900);
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan produk. Silakan coba lagi.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (productLoading) {
    return (
      <p className="py-14 text-center text-sm text-[#8B8172]" role="status">
        Memuat produk...
      </p>
    );
  }

  if (productError) {
    return (
      <div className="mx-auto max-w-[900px] space-y-4 text-center">
        <p className="text-sm text-[#29261F]" role="alert">{productError}</p>
        <Link className="text-sm font-semibold text-[#29261F]" href="/seller/products">
          Kembali ke produk
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">Katalog toko</p>
        <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#29261F] sm:text-[30px]">
          {isEdit ? "Edit Produk" : "Tambah Produk"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#8B8172]">
          {isEdit ? "Perbarui informasi makanan yang ditawarkan." : "Lengkapi informasi makanan surplus yang ingin ditawarkan."}
        </p>
      </div>

      {saved ? (
        <div className="flex items-start gap-3 rounded-xl border border-[#29261F] bg-[#F4C542] px-4 py-3.5 text-sm text-[#29261F]" role="status">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/70 font-bold">✓</span>
          <p className="pt-0.5 font-medium">
            {isEdit ? "Perubahan produk berhasil disimpan." : "Produk berhasil ditambahkan."}
            <span className="mt-1 block text-xs font-normal text-[#29261F]">Mengalihkan ke daftar produk...</span>
          </p>
        </div>
      ) : null}

      {requestError ? (
        <p className="rounded-lg border border-[#29261F] bg-[#FFF9EF] px-4 py-3 text-sm text-[#29261F]" role="alert">
          {requestError}
        </p>
      ) : null}

      {categoriesError ? (
        <p className="rounded-lg border border-[#29261F] bg-[#FFF9EF] px-4 py-3 text-sm text-[#29261F]" role="alert">
          {categoriesError}
        </p>
      ) : null}

      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <section className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-6">
          <h2 className="text-sm font-bold text-[#29261F]">Informasi produk</h2>
          <p className="mt-1 text-xs text-[#8B8172]">Foto dan detail yang jelas membantu pembeli memilih makanan surplus.</p>

          <div className="mt-5 grid gap-5 md:grid-cols-[180px_minmax(0,1fr)]">
            <div>
              <span className="text-xs font-semibold text-[#29261F]">Foto produk</span>
              <div className="mt-2 flex min-h-[150px] flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-[#29261F] bg-[#F7F1E7] p-3 text-center">
                {form.photoUrl ? (
                  <span className="relative block h-[108px] w-full overflow-hidden rounded-md">
                    <Image alt="Pratinjau foto produk" className="object-cover" fill sizes="180px" src={form.photoUrl} unoptimized />
                  </span>
                ) : (
                  <>
                    <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-[#F4C542] text-lg text-[#29261F]">+</span>
                    <span className="mt-2 text-xs font-semibold text-[#29261F]">Masukkan URL foto</span>
                  </>
                )}
              </div>
              <input
                aria-invalid={Boolean(errors.photoUrl)}
                className={fieldClassName}
                name="photoUrl"
                onChange={handleChange}
                placeholder="https://contoh.com/foto.jpg"
                type="url"
                value={form.photoUrl}
              />
              <FieldError>{errors.photoUrl}</FieldError>
              <p className="mt-1 text-[10px] leading-4 text-[#8B8172]">Upload file belum tersedia; backend menerima URL foto.</p>
            </div>

            <div className="grid content-start gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-[#29261F]">Nama produk <span className="text-[#29261F]">*</span></span>
                <input
                  aria-invalid={Boolean(errors.name)}
                  className={fieldClassName}
                  name="name"
                  onChange={handleChange}
                  placeholder="Contoh: Roti Cokelat"
                  value={form.name}
                />
                <FieldError>{errors.name}</FieldError>
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-[#29261F]">Deskripsi</span>
                <textarea
                  className="mt-2 min-h-24 w-full resize-y rounded-lg border border-[#29261F]/10 bg-white px-3 py-2.5 text-sm leading-6 text-[#29261F] outline-none transition placeholder:text-[#8B8172] focus:border-[#29261F] focus:ring-2 focus:ring-[#E89B3C]"
                  name="description"
                  onChange={handleChange}
                  placeholder="Jelaskan kondisi, kelengkapan, dan detail penting lainnya"
                  value={form.description}
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-[#29261F]">Kategori <span className="text-[#29261F]">*</span></span>
                <select
                  aria-invalid={Boolean(errors.categoryId)}
                  className={fieldClassName}
                  disabled={categoriesLoading || categories.length === 0}
                  name="categoryId"
                  onChange={handleChange}
                  value={form.categoryId}
                >
                  <option disabled value="">
                    {categoriesLoading ? "Memuat kategori..." : "Pilih kategori"}
                  </option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                <FieldError>{errors.categoryId}</FieldError>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-[#29261F]">Harga Normal (Rp) <span className="text-[#29261F]">*</span></span>
                <input
                  aria-invalid={Boolean(errors.normalPrice)}
                  className={fieldClassName}
                  inputMode="numeric"
                  min="0"
                  name="normalPrice"
                  onChange={handleChange}
                  placeholder="0"
                  step="1"
                  type="number"
                  value={form.normalPrice}
                />
                <FieldError>{errors.normalPrice}</FieldError>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-[#29261F]">Harga ReMeal (Rp) <span className="text-[#29261F]">*</span></span>
                <input
                  aria-invalid={Boolean(errors.discountPrice)}
                  className={fieldClassName}
                  inputMode="numeric"
                  min="0"
                  name="discountPrice"
                  onChange={handleChange}
                  placeholder="0"
                  step="1"
                  type="number"
                  value={form.discountPrice}
                />
                <FieldError>{errors.discountPrice}</FieldError>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-[#29261F]">Stok (unit) <span className="text-[#29261F]">*</span></span>
                <input
                  aria-invalid={Boolean(errors.stock)}
                  className={fieldClassName}
                  inputMode="numeric"
                  min="0"
                  name="stock"
                  onChange={handleChange}
                  placeholder="0"
                  step="1"
                  type="number"
                  value={form.stock}
                />
                <FieldError>{errors.stock}</FieldError>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-[#29261F]">Waktu Mulai Penjualan <span className="text-[#29261F]">*</span></span>
                <input
                  aria-invalid={Boolean(errors.saleStartAt)}
                  className={fieldClassName}
                  name="saleStartAt"
                  onChange={handleChange}
                  type="datetime-local"
                  value={form.saleStartAt}
                />
                <FieldError>{errors.saleStartAt}</FieldError>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-[#29261F]">Batas Pemesanan <span className="text-[#29261F]">*</span></span>
                <input
                  aria-invalid={Boolean(errors.orderDeadlineAt)}
                  className={fieldClassName}
                  name="orderDeadlineAt"
                  onChange={handleChange}
                  type="datetime-local"
                  value={form.orderDeadlineAt}
                />
                <FieldError>{errors.orderDeadlineAt}</FieldError>
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-[#29261F]">Batas Pengambilan <span className="text-[#29261F]">*</span></span>
                <input
                  aria-invalid={Boolean(errors.pickupDeadlineAt)}
                  className={fieldClassName}
                  name="pickupDeadlineAt"
                  onChange={handleChange}
                  type="datetime-local"
                  value={form.pickupDeadlineAt}
                />
                <FieldError>{errors.pickupDeadlineAt}</FieldError>
              </label>
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            aria-disabled={submitting}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#29261F]/15 bg-[#FFF9EF] px-5 text-sm font-semibold text-[#29261F] transition hover:bg-[#F7F1E7]"
            href="/seller/products"
          >
            Batal
          </Link>
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#FFF9EF] px-5 text-sm font-semibold text-white transition hover:bg-[#E89B3C] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting || categoriesLoading || categoriesError !== ""}
            type="submit"
          >
            {submitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Produk"}
          </button>
        </div>
      </form>
    </div>
  );
}
