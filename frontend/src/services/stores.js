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
    method: "PATCH", // Mengubah dari PUT ke PATCH sesuai backend route
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function createMyStore(data) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const accessToken = await getAccessToken();
  const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/stores`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let message = `API Store gagal (${response.status}).`;
    try {
      const errorData = await response.json();
      if (errorData?.message) message = errorData.message;
    } catch {}
    throw new Error(message);
  }
  return response.json();
}

export async function uploadStorePhoto(file) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL belum dikonfigurasi.");
  }

  const accessToken = await getAccessToken();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/upload/store-photos`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    let message = "Gagal mengupload foto toko.";
    try {
      const errorData = await response.json();
      if (errorData?.message) message = errorData.message;
    } catch {}
    throw new Error(message);
  }

  const result = await response.json();
  const url = result?.data?.url;
  if (typeof url !== "string" || !url) {
    throw new Error("Backend tidak mengembalikan URL foto toko yang valid.");
  }
  return url;
}