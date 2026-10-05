"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { SELLER_DEV_MODE } from "../../lib/sellerDevMode";
import { ADMIN_DEV_MODE } from "../../lib/adminDevMode";

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL belum dikonfigurasi.");
  }

  return apiBaseUrl.replace(/\/$/, "");
}

function getDestination(role) {
  if (role === "seller") return "/seller";
  if (role === "super_admin") return "/admin";
  return null;
}

export default function PanelAuthGuard({ role, children }) {
  const router = useRouter();
  const [status, setStatus] = useState("checking");
  const [errorMessage, setErrorMessage] = useState("");
  const skipPanelAuth =
    (role === "seller" && SELLER_DEV_MODE) ||
    (role === "super_admin" && ADMIN_DEV_MODE);

  useEffect(() => {
    if (skipPanelAuth) return undefined;

    let active = true;

    async function checkSession(session) {
      if (!session?.access_token) {
        router.replace("/login");
        return;
      }

      setStatus("checking");
      setErrorMessage("");

      try {
        const response = await fetch(`${getApiBaseUrl()}/me`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (response.status === 401) {
          await supabase.auth.signOut();
          router.replace("/login");
          return;
        }

        if (response.status === 403) {
          await supabase.auth.signOut();
          router.replace("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`Gagal memverifikasi session (${response.status}).`);
        }

        const profile = await response.json();
        const destination = getDestination(profile?.role);

        if (!destination) {
          await supabase.auth.signOut();
          router.replace("/login");
          return;
        }

        if (profile.role !== role) {
          router.replace(destination);
          return;
        }

        if (active) setStatus("ready");
      } catch (error) {
        if (active) {
          setErrorMessage(
            error instanceof Error ? error.message : "Gagal memverifikasi session.",
          );
          setStatus("error");
        }
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => {
        if (active) void checkSession(session);
      }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [role, router, skipPanelAuth]);

  if (skipPanelAuth) return children;

  if (status === "ready") return children;

  if (status === "error") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f4f5ef] px-6 text-[#202a1e]">
        <p className="max-w-md text-center text-sm" role="alert">
          {errorMessage}
        </p>
      </main>
    );
  }

  return (
    <main
      aria-label="Memverifikasi session"
      className="grid min-h-screen place-items-center bg-[#f4f5ef] text-sm text-[#55604e]"
    >
      Memverifikasi session...
    </main>
  );
}
