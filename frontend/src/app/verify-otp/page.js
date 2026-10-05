"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyOtp } from "../../services/auth";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const result = await verifyOtp({ otp });
      router.replace(result.destination);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Verifikasi OTP gagal. Silakan coba lagi.",
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
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Verifikasi OTP</h1>
          <p className="mt-2 text-sm leading-6 text-[#727a6d]">
            Masukkan kode yang dikirim ke email atau nomor HP yang digunakan saat pendaftaran.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Kode OTP</span>
            <input
              autoComplete="one-time-code"
              className="w-full rounded-lg border border-[#202a1e]/15 px-3.5 py-3 text-sm tracking-[0.2em] outline-none transition focus:border-[#71833d] focus:ring-2 focus:ring-[#71833d]/15"
              inputMode="numeric"
              onChange={(event) => setOtp(event.target.value)}
              required
              type="text"
              value={otp}
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
            {isLoading ? "Memverifikasi..." : "Verifikasi"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#727a6d]">
          Salah memasukkan data?{" "}
          <Link className="font-semibold text-[#35452f] underline" href="/register">
            Daftar kembali
          </Link>
        </p>
      </section>
    </main>
  );
}
