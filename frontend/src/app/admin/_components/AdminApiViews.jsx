"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createAdminCategory,
  deleteAdminCategory,
  deleteAdminUser,
  getAdminCategories,
  getAdminComplaints,
  getAdminDashboard,
  getAdminOrders,
  getAdminReviewReports,
  getAdminSettings,
  getAdminStores,
  getAdminUsers,
  moderateAdminReview,
  updateAdminCategory,
  updateAdminComplaint,
  updateAdminSettings,
  updateAdminUser,
  verifyAdminStore,
} from "../../../services/admin";

const pageSize = 10;
const cardClass = "rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-5";
const fieldClass =
  "h-11 w-full min-w-0 rounded-lg border border-[#29261F]/10 bg-white px-3 text-sm text-[#29261F] outline-none focus:border-[#29261F] focus:ring-2 focus:ring-[#E89B3C]";

function errorText(error) {
  return error instanceof Error ? error.message : "Permintaan gagal. Silakan coba lagi.";
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function Status({ children }) {
  const value = String(children).toLocaleLowerCase("id-ID");
  const tone =
    value.includes("nonaktif") ||
    value.includes("inactive") ||
    value.includes("pending") ||
    value.includes("menunggu")
      ? "bg-[#F8E7A8]"
      : "bg-[#F4C542]";

  return (
    <span className={`inline-flex w-fit whitespace-nowrap rounded-full ${tone} px-2.5 py-1.5 text-[11px] font-semibold text-[#29261F]`}>
      {children}
    </span>
  );
}

function Feedback({ error, message }) {
  if (!error && !message) return null;
  return (
    <p
      className={`rounded-lg px-4 py-3 text-sm ${error ? "bg-[#FFF9EF] text-[#29261F]" : "bg-[#F4C542] text-[#29261F]"}`}
      role={error ? "alert" : "status"}
    >
      {error || message}
    </p>
  );
}

function PageControls({ page, meta, onChange }) {
  const totalPages = Math.max(1, Math.ceil((meta?.total ?? 0) / (meta?.limit ?? pageSize)));
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-3">
      <button className={`${fieldClass} w-auto px-4 disabled:opacity-40`} disabled={page <= 1} onClick={() => onChange(page - 1)} type="button">
        Sebelumnya
      </button>
      <span className="text-xs text-[#8B8172]">Halaman {page} dari {totalPages}</span>
      <button className={`${fieldClass} w-auto px-4 disabled:opacity-40`} disabled={page >= totalPages} onClick={() => onChange(page + 1)} type="button">
        Selanjutnya
      </button>
    </nav>
  );
}

function usePagedData(loader, params) {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: pageSize, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const paramsKey = JSON.stringify(params);
  const stableParams = useMemo(() => JSON.parse(paramsKey), [paramsKey]);
  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await loader({ ...stableParams, page: stableParams.page, limit: pageSize });
      setData(Array.isArray(response?.data) ? response.data : []);
      setMeta(response?.meta ?? { page: stableParams.page, limit: pageSize, total: 0 });
    } catch (requestError) {
      setError(errorText(requestError));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [loader, stableParams]);
  useEffect(() => {
    const timer = window.setTimeout(() => { void refresh(); }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);
  return { data, meta, loading, error, refresh, setData };
}

function UserGrowthChart({ data }) {
  const width = 720;
  const height = 180;
  const paddingX = 16;
  const chartTop = 12;
  const chartBottom = 132;
  const maxValue = Math.max(1, ...data.flatMap((item) => [
    Number(item.consumers) || 0,
    Number(item.sellers) || 0,
  ]));
  const points = (key) => data.map((item, index) => {
    const x = data.length < 2
      ? width / 2
      : paddingX + index * (width - paddingX * 2) / (data.length - 1);
    const value = Number(item[key]) || 0;
    const y = chartBottom - value / maxValue * (chartBottom - chartTop);
    return { x, y, value, date: item.date };
  });
  const consumerPoints = points("consumers");
  const sellerPoints = points("sellers");
  const pathFor = (series) => series.map(({ x, y }, index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const dateLabels = data.filter((_, index) =>
    index === 0 || index === data.length - 1 || index % Math.ceil(data.length / 5) === 0
  );

  return (
    <div className="mt-4 overflow-x-auto">
      <svg
        aria-label="Grafik pertumbuhan jumlah consumer dan seller"
        className="h-auto min-w-[520px] text-[#29261F]"
        role="img"
        viewBox={`0 0 ${width} ${height}`}
      >
        {[0, 1, 2, 3].map((line) => {
          const y = chartTop + line * (chartBottom - chartTop) / 3;
          return <line key={line} stroke="currentColor" strokeOpacity="0.12" x1={paddingX} x2={width - paddingX} y1={y} y2={y} />;
        })}
        <path d={pathFor(consumerPoints)} fill="none" stroke="#E89B3C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <path d={pathFor(sellerPoints)} fill="none" stroke="#29261F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        {consumerPoints.map((point, index) => <circle cx={point.x} cy={point.y} fill="#E89B3C" key={`consumer-${data[index].date}`} r="4"><title>{formatDate(point.date)}: {point.value} consumer</title></circle>)}
        {sellerPoints.map((point, index) => <circle cx={point.x} cy={point.y} fill="#29261F" key={`seller-${data[index].date}`} r="4"><title>{formatDate(point.date)}: {point.value} seller</title></circle>)}
        {dateLabels.map((item) => {
          const pointIndex = data.indexOf(item);
          const x = data.length < 2
            ? width / 2
            : paddingX + pointIndex * (width - paddingX * 2) / (data.length - 1);
          return <text fill="currentColor" fontSize="10" key={item.date} textAnchor="middle" x={x} y="158">{new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(new Date(item.date))}</text>;
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-[#8B8172]">
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#E89B3C]" />Consumer</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#29261F]" />Seller</span>
      </div>
    </div>
  );
}

export function AdminDashboardApi() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    getAdminDashboard().then((response) => {
      if (active) setDashboard(response?.data ?? response);
    }).catch((reason) => {
      if (active) setError(errorText(reason));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);
  const cards = [
    ["Total Consumer", dashboard?.total_consumers],
    ["Total Seller", dashboard?.total_sellers],
    ["Menunggu Verifikasi", dashboard?.pending_verifications],
    ["Total Transaksi", dashboard?.total_transactions],
    ["Total GMV", dashboard?.total_gmv == null ? null : `Rp${Number(dashboard.total_gmv).toLocaleString("id-ID")}`],
    ["Produk Terselamatkan", dashboard?.items_saved],
    ["Laporan Review Terbuka", dashboard?.open_review_reports],
  ];
  return (
    <div className="space-y-6">
      <header><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">Manajemen platform</p><h1 className="mt-1.5 text-[26px] font-bold text-[#29261F] sm:text-[30px]">Dashboard</h1><p className="mt-2 text-sm text-[#8B8172]">Ringkasan yang tersedia dari dashboard API Admin.</p></header>
      <Feedback error={error} />
      {loading ? <p className={cardClass}>Memuat dashboard…</p> : null}
      {!loading && !error ? (
        <>
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {cards.map(([label, value]) => (
              <article className={cardClass} key={label}>
                <p className="text-xs text-[#8B8172]">{label}</p>
                <p className="mt-3 break-words text-2xl font-bold text-[#29261F]">{value ?? "—"}</p>
              </article>
            ))}
          </section>
          <section className={cardClass}>
            <h2 className="text-sm font-bold text-[#29261F]">Pertumbuhan Pengguna</h2>
            {dashboard?.user_growth?.length ? (
              <UserGrowthChart data={dashboard.user_growth} />
            ) : <p className="mt-2 text-sm text-[#8B8172]">Data pertumbuhan belum tersedia.</p>}
          </section>
          <p className="text-center text-[11px] text-[#8B8172]">API dashboard tidak menyediakan rincian aktivitas, produk aktif, toko teratas, atau transaksi terbaru.</p>
        </>
      ) : null}
    </div>
  );
}

function UserRow({ user, onToggle, onDelete, busy }) {
  const active = Boolean(user.is_active);
  return (
    <tr className="border-t border-[#29261F]/[0.07] text-xs text-[#29261F]">
      <td className="break-words px-3 py-3">{user.full_name || "—"}<span className="mt-1 block break-all text-[10px] text-[#8B8172]">{user.phone || "—"}</span></td>
      <td className="break-all px-3 py-3">{user.email || "—"}</td>
      <td className="px-3 py-3">{user.role}</td>
      <td className="px-3 py-3"><Status>{active ? "Aktif" : "Nonaktif"}</Status></td>
      <td className="px-3 py-3">{formatDate(user.created_at)}</td>
      <td className="px-3 py-3"><div className="flex flex-wrap gap-2"><button className="font-semibold text-[#29261F] disabled:opacity-40" disabled={busy} onClick={() => onToggle(user)} type="button">{active ? "Nonaktifkan" : "Aktifkan"}</button><button className="font-semibold text-[#29261F] disabled:opacity-40" disabled={busy} onClick={() => onDelete(user)} type="button">Hapus</button></div></td>
    </tr>
  );
}

export function AdminUsersApi() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [mutationError, setMutationError] = useState("");
  const [busyId, setBusyId] = useState("");
  const params = { q: search.trim(), role, page };
  const { data, meta, loading, error, refresh } = usePagedData(getAdminUsers, params);
  async function toggle(user) {
    setBusyId(user.id); setFeedback(""); setMutationError("");
    try {
      await updateAdminUser(user.id, { is_active: !user.is_active });
      setFeedback("Status pengguna berhasil diperbarui.");
      await refresh();
    } catch (reason) { setMutationError(errorText(reason)); }
    finally { setBusyId(""); }
  }
  async function remove(user) {
    if (!window.confirm(`Hapus pengguna ${user.full_name || user.email}?`)) return;
    setBusyId(user.id); setFeedback(""); setMutationError("");
    try {
      await deleteAdminUser(user.id);
      setFeedback("Pengguna berhasil dihapus.");
      await refresh();
    } catch (reason) { setMutationError(errorText(reason)); }
    finally { setBusyId(""); }
  }
  return (
    <div className="space-y-6">
      <header><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">Manajemen platform</p><h1 className="mt-1.5 text-[26px] font-bold text-[#29261F] sm:text-[30px]">Users</h1><p className="mt-2 text-sm text-[#8B8172]">Daftar akun sesuai pencarian dan role dari backend.</p></header>
      <Feedback error={error || mutationError} message={feedback} />
      <section className={`${cardClass} grid gap-3 sm:grid-cols-[minmax(220px,1fr)_190px]`}>
        <input className={fieldClass} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Cari nama, email, atau telepon…" type="search" value={search} />
        <select className={fieldClass} onChange={(event) => { setRole(event.target.value); setPage(1); }} value={role}><option value="">Semua Role</option><option value="consumer">Consumer</option><option value="seller">Seller</option><option value="super_admin">Super Admin</option></select>
      </section>
      <section className={`${cardClass} overflow-x-auto`}>
        <div className="mb-3 flex justify-between text-xs text-[#8B8172]"><h2 className="font-bold text-[#29261F]">Daftar Pengguna</h2><span>{meta.total ?? 0} pengguna</span></div>
        {loading ? <p>Memuat pengguna…</p> : data.length ? <table className="w-full min-w-[760px] text-left"><thead><tr className="text-[11px] text-[#8B8172]"><th className="px-3 py-2">Pengguna</th><th className="px-3 py-2">Email</th><th className="px-3 py-2">Role</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Bergabung</th><th className="px-3 py-2">Aksi</th></tr></thead><tbody>{data.map((user) => <UserRow busy={busyId === user.id} key={user.id} onDelete={remove} onToggle={toggle} user={user} />)}</tbody></table> : !error ? <p className="py-8 text-center text-sm text-[#8B8172]">Tidak ada pengguna.</p> : null}
      </section>
      <PageControls meta={meta} onChange={setPage} page={page} />
    </div>
  );
}

const verificationToLabel = { pending: "Menunggu Verifikasi", approved: "Disetujui", rejected: "Ditolak", suspended: "Ditangguhkan" };
export function AdminStoresApi() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [mutationError, setMutationError] = useState("");
  const [busyId, setBusyId] = useState("");
  const params = { verification_status: status, page };
  const { data, meta, loading, error, refresh } = usePagedData(getAdminStores, params);
  async function update(store, nextStatus) {
    const reason = nextStatus === "rejected" || nextStatus === "suspended"
      ? window.prompt("Masukkan alasan (wajib):")?.trim()
      : undefined;
    if ((nextStatus === "rejected" || nextStatus === "suspended") && !reason) return;
    if (!window.confirm(`${verificationToLabel[nextStatus]} toko ${store.name}?`)) return;
    setBusyId(store.id); setFeedback(""); setMutationError("");
    try {
      await verifyAdminStore(store.id, { status: nextStatus, ...(reason ? { reason } : {}) });
      setFeedback("Status verifikasi toko berhasil diperbarui.");
      await refresh();
    } catch (reasonError) { setMutationError(errorText(reasonError)); }
    finally { setBusyId(""); }
  }
  return (
    <div className="space-y-6">
      <header><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">Manajemen platform</p><h1 className="mt-1.5 text-[26px] font-bold text-[#29261F] sm:text-[30px]">Stores / UMKM</h1><p className="mt-2 text-sm text-[#8B8172]">Pemilik dan toko mengikuti data yang disediakan API.</p></header>
      <Feedback error={error || mutationError} message={feedback} />
      <section className={`${cardClass} grid gap-3 sm:grid-cols-[minmax(220px,1fr)_220px]`}><p className="self-center text-xs text-[#8B8172]">Pencarian toko tidak tersedia pada endpoint backend.</p><select className={fieldClass} onChange={(event) => { setStatus(event.target.value); setPage(1); }} value={status}><option value="">Semua Status</option><option value="pending">Menunggu Verifikasi</option><option value="approved">Disetujui</option><option value="rejected">Ditolak</option><option value="suspended">Ditangguhkan</option></select></section>
      <section className={`${cardClass} overflow-x-auto`}><div className="mb-3 flex justify-between text-xs text-[#8B8172]"><h2 className="font-bold text-[#29261F]">Daftar UMKM</h2><span>{meta.total ?? 0} toko</span></div>
        {loading ? <p>Memuat toko…</p> : data.length ? <table className="w-full min-w-[850px] text-left"><thead><tr className="text-[11px] text-[#8B8172]"><th className="px-3 py-2">Toko</th><th className="px-3 py-2">Pemilik</th><th className="px-3 py-2">Alamat</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Bergabung</th><th className="px-3 py-2">Aksi Verifikasi</th></tr></thead><tbody>{data.map((store) => {
          const status = store.verification_status;
          const action = status === "pending"
            ? [["approved", "Setujui"], ["rejected", "Tolak"]]
            : status === "approved"
              ? [["suspended", "Tangguhkan"]]
              : status === "suspended"
                ? [["approved", "Aktifkan kembali"]]
                : status === "rejected"
                  ? [["approved", "Setujui Ulang"]]
                  : [];
          return (
            <tr className="border-t border-[#29261F]/[0.07] text-xs" key={store.id}>
              <td className="px-3 py-3 font-semibold">{store.name}</td>
              <td className="px-3 py-3 break-all">{store.owner?.full_name || store.owner_id || "—"}</td>
              <td className="px-3 py-3">{store.address || "—"}</td>
              <td className="px-3 py-3"><Status>{verificationToLabel[status] || status}</Status></td>
              <td className="px-3 py-3">{formatDate(store.created_at)}</td>
              <td className="px-3 py-3">
                {action.length ? (
                  <div className="flex flex-wrap gap-2">
                    {action.map(([nextStatus, label]) => (
                      <button className="whitespace-nowrap font-semibold text-[#29261F] underline disabled:opacity-40" disabled={busyId === store.id} key={nextStatus} onClick={() => void update(store, nextStatus)} type="button">{label}</button>
                    ))}
                  </div>
                ) : <span className="text-[#8B8172]">Status belum dikenali: {status || "—"}</span>}
              </td>
            </tr>
          );
        })}</tbody></table> : !error ? <p className="py-8 text-center text-sm text-[#8B8172]">Tidak ada toko.</p> : null}
      </section>
      <PageControls meta={meta} onChange={setPage} page={page} />
    </div>
  );
}

export function AdminCategoriesApi() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await getAdminCategories();
      const rows = Array.isArray(response) ? response : response?.data;
      if (!Array.isArray(rows)) throw new Error("Format response kategori tidak valid.");
      setCategories(rows);
    } catch (reason) { setError(errorText(reason)); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => { void refresh(); }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);
  const filtered = categories.filter((item) => item.name?.toLocaleLowerCase("id-ID").includes(search.trim().toLocaleLowerCase("id-ID")));
  async function save(event) {
    event.preventDefault();
    const data = { name: form.name.trim(), ...(form.icon.trim() ? { icon: form.icon.trim() } : {}) };
    setBusy(true); setFeedback(""); setError("");
    try {
      if (form.id) await updateAdminCategory(form.id, data);
      else await createAdminCategory(data);
      setForm(null); setFeedback("Kategori berhasil disimpan."); await refresh();
    } catch (reason) { setError(errorText(reason)); }
    finally { setBusy(false); }
  }
  async function remove(category) {
    if (!window.confirm(`Hapus kategori "${category.name}"?`)) return;
    setBusy(true); setError("");
    try { await deleteAdminCategory(category.id); setFeedback("Kategori berhasil dihapus."); await refresh(); }
    catch (reason) { setError(errorText(reason)); }
    finally { setBusy(false); }
  }
  return (
    <div className="space-y-6">
      <header><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">Manajemen platform</p><h1 className="mt-1.5 text-[26px] font-bold text-[#29261F] sm:text-[30px]">Categories</h1><p className="mt-2 text-sm text-[#8B8172]">Kelola nama dan ikon kategori produk.</p></header>
      <Feedback error={error} message={feedback} />
      <section className={`${cardClass} flex flex-col gap-3 sm:flex-row`}><input className={fieldClass} onChange={(event) => setSearch(event.target.value)} placeholder="Cari kategori…" type="search" value={search} /><button className="min-h-11 rounded-lg bg-[#FFF9EF] px-4 text-sm font-semibold text-white" onClick={() => setForm({ name: "", icon: "" })} type="button">+ Tambah Kategori</button></section>
      <section className={`${cardClass} overflow-x-auto`}><p className="mb-3 text-xs text-[#8B8172]">{categories.length} kategori · deskripsi, status, dan jumlah produk tidak disediakan API</p>{loading ? <p>Memuat kategori…</p> : !error && filtered.length === 0 ? <p className="py-8 text-center text-sm text-[#8B8172]">Tidak ada kategori.</p> : null}
        {!loading && filtered.length ? <table className="w-full min-w-[520px] text-left"><thead><tr className="text-[11px] text-[#8B8172]"><th className="px-3 py-2">Nama Kategori</th><th className="px-3 py-2">Ikon</th><th className="px-3 py-2">Aksi</th></tr></thead><tbody>{filtered.map((category) => <tr className="border-t border-[#29261F]/[0.07] text-xs" key={category.id}><td className="px-3 py-3 font-semibold">{category.name}</td><td className="px-3 py-3">{category.icon || "—"}</td><td className="px-3 py-3"><div className="flex gap-3"><button className="font-semibold text-[#29261F]" onClick={() => setForm({ ...category, icon: category.icon || "" })} type="button">Edit</button><button className="font-semibold text-[#29261F] disabled:opacity-40" disabled={busy} onClick={() => void remove(category)} type="button">Hapus</button></div></td></tr>)}</tbody></table> : null}
      </section>
      {form ? <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#FFF9EF]/45 p-4"><form className={`${cardClass} w-full max-w-lg space-y-4`} onSubmit={save}><h2 className="text-lg font-bold text-[#29261F]">{form.id ? "Edit Kategori" : "Tambah Kategori"}</h2><label className="block text-xs font-semibold">Nama Kategori<input className={`${fieldClass} mt-2`} required maxLength={100} onChange={(event) => setForm({ ...form, name: event.target.value })} value={form.name} /></label><label className="block text-xs font-semibold">Ikon (opsional)<input className={`${fieldClass} mt-2`} onChange={(event) => setForm({ ...form, icon: event.target.value })} value={form.icon} /></label><div className="flex justify-end gap-2"><button className="min-h-10 rounded-lg border px-4 text-sm" onClick={() => setForm(null)} type="button">Batal</button><button className="min-h-10 rounded-lg bg-[#FFF9EF] px-4 text-sm font-semibold text-white disabled:opacity-50" disabled={busy} type="submit">Simpan</button></div></form></div> : null}
    </div>
  );
}

const orderLabels = {
  pending_payment: "Menunggu Pembayaran",
  paid: "Dibayar",
  confirmed: "Dikonfirmasi",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  expired: "Kedaluwarsa",
};
const orderStatusOptions = [
  ["", "Semua Status"],
  ["pending_payment", "Menunggu Pembayaran"],
  ["paid", "Dibayar"],
  ["confirmed", "Dikonfirmasi"],
  ["completed", "Selesai"],
  ["cancelled", "Dibatalkan"],
  ["expired", "Kedaluwarsa"],
];

export function AdminOrdersApi() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const params = { status, page };
  const { data, meta, loading, error } = usePagedData(getAdminOrders, params);
  return (
    <div className="space-y-6">
      <header><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">Manajemen platform</p><h1 className="mt-1.5 text-[26px] font-bold text-[#29261F] sm:text-[30px]">Orders</h1><p className="mt-2 text-sm text-[#8B8172]">Pantau pesanan berdasarkan status backend.</p></header>
      <Feedback error={error} />
      <section className={`${cardClass} grid gap-3 sm:grid-cols-[1fr_220px]`}><p className="self-center text-xs text-[#8B8172]">Pencarian, filter tanggal, nama toko, dan nama konsumen tidak tersedia pada endpoint.</p><select className={fieldClass} onChange={(event) => { setStatus(event.target.value); setPage(1); }} value={status}>{orderStatusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></section>
      <section className={`${cardClass} overflow-x-auto`}><div className="mb-3 flex justify-between text-xs text-[#8B8172]"><h2 className="font-bold text-[#29261F]">Daftar Pesanan</h2><span>{meta.total ?? 0} pesanan</span></div>
        {loading ? <p>Memuat pesanan…</p> : data.length ? <table className="w-full min-w-[900px] text-left"><thead><tr className="text-[11px] text-[#8B8172]"><th className="px-3 py-2">Kode / ID</th><th className="px-3 py-2">Produk</th><th className="px-3 py-2">Toko ID</th><th className="px-3 py-2">Konsumen ID</th><th className="px-3 py-2">Jumlah / Total</th><th className="px-3 py-2">Pembayaran</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Dibuat</th></tr></thead><tbody>{data.map((order) => <tr className="border-t border-[#29261F]/[0.07] text-xs" key={order.id}><td className="px-3 py-3 font-semibold">{order.order_code || order.id}</td><td className="px-3 py-3">{order.product?.name || "—"}</td><td className="break-all px-3 py-3">{order.store_id || "—"}</td><td className="break-all px-3 py-3">{order.consumer_id || "—"}</td><td className="px-3 py-3">{order.quantity ?? "—"} × · Rp{Number(order.total_price || 0).toLocaleString("id-ID")}</td><td className="px-3 py-3">{order.payment_status || "—"}</td><td className="px-3 py-3"><Status>{orderLabels[order.status] || order.status || "—"}</Status></td><td className="px-3 py-3">{formatDate(order.created_at)}</td></tr>)}</tbody></table> : !error ? <p className="py-8 text-center text-sm text-[#8B8172]">Tidak ada pesanan.</p> : null}
      </section>
      <PageControls meta={meta} onChange={setPage} page={page} />
    </div>
  );
}

const reportStatusLabels = { open: "Terbuka", resolved: "Ditinjau", dismissed: "Ditolak" };
export function AdminReviewsApi() {
  const [status, setStatus] = useState("open");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [mutationError, setMutationError] = useState("");
  const params = { status, page };
  const { data, meta, loading, error, refresh } = usePagedData(getAdminReviewReports, params);
  async function moderate(report, action) {
    const reviewId = report.review?.id;
    if (!reviewId) { setMutationError("ID review tidak tersedia pada laporan ini."); return; }
    if (!window.confirm(`${action} review yang dilaporkan?`)) return;
    setBusyId(reviewId); setFeedback(""); setMutationError("");
    try {
      await moderateAdminReview(reviewId, { action });
      setFeedback("Moderasi berhasil diproses.");
      await refresh();
    } catch (reason) { setMutationError(errorText(reason)); }
    finally { setBusyId(""); }
  }
  return (
    <div className="space-y-6">
      <header><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">Manajemen platform</p><h1 className="mt-1.5 text-[26px] font-bold text-[#29261F] sm:text-[30px]">Reviews &amp; Reports</h1><p className="mt-2 text-sm text-[#8B8172]">Endpoint Admin hanya menyediakan laporan review, bukan daftar seluruh review.</p></header>
      <Feedback error={error || mutationError} message={feedback} />
      <section className={`${cardClass} grid gap-3 sm:grid-cols-[1fr_220px]`}><p className="self-center text-xs text-[#8B8172]">Review tanpa laporan dan filter rating/pencarian tidak disediakan API Admin.</p><select className={fieldClass} onChange={(event) => { setStatus(event.target.value); setPage(1); }} value={status}><option value="open">Terbuka</option><option value="resolved">Ditinjau</option><option value="dismissed">Ditolak</option></select></section>
      <section className="space-y-3"><div className="flex justify-between text-xs text-[#8B8172]"><h2 className="font-bold text-[#29261F]">Laporan Review</h2><span>{meta.total ?? 0} laporan</span></div>
        {loading ? <div className={cardClass}>Memuat laporan…</div> : null}
        {!loading && !error && data.length === 0 ? <div className={`${cardClass} py-8 text-center text-sm text-[#8B8172]`}>Tidak ada laporan pada status ini.</div> : null}
        {data.map((report) => <article className={cardClass} key={report.id}><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words text-sm font-bold text-[#29261F]">Laporan untuk produk {report.review?.product_id || "—"}</h3><p className="mt-1 break-all text-xs text-[#8B8172]">Review {report.review?.id || "—"} · Pelapor {report.reported_by || "—"}</p></div><Status>{reportStatusLabels[report.status] || report.status}</Status></div><p className="mt-3 text-xs font-semibold text-[#8B8172]">Alasan: {report.reason || "—"}</p><p className="mt-1 break-words text-sm leading-6 text-[#29261F]">{report.description || report.review?.comment || "Tidak ada keterangan."}</p><p className="mt-2 text-[11px] text-[#8B8172]">{formatDate(report.created_at)} · Rating {report.review?.rating ?? "—"}/5 · Pengulas {report.review?.consumer_name || "—"}</p><div className="mt-4 flex flex-wrap gap-3">{[["show", "Tampilkan"], ["hide", "Sembunyikan"], ["delete", "Hapus Review"]].map(([action, label]) => <button className="text-xs font-semibold text-[#29261F] disabled:opacity-40" disabled={Boolean(busyId)} key={action} onClick={() => void moderate(report, action)} type="button">{label}</button>)}</div></article>)}
      </section>
      <PageControls meta={meta} onChange={setPage} page={page} />
    </div>
  );
}

const complaintStatusLabels = {
  open: "Terbuka",
  in_progress: "Ditangani",
  resolved: "Selesai",
};

export function AdminComplaintsApi() {
  const [status, setStatus] = useState("open");
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [mutationError, setMutationError] = useState("");
  const [busyId, setBusyId] = useState("");
  const { data, meta, loading, error, refresh } = usePagedData(getAdminComplaints, { status, page });

  async function update(complaint, nextStatus) {
    const resolutionNote = nextStatus === "resolved"
      ? window.prompt("Catatan penyelesaian (opsional):")?.trim()
      : undefined;
    if (!window.confirm(`Ubah status pengaduan "${complaint.subject}" menjadi ${complaintStatusLabels[nextStatus]}?`)) return;

    setBusyId(complaint.id);
    setFeedback("");
    setMutationError("");
    try {
      await updateAdminComplaint(complaint.id, {
        status: nextStatus,
        ...(resolutionNote ? { resolution_note: resolutionNote } : {}),
      });
      setFeedback("Status pengaduan berhasil diperbarui.");
      await refresh();
    } catch (reason) {
      setMutationError(errorText(reason));
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">Manajemen platform</p>
        <h1 className="mt-1.5 text-[26px] font-bold text-[#29261F] sm:text-[30px]">Pengaduan</h1>
        <p className="mt-2 text-sm text-[#8B8172]">Tinjau keluhan konsumen dan seller, lalu catat penanganannya.</p>
      </header>
      <Feedback error={error || mutationError} message={feedback} />
      <section className={cardClass}>
        <label className="block max-w-sm">
          <span className="text-xs font-semibold text-[#29261F]">Status pengaduan</span>
          <select className={`${fieldClass} mt-2`} onChange={(event) => { setStatus(event.target.value); setPage(1); }} value={status}>
            <option value="">Semua Status</option>
            <option value="open">Terbuka</option>
            <option value="in_progress">Ditangani</option>
            <option value="resolved">Selesai</option>
          </select>
        </label>
      </section>
      <section className="space-y-3" aria-label="Daftar pengaduan">
        <div className="flex flex-wrap justify-between gap-2 text-xs text-[#8B8172]">
          <h2 className="font-bold text-[#29261F]">Pengaduan pengguna</h2>
          <span>{meta.total ?? 0} laporan</span>
        </div>
        {loading ? <p className={cardClass}>Memuat pengaduan…</p> : null}
        {!loading && !error && data.length === 0 ? <p className={`${cardClass} py-8 text-center text-sm text-[#8B8172]`}>Tidak ada pengaduan pada status ini.</p> : null}
        {!loading ? data.map((complaint) => (
          <article className={cardClass} key={complaint.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="break-words text-sm font-bold text-[#29261F]">{complaint.subject}</h3>
                <p className="mt-1 break-all text-[11px] text-[#8B8172]">Pengaduan {complaint.id} · Pengguna {complaint.user_id || "—"} · Pesanan {complaint.order_id || "—"}</p>
              </div>
              <Status>{complaintStatusLabels[complaint.status] || complaint.status}</Status>
            </div>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-[#29261F]">{complaint.description}</p>
            <p className="mt-2 text-[11px] text-[#8B8172]">Dibuat {formatDate(complaint.created_at)}</p>
            {complaint.resolution_note ? <p className="mt-2 rounded-lg bg-[#F8E7A8] px-3 py-2 text-xs text-[#29261F]">Catatan: {complaint.resolution_note}</p> : null}
            {complaint.status !== "resolved" ? (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-[#29261F]/[0.07] pt-3">
                {complaint.status === "open" ? (
                  <button className="min-h-9 rounded-lg border border-[#29261F]/15 px-3 text-xs font-semibold text-[#29261F] disabled:opacity-40" disabled={Boolean(busyId)} onClick={() => void update(complaint, "in_progress")} type="button">
                    {busyId === complaint.id ? "Menyimpan…" : "Mulai Tangani"}
                  </button>
                ) : null}
                <button className="min-h-9 rounded-lg bg-[#F4C542] px-3 text-xs font-semibold text-[#29261F] disabled:opacity-40" disabled={Boolean(busyId)} onClick={() => void update(complaint, "resolved")} type="button">
                  Tandai Selesai
                </button>
              </div>
            ) : null}
          </article>
        )) : null}
      </section>
      <PageControls meta={meta} onChange={setPage} page={page} />
    </div>
  );
}

const settingFields = [
  ["platform_fee_percent", "Biaya Platform (%)", "number"],
  ["payment_expiry_minutes", "Batas Pembayaran (menit)", "number"],
  ["review_edit_window_hours", "Batas Edit Review (jam)", "number"],
  ["max_search_radius_km", "Radius Pencarian Maksimum (km)", "number"],
];
export function AdminSettingsApi() {
  const [settings, setSettings] = useState(null);
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const refresh = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await getAdminSettings();
      const values = response?.data ?? response;
      setSettings(values);
      setDraft(Object.fromEntries(settingFields.map(([key]) => [key, values?.[key] ?? ""])));
    } catch (reason) { setError(errorText(reason)); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => { void refresh(); }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);
  async function save(event) {
    event.preventDefault();
    const payload = Object.fromEntries(settingFields.filter(([key]) => draft[key] !== "").map(([key]) => [key, Number(draft[key])]));
    setBusy(true); setError(""); setFeedback("");
    try { const updated = await updateAdminSettings(payload); const value = updated?.data ?? updated; setSettings(value); setDraft(Object.fromEntries(settingFields.map(([key]) => [key, value?.[key] ?? ""]))); setFeedback("Pengaturan platform berhasil disimpan."); }
    catch (reason) { setError(errorText(reason)); }
    finally { setBusy(false); }
  }
  return (
    <div className="space-y-6">
      <header><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">Konfigurasi platform</p><h1 className="mt-1.5 text-[26px] font-bold text-[#29261F] sm:text-[30px]">Pengaturan</h1><p className="mt-2 text-sm text-[#8B8172]">Pengaturan yang didukung backend; profil, password, notifikasi, dan tema tidak disimpan oleh endpoint ini.</p></header>
      <Feedback error={error} message={feedback} />
      <form className={`${cardClass} max-w-3xl space-y-5`} onSubmit={save}><div><h2 className="text-base font-bold text-[#29261F]">Pengaturan Platform</h2><p className="mt-1 text-xs text-[#8B8172]">Nilai saat ini dari API Admin.</p></div>{loading ? <p>Memuat pengaturan…</p> : draft ? <>{settingFields.map(([key, label]) => <label className="block text-xs font-semibold text-[#29261F]" key={key}>{label}<input className={`${fieldClass} mt-2`} min="0" step="any" type="number" value={draft[key]} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} /></label>)}<button className="min-h-11 rounded-lg bg-[#FFF9EF] px-5 text-sm font-semibold text-white disabled:opacity-50" disabled={busy} type="submit">{busy ? "Menyimpan…" : "Simpan Pengaturan"}</button></> : null}</form>
    </div>
  );
}
