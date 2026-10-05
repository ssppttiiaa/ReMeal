"use client";

import { useState } from "react";
import { ADMIN_DEV_MODE } from "../../../lib/adminDevMode";
import { AdminComplaintsApi } from "../_components/AdminApiViews";

const initialComplaints = [
  {
    id: "demo-complaint-1",
    subject: "Pesanan belum dapat diambil",
    description: "Contoh pengaduan untuk uji coba alur penanganan.",
    status: "open",
    created_at: new Date().toISOString(),
    user_id: "demo-consumer",
    order_id: "demo-order",
  },
];

function AdminComplaintsMock() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [feedback, setFeedback] = useState("");

  function update(complaint, status) {
    if (!window.confirm(`Ubah status contoh pengaduan menjadi ${status === "resolved" ? "Selesai" : "Ditangani"}?`)) return;
    setComplaints((current) => current.map((item) => item.id === complaint.id ? { ...item, status } : item));
    setFeedback("Status pengaduan contoh berubah lokal. Tidak ada request ke backend.");
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">Manajemen platform</p>
        <h1 className="mt-1.5 text-[26px] font-bold text-[#29261F] sm:text-[30px]">Pengaduan</h1>
        <p className="mt-2 text-sm text-[#8B8172]">Data contoh untuk menguji alur penanganan pengaduan.</p>
      </header>
      {feedback ? <p className="rounded-lg bg-[#F8E7A8] px-4 py-3 text-sm text-[#29261F]" role="status">{feedback}</p> : null}
      {complaints.map((complaint) => (
        <article className="rounded-xl border border-[#29261F]/10 bg-[#FFF9EF] p-4 sm:p-5" key={complaint.id}>
          <span className="rounded-full bg-[#F8E7A8] px-2.5 py-1.5 text-xs font-semibold text-[#29261F]">{complaint.status === "open" ? "Terbuka" : complaint.status === "in_progress" ? "Ditangani" : "Selesai"}</span>
          <h2 className="mt-3 text-sm font-bold text-[#29261F]">{complaint.subject}</h2>
          <p className="mt-2 text-sm leading-6 text-[#8B8172]">{complaint.description}</p>
          {complaint.status !== "resolved" ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="min-h-10 rounded-lg border border-[#29261F]/15 px-3 text-xs font-semibold text-[#29261F]" onClick={() => update(complaint, "in_progress")} type="button">Mulai Tangani</button>
              <button className="min-h-10 rounded-lg bg-[#F4C542] px-3 text-xs font-semibold text-[#29261F]" onClick={() => update(complaint, "resolved")} type="button">Tandai Selesai</button>
            </div>
          ) : null}
        </article>
      ))}
      <p className="text-center text-xs text-[#8B8172]">Mode development aktif. Matikan NEXT_PUBLIC_ADMIN_DEV_MODE untuk mengakses pengaduan dari API.</p>
    </div>
  );
}

export default function AdminComplaintsPage() {
  return ADMIN_DEV_MODE ? <AdminComplaintsMock /> : <AdminComplaintsApi />;
}
