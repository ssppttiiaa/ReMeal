"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "../../services/auth";
import AuthShell, { AuthAlert, AuthField, authButtonClass, authInputClass } from "../_components/AuthShell";

function getSafeNext() {
  if (typeof window === "undefined") return null;
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : null;
}

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const result = await login(identifier.trim(), password);
      const next = getSafeNext();
      // `next` hanya dipakai untuk consumer (halaman consumer yang meminta login).
      const destination =
        result.user.role === "consumer" && next?.startsWith("/consumer") ? next : result.destination;
      router.replace(destination);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell
      badge="Selamat datang kembali 👋"
      title="Satu pintu untuk semua akun ReMeal."
      subtitle="Pembeli, mitra toko, maupun admin — cukup masuk di sini. Kami akan mengarahkanmu ke halaman yang sesuai."
      aside={
        <div className="grid max-w-md grid-cols-3 gap-3 text-center text-xs font-black">
          {[
            ["🛍️", "Pembeli", "#dcebd3"],
            ["🏪", "Mitra Toko", "#ffe4a9"],
            ["🛡️", "Admin", "#f7d4c9"],
          ].map(([icon, label, bg]) => (
            <div
              key={label}
              className="rounded-2xl border-2 border-[#211f1c] p-4 shadow-[3px_3px_0px_0px_#211f1c]"
              style={{ backgroundColor: bg }}
            >
              <div className="text-2xl">{icon}</div>
              <div className="mt-1">{label}</div>
            </div>
          ))}
        </div>
      }
      footer={
        <div className="space-y-2">
          <p>
            Belum punya akun?{" "}
            <Link className="font-black text-[#211f1c] underline underline-offset-4" href="/register" id="login-register-link">
              Daftar sebagai pembeli
            </Link>
          </p>
          <p>
            Punya usaha kuliner?{" "}
            <Link className="font-black text-[#211f1c] underline underline-offset-4" href="/register/seller" id="login-seller-register-link">
              Gabung jadi mitra
            </Link>
          </p>
        </div>
      }
    >
      <h1 className="text-3xl font-black tracking-tight">Masuk</h1>
      <p className="mt-2 text-sm font-medium text-[#716e68]">Gunakan email atau nomor HP yang terdaftar.</p>

      <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
        <AuthField label="Email atau nomor HP">
          <input
            autoComplete="username"
            className={authInputClass}
            id="login-identifier"
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="nama@email.com"
            required
            type="text"
            value={identifier}
          />
        </AuthField>

        <AuthField label="Kata sandi">
          <input
            autoComplete="current-password"
            className={authInputClass}
            id="login-password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
            type="password"
            value={password}
          />
        </AuthField>

        <div className="text-right">
          <Link className="text-xs font-bold text-[#211f1c] underline underline-offset-4" href="/consumer/auth?mode=forgot">
            Lupa kata sandi?
          </Link>
        </div>

        <AuthAlert>{errorMessage}</AuthAlert>

        <button className={authButtonClass} disabled={isLoading} id="login-submit" type="submit">
          {isLoading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </AuthShell>
  );
}
