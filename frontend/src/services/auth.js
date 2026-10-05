import { supabase } from "../lib/supabase";

export const PENDING_OTP_STORAGE_KEY = "remeal:pending-otp-registration";

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL belum dikonfigurasi.");
  }

  return apiBaseUrl.replace(/\/$/, "");
}

async function getErrorMessage(response, fallback) {
  try {
    const body = await response.json();
    return body?.message || fallback;
  } catch {
    return fallback;
  }
}

function getDestination(role) {
  if (role === "seller") return "/seller";
  if (role === "super_admin") return "/admin";
  return null;
}

async function postAuthRequest(endpoint, body, fallbackMessage) {
  const url = `${getApiBaseUrl()}${endpoint}`;
  let response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.");
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, fallbackMessage));
  }

  try {
    return await response.json();
  } catch {
    throw new Error("Server mengembalikan respons yang tidak valid.");
  }
}

function getRegistrationIdentifier(data) {
  const email = data.email?.trim();
  const phone = data.phone?.trim();
  return email || phone || "";
}

function getPendingOtpRegistration() {
  if (typeof window === "undefined") return null;

  try {
    const pending = window.sessionStorage.getItem(PENDING_OTP_STORAGE_KEY);
    return pending ? JSON.parse(pending) : null;
  } catch {
    return null;
  }
}

function savePendingOtpRegistration(identifier, role) {
  try {
    window.sessionStorage.setItem(
      PENDING_OTP_STORAGE_KEY,
      JSON.stringify({ identifier, role }),
    );
  } catch {
    throw new Error(
      "Pendaftaran berhasil, tetapi data verifikasi tidak dapat disimpan di browser. Aktifkan session storage lalu ulangi pendaftaran.",
    );
  }
}

async function setAndVerifySession(result) {
  const { access_token: accessToken, refresh_token: refreshToken, user } = result;

  if (!accessToken || !refreshToken || !user?.id || !user?.role) {
    throw new Error("Respons autentikasi tidak berisi session atau profil pengguna yang valid.");
  }

  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    throw new Error(`Gagal menyimpan session: ${error.message}`);
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(`Gagal memverifikasi session: ${sessionError.message}`);
  }

  if (!session?.access_token || session.user?.id !== user.id) {
    throw new Error("Session tidak tersimpan untuk pengguna yang benar.");
  }

  return user;
}

export async function register(data) {
  const identifier = getRegistrationIdentifier(data);

  if (!identifier) {
    throw new Error("Masukkan email atau nomor HP untuk menerima kode OTP.");
  }

  const result = await postAuthRequest(
    "/auth/register",
    {
      full_name: data.full_name.trim(),
      ...(data.email?.trim() ? { email: data.email.trim() } : {}),
      ...(data.phone?.trim() ? { phone: data.phone.trim() } : {}),
      password: data.password,
      role: data.role,
    },
    "Pendaftaran gagal. Periksa data yang dimasukkan.",
  );

  if (data.email?.trim()) {
    return { ...result, confirmationRequired: true };
  }

  savePendingOtpRegistration(identifier, data.role);
  return { ...result, confirmationRequired: false };
}

export async function verifyOtp({ otp }) {
  const pending = getPendingOtpRegistration();
  if (!pending?.identifier || !pending?.role) {
    throw new Error("Data pendaftaran tidak ditemukan. Silakan daftar kembali.");
  }

  if (pending.role === "consumer") {
    throw new Error(
      "Verifikasi dan login Consumer belum tersedia karena halaman Consumer belum ada. Gunakan akun Seller atau coba lagi setelah halaman Consumer tersedia.",
    );
  }

  const result = await postAuthRequest(
    "/auth/verify-otp",
    { identifier: pending.identifier, otp: otp.trim() },
    "Verifikasi OTP gagal. Periksa kode lalu coba lagi.",
  );

  if (result.user?.role !== pending.role) {
    throw new Error("Role akun tidak sesuai dengan data pendaftaran.");
  }

  const user = await setAndVerifySession(result);
  window.sessionStorage.removeItem(PENDING_OTP_STORAGE_KEY);
  return { user, destination: getDestination(user.role) };
}

export async function login(identifier, password) {
  const result = await postAuthRequest(
    "/auth/login",
    { identifier, password },
    "Login gagal. Periksa identifier dan password Anda.",
  );

  const { user } = result;
  if (!user?.role) {
    throw new Error("Respons login tidak berisi role pengguna yang valid.");
  }

  const destination = getDestination(user.role);
  if (!destination) {
    if (user.role === "consumer") {
      throw new Error(
        "Login Consumer belum tersedia karena halaman Consumer belum ada. Gunakan akun Seller atau coba lagi setelah halaman Consumer tersedia.",
      );
    }
    throw new Error("Role akun ini tidak diizinkan masuk ke panel yang tersedia.");
  }

  await setAndVerifySession(result);
  return { user, destination };
}

export async function logout() {
  let logoutError = null;
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    logoutError = new Error(`Gagal mendapatkan session: ${sessionError.message}`);
  } else if (session?.access_token) {
    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "Logout pada server gagal."),
        );
      }
    } catch (error) {
      logoutError = error instanceof Error ? error : new Error("Logout pada server gagal.");
    }
  }

  const { error: signOutError } = await supabase.auth.signOut();

  if (logoutError) throw logoutError;
  if (signOutError) {
    throw new Error(`Gagal menghapus session lokal: ${signOutError.message}`);
  }
}
