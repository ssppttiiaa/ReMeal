import Link from "next/link";
import { ADMIN_DEV_MODE } from "../../lib/adminDevMode";
import { AdminDashboardApi } from "./_components/AdminApiViews";

const summaryCards = [
  { label: "Total Users", value: "1.248", detail: "+18 pengguna hari ini", mark: "U", tone: "bg-[#F4C542] text-[#29261F]" },
  { label: "Total UMKM", value: "86", detail: "+4 UMKM minggu ini", mark: "T", tone: "bg-[#F8E7A8] text-[#29261F]" },
  { label: "Produk Aktif", value: "324", detail: "Produk tersedia di platform", mark: "P", tone: "bg-[#E89B3C] text-[#29261F]" },
  { label: "Total Pesanan", value: "2.156", detail: "64 pesanan hari ini", mark: "O", tone: "bg-[#FFF9EF] text-[#29261F]" },
  { label: "Pesanan Selesai", value: "1.892", detail: "87,8% dari total pesanan", mark: "✓", tone: "bg-[#F4C542] text-[#29261F]" },
  { label: "Total Transaksi", value: "Rp24,8 jt", detail: "Akumulasi data contoh", mark: "Rp", tone: "bg-[#F8E7A8] text-[#29261F]" },
];

const activities = [
  { label: "User baru hari ini", value: "18", mark: "U", tone: "bg-[#F4C542] text-[#29261F]" },
  { label: "UMKM baru minggu ini", value: "4", mark: "T", tone: "bg-[#F8E7A8] text-[#29261F]" },
  { label: "Produk ditambahkan hari ini", value: "27", mark: "P", tone: "bg-[#E89B3C] text-[#29261F]" },
  { label: "Pesanan hari ini", value: "64", mark: "O", tone: "bg-[#FFF9EF] text-[#29261F]" },
];

const orderStatuses = [
  { label: "Menunggu Pembayaran", count: 12, tone: "bg-[#E89B3C]" },
  { label: "Diproses", count: 18, tone: "bg-[#E89B3C]" },
  { label: "Siap Diambil", count: 9, tone: "bg-[#F4C542]" },
  { label: "Selesai", count: 112, tone: "bg-[#F4C542]" },
  { label: "Dibatalkan", count: 5, tone: "bg-[#E89B3C]" },
];

const topStores = [
  { name: "Roti & Rasa", transactions: 245, status: "Buka" },
  { name: "Dapur Mbak Sari", transactions: 198, status: "Buka" },
  { name: "Kopi Senja", transactions: 176, status: "Tutup" },
  { name: "Kedai Nusantara", transactions: 154, status: "Buka" },
  { name: "Manis Bakery", transactions: 139, status: "Buka" },
];

const expiringProducts = [
  { name: "Roti Cokelat", store: "Roti & Rasa", stock: 8, price: 8000, time: "30 menit lagi", status: "Segera berakhir" },
  { name: "Rice Bowl Ayam Teriyaki", store: "Dapur Mbak Sari", stock: 4, price: 21000, time: "45 menit lagi", status: "Segera berakhir" },
  { name: "Es Kopi Susu Gula Aren", store: "Kopi Senja", stock: 6, price: 15000, time: "1 jam lagi", status: "Aktif" },
];

const transactions = [
  { id: "RM-1024", product: "Roti Cokelat", store: "Roti & Rasa", total: 16000, status: "Selesai", time: "14:20" },
  { id: "RM-1023", product: "Rice Bowl Ayam Teriyaki", store: "Dapur Mbak Sari", total: 21000, status: "Siap Diambil", time: "14:05" },
  { id: "RM-1022", product: "Brownies Cokelat", store: "Manis Bakery", total: 38000, status: "Diproses", time: "13:42" },
  { id: "RM-1021", product: "Es Kopi Susu Gula Aren", store: "Kopi Senja", total: 15000, status: "Menunggu Pembayaran", time: "13:30" },
];

const quickActions = [
  { label: "Kelola Users", href: "/admin/users", mark: "U" },
  { label: "Kelola UMKM", href: "/admin/stores", mark: "T" },
  { label: "Kelola Categories", href: "/admin/categories", mark: "C" },
  { label: "Kelola Pesanan", href: "/admin/orders", mark: "O" },
  { label: "Kelola Pengaduan", href: "/admin/complaints", mark: "!" },
];

function formatPrice(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">{eyebrow}</p>
        <h2 className="mt-1.5 text-lg font-bold tracking-[-0.02em] text-[#29261F]">{title}</h2>
      </div>
      {action ? <span className="text-xs font-semibold text-[#29261F]">{action}</span> : null}
    </div>
  );
}

function StatusBadge({ status }) {
  const style =
    status === "Buka" || status === "Selesai" || status === "Aktif"
      ? "bg-[#F4C542] text-[#29261F]"
      : status === "Tutup" || status === "Dibatalkan"
        ? "bg-[#29261F] text-white"
        : status === "Siap Diambil"
          ? "bg-[#F4C542] text-[#29261F]"
          : status === "Diproses"
            ? "bg-[#E89B3C] text-[#29261F]"
            : status === "Segera berakhir"
              ? "bg-[#F8E7A8] text-[#29261F]"
              : "bg-[#F8E7A8] text-[#29261F]";

  return (
    <span className={`inline-flex w-fit whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${style}`}>
      {status}
    </span>
  );
}

function TransactionsTable() {
  return (
    <>
      <div className="space-y-3 lg:hidden">
        {transactions.map((transaction) => (
          <article className="rounded-lg border border-[#29261F]/[0.06] bg-[#F7F1E7] p-3.5" key={transaction.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#29261F]">{transaction.id}</p>
                <p className="mt-1 break-words text-sm font-semibold leading-5 text-[#29261F]">{transaction.product}</p>
                <p className="mt-1 text-xs text-[#8B8172]">{transaction.store} · {transaction.time}</p>
              </div>
              <StatusBadge status={transaction.status} />
            </div>
            <p className="mt-3 border-t border-[#29261F]/[0.06] pt-3 text-sm font-bold text-[#29261F]">
              {formatPrice(transaction.total)}
            </p>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[850px] table-fixed text-left">
          <colgroup>
            <col className="w-[12%]" />
            <col className="w-[23%]" />
            <col className="w-[19%]" />
            <col className="w-[15%]" />
            <col className="w-[21%]" />
            <col className="w-[10%]" />
          </colgroup>
          <thead className="border-b border-[#29261F]/[0.07] bg-[#F7F1E7]">
            <tr className="text-[11px] font-semibold text-[#8B8172]">
              <th className="px-3 py-3">ID Pesanan</th>
              <th className="px-3 py-3">Produk</th>
              <th className="px-3 py-3">UMKM</th>
              <th className="px-3 py-3">Total</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#29261f]/[0.07]">
            {transactions.map((transaction) => (
              <tr className="text-xs text-[#29261F]" key={transaction.id}>
                <td className="px-3 py-3.5 font-bold">{transaction.id}</td>
                <td className="break-words px-3 py-3.5 font-medium leading-5">{transaction.product}</td>
                <td className="break-words px-3 py-3.5">{transaction.store}</td>
                <td className="px-3 py-3.5 font-semibold">{formatPrice(transaction.total)}</td>
                <td className="px-3 py-3.5"><StatusBadge status={transaction.status} /></td>
                <td className="px-3 py-3.5 text-[#8B8172]">{transaction.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AdminDashboardMock() {
  const maximumOrders = Math.max(...orderStatuses.map((item) => item.count));

  return (
    <div className="space-y-6 sm:space-y-7">
      <section className="relative overflow-hidden rounded-2xl bg-[#F4C542] px-5 py-6 sm:px-7 sm:py-7">
        <div className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full border-[26px] border-white/25" />
        <div className="pointer-events-none absolute -bottom-24 right-28 h-40 w-40 rounded-full border-[20px] border-[#29261F]/35" />
        <div className="relative">
          <p className="text-xs font-semibold text-[#29261F]">Ringkasan platform</p>
          <h1 className="mt-2 text-[25px] font-bold leading-tight tracking-[-0.035em] text-[#29261F] sm:text-[30px]">
            Dashboard Admin
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#29261F]">
            Pantau aktivitas pengguna, UMKM, produk, dan pesanan ReMeal dari satu tempat.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#29261F]/20 bg-white/60 px-3 py-2 text-[11px] font-semibold text-[#29261F]">
            <span className="h-2 w-2 rounded-full bg-[#E89B3C]" />
            Data contoh untuk pratinjau
          </span>
        </div>
      </section>

      <section aria-label="Ringkasan platform" className="grid grid-cols-2 gap-3 xl:grid-cols-3 2xl:grid-cols-6">
        {summaryCards.map((card) => (
          <article className="min-w-0 rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-5" key={card.label}>
            <div className="flex items-start justify-between gap-2">
              <p className="min-h-8 text-xs font-medium leading-4 text-[#8B8172]">{card.label}</p>
              <span className={`grid h-8 min-w-8 shrink-0 place-items-center rounded-lg px-1.5 text-xs font-bold ${card.tone}`}>
                {card.mark}
              </span>
            </div>
            <p className="mt-3 break-words text-[23px] font-bold leading-none tracking-[-0.04em] text-[#29261F] sm:text-[26px]">
              {card.value}
            </p>
            <p className="mt-2.5 break-words text-[10px] leading-4 text-[#8B8172]">{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-5">
          <SectionHeading eyebrow="Aktivitas terbaru" title="Aktivitas Platform" action="Hari ini" />
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {activities.map((activity) => (
              <div className="flex items-center gap-3 rounded-lg bg-[#F7F1E7] p-3.5" key={activity.label}>
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-xs font-bold ${activity.tone}`}>
                  {activity.mark}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] leading-4 text-[#8B8172]">{activity.label}</p>
                  <p className="mt-1 text-xl font-bold leading-none text-[#29261F]">{activity.value}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-5">
          <SectionHeading eyebrow="Operasional" title="Status Pesanan" action="156 pesanan" />
          <div className="mt-5 space-y-4">
            {orderStatuses.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 break-words text-xs font-medium text-[#29261F]">{item.label}</p>
                  <p className="shrink-0 text-xs font-bold text-[#29261F]">{item.count}</p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F7F1E7]">
                  <div
                    className={`h-full rounded-full ${item.tone}`}
                    style={{ width: `${(item.count / maximumOrders) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-5">
          <SectionHeading eyebrow="Performa seller" title="UMKM Teratas" action="Berdasarkan transaksi" />
          <div className="mt-4 divide-y divide-[#29261f]/[0.07]">
            {topStores.map((store, index) => (
              <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0" key={store.name}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#F7F1E7] text-xs font-bold text-[#29261F]">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#29261F]">{store.name}</p>
                  <p className="mt-1 text-[11px] text-[#8B8172]">{store.transactions} transaksi</p>
                </div>
                <StatusBadge status={store.status} />
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-5">
          <SectionHeading eyebrow="Pantau listing" title="Produk Segera Berakhir" action="3 produk" />
          <div className="mt-4 space-y-3">
            {expiringProducts.map((product) => (
              <div className="rounded-lg border border-[#29261F]/[0.06] bg-[#F7F1E7] p-3.5" key={product.name}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold leading-5 text-[#29261F]">{product.name}</p>
                    <p className="mt-1 text-xs text-[#8B8172]">{product.store} · Stok {product.stock}</p>
                  </div>
                  <StatusBadge status={product.status} />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#29261F]/[0.06] pt-3">
                  <p className="text-xs font-semibold text-[#29261F]">{formatPrice(product.price)}</p>
                  <p className="text-[11px] text-[#29261F]">{product.time}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-5">
        <div className="mb-4">
          <SectionHeading eyebrow="Aktivitas transaksi" title="Transaksi Terbaru" action="4 transaksi contoh" />
        </div>
        <TransactionsTable />
      </section>

      <section className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-5">
        <SectionHeading eyebrow="Akses cepat" title="Quick Actions" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              className="flex min-h-12 min-w-0 items-center gap-2.5 rounded-lg border border-[#29261F]/[0.08] bg-white px-3 py-3 text-xs font-semibold text-[#29261F] transition hover:border-[#29261F] hover:bg-[#F7F1E7] sm:px-4 sm:text-sm"
              href={action.href}
              key={action.href}
              prefetch={false}
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#F4C542] text-[10px] font-bold text-[#29261F]">
                {action.mark}
              </span>
              <span className="break-words">{action.label}</span>
            </Link>
          ))}
        </div>
        <p className="mt-3 text-[10px] leading-4 text-[#8B8172]">
          Halaman pengelolaan lainnya belum dibuat pada tahap ini.
        </p>
      </section>

      <p className="pb-1 text-center text-[10px] text-[#8B8172]">
        Seluruh metrik dan aktivitas di dashboard ini merupakan data contoh, bukan data produksi.
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  return ADMIN_DEV_MODE ? <AdminDashboardMock /> : <AdminDashboardApi />;
}
