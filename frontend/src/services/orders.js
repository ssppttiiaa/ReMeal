const SELLER_ORDERS_PATH = "/seller/orders";

async function requestSellerOrders(path, options = {}) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL belum dikonfigurasi untuk API Seller Orders.");
  }

  const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Seller Orders gagal (${response.status} ${response.statusText}).`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function getSellerOrders() {
  return requestSellerOrders(SELLER_ORDERS_PATH);
}

export function getSellerOrderById(orderId) {
  return requestSellerOrders(`${SELLER_ORDERS_PATH}/${encodeURIComponent(orderId)}`);
}

export function confirmSellerOrder(orderId) {
  return requestSellerOrders(
    `${SELLER_ORDERS_PATH}/${encodeURIComponent(orderId)}/confirm`,
    { method: "POST" },
  );
}

// These endpoint wrappers are prepared for backend integration; QR Pickup UI currently stays local.
export function verifySellerOrderQR(qrCode) {
  return requestSellerOrders(`${SELLER_ORDERS_PATH}/verify-qr`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qrCode }),
  });
}

export function completeSellerOrder(orderId) {
  return requestSellerOrders(
    `${SELLER_ORDERS_PATH}/${encodeURIComponent(orderId)}/complete`,
    { method: "POST" },
  );
}
