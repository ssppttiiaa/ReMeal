import { supabase } from "../lib/supabase";

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

async function requestAdmin(path, options = {}) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL belum dikonfigurasi.");
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
    let message = `API Admin gagal (${response.status} ${response.statusText}).`;

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

/* =========================
   DASHBOARD
========================= */

export function getAdminDashboard() {
  return requestAdmin("/admin/dashboard");
}

export function getAdminCategories() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL belum dikonfigurasi.");
  }

  return fetch(`${apiBaseUrl.replace(/\/$/, "")}/categories`, {
    headers: { Accept: "application/json" },
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Gagal memuat kategori (${response.status} ${response.statusText}).`);
    }
    return response.json();
  });
}

/* =========================
   USERS
========================= */

export function getAdminUsers(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const suffix = query.toString() ? `?${query.toString()}` : "";

  return requestAdmin(`/admin/users${suffix}`);
}

export function updateAdminUser(userId, data) {
  return requestAdmin(
    `/admin/users/${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
}

export function deleteAdminUser(userId) {
  return requestAdmin(
    `/admin/users/${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================
   STORES
========================= */

export function getAdminStores(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const suffix = query.toString() ? `?${query.toString()}` : "";

  return requestAdmin(`/admin/stores${suffix}`);
}

export function verifyAdminStore(storeId, data) {
  return requestAdmin(
    `/admin/stores/${encodeURIComponent(storeId)}/verification`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
}

/* =========================
   CATEGORIES
========================= */

export function createAdminCategory(data) {
  return requestAdmin("/admin/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export function updateAdminCategory(categoryId, data) {
  return requestAdmin(
    `/admin/categories/${encodeURIComponent(categoryId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
}

export function deleteAdminCategory(categoryId) {
  return requestAdmin(
    `/admin/categories/${encodeURIComponent(categoryId)}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================
   ORDERS
========================= */

export function getAdminOrders(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const suffix = query.toString() ? `?${query.toString()}` : "";

  return requestAdmin(`/admin/orders${suffix}`);
}

/* =========================
   REVIEW REPORTS
========================= */

export function getAdminReviewReports(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const suffix = query.toString() ? `?${query.toString()}` : "";

  return requestAdmin(`/admin/review-reports${suffix}`);
}

export function moderateAdminReview(reviewId, data) {
  return requestAdmin(
    `/admin/reviews/${encodeURIComponent(reviewId)}/moderation`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
}

/* =========================
   COMPLAINTS
========================= */

export function getAdminComplaints(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const suffix = query.toString() ? `?${query.toString()}` : "";

  return requestAdmin(`/admin/complaints${suffix}`);
}

export function updateAdminComplaint(complaintId, data) {
  return requestAdmin(
    `/admin/complaints/${encodeURIComponent(complaintId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
}

/* =========================
   SETTINGS
========================= */

export function getAdminSettings() {
  return requestAdmin("/admin/settings");
}

export function updateAdminSettings(data) {
  return requestAdmin("/admin/settings", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}