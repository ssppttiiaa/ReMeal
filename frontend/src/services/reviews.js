import { supabase } from "../lib/supabase";

const SELLER_REVIEWS_PATH = "/seller/reviews";

async function getAccessToken() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(`Gagal mendapatkan session: ${error.message}`);
  }

  if (!session?.access_token) {
    throw new Error("Session login tidak ditemukan. Silakan login terlebih dahulu.");
  }

  return session.access_token;
}

async function requestSellerReviews(path, options = {}) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL belum dikonfigurasi untuk API Seller Reviews."
    );
  }

  const accessToken = await getAccessToken();

  const response = await fetch(
    `${apiBaseUrl.replace(/\/$/, "")}${path}`,
    {
      ...options,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    }
  );

  if (!response.ok) {
    let message = `API Seller Reviews gagal (${response.status} ${response.statusText}).`;

    try {
      const errorData = await response.json();

      if (errorData?.message) {
        message = errorData.message;
      }
    } catch {
      // gunakan pesan default
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reply }),
    }
  );
}