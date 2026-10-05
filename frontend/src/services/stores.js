import { supabase } from "../lib/supabase";

const SELLER_STORE_PATH = "/stores/me";

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

async function requestMyStore(options = {}) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL belum dikonfigurasi untuk API Store."
    );
  }

  const accessToken = await getAccessToken();

  const response = await fetch(
    `${apiBaseUrl.replace(/\/$/, "")}${SELLER_STORE_PATH}`,
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
    let message = `API Store gagal (${response.status} ${response.statusText}).`;

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

export function getMyStore() {
  return requestMyStore();
}

export function updateMyStore(data) {
  return requestMyStore({
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}