const SELLER_STORE_PATH = "/stores/me";

async function requestMyStore(options = {}) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL belum dikonfigurasi untuk API Store.");
  }

  const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}${SELLER_STORE_PATH}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Store gagal (${response.status} ${response.statusText}).`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function getMyStore() {
  return requestMyStore();
}

// Uses PUT /stores/me as the conventional update route; confirm the exact method with the backend OpenAPI before integration.
export function updateMyStore(data) {
  return requestMyStore({
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
