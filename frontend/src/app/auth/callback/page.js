"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

const destinations = {
  seller: "/seller",
  super_admin: "/admin",
};

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL belum dikonfigurasi.");
  }

  return apiBaseUrl.replace(/\/$/, "");
}

function clearUrlFragment() {
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}`,
  );
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const hasStarted = useRef(false);
  const [message, setMessage] = useState("Memproses konfirmasi email...");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    async function processConfirmation() {
      const fragment = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = fragment.get("access_token");
      const refreshToken = fragment.get("refresh_token");

      if (!accessToken || !refreshToken) {
        clearUrlFragment();
        setMessage(
          "Tautan konfirmasi tidak valid atau sudah kedaluwarsa. Silakan daftar kembali atau masuk.",
        );
        setIsError(true);
        return;
      }

      clearUrlFragment();

      const { error: setSessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (setSessionError) {
        throw new Error(`Gagal menyimpan session: ${setSessionError.message}`);
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(`Gagal mengambil session: ${sessionError.message}`);
      }
      if (!session?.access_token || !session.user?.id) {
        throw new Error("Session tidak tersedia setelah konfirmasi email.");
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(`Gagal memverifikasi pengguna: ${userError.message}`);
      }
      if (!user?.id || user.id !== session.user.id) {
        throw new Error("Pengguna pada session tidak dapat diverifikasi.");
      }

      const response = await fetch(`${getApiBaseUrl()}/me`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Gagal mengambil profil pengguna (${response.status}). Silakan coba masuk kembali.`,
        );
      }

      const profile = await response.json();
      if (!profile?.id || profile.id !== user.id) {
        throw new Error("Profil yang diterima tidak sesuai dengan pengguna.");
      }

      if (profile.role === "consumer") {
        setMessage(
          "Email berhasil dikonfirmasi dan session telah disimpan. Halaman Consumer belum tersedia di frontend ini.",
        );
        return;
      }

      const destination = destinations[profile.role];
      if (!destination) {
        throw new Error("Role akun tidak dikenali oleh frontend ini.");
      }

      router.replace(destination);
    }

    processConfirmation().catch((error) => {
      setMessage(
        error instanceof Error
          ? error.message
          : "Konfirmasi email gagal diproses. Silakan coba lagi.",
      );
      setIsError(true);
    });
  }, [router]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f5ef] px-6 text-[#202a1e]">
      <p
        className={`max-w-md text-center text-sm ${isError ? "text-[#a33e2b]" : "text-[#55604e]"}`}
        role={isError ? "alert" : "status"}
      >
        {message}
      </p>
    </main>
  );
}
