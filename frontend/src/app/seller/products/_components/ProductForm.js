"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { productCategories } from "../_data/products";

const fieldClassName =
  "mt-2 h-11 w-full rounded-lg border border-[#202a1e]/10 bg-white px-3 text-sm text-[#30392c] outline-none transition placeholder:text-[#a0a497] focus:border-[#8b9d5e] focus:ring-2 focus:ring-[#dfe8ca]";

function FieldError({ children }) {
  return children ? <p className="mt-1.5 text-xs font-medium text-[#a34d3e]">{children}</p> : null;
}

export default function ProductForm({ product, mode }) {
  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "");
  const [condition, setCondition] = useState(product?.condition ?? "Dibuat hari ini");
  const [description, setDescription] = useState(product?.description ?? "");
  const [photoName, setPhotoName] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [preview, setPreview] = useState(product?.image ?? "");
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!preview.startsWith("blob:")) return undefined;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Pilih file gambar JPG, PNG, atau WebP.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Ukuran foto maksimal 5 MB.");
      event.target.value = "";
      return;
    }

    setPhotoError("");
    setPhotoName(file.name);
    setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (!name.trim()) nextErrors.name = "Nama produk wajib diisi.";
    if (!category) nextErrors.category = "Pilih kategori produk.";
    if (price.trim() === "" || !Number.isFinite(numericPrice) || numericPrice < 0) {
      nextErrors.price = "Harga harus berupa angka nol atau lebih.";
    }
    if (stock.trim() === "" || !Number.isInteger(numericStock) || numericStock < 0) {
      nextErrors.stock = "Stok harus berupa angka bulat nol atau lebih.";
    }
    if (!description.trim()) nextErrors.description = "Deskripsi produk wajib diisi.";

    setErrors(nextErrors);
    setSaved(false);
    if (Object.keys(nextErrors).length === 0) setSaved(true);
  }

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8b927f]">Katalog toko</p>
        <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#202a1e] sm:text-[30px]">
          {mode === "edit" ? "Edit Produk" : "Tambah Produk"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#727a6d]">
          {mode === "edit" ? "Perbarui informasi makanan yang ditawarkan." : "Lengkapi informasi makanan surplus yang ingin ditawarkan."}
        </p>
      </div>

      {saved ? (
        <div className="flex items-start gap-3 rounded-xl border border-[#cbd8ae] bg-[#edf3df] px-4 py-3.5 text-sm text-[#52683a]" role="status">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/70 font-bold">✓</span>
          <p className="pt-0.5 font-medium">
            {mode === "edit" ? "Perubahan produk berhasil disimpan sebagai simulasi." : "Produk berhasil disimpan sebagai simulasi."}
            <span className="mt-1 block text-xs font-normal text-[#6b7b54]">Belum ada data yang dikirim ke server.</span>
          </p>
        </div>
      ) : null}

      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <section className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4 sm:p-6">
          <h2 className="text-sm font-bold text-[#30392c]">Informasi produk</h2>
          <p className="mt-1 text-xs text-[#858c7d]">Foto dan detail yang jelas membantu pembeli memilih makanan surplus.</p>

          <div className="mt-5 grid gap-5 md:grid-cols-[180px_minmax(0,1fr)]">
            <div>
              <span className="text-xs font-semibold text-[#4d5548]">Foto produk</span>
              <label className="mt-2 flex min-h-[150px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-[#aeb69d] bg-[#f8f9f4] p-3 text-center transition hover:border-[#71854a]">
                {preview ? (
                  <span className="relative block h-[108px] w-full overflow-hidden rounded-md">
                    <Image alt="Pratinjau foto produk" className="object-cover" fill sizes="180px" src={preview} unoptimized />
                  </span>
                ) : (
                  <>
                    <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-[#e9eedf] text-lg text-[#637844]">+</span>
                    <span className="mt-2 text-xs font-semibold text-[#596745]">Pilih foto</span>
                  </>
                )}
                <span className="mt-2 max-w-full truncate text-[10px] text-[#858c7d]">
                  {photoName || (preview ? "Ganti foto" : "JPG, PNG, atau WebP · maks. 5 MB")}
                </span>
                <input accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handlePhotoChange} type="file" />
              </label>
              <FieldError>{photoError}</FieldError>
            </div>

            <div className="grid content-start gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-[#4d5548]">Nama produk <span className="text-[#a34d3e]">*</span></span>
                <input
                  aria-invalid={Boolean(errors.name)}
                  className={fieldClassName}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Contoh: Roti Cokelat"
                  value={name}
                />
                <FieldError>{errors.name}</FieldError>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-[#4d5548]">Kategori <span className="text-[#a34d3e]">*</span></span>
                <select
                  aria-invalid={Boolean(errors.category)}
                  className={fieldClassName}
                  onChange={(event) => setCategory(event.target.value)}
                  value={category}
                >
                  <option disabled value="">Pilih kategori</option>
                  {productCategories.map((item) => <option key={item}>{item}</option>)}
                </select>
                <FieldError>{errors.category}</FieldError>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-[#4d5548]">Kondisi barang</span>
                <select className={fieldClassName} onChange={(event) => setCondition(event.target.value)} value={condition}>
                  <option>Dibuat hari ini</option>
                  <option>Siap santap</option>
                  <option>Disimpan dingin</option>
                  <option>Kemasan utuh</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-[#4d5548]">Harga (Rp) <span className="text-[#a34d3e]">*</span></span>
                <input
                  aria-invalid={Boolean(errors.price)}
                  className={fieldClassName}
                  inputMode="numeric"
                  min="0"
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="0"
                  type="number"
                  value={price}
                />
                <FieldError>{errors.price}</FieldError>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-[#4d5548]">Stok (unit) <span className="text-[#a34d3e]">*</span></span>
                <input
                  aria-invalid={Boolean(errors.stock)}
                  className={fieldClassName}
                  inputMode="numeric"
                  min="0"
                  onChange={(event) => setStock(event.target.value)}
                  placeholder="0"
                  step="1"
                  type="number"
                  value={stock}
                />
                <FieldError>{errors.stock}</FieldError>
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-[#4d5548]">Deskripsi <span className="text-[#a34d3e]">*</span></span>
                <textarea
                  aria-invalid={Boolean(errors.description)}
                  className="mt-2 min-h-28 w-full resize-y rounded-lg border border-[#202a1e]/10 bg-white px-3 py-2.5 text-sm leading-6 text-[#30392c] outline-none transition placeholder:text-[#a0a497] focus:border-[#8b9d5e] focus:ring-2 focus:ring-[#dfe8ca]"
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Jelaskan kondisi, kelengkapan, dan detail penting lainnya"
                  value={description}
                />
                <FieldError>{errors.description}</FieldError>
              </label>
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#202a1e]/15 bg-[#fffefa] px-5 text-sm font-semibold text-[#4d5548] transition hover:bg-[#f1f2ec]"
            href="/seller/products"
          >
            Batal
          </Link>
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#202a1e] px-5 text-sm font-semibold text-white transition hover:bg-[#35432f]"
            type="submit"
          >
            {mode === "edit" ? "Simpan Perubahan" : "Simpan Produk"}
          </button>
        </div>
      </form>
      <p className="text-center text-[10px] text-[#9aa092]">Formulir ini menggunakan simulasi lokal dan belum terhubung ke API.</p>
    </div>
  );
}