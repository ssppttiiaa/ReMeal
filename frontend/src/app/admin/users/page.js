"use client";

import { useMemo, useState } from "react";

const users = [
  { id: "usr-2026-001", name: "Septiana", email: "septi@remeal.id", phone: "081234567890", role: "consumer", status: "Aktif", joined: "1 Oktober 2026" },
  { id: "usr-2026-002", name: "Roti & Rasa", email: "seller@remeal.id", phone: "081234567891", role: "seller", status: "Aktif", joined: "28 September 2026" },
  { id: "usr-2026-003", name: "Dapur Mbak Sari", email: "dapur@remeal.id", phone: "081234567892", role: "seller", status: "Aktif", joined: "25 September 2026" },
  { id: "usr-2026-004", name: "Admin ReMeal", email: "admin@remeal.id", phone: "", role: "super_admin", status: "Aktif", joined: "20 September 2026" },
  { id: "usr-2026-005", name: "Bima Pratama", email: "bima@remeal.id", phone: "081234560005", role: "consumer", status: "Aktif", joined: "18 September 2026" },
  { id: "usr-2026-006", name: "Kopi Senja", email: "kopi.senja@remeal.id", phone: "081234560006", role: "seller", status: "Nonaktif", joined: "16 September 2026" },
  { id: "usr-2026-007", name: "Nadia Putri", email: "nadia@remeal.id", phone: "081234560007", role: "consumer", status: "Aktif", joined: "14 September 2026" },
  { id: "usr-2026-008", name: "Kedai Nusantara", email: "kedai@remeal.id", phone: "081234560008", role: "seller", status: "Aktif", joined: "12 September 2026" },
  { id: "usr-2026-009", name: "Rafi Hidayat", email: "rafi@remeal.id", phone: "081234560009", role: "consumer", status: "Nonaktif", joined: "10 September 2026" },
  { id: "usr-2026-010", name: "Manis Bakery", email: "manis@remeal.id", phone: "081234560010", role: "seller", status: "Aktif", joined: "8 September 2026" },
  { id: "usr-2026-011", name: "Citra Lestari", email: "citra@remeal.id", phone: "081234560011", role: "consumer", status: "Aktif", joined: "6 September 2026" },
  { id: "usr-2026-012", name: "Dimas Saputra", email: "dimas@remeal.id", phone: "081234560012", role: "consumer", status: "Aktif", joined: "4 September 2026" },
  { id: "usr-2026-013", name: "Warung Pagi", email: "warung.pagi@remeal.id", phone: "081234560013", role: "seller", status: "Aktif", joined: "2 September 2026" },
  { id: "usr-2026-014", name: "Sinta Maharani", email: "sinta@remeal.id", phone: "081234560014", role: "consumer", status: "Aktif", joined: "31 Agustus 2026" },
  { id: "usr-2026-015", name: "Pawon Ibu", email: "pawon@remeal.id", phone: "081234560015", role: "seller", status: "Nonaktif", joined: "29 Agustus 2026" },
  { id: "usr-2026-016", name: "Yoga Firmansyah", email: "yoga@remeal.id", phone: "081234560016", role: "consumer", status: "Aktif", joined: "27 Agustus 2026" },
  { id: "usr-2026-017", name: "Dapur Hijau", email: "hijau@remeal.id", phone: "081234560017", role: "seller", status: "Aktif", joined: "25 Agustus 2026" },
  { id: "usr-2026-018", name: "Alya Rahma", email: "alya@remeal.id", phone: "081234560018", role: "consumer", status: "Nonaktif", joined: "23 Agustus 2026" },
  { id: "usr-2026-019", name: "Nusa Snack", email: "snack@remeal.id", phone: "081234560019", role: "seller", status: "Aktif", joined: "21 Agustus 2026" },
  { id: "usr-2026-020", name: "Fajar Wibowo", email: "fajar@remeal.id", phone: "081234560020", role: "consumer", status: "Aktif", joined: "19 Agustus 2026" },
  { id: "usr-2026-021", name: "Sari Rasa", email: "sari.rasa@remeal.id", phone: "081234560021", role: "seller", status: "Aktif", joined: "17 Agustus 2026" },
  { id: "usr-2026-022", name: "Intan Permata", email: "intan@remeal.id", phone: "081234560022", role: "consumer", status: "Aktif", joined: "15 Agustus 2026" },
  { id: "usr-2026-023", name: "Teras Roti", email: "teras@remeal.id", phone: "081234560023", role: "seller", status: "Aktif", joined: "13 Agustus 2026" },
];

const roleLabels = {
  consumer: "Consumer",
  seller: "Seller",
  super_admin: "Super Admin",
};

const pageSize = 10;
const summaryCards = [
  { label: "Total Users", value: "1.248", detail: "seluruh akun contoh", mark: "U", tone: "bg-[#e7edda] text-[#536738]" },
  { label: "Consumer", value: "1.162", detail: "akun konsumen", mark: "C", tone: "bg-[#dce9e7] text-[#3c6861]" },
  { label: "Seller", value: "85", detail: "akun seller", mark: "S", tone: "bg-[#f8e5c9] text-[#8b5924]" },
  { label: "User Aktif", value: "1.203", detail: "akun berstatus aktif", mark: "✓", tone: "bg-[#e7edda] text-[#536738]" },
];

function UserStatusBadge({ status }) {
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

function RoleBadge({ role }) {
  const label = roleLabels[role];
  const styles = {
    consumer: "bg-[#dce9e7] text-[#3c6861]",
    seller: "bg-[#f8e9d4] text-[#94621f]",
    super_admin: "bg-[#eee8f3] text-[#725b84]",
  };

  return (
    <span className={`inline-flex w-fit whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${styles[role]}`}>
      {label}
    </span>
  );
}

function UserAvatar({ name }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("id-ID");

  return (
    <span
      aria-hidden="true"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e9eedf] text-xs font-bold text-[#637844]"
    >
      {initials}
    </span>
  );
}

function UserDetailDialog({ user, onClose }) {
  return (
    <div
      aria-labelledby="user-detail-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#202a1e]/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
    >
      <section className="w-full max-w-lg rounded-xl bg-[#fffefa] p-5 shadow-xl sm:p-6">
        <div className="flex items-start gap-3">
          <UserAvatar name={user.name} />
          <div className="min-w-0 flex-1">
            <h2 className="break-words text-lg font-bold text-[#30392c]" id="user-detail-title">
              Detail Pengguna
            </h2>
            <p className="mt-1 break-all text-xs text-[#858c7d]">{user.id}</p>
          </div>
          <button
            aria-label="Tutup detail"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg text-[#727a6d] transition hover:bg-[#f4f5ef]"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <dl className="mt-5 grid gap-x-5 sm:grid-cols-2">
          <div className="border-b border-[#202a1e]/[0.07] py-3">
            <dt className="text-xs text-[#858c7d]">Nama</dt>
            <dd className="mt-1 break-words text-sm font-semibold text-[#30392c]">{user.name}</dd>
          </div>
          <div className="border-b border-[#202a1e]/[0.07] py-3">
            <dt className="text-xs text-[#858c7d]">Email</dt>
            <dd className="mt-1 break-all text-sm font-semibold text-[#30392c]">{user.email}</dd>
          </div>
          <div className="border-b border-[#202a1e]/[0.07] py-3">
            <dt className="text-xs text-[#858c7d]">Nomor Telepon</dt>
            <dd className="mt-1 break-words text-sm font-semibold text-[#30392c]">{user.phone || "-"}</dd>
          </div>
          <div className="border-b border-[#202a1e]/[0.07] py-3">
            <dt className="text-xs text-[#858c7d]">Tanggal Bergabung</dt>
            <dd className="mt-1 break-words text-sm font-semibold text-[#30392c]">{user.joined}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-b border-[#202a1e]/[0.07] py-3">
            <dt className="text-xs text-[#858c7d]">Role</dt>
            <dd><RoleBadge role={user.role} /></dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-b border-[#202a1e]/[0.07] py-3">
            <dt className="text-xs text-[#858c7d]">Status</dt>
            <dd><UserStatusBadge status={user.status} /></dd>
          </div>
        </dl>

        <div className="mt-5 flex justify-end">
          <button
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#202a1e] px-5 text-sm font-semibold text-white transition hover:bg-[#35432f]"
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

function UserCard({ user, onView }) {
  return (
    <article className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4">
      <div className="flex items-start gap-3">
        <UserAvatar name={user.name} />
        <div className="min-w-0 flex-1">
          <h3 className="break-words text-sm font-bold text-[#30392c]">{user.name}</h3>
          <p className="mt-1 break-all text-xs leading-5 text-[#727a6d]">{user.email}</p>
          <p className="mt-1 text-[11px] text-[#858c7d]">{user.phone || "Nomor telepon tidak tersedia"}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#202a1e]/[0.07] pt-3">
        <RoleBadge role={user.role} />
        <UserStatusBadge status={user.status} />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] text-[#858c7d]">Bergabung {user.joined}</p>
        <button
          className="inline-flex min-h-9 items-center justify-center rounded-lg px-3 text-xs font-semibold text-[#637844] transition hover:bg-[#edf1e4]"
          onClick={() => onView(user)}
          type="button"
        >
          Lihat Detail
        </button>
      </div>
    </article>
  );
}

function Pagination({ currentPage, totalPages, onChange }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Pagination pengguna" className="flex flex-wrap items-center justify-center gap-1.5">
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

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("Semua Role");
  const [status, setStatus] = useState("Semua Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const normalizedSearch = search.trim().toLocaleLowerCase("id-ID");

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesSearch =
          !normalizedSearch ||
          user.name.toLocaleLowerCase("id-ID").includes(normalizedSearch) ||
          user.email.toLocaleLowerCase("id-ID").includes(normalizedSearch);
        const matchesRole = role === "Semua Role" || roleLabels[user.role] === role;
        const matchesStatus = status === "Semua Status" || user.status === status;
        return matchesSearch && matchesRole && matchesStatus;
      }),
    [normalizedSearch, role, status],
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const visibleUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const summaries = [
    { label: "Total Users", value: "1.248", detail: "seluruh akun contoh", mark: "U", tone: "bg-[#e7edda] text-[#536738]" },
    { label: "Consumer", value: "1.162", detail: "akun konsumen", mark: "C", tone: "bg-[#dce9e7] text-[#3c6861]" },
    { label: "Seller", value: "85", detail: "akun seller", mark: "S", tone: "bg-[#f8e5c9] text-[#8b5924]" },
    { label: "User Aktif", value: "1.203", detail: "akun berstatus aktif", mark: "✓", tone: "bg-[#e7edda] text-[#536738]" },
  ];

  function changeFilters(update) {
    update();
    setCurrentPage(1);
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8b927f]">Manajemen platform</p>
        <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#202a1e] sm:text-[30px]">
          Users
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#727a6d]">
          Lihat dan pantau pengguna yang terdaftar di ReMeal.
        </p>
      </header>

      <section aria-label="Ringkasan pengguna" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
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
            <p className="mt-2.5 break-words text-[10px] leading-4 text-[#8b927f]">{summary.detail}</p>
          </article>
        ))}
      </section>

      <section
        aria-label="Cari dan filter pengguna"
        className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4 sm:p-5"
      >
        <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_190px_190px]">
          <label className="relative block">
            <span className="sr-only">Cari nama atau email</span>
            <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#858c7d]">⌕</span>
            <input
              className="h-11 w-full rounded-lg border border-[#202a1e]/10 bg-white pl-9 pr-3 text-sm text-[#30392c] outline-none transition placeholder:text-[#a0a497] focus:border-[#8b9d5e] focus:ring-2 focus:ring-[#dfe8ca]"
              onChange={(event) => changeFilters(() => setSearch(event.target.value))}
              placeholder="Cari nama atau email..."
              type="search"
              value={search}
            />
          </label>
          <label className="block">
            <span className="sr-only">Filter role</span>
            <select
              className="h-11 w-full rounded-lg border border-[#202a1e]/10 bg-white px-3 text-sm text-[#4d5548] outline-none focus:border-[#8b9d5e] focus:ring-2 focus:ring-[#dfe8ca]"
              onChange={(event) => changeFilters(() => setRole(event.target.value))}
              value={role}
            >
              <option>Semua Role</option>
              <option>Consumer</option>
              <option>Seller</option>
              <option>Super Admin</option>
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Filter status</span>
            <select
              className="h-11 w-full rounded-lg border border-[#202a1e]/10 bg-white px-3 text-sm text-[#4d5548] outline-none focus:border-[#8b9d5e] focus:ring-2 focus:ring-[#dfe8ca]"
              onChange={(event) => changeFilters(() => setStatus(event.target.value))}
              value={status}
            >
              <option>Semua Status</option>
              <option>Aktif</option>
              <option>Nonaktif</option>
            </select>
          </label>
        </div>
      </section>

      <section aria-label="Daftar pengguna" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-[#30392c]">Daftar Pengguna</h2>
          <span className="text-xs text-[#858c7d]">
            {filteredUsers.length === 0
              ? "0 pengguna"
              : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredUsers.length)} dari ${filteredUsers.length} pengguna`}
          </span>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] px-5 py-12 text-center">
            <h3 className="text-sm font-bold text-[#30392c]">Pengguna tidak ditemukan</h3>
            <p className="mt-1.5 text-sm text-[#858c7d]">
              Coba ubah kata kunci atau filter yang digunakan.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 lg:hidden">
              {visibleUsers.map((user) => (
                <UserCard key={user.id} onView={setSelectedUser} user={user} />
              ))}
            </div>

            <div className="hidden overflow-x-auto rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] lg:block">
              <table className="w-full min-w-[950px] table-fixed text-left">
                <colgroup>
                  <col className="w-[25%]" />
                  <col className="w-[24%]" />
                  <col className="w-[14%]" />
                  <col className="w-[12%]" />
                  <col className="w-[15%]" />
                  <col className="w-[10%]" />
                </colgroup>
                <thead className="border-b border-[#202a1e]/[0.07] bg-[#f8f9f4]">
                  <tr className="text-[11px] font-semibold text-[#727a6d]">
                    <th className="px-4 py-3.5">Pengguna</th>
                    <th className="px-4 py-3.5">Email</th>
                    <th className="px-4 py-3.5">Role</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Bergabung</th>
                    <th className="px-4 py-3.5">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#202a1e]/[0.07]">
                  {visibleUsers.map((user) => (
                    <tr className="text-xs text-[#30392c]" key={user.id}>
                      <td className="px-4 py-3.5">
                        <div className="flex min-w-0 items-center gap-3">
                          <UserAvatar name={user.name} />
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{user.name}</p>
                            <p className="mt-1 truncate text-[10px] text-[#858c7d]">{user.phone || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="break-all px-4 py-3.5">{user.email}</td>
                      <td className="px-4 py-3.5"><RoleBadge role={user.role} /></td>
                      <td className="px-4 py-3.5"><UserStatusBadge status={user.status} /></td>
                      <td className="px-4 py-3.5 text-[#727a6d]">{user.joined}</td>
                      <td className="px-4 py-3.5">
                        <button
                          className="whitespace-nowrap text-xs font-semibold text-[#637844] transition hover:text-[#40532c]"
                          onClick={() => setSelectedUser(user)}
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

      <p className="text-center text-[11px] text-[#9aa092]">
        Daftar dan ringkasan pengguna contoh — belum terhubung ke database.
      </p>

      {selectedUser ? <UserDetailDialog onClose={() => setSelectedUser(null)} user={selectedUser} /> : null}
    </div>
  );
}
