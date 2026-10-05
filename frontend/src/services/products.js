import { supabase } from "../lib/supabase";

const SELLER_PRODUCTS_PATH = "/seller/products";

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

async function requestSellerProducts(path, options = {}) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL belum dikonfigurasi untuk API Seller Products.",
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
    },
  );

  if (!response.ok) {
    let message = `API Seller Products gagal (${response.status} ${response.statusText}).`;

    try {
      const errorData = await response.json();

      if (errorData?.message) {
        message = errorData.message;
      }
    } catch {
      // Response bukan JSON, gunakan pesan default.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getSellerProducts({ page, limit, status } = {}) {
  const query = new URLSearchParams();
  if (page !== undefined) query.set("page", String(page));
  if (limit !== undefined) query.set("limit", String(limit));
  if (status) query.set("status", status);

  const queryString = query.toString();
  return requestSellerProducts(
    `${SELLER_PRODUCTS_PATH}${queryString ? `?${queryString}` : ""}`,
  );
}

export async function getAllSellerProducts({ status, limit = 100 } = {}) {
  const products = [];
  let page = 1;
  let total = Infinity;

  while (products.length < total) {
    const response = await getSellerProducts({ page, limit, status });
    if (!Array.isArray(response?.data) || !Number.isInteger(response?.meta?.total)) {
      throw new Error("Format response daftar produk tidak valid.");
    }

    products.push(...response.data);
    total = response.meta.total;

    if (response.data.length === 0 || products.length >= total) break;
    page += 1;
  }

  return products;
}

export async function getProductCategories() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL belum dikonfigurasi untuk API kategori produk.",
    );
  }

  const response = await fetch(
    `${apiBaseUrl.replace(/\/$/, "")}/categories`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `API kategori produk gagal (${response.status} ${response.statusText}).`,
    );
  }

  return response.json();
}

export function createSellerProduct(data) {
  return requestSellerProducts(SELLER_PRODUCTS_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export function updateSellerProduct(productId, data) {
  return requestSellerProducts(
    `${SELLER_PRODUCTS_PATH}/${encodeURIComponent(productId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
}

export function deleteSellerProduct(productId) {
  return requestSellerProducts(
    `${SELLER_PRODUCTS_PATH}/${encodeURIComponent(productId)}`,
    {
      method: "DELETE",
    },
  );
}

export function closeSellerProduct(productId) {
  return requestSellerProducts(
    `${SELLER_PRODUCTS_PATH}/${encodeURIComponent(productId)}/close`,
    {
      method: "POST",
    },
  );
}

export async function uploadSellerProductPhoto(file) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL belum dikonfigurasi.");
  }
  
  const accessToken = await getAccessToken();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/upload/product-photos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    body: formData,
  });

  if (!response.ok) {
    let message = "Gagal mengupload foto.";
    try {
      const errorData = await response.json();
      if (errorData?.message) message = errorData.message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}