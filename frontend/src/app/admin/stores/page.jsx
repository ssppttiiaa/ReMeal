"use client";

import { useMemo, useState } from "react";
import { ADMIN_DEV_MODE } from "../../../lib/adminDevMode";
import { AdminStoresApi } from "../_components/AdminApiViews";

const stores = [
  {
    id: "store-001",
    name: "Roti & Rasa",
    owner: "Rina",
    email: "seller@remeal.id",
    phone: "081234567891",
    location: "Yogyakarta",
    status: "Aktif",
    products: 12,
    joined: "28 September 2026",
    transactions: 245,
    rating: "4,8",
  },
  {
    id: "store-002",
    name: "Dapur Mbak Sari",
    owner: "Sari",
    email: "dapur@remeal.id",
    phone: "081234567892",
    location: "Yogyakarta",
    status: "Aktif",
    products: 8,
    joined: "25 September 2026",
    transactions: 198,
    rating: "4,7",
  },
  {
    id: "store-003",
    name: "Kopi Senja",
    owner: "Andi",
    email: "kopisenja@remeal.id",
    phone: "081234560006",
    location: "Sleman",
    status: "Menunggu Verifikasi",
    products: 5,
    joined: "22 September 2026",
    transactions: 0,
    rating: "—",
  },
  {
    id: "store-004",
    name: "Manis Bakery",
    owner: "Dewi",
    email: "manis@remeal.id",
    phone: "081234560010",
    location: "Bantul",
    status: "Nonaktif",
    products: 0,
    joined: "20 September 2026",
    transactions: 64,
    rating: "4,5",
  },
  {
    id: "store-005",
    name: "Kedai Nusantara",
    owner: "Budi",
    email: "kedai@remeal.id",
    phone: "081234560008",
    location: "Yogyakarta",
    status: "Aktif",
    products: 10,
    joined: "18 September 2026",
    transactions: 154,
    rating: "4,6",
  },
  {
    id: "store-006",
    name: "Warung Pagi",
    owner: "Lestari",
    email: "warung.pagi@remeal.id",
    phone: "081234560013",
    location: "Sleman",
    status: "Aktif",
    products: 7,
    joined: "16 September 2026",
    transactions: 121,
    rating: "4,4",
  },
  {
    id: "store-007",
    name: "Pawon Ibu",
    owner: "Maya",
    email: "pawon@remeal.id",
    phone: "081234560015",
    location: "Bantul",
    status: "Nonaktif",
    products: 0,
    joined: "14 September 2026",
    transactions: 73,
    rating: "4,3",
  },
  {
    id: "store-008",
    name: "Dapur Hijau",
    owner: "Raka",
    email: "hijau@remeal.id",
    phone: "081234560017",
    location: "Yogyakarta",
    status: "Aktif",
    products: 9,
    joined: "12 September 2026",
    transactions: 112,
    rating: "4,7",
  },
  {
    id: "store-009",
    name: "Nusa Snack",
    owner: "Putri",
    email: "snack@remeal.id",
    phone: "081234560019",
    location: "Sleman",
    status: "Menunggu Verifikasi",
    products: 4,
    joined: "10 September 2026",
    transactions: 0,
    rating: "—",
  },
  {
    id: "store-010",
    name: "Sari Rasa",
    owner: "Agus",
    email: "sari.rasa@remeal.id",
    phone: "081234560021",
    location: "Kulon Progo",
    status: "Aktif",
    products: 6,
    joined: "8 September 2026",
    transactions: 139,
    rating: "4,6",
  },
  {
    id: "store-011",
    name: "Teras Roti",
    owner: "Nia",
    email: "teras@remeal.id",
    phone: "081234560023",
    location: "Yogyakarta",
    status: "Aktif",
    products: 11,
    joined: "6 September 2026",
    transactions: 98,
    rating: "4,5",
  },
  {
    id: "store-012",
    name: "Segar Berkah",
    owner: "Dian",
    email: "segar.berkah@remeal.id",
    phone: "081234560024",
    location: "Gunungkidul",
    status: "Menunggu Verifikasi",
    products: 3,
    joined: "4 September 2026",
    transactions: 0,
    rating: "—",
  },
  {
    id: "store-013",
    name: "Lauk Rumahan",
    owner: "Fajar",
    email: "lauk.rumahan@remeal.id",
    phone: "081234560025",
    location: "Bantul",
    status: "Aktif",
    products: 13,
    joined: "2 September 2026",
    transactions: 87,
    rating: "4,4",
  },
  {
    id: "store-014",
    name: "Buah Kita",
    owner: "Intan",
    email: "buah.kita@remeal.id",
    phone: "081234560026",
    location: "Sleman",
    status: "Aktif",
    products: 5,
    joined: "31 Agustus 2026",
    transactions: 56,
    rating: "4,2",
  },
  {
    id: "store-015",
    name: "Jajan Pasar Murni",
    owner: "Wulan",
    email: "jajan.murni@remeal.id",
    phone: "081234560027",
    location: "Yogyakarta",
    status: "Aktif",
    products: 8,
    joined: "29 Agustus 2026",
    transactions: 91,
    rating: "4,8",
  },
];

const pageSize = 10;
const summaryCards = [
  { label: "Total UMKM", value: "86", detail: "seluruh toko contoh", mark: "T", tone: "bg-[#F4C542] text-[#29261F]" },
  { label: "UMKM Aktif", value: "72", detail: "toko beroperasi", mark: "A", tone: "bg-[#E89B3C] text-[#29261F]" },
  { label: "Menunggu Verifikasi", value: "8", detail: "perlu ditinjau", mark: "V", tone: "bg-[#F8E7A8] text-[#29261F]" },
  { label: "Nonaktif", value: "6", detail: "toko tidak aktif", mark: "N", tone: "bg-[#FFF9EF] text-[#29261F]" },
];

function StoreAvatar({ name }) {
  return (
    <span
      aria-hidden="true"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F4C542] text-sm font-bold text-[#29261F]"
    >
      {name.trim().slice(0, 1).toLocaleUpperCase("id-ID")}
    </span>
  );
}

function StoreStatusBadge({ status }) {
  const styles = {
    Aktif: "bg-[#F4C542] text-[#29261F]",
    "Menunggu Verifikasi": "bg-[#F8E7A8] text-[#29261F]",
    Nonaktif: "bg-[#F8E7A8] text-[#29261F]",
    Ditolak: "bg-[#29261F] text-white",
    Ditangguhkan: "bg-[#E89B3C] text-[#29261F]",
  };

  return (
    <span className={`inline-flex w-fit whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

function MockStoreVerificationActions({ store, onUpdate }) {
  const actionsByStatus = {
    "Menunggu Verifikasi": [["Aktif", "Setujui"], ["Ditolak", "Tolak"]],
    Aktif: [["Ditangguhkan", "Tangguhkan"]],
    Nonaktif: [["Aktif", "Aktifkan kembali"]],
    Ditangguhkan: [["Aktif", "Aktifkan kembali"]],
    Ditolak: [["Aktif", "Setujui Ulang"]],
  };
  const actions = actionsByStatus[store.status] ?? [];

  if (actions.length === 0) {
    return <span className="text-xs text-[#8B8172]">Status toko belum dikenali: {store.status || "—"}</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map(([nextStatus, label]) => (
        <button
          className="min-h-8 rounded-lg border border-[#29261F]/15 px-2.5 text-xs font-semibold text-[#29261F] transition hover:bg-[#F8E7A8]"
          key={nextStatus}
          onClick={() => onUpdate(store, nextStatus)}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function StoreDetailDialog({ store, onClose, onUpdate }) {
  const details = [
    ["Nama Toko", store.name],
    ["Pemilik", store.owner],
    ["Email", store.email],
    ["Nomor Telepon", store.phone],
    ["Lokasi", store.location],
    ["Tanggal Bergabung", store.joined],
    ["Jumlah Produk Aktif", `${store.products} produk`],
    ["Jumlah Transaksi", store.transactions.toLocaleString("id-ID")],
    ["Rating Toko", store.rating === "—" ? store.rating : `${store.rating} / 5`],
  ];

  return (
    <div
      aria-labelledby="store-detail-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#FFF9EF]/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
    >
      <section className="my-auto w-full max-w-lg rounded-xl bg-[#FFF9EF] p-5 shadow-xl sm:p-6">
        <div className="flex items-start gap-3">
          <StoreAvatar name={store.name} />
          <div className="min-w-0 flex-1">
            <h2 className="break-words text-lg font-bold text-[#29261F]" id="store-detail-title">
              Detail UMKM
            </h2>
            <p className="mt-1 break-words text-xs text-[#8B8172]">{store.name}</p>
          </div>
          <button
            aria-label="Tutup detail"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg text-[#8B8172] transition hover:bg-[#F7F1E7]"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="mt-4">
          <StoreStatusBadge status={store.status} />
        </div>
        <dl className="mt-3 grid gap-x-5 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div className="min-w-0 border-b border-[#29261F]/[0.07] py-3" key={label}>
              <dt className="text-xs text-[#8B8172]">{label}</dt>
              <dd className="mt-1 break-words text-sm font-semibold text-[#29261F]">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 border-t border-[#29261F]/[0.07] pt-4">
          <p className="mb-2 text-xs font-semibold text-[#29261F]">Verifikasi Super Admin</p>
          <MockStoreVerificationActions onUpdate={onUpdate} store={store} />
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

function StoreCard({ store, onView, onUpdate }) {
  return (
    <article className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4">
      <div className="flex items-start gap-3">
        <StoreAvatar name={store.name} />
        <div className="min-w-0 flex-1">
          <h3 className="break-words text-sm font-bold text-[#29261F]">{store.name}</h3>
          <p className="mt-1 text-xs text-[#8B8172]">Pemilik: {store.owner}</p>
          <p className="mt-1 break-all text-xs leading-5 text-[#8B8172]">{store.email}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#29261F]/[0.07] pt-3">
        <StoreStatusBadge status={store.status} />
        <span className="text-xs text-[#8B8172]">{store.products} produk aktif</span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0 text-[11px] leading-5 text-[#8B8172]">
          <p className="break-words">{store.location}</p>
          <p>Bergabung {store.joined}</p>
        </div>
        <button
          className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-lg px-3 text-xs font-semibold text-[#29261F] transition hover:bg-[#F4C542]"
          onClick={() => onView(store)}
          type="button"
        >
          Lihat Detail
        </button>
      </div>
      <div className="mt-3 border-t border-[#29261F]/[0.07] pt-3">
        <MockStoreVerificationActions onUpdate={onUpdate} store={store} />
      </div>
    </article>
  );
}

function Pagination({ currentPage, totalPages, onChange }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Pagination UMKM" className="flex flex-wrap items-center justify-center gap-1.5">
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

function AdminStoresMock() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Semua Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [mockStores, setMockStores] = useState(stores);
  const [selectedStore, setSelectedStore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const normalizedSearch = search.trim().toLocaleLowerCase("id-ID");

  const filteredStores = useMemo(
    () =>
      mockStores.filter((store) => {
        const matchesSearch =
          !normalizedSearch ||
          store.name.toLocaleLowerCase("id-ID").includes(normalizedSearch) ||
          store.owner.toLocaleLowerCase("id-ID").includes(normalizedSearch) ||
          store.email.toLocaleLowerCase("id-ID").includes(normalizedSearch);
        const matchesStatus = status === "Semua Status" || store.status === status;
        return matchesSearch && matchesStatus;
      }),
    [mockStores, normalizedSearch, status],
  );

  const totalPages = Math.ceil(filteredStores.length / pageSize);
  const visibleStores = filteredStores.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function changeFilters(update) {
    update();
    setCurrentPage(1);
  }

  function updateMockVerification(store, nextStatus) {
    let reason = "";
    if (nextStatus === "Ditolak" || nextStatus === "Ditangguhkan") {
      reason = window.prompt(`Masukkan alasan ${nextStatus.toLocaleLowerCase("id-ID")} (wajib):`)?.trim() ?? "";
      if (!reason) return;
    }
    if (!window.confirm(`${nextStatus} toko ${store.name}?`)) return;

    const updatedStore = { ...store, status: nextStatus };
    setMockStores((current) => current.map((item) => item.id === store.id ? updatedStore : item));
    setSelectedStore((current) => current?.id === store.id ? updatedStore : current);
    setFeedback(`Status ${store.name} berubah menjadi ${nextStatus} pada data development saja${reason ? ` · Alasan: ${reason}` : ""}.`);
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">Manajemen platform</p>
        <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#29261F] sm:text-[30px]">
          Stores / UMKM
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#8B8172]">
          Pantau toko dan UMKM yang terdaftar di ReMeal.
        </p>
      </header>

      {feedback ? <p className="rounded-lg border border-[#29261F]/10 bg-[#F8E7A8] px-4 py-3 text-sm text-[#29261F]" role="status">{feedback}</p> : null}

      <section aria-label="Ringkasan UMKM" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {summaryCards.map((summary) => (
          <article className="min-w-0 rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-5" key={summary.label}>
            <div className="flex items-start justify-between gap-2">
              <p className="min-h-8 text-xs font-medium leading-4 text-[#8B8172]">{summary.label}</p>
              <span className={`grid h-8 min-w-8 shrink-0 place-items-center rounded-lg px-1.5 text-xs font-bold ${summary.tone}`}>
                {summary.mark}
              </span>
            </div>
            <p className="mt-3 break-words text-[23px] font-bold leading-none tracking-[-0.04em] text-[#29261F] sm:text-[26px]">
              {summary.value}
            </p>
            <p className="mt-2.5 break-words text-[10px] leading-4 text-[#8B8172]">{summary.detail}</p>
          </article>
        ))}
      </section>

      <section
        aria-label="Cari dan filter UMKM"
        className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-5"
      >
        <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_220px]">
          <label className="relative block">
            <span className="sr-only">Cari nama toko atau pemilik</span>
            <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8172]">⌕</span>
            <input
              className="h-11 w-full min-w-0 rounded-lg border border-[#29261F]/10 bg-white pl-9 pr-3 text-sm text-[#29261F] outline-none transition placeholder:text-[#8B8172] focus:border-[#29261F] focus:ring-2 focus:ring-[#E89B3C]"
              onChange={(event) => changeFilters(() => setSearch(event.target.value))}
              placeholder="Cari nama toko atau pemilik..."
              type="search"
              value={search}
            />
          </label>
          <label className="block">
            <span className="sr-only">Filter status</span>
            <select
              className="h-11 w-full min-w-0 rounded-lg border border-[#29261F]/10 bg-white px-3 text-sm text-[#29261F] outline-none focus:border-[#29261F] focus:ring-2 focus:ring-[#E89B3C]"
              onChange={(event) => changeFilters(() => setStatus(event.target.value))}
              value={status}
            >
              <option>Semua Status</option>
              <option>Aktif</option>
              <option>Menunggu Verifikasi</option>
              <option>Nonaktif</option>
              <option>Ditolak</option>
              <option>Ditangguhkan</option>
            </select>
          </label>
        </div>
      </section>

      <section aria-label="Daftar UMKM" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-[#29261F]">Daftar UMKM</h2>
          <span className="text-xs text-[#8B8172]">
            {filteredStores.length === 0
              ? "0 UMKM"
              : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredStores.length)} dari ${filteredStores.length} UMKM`}
          </span>
        </div>

        {filteredStores.length === 0 ? (
          <div className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] px-5 py-12 text-center">
            <h3 className="text-sm font-bold text-[#29261F]">UMKM tidak ditemukan</h3>
            <p className="mt-1.5 text-sm text-[#8B8172]">
              Coba ubah kata kunci atau filter yang digunakan.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 lg:hidden">
              {visibleStores.map((store) => (
                <StoreCard key={store.id} onUpdate={updateMockVerification} onView={setSelectedStore} store={store} />
              ))}
            </div>

            <div className="hidden overflow-x-auto rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] lg:block">
              <table className="w-full min-w-[1000px] table-fixed text-left">
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[12%]" />
                  <col className="w-[21%]" />
                  <col className="w-[16%]" />
                  <col className="w-[13%]" />
                  <col className="w-[6%]" />
                  <col className="w-[12%]" />
                </colgroup>
                <thead className="border-b border-[#29261F]/[0.07] bg-[#F7F1E7]">
                  <tr className="text-[11px] font-semibold text-[#8B8172]">
                    <th className="px-4 py-3.5">Toko</th>
                    <th className="px-4 py-3.5">Pemilik</th>
                    <th className="px-4 py-3.5">Email</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Bergabung</th>
                    <th className="px-4 py-3.5">Produk</th>
                    <th className="px-4 py-3.5">Aksi Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#29261f]/[0.07]">
                  {visibleStores.map((store) => (
                    <tr className="text-xs text-[#29261F]" key={store.id}>
                      <td className="px-4 py-3.5">
                        <div className="flex min-w-0 items-center gap-3">
                          <StoreAvatar name={store.name} />
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{store.name}</p>
                            <p className="mt-1 truncate text-[10px] text-[#8B8172]">{store.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="break-words px-4 py-3.5">{store.owner}</td>
                      <td className="break-all px-4 py-3.5">{store.email}</td>
                      <td className="px-4 py-3.5"><StoreStatusBadge status={store.status} /></td>
                      <td className="px-4 py-3.5 text-[#8B8172]">{store.joined}</td>
                      <td className="px-4 py-3.5">{store.products}</td>
                      <td className="px-4 py-3.5">
                        <div className="space-y-2">
                          <button className="whitespace-nowrap text-xs font-semibold text-[#29261F] underline" onClick={() => setSelectedStore(store)} type="button">
                            Detail
                          </button>
                          <MockStoreVerificationActions onUpdate={updateMockVerification} store={store} />
                        </div>
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
        Daftar dan ringkasan UMKM contoh — belum terhubung ke database.
      </p>

      {selectedStore ? (
        <StoreDetailDialog onClose={() => setSelectedStore(null)} onUpdate={updateMockVerification} store={selectedStore} />
      ) : null}
    </div>
  );
}

export default function AdminStoresPage() {
  return ADMIN_DEV_MODE ? <AdminStoresMock /> : <AdminStoresApi />;
}
