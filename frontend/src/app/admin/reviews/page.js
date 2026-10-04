"use client";

import { useMemo, useState } from "react";

const initialReviews = [
  {
    id: "REV-001",
    userName: "Septiana",
    productName: "Roti Cokelat",
    storeName: "Roti & Rasa",
    rating: 5,
    review: "Rotinya masih enak dan harganya terjangkau.",
    date: "4 Oktober 2026",
    reply: "Terima kasih sudah membeli di Roti & Rasa.",
    report: {
      reporter: "Pengguna ReMeal",
      reason: "Spam",
      date: "4 Oktober 2026",
      count: 1,
      status: "Menunggu",
    },
  },
  {
    id: "REV-002",
    userName: "Bima",
    productName: "Rice Bowl Ayam Teriyaki",
    storeName: "Dapur Mbak Sari",
    rating: 4,
    review: "Rasanya enak, porsinya pas untuk makan siang.",
    date: "4 Oktober 2026",
    reply: "",
    report: {
      reporter: "Pengguna ReMeal",
      reason: "Informasi palsu",
      date: "4 Oktober 2026",
      count: 2,
      status: "Menunggu",
    },
  },
  {
    id: "REV-003",
    userName: "Nadia",
    productName: "Brownies Cokelat",
    storeName: "Manis Bakery",
    rating: 5,
    review: "Browniesnya lembut dan rasa cokelatnya mantap.",
    date: "3 Oktober 2026",
    reply: "Senang sekali Anda menyukainya. Terima kasih!",
    report: {
      reporter: "Pemilik Toko",
      reason: "Konten tidak relevan",
      date: "3 Oktober 2026",
      count: 1,
      status: "Menunggu",
    },
  },
  {
    id: "REV-004",
    userName: "Rafi",
    productName: "Es Kopi Susu Gula Aren",
    storeName: "Kopi Senja",
    rating: 2,
    review: "Rasanya tidak sesuai dengan deskripsi produk.",
    date: "3 Oktober 2026",
    reply: "",
    report: {
      reporter: "Pemilik Toko",
      reason: "Konten tidak relevan",
      date: "4 Oktober 2026",
      count: 1,
      status: "Ditinjau",
    },
  },
  {
    id: "REV-005",
    userName: "Citra",
    productName: "Paket Snack",
    storeName: "Kedai Nusantara",
    rating: 3,
    review: "Cukup enak, tetapi beberapa pilihan sudah habis.",
    date: "2 Oktober 2026",
    reply: "Terima kasih atas masukannya, Kak.",
    report: {
      reporter: "Pengguna ReMeal",
      reason: "Informasi palsu",
      date: "2 Oktober 2026",
      count: 1,
      status: "Menunggu",
    },
  },
  {
    id: "REV-006",
    userName: "Dimas",
    productName: "Roti Sobek Keju",
    storeName: "Roti & Rasa",
    rating: 1,
    review: "Review percobaan yang memakai bahasa tidak pantas.",
    date: "2 Oktober 2026",
    reply: "",
    report: {
      reporter: "Septiana",
      reason: "Bahasa tidak pantas",
      date: "3 Oktober 2026",
      count: 3,
      status: "Menunggu",
    },
  },
  {
    id: "REV-007",
    userName: "Sinta",
    productName: "Puding Cokelat",
    storeName: "Manis Bakery",
    rating: 4,
    review: "Pudingnya enak dan kemasannya rapi.",
    date: "1 Oktober 2026",
    reply: "Terima kasih sudah mencoba produk kami.",
    report: {
      reporter: "Pemilik Toko",
      reason: "Konten tidak relevan",
      date: "1 Oktober 2026",
      count: 1,
      status: "Menunggu",
    },
  },
  {
    id: "REV-008",
    userName: "Yoga",
    productName: "Nasi Gudeg",
    storeName: "Warung Pagi",
    rating: 5,
    review: "Rasa rumahan yang pas, akan pesan lagi.",
    date: "30 September 2026",
    reply: "",
    report: {
      reporter: "Bima",
      reason: "Spam",
      date: "2 Oktober 2026",
      count: 1,
      status: "Ditindaklanjuti",
    },
  },
  {
    id: "REV-009",
    userName: "Alya",
    productName: "Salad Buah",
    storeName: "Segar Berkah",
    rating: 3,
    review: "Buahnya segar, sausnya sedikit terlalu manis.",
    date: "29 September 2026",
    reply: "Terima kasih untuk review dan sarannya.",
    report: {
      reporter: "Pengguna ReMeal",
      reason: "Spam",
      date: "29 September 2026",
      count: 2,
      status: "Menunggu",
    },
  },
  {
    id: "REV-010",
    userName: "Fajar",
    productName: "Roti Pisang",
    storeName: "Teras Roti",
    rating: 4,
    review: "Cocok untuk camilan sore dan masih fresh.",
    date: "28 September 2026",
    reply: "",
    report: {
      reporter: "Pengguna ReMeal",
      reason: "Konten tidak relevan",
      date: "1 Oktober 2026",
      count: 1,
      status: "Menunggu",
    },
  },
  {
    id: "REV-011",
    userName: "Intan",
    productName: "Paket Nasi Ayam",
    storeName: "Dapur Mbak Sari",
    rating: 5,
    review: "Porsinya mengenyangkan dan bumbunya enak.",
    date: "25 September 2026",
    reply: "Terima kasih sudah berbelanja di Dapur Mbak Sari.",
    report: {
      reporter: "Pemilik Toko",
      reason: "Spam",
      date: "27 September 2026",
      count: 2,
      status: "Ditolak",
    },
  },
  {
    id: "REV-012",
    userName: "Wulan",
    productName: "Donat Cokelat",
    storeName: "Roti & Rasa",
    rating: 2,
    review: "Donatnya agak kering saat saya ambil.",
    date: "20 September 2026",
    reply: "",
    report: {
      reporter: "Pengguna ReMeal",
      reason: "Informasi palsu",
      date: "22 September 2026",
      count: 1,
      status: "Menunggu",
    },
  },
];

const ratingOptions = [5, 4, 3, 2, 1];
const reviewStatuses = ["Semua Status", "Sudah Dibalas", "Belum Dibalas"];
const reportStatuses = ["Semua Status", "Menunggu", "Ditinjau", "Ditindaklanjuti", "Ditolak"];
const pageSize = 5;
const moderationActions = ["Tandai Ditinjau", "Tindak Lanjuti", "Tolak Laporan"];

function RatingStars({ rating, size = "text-sm" }) {
  return (
    <span
      aria-label={`Rating ${rating} dari 5`}
      className={`inline-flex whitespace-nowrap leading-none ${size}`}
    >
      <span className="text-[#d99a42]">{"★".repeat(rating)}</span>
      <span className="text-[#d9ddd2]">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

function ReplyStatusBadge({ replied }) {
  return (
    <span
      className={`inline-flex w-fit whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${
        replied ? "bg-[#e7edda] text-[#536738]" : "bg-[#f8e9d4] text-[#94621f]"
      }`}
    >
      {replied ? "Sudah Dibalas" : "Belum Dibalas"}
    </span>
  );
}

function ReportStatusBadge({ status }) {
  const styles = {
    Menunggu: "bg-[#f8e9d4] text-[#94621f]",
    Ditinjau: "bg-[#dce9e7] text-[#3c6861]",
    Ditindaklanjuti: "bg-[#f5dfd8] text-[#a34d3e]",
    Ditolak: "bg-[#e9eedf] text-[#637844]",
  };

  return (
    <span className={`inline-flex w-fit whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

function ReviewDetailDialog({ review, onClose }) {
  return (
    <div
      aria-labelledby="review-detail-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#202a1e]/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
    >
      <section className="my-auto w-full max-w-xl rounded-xl bg-[#fffefa] p-5 shadow-xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#30392c]" id="review-detail-title">Detail Review</h2>
            <p className="mt-1 text-xs text-[#858c7d]">{review.id}</p>
          </div>
          <button
            aria-label="Tutup detail review"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg text-[#727a6d] transition hover:bg-[#f4f5ef]"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <dl className="mt-4 grid gap-x-5 sm:grid-cols-2">
          <DetailField label="User">{review.userName}</DetailField>
          <DetailField label="Produk">{review.productName}</DetailField>
          <DetailField label="Toko">{review.storeName}</DetailField>
          <DetailField label="Rating"><RatingStars rating={review.rating} size="text-base" /></DetailField>
          <DetailField label="Tanggal">{review.date}</DetailField>
          <DetailField label="Status"><ReplyStatusBadge replied={Boolean(review.reply)} /></DetailField>
        </dl>
        <div className="mt-4 rounded-lg bg-[#f8f9f4] p-3.5">
          <p className="text-xs font-semibold text-[#727a6d]">Isi Review</p>
          <p className="mt-1.5 break-words text-sm leading-6 text-[#30392c]">{review.review}</p>
        </div>
        <div className="mt-3 rounded-lg border border-[#dfe6d1] bg-[#f5f7ef] p-3.5">
          <p className="text-xs font-semibold text-[#68754b]">Balasan Seller</p>
          <p className="mt-1.5 break-words text-sm leading-6 text-[#4d5548]">
            {review.reply || "Belum ada balasan dari seller."}
          </p>
        </div>
        {review.report ? (
          <div className="mt-3 rounded-lg border border-[#f0dfc7] bg-[#fbf5ec] p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold text-[#94621f]">Laporan Review</p>
              <ReportStatusBadge status={review.report.status} />
            </div>
            <dl className="mt-2 grid gap-x-4 gap-y-2 sm:grid-cols-3">
              <DetailField label="Alasan">{review.report.reason}</DetailField>
              <DetailField label="Tanggal Laporan">{review.report.date}</DetailField>
              <DetailField label="Jumlah Laporan">{review.report.count}</DetailField>
            </dl>
          </div>
        ) : null}

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

function DetailField({ label, children }) {
  return (
    <div className="min-w-0 border-b border-[#202a1e]/[0.07] py-2.5">
      <dt className="text-xs text-[#858c7d]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold text-[#30392c]">{children}</dd>
    </div>
  );
}

function ReviewCard({ review, onView }) {
  return (
    <article className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words text-sm font-bold text-[#30392c]">{review.userName}</p>
          <p className="mt-1 break-words text-xs font-medium text-[#68754b]">{review.productName}</p>
          <p className="mt-1 break-words text-xs text-[#858c7d]">{review.storeName}</p>
        </div>
        <RatingStars rating={review.rating} size="text-lg" />
      </div>
      <p className="mt-4 break-words text-sm leading-6 text-[#4d5548]">“{review.review}”</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-[#858c7d]">{review.date}</p>
        <ReplyStatusBadge replied={Boolean(review.reply)} />
      </div>
      {review.report ? (
        <div className="mt-3 rounded-lg border border-[#f0dfc7] bg-[#fbf5ec] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold text-[#94621f]">Laporan</p>
            <ReportStatusBadge status={review.report.status} />
          </div>
          <p className="mt-1.5 break-words text-xs leading-5 text-[#727a6d]">
            {review.report.reason} · {review.report.count} laporan · {review.report.date}
          </p>
        </div>
      ) : null}
      <button
        className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-[#202a1e]/10 px-3 text-sm font-semibold text-[#596745] transition hover:bg-[#f4f5ef]"
        onClick={() => onView(review)}
        type="button"
      >
        Lihat Detail
      </button>
    </article>
  );
}

function ReportCard({ review, onReview }) {
  return (
    <article className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words text-sm font-bold text-[#30392c]">{review.userName}</p>
          <p className="mt-1 break-words text-xs font-medium text-[#68754b]">{review.productName}</p>
          <p className="mt-1 break-words text-xs text-[#858c7d]">{review.storeName}</p>
        </div>
        <ReportStatusBadge status={review.report.status} />
      </div>
      <p className="mt-3 break-words text-sm leading-6 text-[#4d5548]">“{review.review}”</p>
      <div className="mt-3 grid gap-2 rounded-lg bg-[#f8f9f4] p-3 text-xs sm:grid-cols-2">
        <p className="break-words text-[#727a6d]"><span className="font-semibold text-[#30392c]">Pelapor:</span> {review.report.reporter}</p>
        <p className="break-words text-[#727a6d]"><span className="font-semibold text-[#30392c]">Alasan:</span> {review.report.reason}</p>
        <p className="text-[#727a6d]"><span className="font-semibold text-[#30392c]">Tanggal:</span> {review.report.date}</p>
        <p className="text-[#727a6d]"><span className="font-semibold text-[#30392c]">Jumlah:</span> {review.report.count}</p>
      </div>
      {review.report.status === "Menunggu" ? (
        <button
          className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-[#202a1e] px-3 text-sm font-semibold text-white transition hover:bg-[#35432f]"
          onClick={() => onReview(review)}
          type="button"
        >
          Review Laporan
        </button>
      ) : null}
    </article>
  );
}

function ReportReviewDialog({ review, onAction, onClose }) {
  return (
    <div
      aria-labelledby="report-review-title"
      aria-modal="true"
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-[#202a1e]/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
    >
      <section className="my-auto w-full max-w-xl rounded-xl bg-[#fffefa] p-5 shadow-xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#30392c]" id="report-review-title">Review Laporan</h2>
            <p className="mt-1 text-xs text-[#858c7d]">{review.id}</p>
          </div>
          <button
            aria-label="Tutup laporan"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg text-[#727a6d] transition hover:bg-[#f4f5ef]"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="mt-4">
          <ReportStatusBadge status={review.report.status} />
        </div>
        <dl className="mt-4 grid gap-x-5 sm:grid-cols-2">
          <DetailField label="Produk">{review.productName}</DetailField>
          <DetailField label="Toko">{review.storeName}</DetailField>
          <DetailField label="Pelapor">{review.report.reporter}</DetailField>
          <DetailField label="Alasan">{review.report.reason}</DetailField>
          <DetailField label="Tanggal Laporan">{review.report.date}</DetailField>
          <DetailField label="Jumlah Laporan">{review.report.count}</DetailField>
        </dl>
        <div className="mt-4 rounded-lg bg-[#f8f9f4] p-3.5">
          <p className="text-xs font-semibold text-[#727a6d]">Review</p>
          <p className="mt-1.5 break-words text-sm leading-6 text-[#30392c]">“{review.review}”</p>
        </div>

        {review.report.status === "Menunggu" ? (
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {moderationActions.map((action) => (
              <button
                className={`inline-flex min-h-10 items-center justify-center rounded-lg px-3 text-xs font-semibold transition ${
                  action === "Tindak Lanjuti"
                    ? "bg-[#a34d3e] text-white hover:bg-[#8d4033]"
                    : action === "Tolak Laporan"
                      ? "border border-[#202a1e]/10 text-[#596745] hover:bg-[#f4f5ef]"
                      : "bg-[#e9eedf] text-[#536738] hover:bg-[#dfe8ca]"
                }`}
                key={action}
                onClick={() => onAction({ review, action })}
                type="button"
              >
                {action}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-5 flex justify-end">
            <button
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#202a1e] px-5 text-sm font-semibold text-white transition hover:bg-[#35432f]"
              onClick={onClose}
              type="button"
            >
              Tutup
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function ModerationConfirmationDialog({ action, onCancel, onConfirm }) {
  return (
    <div
      aria-labelledby="moderation-confirm-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#202a1e]/55 p-4"
      role="alertdialog"
    >
      <section className="w-full max-w-md rounded-xl bg-[#fffefa] p-5 shadow-xl sm:p-6">
        <h2 className="text-base font-bold text-[#30392c]" id="moderation-confirm-title">
          Konfirmasi Moderasi
        </h2>
        <p className="mt-2 break-words text-sm leading-6 text-[#727a6d]">
          {action.action} laporan untuk review {action.review.id}?
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
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#202a1e] px-5 text-sm font-semibold text-white transition hover:bg-[#35432f]"
            onClick={onConfirm}
            type="button"
          >
            {action.action}
          </button>
        </div>
      </section>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onChange, label }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label={`Pagination ${label}`} className="flex flex-wrap items-center justify-center gap-1.5">
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

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(initialReviews);
  const [tab, setTab] = useState("Semua Review");
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("Semua Rating");
  const [status, setStatus] = useState("Semua Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reportToReview, setReportToReview] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [feedback, setFeedback] = useState("");
  const normalizedSearch = search.trim().toLocaleLowerCase("id-ID");
  const reportTab = tab === "Laporan";

  const filteredReviews = useMemo(
    () =>
      reviews.filter((review) => {
        const searchableText = `${review.userName} ${review.productName} ${review.storeName}`.toLocaleLowerCase("id-ID");
        const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
        const matchesRating = rating === "Semua Rating" || review.rating === Number(rating);
        if (reportTab) {
          return (
            review.report &&
            matchesSearch &&
            matchesRating &&
            (status === "Semua Status" || review.report.status === status)
          );
        }
        const replied = Boolean(review.reply);
        const matchesReplyStatus =
          status === "Semua Status" ||
          (status === "Sudah Dibalas" ? replied : !replied);
        return matchesSearch && matchesRating && matchesReplyStatus;
      }),
    [normalizedSearch, rating, reportTab, reviews, status],
  );

  const totalPages = Math.ceil(filteredReviews.length / pageSize);
  const visibleReviews = filteredReviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const reportCount = reviews.filter((review) => review.report).length;
  const unrepliedCount = reviews.filter((review) => !review.reply).length;
  const averageRating =
    reviews.length === 0
      ? "0,0"
      : (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length)
          .toFixed(1)
          .replace(".", ",");
  const summaries = [
    { label: "Total Review", value: reviews.length.toLocaleString("id-ID"), mark: "R", tone: "bg-[#e7edda] text-[#536738]" },
    { label: "Rating Rata-rata", value: `${averageRating} / 5`, mark: "★", tone: "bg-[#f8e5c9] text-[#8b5924]" },
    { label: "Belum Dibalas", value: unrepliedCount.toLocaleString("id-ID"), mark: "B", tone: "bg-[#dce9e7] text-[#3c6861]" },
    { label: "Laporan Review", value: reportCount.toLocaleString("id-ID"), mark: "!", tone: "bg-[#f5dfd8] text-[#a34d3e]" },
  ];

  function changeFilters(update) {
    update();
    setCurrentPage(1);
  }

  function changeTab(nextTab) {
    setTab(nextTab);
    setStatus("Semua Status");
    setCurrentPage(1);
    setFeedback("");
  }

  function confirmModeration() {
    if (!pendingAction) return;
    const nextStatus = {
      "Tandai Ditinjau": "Ditinjau",
      "Tindak Lanjuti": "Ditindaklanjuti",
      "Tolak Laporan": "Ditolak",
    }[pendingAction.action];
    setReviews((current) =>
      current.map((review) =>
        review.id === pendingAction.review.id && review.report
          ? { ...review, report: { ...review.report, status: nextStatus } }
          : review,
      ),
    );
    setFeedback(`Laporan ${pendingAction.review.id} berhasil ditandai "${nextStatus}". Perubahan hanya tersimpan sementara.`);
    setReportToReview((current) =>
      current?.id === pendingAction.review.id
        ? { ...current, report: { ...current.report, status: nextStatus } }
        : current,
    );
    setPendingAction(null);
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8b927f]">Manajemen platform</p>
        <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#202a1e] sm:text-[30px]">
          Reviews &amp; Reports
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#727a6d]">
          Pantau ulasan konsumen dan tinjau laporan review di ReMeal.
        </p>
      </header>

      {feedback ? (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-[#637844]/20 bg-[#e9eedf] px-4 py-3 text-sm text-[#536738]" role="status">
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

      <section aria-label="Ringkasan review dan laporan" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {summaries.map((summary) => (
          <article className="min-w-0 rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4 sm:p-5" key={summary.label}>
            <div className="flex items-start justify-between gap-2">
              <p className="min-h-8 text-xs font-medium leading-4 text-[#727a6d]">{summary.label}</p>
              <span className={`grid h-8 min-w-8 shrink-0 place-items-center rounded-lg px-1.5 text-xs font-bold ${summary.tone}`}>
                {summary.mark}
              </span>
            </div>
            <p className="mt-3 break-words text-[23px] font-bold leading-tight tracking-[-0.04em] text-[#202a1e] sm:text-[26px]">
              {summary.value}
            </p>
            <p className="mt-2.5 text-[10px] leading-4 text-[#8b927f]">data contoh</p>
          </article>
        ))}
      </section>

      <section aria-label="Review dan laporan" className="space-y-4">
        <div className="flex gap-2 border-b border-[#202a1e]/10" role="tablist">
          {["Semua Review", "Laporan"].map((item) => (
            <button
              aria-selected={tab === item}
              className={`min-h-11 border-b-2 px-3 text-sm font-semibold transition ${
                tab === item
                  ? "border-[#637844] text-[#40532c]"
                  : "border-transparent text-[#858c7d] hover:text-[#596745]"
              }`}
              key={item}
              onClick={() => changeTab(item)}
              role="tab"
              type="button"
            >
              {item}
              {item === "Laporan" ? <span className="ml-2 text-xs">{reportCount}</span> : null}
            </button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_170px_210px]">
          <label className="relative block">
            <span className="sr-only">Cari produk, toko, atau pengguna</span>
            <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#858c7d]">⌕</span>
            <input
              className="h-11 w-full min-w-0 rounded-lg border border-[#202a1e]/10 bg-white pl-9 pr-3 text-sm text-[#30392c] outline-none transition placeholder:text-[#a0a497] focus:border-[#8b9d5e] focus:ring-2 focus:ring-[#dfe8ca]"
              onChange={(event) => changeFilters(() => setSearch(event.target.value))}
              placeholder="Cari produk, toko, atau pengguna..."
              type="search"
              value={search}
            />
          </label>
          <label className="block">
            <span className="sr-only">Filter rating</span>
            <select
              className="h-11 w-full min-w-0 rounded-lg border border-[#202a1e]/10 bg-white px-3 text-sm text-[#4d5548] outline-none focus:border-[#8b9d5e] focus:ring-2 focus:ring-[#dfe8ca]"
              onChange={(event) => changeFilters(() => setRating(event.target.value))}
              value={rating}
            >
              <option>Semua Rating</option>
              {ratingOptions.map((item) => <option key={item} value={item}>{item} bintang</option>)}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Filter status {reportTab ? "laporan" : "balasan"}</span>
            <select
              className="h-11 w-full min-w-0 rounded-lg border border-[#202a1e]/10 bg-white px-3 text-sm text-[#4d5548] outline-none focus:border-[#8b9d5e] focus:ring-2 focus:ring-[#dfe8ca]"
              onChange={(event) => changeFilters(() => setStatus(event.target.value))}
              value={status}
            >
              {(reportTab ? reportStatuses : reviewStatuses).map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <section aria-label={reportTab ? "Daftar laporan" : "Daftar review"} className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-[#30392c]">{reportTab ? "Daftar Laporan Review" : "Daftar Review"}</h2>
            <span className="text-xs text-[#858c7d]">
              {filteredReviews.length === 0
                ? reportTab ? "0 laporan" : "0 review"
                : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredReviews.length)} dari ${filteredReviews.length} ${reportTab ? "laporan" : "review"}`}
            </span>
          </div>

          {filteredReviews.length === 0 ? (
            <div className="rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] px-5 py-12 text-center">
              <h3 className="text-sm font-bold text-[#30392c]">
                {reportTab ? "Tidak ada laporan review" : "Review tidak ditemukan"}
              </h3>
              <p className="mt-1.5 text-sm text-[#858c7d]">
                {reportTab
                  ? "Belum ada laporan yang sesuai dengan pencarian atau filter."
                  : "Coba ubah kata kunci atau filter yang digunakan."}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {visibleReviews.map((review) =>
                  reportTab ? (
                    <ReportCard key={review.id} onReview={setReportToReview} review={review} />
                  ) : (
                    <ReviewCard key={review.id} onView={setSelectedReview} review={review} />
                  ),
                )}
              </div>
              {totalPages > 1 ? (
                <Pagination
                  currentPage={currentPage}
                  label={reportTab ? "laporan" : "review"}
                  onChange={setCurrentPage}
                  totalPages={totalPages}
                />
              ) : null}
            </>
          )}
        </section>
      </section>

      <p className="text-center text-[11px] text-[#9aa092]">
        Review dan laporan contoh — belum terhubung ke database.
      </p>

      {selectedReview ? (
        <ReviewDetailDialog onClose={() => setSelectedReview(null)} review={selectedReview} />
      ) : null}
      {reportToReview ? (
        <ReportReviewDialog
          onAction={setPendingAction}
          onClose={() => setReportToReview(null)}
          review={reviews.find((review) => review.id === reportToReview.id) ?? reportToReview}
        />
      ) : null}
      {pendingAction ? (
        <ModerationConfirmationDialog
          action={pendingAction}
          onCancel={() => setPendingAction(null)}
          onConfirm={confirmModeration}
        />
      ) : null}
    </div>
  );
}
