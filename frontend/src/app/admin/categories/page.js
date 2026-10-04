"use client";

import { useMemo, useState } from "react";

const initialCategories = [
  { id: "cat-001", name: "Makanan Berat", description: "Nasi, rice bowl, dan makanan utama", products: 31, status: "Aktif" },
  { id: "cat-002", name: "Roti & Bakery", description: "Produk roti, pastry, dan bakery", products: 24, status: "Aktif" },
  { id: "cat-003", name: "Snack", description: "Camilan dan makanan ringan", products: 18, status: "Aktif" },
  { id: "cat-004", name: "Dessert", description: "Kue, puding, dan makanan manis", products: 15, status: "Aktif" },
  { id: "cat-005", name: "Minuman", description: "Kopi, teh, jus, dan minuman lainnya", products: 27, status: "Aktif" },
  { id: "cat-006", name: "Makanan Siap Saji", description: "Hidangan siap santap untuk dinikmati segera", products: 12, status: "Aktif" },
  { id: "cat-007", name: "Makanan Sehat", description: "Pilihan makanan bernutrisi dan seimbang", products: 9, status: "Aktif" },
  { id: "cat-008", name: "Lainnya", description: "Produk kuliner yang belum masuk kategori lain", products: 4, status: "Nonaktif" },
];

const pageSize = 10;

function CategoryStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex w-fit whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${
        status === "Aktif" ? "bg-[#e9eedf] text-[#637844]" : "bg-[#f5dfd8] text-[#a34d3e]"
      }`}
    >
      {status}
    </span>
  );
}

function CategoryFormDialog({ category, onClose, onSave }) {
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [status, setStatus] = useState(category?.status ?? "Aktif");
  const [errors, setErrors] = useState({});

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Nama kategori wajib diisi.";
    if (!description.trim()) nextErrors.description = "Deskripsi wajib diisi.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      ...(category ?? {}),
      name: name.trim(),
      description: description.trim(),
      status,
    });
  }

  const fieldClassName =
    "mt-2 h-11 w-full min-w-0 rounded-lg border border-[#202a1e]/10 bg-white px-3 text-sm text-[#30392c] outline-none transition placeholder:text-[#a0a497] focus:border-[#8b9d5e] focus:ring-2 focus:ring-[#dfe8ca]";

  return (
    <div
      aria-labelledby="category-form-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#202a1e]/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
    >
      <form
        className="my-auto w-full max-w-lg rounded-xl bg-[#fffefa] p-5 shadow-xl sm:p-6"
        noValidate
        onSubmit={submit}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#30392c]" id="category-form-title">
              {category ? "Edit Kategori" : "Tambah Kategori"}
            </h2>
            <p className="mt-1 text-xs leading-5 text-[#858c7d]">
              Data kategori ini hanya disimpan sementara di halaman.
            </p>
          </div>
          <button
            aria-label="Tutup form kategori"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg text-[#727a6d] transition hover:bg-[#f4f5ef]"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-[#4d5548]">
              Nama Kategori <span className="text-[#a34d3e]">*</span>
            </span>
            <input
              aria-describedby={errors.name ? "category-name-error" : undefined}
              aria-invalid={Boolean(errors.name)}
              className={fieldClassName}
              onChange={(event) => setName(event.target.value)}
              placeholder="Contoh: Makanan Berat"
              value={name}
            />
            {errors.name ? <span className="mt-1 block text-xs text-[#a34d3e]" id="category-name-error">{errors.name}</span> : null}
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-[#4d5548]">
              Deskripsi <span className="text-[#a34d3e]">*</span>
            </span>
            <textarea
              aria-describedby={errors.description ? "category-description-error" : undefined}
              aria-invalid={Boolean(errors.description)}
              className="mt-2 min-h-24 w-full resize-y rounded-lg border border-[#202a1e]/10 bg-white px-3 py-2.5 text-sm text-[#30392c] outline-none transition placeholder:text-[#a0a497] focus:border-[#8b9d5e] focus:ring-2 focus:ring-[#dfe8ca]"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Jelaskan jenis produk dalam kategori ini"
              value={description}
            />
            {errors.description ? (
              <span className="mt-1 block text-xs text-[#a34d3e]" id="category-description-error">{errors.description}</span>
            ) : null}
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-[#4d5548]">Status</span>
            <select className={fieldClassName} onChange={(event) => setStatus(event.target.value)} value={status}>
              <option>Aktif</option>
              <option>Nonaktif</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#202a1e]/10 px-5 text-sm font-semibold text-[#596745] transition hover:bg-[#f4f5ef]"
            onClick={onClose}
            type="button"
          >
            Batal
          </button>
          <button
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#202a1e] px-5 text-sm font-semibold text-white transition hover:bg-[#35432f]"
            type="submit"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}

function StatusConfirmationDialog({ category, onCancel, onConfirm }) {
  const activate = category.status === "Nonaktif";
  const action = activate ? "Aktifkan" : "Nonaktifkan";

  return (
    <div
      aria-labelledby="category-status-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#202a1e]/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
      role="alertdialog"
    >
      <section className="w-full max-w-md rounded-xl bg-[#fffefa] p-5 shadow-xl sm:p-6">
        <h2 className="text-base font-bold text-[#30392c]" id="category-status-title">
          {action} kategori?
        </h2>
        <p className="mt-2 break-words text-sm leading-6 text-[#727a6d]">
          {action} kategori {category.name}?
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#202a1e]/10 px-5 text-sm font-semibold text-[#596745] transition hover:bg-[#f4f5ef]"
            onClick={onCancel}
            type="button"
          >
            Batal
          </button>
          <button
            className={`inline-flex min-h-10 items-center justify-center rounded-lg px-5 text-sm font-semibold text-white transition ${
              activate ? "bg-[#637844] hover:bg-[#526638]" : "bg-[#a34d3e] hover:bg-[#8d4033]"
            }`}
            onClick={onConfirm}
            type="button"
          >
            {action}
          </button>
        </div>
      </section>
    </div>
  );
}

function CategoryActions({ category, onEdit, onToggle }) {
  const action = category.status === "Aktif" ? "Nonaktifkan" : "Aktifkan";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        className="inline-flex min-h-9 items-center justify-center rounded-lg px-3 text-xs font-semibold text-[#637844] transition hover:bg-[#edf1e4]"
        onClick={() => onEdit(category)}
        type="button"
      >
        Edit
      </button>
      <button
        className={`inline-flex min-h-9 items-center justify-center rounded-lg px-3 text-xs font-semibold transition ${
          category.status === "Aktif"
            ? "text-[#a34d3e] hover:bg-[#f8e9e5]"
            : "text-[#536738] hover:bg-[#edf1e4]"
        }`}
        onClick={() => onToggle(category)}
        type="button"
      >
        {action}
      </button>
    </div>
  );
}

function CategoryCard({ category, onEdit, onToggle }) {
  return (
    <article className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-sm font-bold text-[#30392c]">{category.name}</h3>
          <p className="mt-1 break-words text-xs leading-5 text-[#727a6d]">{category.description}</p>
        </div>
        <CategoryStatusBadge status={category.status} />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#202a1e]/[0.07] pt-3">
        <p className="text-xs text-[#858c7d]">{category.products} produk</p>
        <CategoryActions category={category} onEdit={onEdit} onToggle={onToggle} />
      </div>
    </article>
  );
}

function Pagination({ currentPage, totalPages, onChange }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Pagination kategori" className="flex flex-wrap items-center justify-center gap-1.5">
      <button
        className="min-h-10 rounded-lg border border-[#202a1e]/10 px-3 text-xs font-semibold text-[#596745] transition hover:bg-[#f4f5ef] disabled:cursor-not-allowed disabled:opacity-40"
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
              ? "bg-[#202a1e] text-white"
              : "border border-[#202a1e]/10 text-[#596745] hover:bg-[#f4f5ef]"
          }`}
          key={page}
          onClick={() => onChange(page)}
          type="button"
        >
          {page}
        </button>
      ))}
      <button
        className="min-h-10 rounded-lg border border-[#202a1e]/10 px-3 text-xs font-semibold text-[#596745] transition hover:bg-[#f4f5ef] disabled:cursor-not-allowed disabled:opacity-40"
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
        type="button"
      >
        Selanjutnya
      </button>
    </nav>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Semua Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCategory, setEditingCategory] = useState(null);
  const [confirmingCategory, setConfirmingCategory] = useState(null);
  const [feedback, setFeedback] = useState("");
  const normalizedSearch = search.trim().toLocaleLowerCase("id-ID");

  const filteredCategories = useMemo(
    () =>
      categories.filter((category) => {
        const matchesSearch =
          !normalizedSearch ||
          category.name.toLocaleLowerCase("id-ID").includes(normalizedSearch) ||
          category.description.toLocaleLowerCase("id-ID").includes(normalizedSearch);
        const matchesStatus = status === "Semua Status" || category.status === status;
        return matchesSearch && matchesStatus;
      }),
    [categories, normalizedSearch, status],
  );

  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const visibleCategories = filteredCategories.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const activeCount = categories.filter((category) => category.status === "Aktif").length;
  const inactiveCount = categories.length - activeCount;
  const summaries = [
    { label: "Total Kategori", value: categories.length, mark: "K", tone: "bg-[#e7edda] text-[#536738]" },
    { label: "Kategori Aktif", value: activeCount, mark: "A", tone: "bg-[#dce9e7] text-[#3c6861]" },
    { label: "Kategori Nonaktif", value: inactiveCount, mark: "N", tone: "bg-[#f5dfd8] text-[#a34d3e]" },
  ];

  function changeFilters(update) {
    update();
    setCurrentPage(1);
  }

  function saveCategory(category) {
    if (category.id) {
      setCategories((current) => current.map((item) => (item.id === category.id ? { ...item, ...category } : item)));
      setFeedback(`Kategori "${category.name}" berhasil diperbarui.`);
    } else {
      setCategories((current) => [
        { ...category, id: `cat-${Date.now()}`, products: 0 },
        ...current,
      ]);
      setFeedback(`Kategori "${category.name}" berhasil ditambahkan.`);
      setCurrentPage(1);
    }
    setEditingCategory(null);
  }

  function confirmStatusChange() {
    if (!confirmingCategory) return;
    const nextStatus = confirmingCategory.status === "Aktif" ? "Nonaktif" : "Aktif";
    setCategories((current) =>
      current.map((category) =>
        category.id === confirmingCategory.id ? { ...category, status: nextStatus } : category,
      ),
    );
    setFeedback(`Kategori "${confirmingCategory.name}" berhasil ${nextStatus === "Aktif" ? "diaktifkan" : "dinonaktifkan"}.`);
    setConfirmingCategory(null);
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8b927f]">Manajemen platform</p>
        <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#202a1e] sm:text-[30px]">
          Categories
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#727a6d]">
          Kelola kategori produk kuliner yang ditampilkan di ReMeal.
        </p>
      </header>

      {feedback ? (
        <div
          className="flex items-start justify-between gap-3 rounded-lg border border-[#637844]/20 bg-[#e9eedf] px-4 py-3 text-sm text-[#536738]"
          role="status"
        >
          <span>{feedback}</span>
          <button
            aria-label="Tutup notifikasi"
            className="shrink-0 font-semibold"
            onClick={() => setFeedback("")}
            type="button"
          >
            ×
          </button>
        </div>
      ) : null}

      <section aria-label="Ringkasan kategori" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {summaries.map((summary) => (
          <article className="min-w-0 rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4 sm:p-5" key={summary.label}>
            <div className="flex items-start justify-between gap-2">
              <p className="min-h-8 text-xs font-medium leading-4 text-[#727a6d]">{summary.label}</p>
              <span className={`grid h-8 min-w-8 shrink-0 place-items-center rounded-lg px-1.5 text-xs font-bold ${summary.tone}`}>
                {summary.mark}
              </span>
            </div>
            <p className="mt-3 break-words text-[23px] font-bold leading-none tracking-[-0.04em] text-[#202a1e] sm:text-[26px]">
              {summary.value}
            </p>
            <p className="mt-2.5 text-[10px] leading-4 text-[#8b927f]">data contoh</p>
          </article>
        ))}
      </section>

      <section
        aria-label="Cari dan filter kategori"
        className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4 sm:p-5"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[minmax(200px,1fr)_190px]">
            <label className="block">
              <span className="sr-only">Cari kategori</span>
              <input
                className="h-11 w-full min-w-0 rounded-lg border border-[#202a1e]/10 bg-white px-3 text-sm text-[#30392c] outline-none transition placeholder:text-[#a0a497] focus:border-[#8b9d5e] focus:ring-2 focus:ring-[#dfe8ca]"
                onChange={(event) => changeFilters(() => setSearch(event.target.value))}
                placeholder="Cari kategori..."
                type="search"
                value={search}
              />
            </label>
            <label className="block">
              <span className="sr-only">Filter status kategori</span>
              <select
                className="h-11 w-full min-w-0 rounded-lg border border-[#202a1e]/10 bg-white px-3 text-sm text-[#4d5548] outline-none focus:border-[#8b9d5e] focus:ring-2 focus:ring-[#dfe8ca]"
                onChange={(event) => changeFilters(() => setStatus(event.target.value))}
                value={status}
              >
                <option>Semua Status</option>
                <option>Aktif</option>
                <option>Nonaktif</option>
              </select>
            </label>
          </div>
          <button
            className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-lg bg-[#202a1e] px-4 text-sm font-semibold text-white transition hover:bg-[#35432f] md:w-auto"
            onClick={() => setEditingCategory({})}
            type="button"
          >
            + Tambah Kategori
          </button>
        </div>
      </section>

      <section aria-label="Daftar kategori" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-[#30392c]">Daftar Kategori</h2>
          <span className="text-xs text-[#858c7d]">
            {filteredCategories.length === 0
              ? "0 kategori"
              : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredCategories.length)} dari ${filteredCategories.length} kategori`}
          </span>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] px-5 py-12 text-center">
            <h3 className="text-sm font-bold text-[#30392c]">Kategori tidak ditemukan</h3>
            <p className="mt-1.5 text-sm text-[#858c7d]">
              Coba ubah kata kunci atau filter yang digunakan.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 lg:hidden">
              {visibleCategories.map((category) => (
                <CategoryCard
                  category={category}
                  key={category.id}
                  onEdit={setEditingCategory}
                  onToggle={setConfirmingCategory}
                />
              ))}
            </div>

            <div className="hidden overflow-x-auto rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] lg:block">
              <table className="w-full min-w-[900px] table-fixed text-left">
                <colgroup>
                  <col className="w-[24%]" />
                  <col className="w-[37%]" />
                  <col className="w-[14%]" />
                  <col className="w-[12%]" />
                  <col className="w-[13%]" />
                </colgroup>
                <thead className="border-b border-[#202a1e]/[0.07] bg-[#f8f9f4]">
                  <tr className="text-[11px] font-semibold text-[#727a6d]">
                    <th className="px-4 py-3.5">Kategori</th>
                    <th className="px-4 py-3.5">Deskripsi</th>
                    <th className="px-4 py-3.5">Jumlah Produk</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#202a1e]/[0.07]">
                  {visibleCategories.map((category) => (
                    <tr className="text-xs text-[#30392c]" key={category.id}>
                      <td className="break-words px-4 py-3.5 font-semibold">{category.name}</td>
                      <td className="break-words px-4 py-3.5 text-[#727a6d]">{category.description}</td>
                      <td className="px-4 py-3.5">{category.products}</td>
                      <td className="px-4 py-3.5"><CategoryStatusBadge status={category.status} /></td>
                      <td className="px-4 py-3.5">
                        <CategoryActions
                          category={category}
                          onEdit={setEditingCategory}
                          onToggle={setConfirmingCategory}
                        />
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

      <p className="text-center text-[11px] text-[#9aa092]">
        Kategori dan jumlah produk contoh — perubahan hanya tersimpan sementara di halaman.
      </p>

      {editingCategory ? (
        <CategoryFormDialog
          category={editingCategory.id ? editingCategory : null}
          onClose={() => setEditingCategory(null)}
          onSave={saveCategory}
        />
      ) : null}
      {confirmingCategory ? (
        <StatusConfirmationDialog
          category={confirmingCategory}
          onCancel={() => setConfirmingCategory(null)}
          onConfirm={confirmStatusChange}
        />
      ) : null}
    </div>
  );
}
