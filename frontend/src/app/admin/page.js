import Link from "next/link";

const summaryCards = [
  { label: "Total Users", value: "1.248", detail: "+18 pengguna hari ini", mark: "U", tone: "bg-[#e7edda] text-[#536738]" },
  { label: "Total UMKM", value: "86", detail: "+4 UMKM minggu ini", mark: "T", tone: "bg-[#f8e5c9] text-[#8b5924]" },
  { label: "Produk Aktif", value: "324", detail: "Produk tersedia di platform", mark: "P", tone: "bg-[#dce9e7] text-[#3c6861]" },
  { label: "Total Pesanan", value: "2.156", detail: "64 pesanan hari ini", mark: "O", tone: "bg-[#f3dddd] text-[#9b5148]" },
  { label: "Pesanan Selesai", value: "1.892", detail: "87,8% dari total pesanan", mark: "✓", tone: "bg-[#e7edda] text-[#536738]" },
  { label: "Total Transaksi", value: "Rp24,8 jt", detail: "Akumulasi data contoh", mark: "Rp", tone: "bg-[#eee8f3] text-[#725b84]" },
];

const activities = [
  { label: "User baru hari ini", value: "18", mark: "U", tone: "bg-[#e7edda] text-[#536738]" },
  { label: "UMKM baru minggu ini", value: "4", mark: "T", tone: "bg-[#f8e5c9] text-[#8b5924]" },
  { label: "Produk ditambahkan hari ini", value: "27", mark: "P", tone: "bg-[#dce9e7] text-[#3c6861]" },
  { label: "Pesanan hari ini", value: "64", mark: "O", tone: "bg-[#f3dddd] text-[#9b5148]" },
];

const orderStatuses = [
  { label: "Menunggu Pembayaran", count: 12, tone: "bg-[#d79a53]" },
  { label: "Diproses", count: 18, tone: "bg-[#57857a]" },
  { label: "Siap Diambil", count: 9, tone: "bg-[#71854a]" },
  { label: "Selesai", count: 112, tone: "bg-[#91a85d]" },
  { label: "Dibatalkan", count: 5, tone: "bg-[#c75c49]" },
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
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8b927f]">{eyebrow}</p>
        <h2 className="mt-1.5 text-lg font-bold tracking-[-0.02em] text-[#202a1e]">{title}</h2>
      </div>
      {action ? <span className="text-xs font-semibold text-[#68754b]">{action}</span> : null}
    </div>
  );
}

function StatusBadge({ status }) {
  const style =
    status === "Buka" || status === "Selesai" || status === "Aktif"
      ? "bg-[#e9eedf] text-[#637844]"
      : status === "Tutup" || status === "Dibatalkan"
        ? "bg-[#f5dfd8] text-[#a34d3e]"
        : status === "Siap Diambil"
          ? "bg-[#edf0dc] text-[#637844]"
          : status === "Diproses"
            ? "bg-[#dce9e7] text-[#3c6861]"
            : status === "Segera berakhir"
              ? "bg-[#f8e9d4] text-[#94621f]"
              : "bg-[#f8e9d4] text-[#94621f]";

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
          <article className="rounded-lg border border-[#202a1e]/[0.06] bg-[#fdfdf9] p-3.5" key={transaction.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#30392c]">{transaction.id}</p>
                <p className="mt-1 break-words text-sm font-semibold leading-5 text-[#30392c]">{transaction.product}</p>
                <p className="mt-1 text-xs text-[#858c7d]">{transaction.store} · {transaction.time}</p>
              </div>
              <StatusBadge status={transaction.status} />
            </div>
            <p className="mt-3 border-t border-[#202a1e]/[0.06] pt-3 text-sm font-bold text-[#202a1e]">
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
          <thead className="border-b border-[#202a1e]/[0.07] bg-[#f8f9f4]">
            <tr className="text-[11px] font-semibold text-[#727a6d]">
              <th className="px-3 py-3">ID Pesanan</th>
              <th className="px-3 py-3">Produk</th>
              <th className="px-3 py-3">UMKM</th>
              <th className="px-3 py-3">Total</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#202a1e]/[0.07]">
            {transactions.map((transaction) => (
              <tr className="text-xs text-[#30392c]" key={transaction.id}>
                <td className="px-3 py-3.5 font-bold">{transaction.id}</td>
                <td className="break-words px-3 py-3.5 font-medium leading-5">{transaction.product}</td>
                <td className="break-words px-3 py-3.5">{transaction.store}</td>
                <td className="px-3 py-3.5 font-semibold">{formatPrice(transaction.total)}</td>
                <td className="px-3 py-3.5"><StatusBadge status={transaction.status} /></td>
                <td className="px-3 py-3.5 text-[#727a6d]">{transaction.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function AdminDashboard() {
  const maximumOrders = Math.max(...orderStatuses.map((item) => item.count));

  return (
    <div className="space-y-6 sm:space-y-7">
      <section className="relative overflow-hidden rounded-2xl bg-[#e6edcf] px-5 py-6 sm:px-7 sm:py-7">
        <div className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full border-[26px] border-white/25" />
        <div className="pointer-events-none absolute -bottom-24 right-28 h-40 w-40 rounded-full border-[20px] border-[#cad79f]/35" />
        <div className="relative">
          <p className="text-xs font-semibold text-[#69794a]">Ringkasan platform</p>
          <h1 className="mt-2 text-[25px] font-bold leading-tight tracking-[-0.035em] text-[#202a1e] sm:text-[30px]">
            Dashboard Admin
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5c6849]">
            Pantau aktivitas pengguna, UMKM, produk, dan pesanan ReMeal dari satu tempat.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#87935e]/20 bg-white/60 px-3 py-2 text-[11px] font-semibold text-[#596745]">
            <span className="h-2 w-2 rounded-full bg-[#d79a53]" />
            Data contoh untuk pratinjau
          </span>
        </div>
      </section>

      <section aria-label="Ringkasan platform" className="grid grid-cols-2 gap-3 xl:grid-cols-3 2xl:grid-cols-6">
        {summaryCards.map((card) => (
          <article className="min-w-0 rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4 sm:p-5" key={card.label}>
            <div className="flex items-start justify-between gap-2">
              <p className="min-h-8 text-xs font-medium leading-4 text-[#727a6d]">{card.label}</p>
              <span className={`grid h-8 min-w-8 shrink-0 place-items-center rounded-lg px-1.5 text-xs font-bold ${card.tone}`}>
                {card.mark}
              </span>
            </div>
            <p className="mt-3 break-words text-[23px] font-bold leading-none tracking-[-0.04em] text-[#202a1e] sm:text-[26px]">
              {card.value}
            </p>
            <p className="mt-2.5 break-words text-[10px] leading-4 text-[#8b927f]">{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4 sm:p-5">
          <SectionHeading eyebrow="Aktivitas terbaru" title="Aktivitas Platform" action="Hari ini" />
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {activities.map((activity) => (
              <div className="flex items-center gap-3 rounded-lg bg-[#f8f9f4] p-3.5" key={activity.label}>
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-xs font-bold ${activity.tone}`}>
                  {activity.mark}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] leading-4 text-[#858c7d]">{activity.label}</p>
                  <p className="mt-1 text-xl font-bold leading-none text-[#202a1e]">{activity.value}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4 sm:p-5">
          <SectionHeading eyebrow="Operasional" title="Status Pesanan" action="156 pesanan" />
          <div className="mt-5 space-y-4">
            {orderStatuses.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 break-words text-xs font-medium text-[#596745]">{item.label}</p>
                  <p className="shrink-0 text-xs font-bold text-[#30392c]">{item.count}</p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eceee7]">
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
        <article className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4 sm:p-5">
          <SectionHeading eyebrow="Performa seller" title="UMKM Teratas" action="Berdasarkan transaksi" />
          <div className="mt-4 divide-y divide-[#202a1e]/[0.07]">
            {topStores.map((store, index) => (
              <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0" key={store.name}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#f0f2e9] text-xs font-bold text-[#71854a]">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#30392c]">{store.name}</p>
                  <p className="mt-1 text-[11px] text-[#858c7d]">{store.transactions} transaksi</p>
                </div>
                <StatusBadge status={store.status} />
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4 sm:p-5">
          <SectionHeading eyebrow="Pantau listing" title="Produk Segera Berakhir" action="3 produk" />
          <div className="mt-4 space-y-3">
            {expiringProducts.map((product) => (
              <div className="rounded-lg border border-[#202a1e]/[0.06] bg-[#fdfdf9] p-3.5" key={product.name}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold leading-5 text-[#30392c]">{product.name}</p>
                    <p className="mt-1 text-xs text-[#858c7d]">{product.store} · Stok {product.stock}</p>
                  </div>
                  <StatusBadge status={product.status} />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#202a1e]/[0.06] pt-3">
                  <p className="text-xs font-semibold text-[#596745]">{formatPrice(product.price)}</p>
                  <p className="text-[11px] text-[#94621f]">{product.time}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4 sm:p-5">
        <div className="mb-4">
          <SectionHeading eyebrow="Aktivitas transaksi" title="Transaksi Terbaru" action="4 transaksi contoh" />
        </div>
        <TransactionsTable />
      </section>

      <section className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4 sm:p-5">
        <SectionHeading eyebrow="Akses cepat" title="Quick Actions" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              className="flex min-h-12 min-w-0 items-center gap-2.5 rounded-lg border border-[#202a1e]/[0.08] bg-white px-3 py-3 text-xs font-semibold text-[#596745] transition hover:border-[#aebc8e] hover:bg-[#f8f9f4] sm:px-4 sm:text-sm"
              href={action.href}
              key={action.href}
              prefetch={false}
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#e9eedf] text-[10px] font-bold text-[#637844]">
                {action.mark}
              </span>
              <span className="break-words">{action.label}</span>
            </Link>
          ))}
        </div>
        <p className="mt-3 text-[10px] leading-4 text-[#9aa092]">
          Halaman pengelolaan lainnya belum dibuat pada tahap ini.
        </p>
      </section>

      <p className="pb-1 text-center text-[10px] text-[#9aa092]">
        Seluruh metrik dan aktivitas di dashboard ini merupakan data contoh, bukan data produksi.
      </p>
    </div>
  );
}
