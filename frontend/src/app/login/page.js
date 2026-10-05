"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "../../services/auth";

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
      router.replace(result.destination);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Login gagal. Silakan coba lagi.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f5ef] px-4 py-10 text-[#202a1e]">
      <section className="w-full max-w-md rounded-2xl border border-[#202a1e]/[0.08] bg-white p-7 shadow-sm sm:p-9">
        <div className="mb-8">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#202a1e] text-sm font-black text-[#e2f27b]">
            R.
          </span>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Masuk ke ReMeal</h1>
          <p className="mt-2 text-sm leading-6 text-[#727a6d]">
            Gunakan akun Seller atau Admin untuk melanjutkan. Login Consumer belum tersedia.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Email atau identifier</span>
            <input
              autoComplete="username"
              className="w-full rounded-lg border border-[#202a1e]/15 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[#71833d] focus:ring-2 focus:ring-[#71833d]/15"
              onChange={(event) => setIdentifier(event.target.value)}
              required
              type="text"
              value={identifier}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Password</span>
            <input
              autoComplete="current-password"
              className="w-full rounded-lg border border-[#202a1e]/15 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[#71833d] focus:ring-2 focus:ring-[#71833d]/15"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {errorMessage && (
            <p className="rounded-lg bg-[#fff0ed] px-4 py-3 text-sm text-[#a33e2b]" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            className="w-full rounded-lg bg-[#202a1e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#35452f] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#727a6d]">
          Belum punya akun?{" "}
          <Link className="font-semibold text-[#35452f] underline" href="/register">
            Daftar
          </Link>
        </p>
      </section>
    </main>
  );
}
