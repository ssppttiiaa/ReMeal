import { supabase } from "../lib/supabase";

const SELLER_ORDERS_PATH = "/seller/orders";

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

async function requestSellerOrders(path, options = {}) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL belum dikonfigurasi untuk API Seller Orders."
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
    let message = `API Seller Orders gagal (${response.status} ${response.statusText}).`;

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

export function getSellerOrders() {
  return requestSellerOrders(SELLER_ORDERS_PATH);
}

export function getSellerOrderById(orderId) {
  return requestSellerOrders(
    `${SELLER_ORDERS_PATH}/${encodeURIComponent(orderId)}`
  );
}

export function confirmSellerOrder(orderId) {
  return requestSellerOrders(
    `${SELLER_ORDERS_PATH}/${encodeURIComponent(orderId)}/confirm`,
    {
      method: "POST",
    }
  );
}

export function verifySellerOrderQR(qrCode) {
  return requestSellerOrders(`${SELLER_ORDERS_PATH}/verify-qr`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ qr_code: qrCode }),
  });
}

export function completeSellerOrder(orderId) {
  return requestSellerOrders(
    `${SELLER_ORDERS_PATH}/${encodeURIComponent(orderId)}/complete`,
    {
      method: "POST",
    }
  );
}