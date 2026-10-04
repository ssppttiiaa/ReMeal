const SELLER_REVIEWS_PATH = "/seller/reviews";

async function requestSellerReviews(path, options = {}) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL belum dikonfigurasi untuk API Seller Reviews.");
  }

  const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Seller Reviews gagal (${response.status} ${response.statusText}).`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function getSellerReviews() {
  return requestSellerReviews(SELLER_REVIEWS_PATH);
}

export function replyToReview(reviewId, reply) {
  return requestSellerReviews(
    `${SELLER_REVIEWS_PATH}/${encodeURIComponent(reviewId)}/reply`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    },
  );
}
