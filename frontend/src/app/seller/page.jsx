"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { apiRequest, formatRupiah } from "../../lib/consumer-api";
import { getMyStore } from "../../services/stores";

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

export default function SellerDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [stockReminders, setStockReminders] = useState([]);
  const [storeStatus, setStoreStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUserName(session.user.user_metadata?.full_name || session.user.email);
        }
        
        const token = session?.access_token;
        if (!token) return;

        let sStatus = null;
        try {
          const store = await getMyStore();
          sStatus = store?.verification_status;
        } catch (e) {
          // Store doesn't exist
        }
        if (active) setStoreStatus(sStatus);

        const [dashboardRes, stockRes] = await Promise.all([
          apiRequest("/seller/dashboard", { token }),
          apiRequest("/seller/stock-reminders", { token })
        ]);

        if (active) {
          setDashboardData(dashboardRes?.[0] || dashboardRes || {});
          setStockReminders(stockRes?.data || stockRes || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  const statistics = [
    {
      label: "Total produk",
      value: dashboardData?.total_products || "0",
      detail: `${dashboardData?.new_products || 0} produk baru`,
      mark: "P",
      tone: "bg-[#F4C542] text-[#29261F]",
    },
    {
      label: "Produk tersedia",
      value: dashboardData?.available_products || "0",
      detail: `${dashboardData?.expiring_products || 0} segera berakhir`,
      mark: "T",
      tone: "bg-[#F8E7A8] text-[#29261F]",
    },
    {
      label: "Pesanan masuk",
      value: dashboardData?.total_orders || "0",
      detail: `${dashboardData?.pending_orders || 0} perlu dikonfirmasi`,
      mark: "↗",
      tone: "bg-[#E89B3C] text-[#29261F]",
    },
    {
      label: "Pendapatan",
      value: formatRupiah(dashboardData?.total_revenue || 0),
      detail: "Bulan ini",
      mark: "Rp",
      tone: "bg-[#FFF9EF] text-[#29261F]",
    },
  ];

  const expiringProducts = dashboardData?.expiring_items || [];
  const salesBars = dashboardData?.sales_chart || [0, 0, 0, 0, 0, 0, 0];
  const weekdays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-7 sm:space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-[#F4C542] px-5 py-6 sm:px-8 sm:py-7">
        <div className="pointer-events-none absolute -right-8 -top-16 h-52 w-52 rounded-full border-[28px] border-white/25" />
        <div className="pointer-events-none absolute -bottom-24 right-28 h-48 w-48 rounded-full border-[22px] border-[#29261F]/35" />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold text-[#29261F]">{today}</p>
            <h1 className="mt-2 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#29261F] sm:text-[32px]">
              Selamat datang, {userName.split(' ')[0] || 'Seller'} <span aria-hidden="true">☀</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#29261F]">
              {!storeStatus && !loading ? "Anda belum membuat toko. Silakan buat toko terlebih dahulu." : storeStatus === "pending" ? "Toko Anda sedang menunggu konfirmasi dari Admin." : "Kelola produk dan pesanan toko Anda dari panel ini."}
            </p>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-full border border-[#29261F]/20 bg-white/60 px-3 py-2 text-xs font-semibold text-[#29261F]">
            <span className={`h-2 w-2 rounded-full ${storeStatus === "approved" ? "bg-[#F4C542]" : storeStatus === "pending" ? "bg-blue-500" : "bg-red-500"}`} />
            {storeStatus === "approved" ? "Toko beroperasi" : storeStatus === "pending" ? "Menunggu Verifikasi" : "Toko belum ada"}
          </div>
        </div>
      </section>

      {!storeStatus && !loading && (
        <section className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-5 sm:p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
          <h2 className="text-xl font-bold text-[#29261F] mb-2">Lengkapi Profil Usaha Anda</h2>
          <p className="text-sm text-[#8B8172] mb-6 max-w-md">
            Untuk mulai menggunakan fitur dashboard, mengelola produk, dan menerima pesanan, Anda harus melengkapi informasi toko terlebih dahulu.
          </p>
          <a
            href="/seller/store"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#F4C542] px-6 text-sm font-bold text-[#29261F] transition hover:bg-[#E89B3C]"
          >
            Buat Toko Sekarang
          </a>
        </section>
      )}

      {storeStatus === "pending" && !loading && (
        <section className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-5 sm:p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
          <h2 className="text-xl font-bold text-[#29261F] mb-2">Toko Anda Sedang Diverifikasi</h2>
          <p className="text-sm text-[#8B8172] mb-6 max-w-md">
            Toko Anda telah berhasil didaftarkan dan saat ini sedang menunggu persetujuan dari Admin. Anda akan bisa mengelola produk dan pesanan setelah toko disetujui.
          </p>
          <a
            href="/seller/store"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white border border-[#29261F]/10 px-6 text-sm font-bold text-[#29261F] transition hover:bg-black/5"
          >
            Lihat Profil Toko
          </a>
        </section>
      )}

      {storeStatus === "approved" && dashboardData && (
        <>
          <section aria-label="Ringkasan toko" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((statistic) => (
          <article
            className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-5"
            key={statistic.label}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-[#8B8172]">{statistic.label}</p>
              <span className={`grid h-8 min-w-8 place-items-center rounded-lg px-1.5 text-xs font-bold ${statistic.tone}`}>
                {statistic.mark}
              </span>
            </div>
            <p className="mt-4 text-[26px] font-bold leading-none tracking-[-0.04em] text-[#29261F]">
              {loading ? "..." : statistic.value}
            </p>
            <p className="mt-2.5 text-[11px] font-medium text-[#8B8172]">{statistic.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
        <article className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-5 sm:p-6">
          <SectionHeading eyebrow="Performa toko" title="Ringkasan penjualan" action="7 hari terakhir" />
          <div className="mt-7 flex h-32 items-end justify-between gap-3 border-b border-[#29261F]/[0.08] px-1">
            {salesBars.map((height, index) => (
              <div className="flex h-full flex-1 items-end justify-center" key={weekdays[index]}>
                <div
                  aria-label={`${weekdays[index]}: ${height} persen`}
                  className={`w-full max-w-10 rounded-t-md ${index === 5 ? "bg-[#F4C542]" : "bg-[#F8E7A8]"}`}
                  style={{ height: loading ? 0 : `${height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-3 px-1">
            {weekdays.map((weekday) => (
              <span className="flex-1 text-center text-[10px] text-[#8B8172]" key={weekday}>
                {weekday}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] text-[#8B8172]">Total penjualan minggu ini</p>
              <p className="mt-1 text-xl font-bold tracking-[-0.03em]">{loading ? "..." : formatRupiah(dashboardData?.weekly_revenue || 0)}</p>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-5 sm:p-6">
          <SectionHeading eyebrow="Perlu perhatian" title="Pengingat stok" action={`${stockReminders.length} produk`} />
          <div className="mt-5 divide-y divide-[#29261f]/[0.07]">
            {stockReminders.length === 0 && !loading && (
              <p className="text-sm text-[#8B8172] text-center py-4">Semua stok produk aman.</p>
            )}
            {stockReminders.map((item) => (
              <div className="py-4 first:pt-0 last:pb-0" key={item.id || item.name}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#29261F]">{item.name}</p>
                    <p className="mt-1 text-xs text-[#8B8172]">{item.stock} porsi tersisa</p>
                  </div>
                  <span className="rounded-md bg-[#F8E7A8] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#29261F]">
                    Menipis
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#F7F1E7]">
                  <div className="h-full rounded-full bg-[#E89B3C]" style={{ width: `${Math.min((item.stock / 10) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-5 sm:p-6">
        <SectionHeading eyebrow="Pantau waktu" title="Produk segera berakhir" action="Hari ini" />
        <div className="mt-5 divide-y divide-[#29261f]/[0.07]">
          {expiringProducts.length === 0 && !loading && (
            <p className="text-sm text-[#8B8172] text-center py-4">Tidak ada produk yang akan segera kedaluwarsa hari ini.</p>
          )}
          {expiringProducts.map((product) => (
            <article className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center" key={product.id || product.name}>
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#F8E7A8] text-sm font-bold text-[#29261F]">
                {product.name.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#29261F]">{product.name}</p>
                <p className="mt-1 text-xs text-[#8B8172]">{product.category?.name || 'Produk'} · Stok {product.stock}</p>
              </div>
              <span
                className={`w-fit rounded-full px-2.5 py-1.5 text-[11px] font-semibold bg-[#F8E7A8] text-[#29261F]`}
              >
                Segera ditutup
              </span>
            </article>
          ))}
        </div>
      </section>
        </>
      )}
    </div>
  );
}