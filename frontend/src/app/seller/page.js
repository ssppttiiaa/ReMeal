const statistics = [
  {
    label: "Total produk",
    value: "18",
    detail: "4 produk baru bulan ini",
    mark: "P",
    tone: "bg-[#e7edda] text-[#536738]",
  },
  {
    label: "Produk tersedia",
    value: "12",
    detail: "2 segera berakhir",
    mark: "T",
    tone: "bg-[#f8e5c9] text-[#8b5924]",
  },
  {
    label: "Pesanan masuk",
    value: "8",
    detail: "3 perlu dikonfirmasi",
    mark: "↗",
    tone: "bg-[#dce9e7] text-[#3c6861]",
  },
  {
    label: "Pendapatan hari ini",
    value: "Rp1.248.000",
    detail: "+12% dari kemarin",
    mark: "Rp",
    tone: "bg-[#f3dddd] text-[#9b5148]",
  },
];

const expiringProducts = [
  { name: "Nasi ayam bumbu rujak", category: "Menu utama", stock: 4, time: "17 menit lagi", urgency: "high" },
  { name: "Roti sobek cokelat", category: "Roti & kue", stock: 6, time: "34 menit lagi", urgency: "medium" },
  { name: "Es kopi gula aren", category: "Minuman", stock: 3, time: "52 menit lagi", urgency: "low" },
];

const stockReminders = [
  { name: "Nasi ayam bumbu rujak", stock: "2 porsi tersisa", level: 20 },
  { name: "Paket sarapan komplit", stock: "3 porsi tersisa", level: 35 },
];

const salesBars = [28, 42, 35, 62, 48, 78, 57];
const weekdays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

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

export default function SellerDashboard() {
  return (
    <div className="space-y-7 sm:space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-[#e6edcf] px-5 py-6 sm:px-8 sm:py-7">
        <div className="pointer-events-none absolute -right-8 -top-16 h-52 w-52 rounded-full border-[28px] border-white/25" />
        <div className="pointer-events-none absolute -bottom-24 right-28 h-48 w-48 rounded-full border-[22px] border-[#cad79f]/35" />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold text-[#69794a]">Jumat, 2 Oktober 2026</p>
            <h1 className="mt-2 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#202a1e] sm:text-[32px]">
              Selamat pagi, Dina <span aria-hidden="true">☀</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#5c6849]">
              Ada beberapa makanan yang siap menemukan pemilik baru hari ini.
            </p>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-full border border-[#87935e]/20 bg-white/60 px-3 py-2 text-xs font-semibold text-[#596745]">
            <span className="h-2 w-2 rounded-full bg-[#77a45b]" />
            Toko beroperasi
          </div>
        </div>
      </section>

      <section aria-label="Ringkasan toko" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((statistic) => (
          <article
            className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4 sm:p-5"
            key={statistic.label}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-[#727a6d]">{statistic.label}</p>
              <span className={`grid h-8 min-w-8 place-items-center rounded-lg px-1.5 text-xs font-bold ${statistic.tone}`}>
                {statistic.mark}
              </span>
            </div>
            <p className="mt-4 text-[26px] font-bold leading-none tracking-[-0.04em] text-[#202a1e]">
              {statistic.value}
            </p>
            <p className="mt-2.5 text-[11px] font-medium text-[#8b927f]">{statistic.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
        <article className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-5 sm:p-6">
          <SectionHeading eyebrow="Performa toko" title="Ringkasan penjualan" action="7 hari terakhir" />
          <div className="mt-7 flex h-32 items-end justify-between gap-3 border-b border-[#202a1e]/[0.08] px-1">
            {salesBars.map((height, index) => (
              <div className="flex h-full flex-1 items-end justify-center" key={weekdays[index]}>
                <div
                  aria-label={`${weekdays[index]}: ${height} persen`}
                  className={`w-full max-w-10 rounded-t-md ${index === 5 ? "bg-[#71854a]" : "bg-[#d8e2bf]"}`}
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-3 px-1">
            {weekdays.map((weekday) => (
              <span className="flex-1 text-center text-[10px] text-[#92988a]" key={weekday}>
                {weekday}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] text-[#858c7d]">Total penjualan minggu ini</p>
              <p className="mt-1 text-xl font-bold tracking-[-0.03em]">Rp6.420.000</p>
            </div>
            <span className="rounded-full bg-[#edf3df] px-2.5 py-1.5 text-[11px] font-semibold text-[#5c7541]">
              +8,4% minggu lalu
            </span>
          </div>
        </article>

        <article className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-5 sm:p-6">
          <SectionHeading eyebrow="Perlu perhatian" title="Pengingat stok" action="2 produk" />
          <div className="mt-5 divide-y divide-[#202a1e]/[0.07]">
            {stockReminders.map((item) => (
              <div className="py-4 first:pt-0 last:pb-0" key={item.name}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#30392c]">{item.name}</p>
                    <p className="mt-1 text-xs text-[#858c7d]">{item.stock}</p>
                  </div>
                  <span className="rounded-md bg-[#f8e5c9] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8b5924]">
                    Menipis
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eceee7]">
                  <div className="h-full rounded-full bg-[#d79a53]" style={{ width: `${item.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-5 sm:p-6">
        <SectionHeading eyebrow="Pantau waktu" title="Produk segera berakhir" action="Hari ini" />
        <div className="mt-5 divide-y divide-[#202a1e]/[0.07]">
          {expiringProducts.map((product) => (
            <article className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center" key={product.name}>
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#f0eadb] text-sm font-bold text-[#80633b]">
                {product.name.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#30392c]">{product.name}</p>
                <p className="mt-1 text-xs text-[#858c7d]">{product.category} · Stok {product.stock}</p>
              </div>
              <span
                className={`w-fit rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${
                  product.urgency === "high"
                    ? "bg-[#f5dfd8] text-[#a34d3e]"
                    : product.urgency === "medium"
                      ? "bg-[#f8e9d4] text-[#94621f]"
                      : "bg-[#e9eedf] text-[#637844]"
                }`}
              >
                {product.time}
              </span>
            </article>
          ))}
        </div>
      </section>

      <p className="pb-2 text-center text-[10px] text-[#9aa092]">Data contoh untuk pratinjau dashboard</p>
    </div>
  );
}