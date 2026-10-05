"use client";

import { useMemo, useState, useEffect } from "react";
import { getSellerReviews, replyToReview } from "../../../../services/reviews";

const ratingOptions = [5, 4, 3, 2, 1];

function RatingStars({ rating, size = "text-base" }) {
  return (
    <span
      aria-label={`Rating ${rating} dari 5`}
      className={`inline-flex whitespace-nowrap leading-none ${size}`}
    >
      <span className="text-[#29261F]">{"★".repeat(rating)}</span>
      <span className="text-[#29261F]">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

function ReviewStatus({ replied }) {
  return (
    <span
      className={`inline-flex w-fit whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${
        replied ? "bg-[#F4C542] text-[#29261F]" : "bg-[#F8E7A8] text-[#29261F]"
      }`}
    >
      {replied ? "Sudah Dibalas" : "Belum Dibalas"}
    </span>
  );
}

function ReviewCard({ review, onReply }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);

  async function submitReply(event) {
    event.preventDefault();
    const reply = replyText.trim();
    if (!reply) {
      setFeedback("Balasan tidak boleh kosong.");
      return;
    }
    setBusy(true);
    setFeedback("");
    try {
      await replyToReview(review.id, reply);
      onReply(review.id, reply);
      setIsReplying(false);
      setReplyText("");
      setFeedback("Balasan berhasil disimpan.");
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setBusy(false);
    }
  }

  function cancelReply() {
    setIsReplying(false);
    setReplyText("");
    setFeedback("");
  }

  return (
    <article className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-sm font-bold text-[#29261F]">{review.customer}</h3>
          <p className="mt-1 break-words text-xs font-medium text-[#29261F]">{review.product}</p>
        </div>
        <RatingStars rating={review.rating} size="text-lg" />
      </div>

      <p className="mt-4 break-words text-sm leading-6 text-[#29261F]">“{review.comment}”</p>
      <p className="mt-3 text-xs text-[#8B8172]">{review.date}</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#29261F]/[0.07] pt-4">
        <ReviewStatus replied={Boolean(review.reply)} />
        {!review.reply && !isReplying ? (
          <button
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#FFF9EF] px-4 text-sm font-semibold text-white transition hover:bg-[#E89B3C]"
            onClick={() => {
              setFeedback("");
              setIsReplying(true);
            }}
            type="button"
          >
            Balas
          </button>
        ) : null}
      </div>

      {review.reply ? (
        <div className="mt-4 rounded-lg border border-[#29261F] bg-[#F7F1E7] p-3.5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#29261F]">Balasan seller</p>
          <p className="mt-1.5 break-words text-sm leading-6 text-[#29261F]">{review.reply}</p>
        </div>
      ) : null}

      {isReplying ? (
        <form className="mt-4 space-y-3 border-t border-[#29261F]/[0.07] pt-4" onSubmit={submitReply}>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-[#29261F]">Balasan review</span>
            <textarea
              className="min-h-28 w-full resize-y rounded-lg border border-[#29261F]/10 bg-white px-3 py-2.5 text-sm leading-6 text-[#29261F] outline-none transition placeholder:text-[#8B8172] focus:border-[#29261F] focus:ring-2 focus:ring-[#E89B3C]"
              onChange={(event) => setReplyText(event.target.value)}
              placeholder="Balas review..."
              value={replyText}
            />
          </label>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#29261F]/10 px-4 text-sm font-semibold text-[#29261F] transition hover:bg-[#F7F1E7]"
              onClick={cancelReply}
              type="button"
            >
              Batal
            </button>
            <button
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#FFF9EF] px-4 text-sm font-semibold text-white transition hover:bg-[#E89B3C] disabled:opacity-50"
              disabled={busy}
              type="submit"
            >
              {busy ? "Menyimpan..." : "Kirim Balasan"}
            </button>
          </div>
        </form>
      ) : null}

      {feedback ? (
        <p aria-live="polite" className="mt-3 text-xs font-medium leading-5 text-[#29261F]">
          {feedback}
        </p>
      ) : null}
    </article>
  );
}

export default function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("Semua Rating");
  const [replyStatus, setReplyStatus] = useState("Semua");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    let active = true;
    getSellerReviews()
      .then((res) => {
        if (!active) return;
        setAverageRating(res.average_rating || 0);
        setTotalReviews(res.total_reviews || 0);
        const fetchedReviews = (res.data || []).map(r => ({
          id: r.id,
          customer: r.consumer_name || "Konsumen",
          product: `Produk ID: ${r.product_id}`,
          rating: r.rating,
          comment: r.comment,
          date: new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(r.created_at)),
          reply: r.seller_reply
        }));
        setReviews(fetchedReviews);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const normalizedSearch = search.trim().toLocaleLowerCase("id-ID");

  const filteredReviews = useMemo(
    () =>
      reviews.filter((review) => {
        const searchableText = `${review.customer} ${review.product} ${review.comment}`.toLocaleLowerCase("id-ID");
        const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
        const matchesRating = rating === "Semua Rating" || review.rating === Number(rating);
        const hasReply = Boolean(review.reply);
        const matchesStatus =
          replyStatus === "Semua" ||
          (replyStatus === "Sudah Dibalas" ? hasReply : !hasReply);

        return matchesSearch && matchesRating && matchesStatus;
      }),
    [normalizedSearch, rating, replyStatus, reviews],
  );

  const repliedCount = reviews.filter((review) => Boolean(review.reply)).length;
  const pendingCount = reviews.length - repliedCount;

  function handleReply(reviewId, reply) {
    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === reviewId ? { ...review, reply } : review,
      ),
    );
  }

  const summaries = [
    {
      label: "Rating rata-rata",
      value: averageRating.toFixed(1),
      detail: "dari 5",
      stars: Math.round(averageRating),
    },
    { label: "Total review", value: totalReviews, detail: "review konsumen" },
    { label: "Belum dibalas", value: pendingCount, detail: "review" },
    { label: "Sudah dibalas", value: repliedCount, detail: "review" },
  ];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">Suara konsumen</p>
        <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#29261F] sm:text-[30px]">
          Review
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#8B8172]">
          Lihat dan kelola ulasan dari konsumen.
        </p>
      </header>

      {error && <p className="text-sm font-semibold text-red-500">{error}</p>}

      <section aria-label="Ringkasan review" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {summaries.map((summary) => (
          <article className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-5" key={summary.label}>
            <p className="text-xs font-medium text-[#8B8172]">{summary.label}</p>
            <div className="mt-3 flex min-h-8 flex-wrap items-center gap-x-2 gap-y-1">
              <p className="text-[26px] font-bold leading-none tracking-[-0.04em] text-[#29261F]">{summary.value}</p>
              {summary.stars ? (
                <RatingStars rating={summary.stars} size="text-sm" />
              ) : null}
            </div>
            <p className="mt-2 text-[11px] text-[#8B8172]">{summary.detail}</p>
          </article>
        ))}
      </section>

      <section
        aria-label="Cari dan filter review"
        className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-5"
      >
        <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_180px_190px]">
          <label className="relative block">
            <span className="sr-only">Cari review</span>
            <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8172]">⌕</span>
            <input
              className="h-11 w-full rounded-lg border border-[#29261F]/10 bg-white pl-9 pr-3 text-sm text-[#29261F] outline-none transition placeholder:text-[#8B8172] focus:border-[#29261F] focus:ring-2 focus:ring-[#E89B3C]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari konsumen, produk, atau komentar"
              type="search"
              value={search}
            />
          </label>
          <label className="block">
            <span className="sr-only">Filter rating</span>
            <select
              className="h-11 w-full rounded-lg border border-[#29261F]/10 bg-white px-3 text-sm text-[#29261F] outline-none focus:border-[#29261F] focus:ring-2 focus:ring-[#E89B3C]"
              onChange={(event) => setRating(event.target.value)}
              value={rating}
            >
              <option>Semua Rating</option>
              {ratingOptions.map((item) => <option key={item} value={item}>{item} bintang</option>)}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Filter status balasan</span>
            <select
              className="h-11 w-full rounded-lg border border-[#29261F]/10 bg-white px-3 text-sm text-[#29261F] outline-none focus:border-[#29261F] focus:ring-2 focus:ring-[#E89B3C]"
              onChange={(event) => setReplyStatus(event.target.value)}
              value={replyStatus}
            >
              <option>Semua</option>
              <option>Belum Dibalas</option>
              <option>Sudah Dibalas</option>
            </select>
          </label>
        </div>
      </section>

      <section aria-label="Daftar review" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-[#29261F]">Daftar review</h2>
          <span className="text-xs text-[#8B8172]">{filteredReviews.length} review</span>
        </div>
        {loading ? (
          <p className="text-sm">Memuat review...</p>
        ) : filteredReviews.length === 0 ? (
          <div className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] px-5 py-12 text-center">
            <h3 className="text-sm font-bold text-[#29261F]">Review tidak ditemukan</h3>
            <p className="mt-1.5 text-sm text-[#8B8172]">
              Coba ubah kata pencarian atau filter yang digunakan.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} onReply={handleReply} review={review} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
