"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../../services/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!email.trim() && !phone.trim()) {
      setErrorMessage("Masukkan email atau nomor HP untuk mendaftar.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password harus terdiri dari minimal 8 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi password tidak sama.");
      return;
    }
    if (!role) {
      setErrorMessage("Pilih role akun Anda.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        full_name: fullName,
        email,
        phone,
        password,
        role,
      });
      if (result.confirmationRequired) {
        setSuccessMessage(
          "Pendaftaran berhasil. Silakan buka email Anda dan klik tautan konfirmasi untuk mengaktifkan akun.",
        );
      } else {
        setSuccessMessage("Pendaftaran berhasil. Mengarahkan ke halaman verifikasi OTP...");
        window.setTimeout(() => router.push("/verify-otp"), 700);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Pendaftaran gagal. Silakan coba lagi.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f5ef] px-4 py-10 text-[#202a1e]">
      <section className="w-full max-w-lg rounded-2xl border border-[#202a1e]/[0.08] bg-white p-7 shadow-sm sm:p-9">
        <div className="mb-8">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#202a1e] text-sm font-black text-[#e2f27b]">
            R.
          </span>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Buat akun ReMeal</h1>
          <p className="mt-2 text-sm leading-6 text-[#727a6d]">
            Daftar untuk mulai menggunakan ReMeal.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Nama Lengkap</span>
            <input
              autoComplete="name"
              className="w-full rounded-lg border border-[#202a1e]/15 px-3.5 py-3 text-sm outline-none transition focus:border-[#71833d] focus:ring-2 focus:ring-[#71833d]/15"
              onChange={(event) => setFullName(event.target.value)}
              required
              type="text"
              value={fullName}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Email</span>
            <input
              autoComplete="email"
              className="w-full rounded-lg border border-[#202a1e]/15 px-3.5 py-3 text-sm outline-none transition focus:border-[#71833d] focus:ring-2 focus:ring-[#71833d]/15"
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              value={email}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Nomor HP</span>
            <input
              autoComplete="tel"
              className="w-full rounded-lg border border-[#202a1e]/15 px-3.5 py-3 text-sm outline-none transition focus:border-[#71833d] focus:ring-2 focus:ring-[#71833d]/15"
              onChange={(event) => setPhone(event.target.value)}
              type="tel"
              value={phone}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Password</span>
            <input
              autoComplete="new-password"
              className="w-full rounded-lg border border-[#202a1e]/15 px-3.5 py-3 text-sm outline-none transition focus:border-[#71833d] focus:ring-2 focus:ring-[#71833d]/15"
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Konfirmasi Password</span>
            <input
              autoComplete="new-password"
              className="w-full rounded-lg border border-[#202a1e]/15 px-3.5 py-3 text-sm outline-none transition focus:border-[#71833d] focus:ring-2 focus:ring-[#71833d]/15"
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              type="password"
              value={confirmPassword}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Role</span>
            <select
              className="w-full rounded-lg border border-[#202a1e]/15 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[#71833d] focus:ring-2 focus:ring-[#71833d]/15"
              onChange={(event) => setRole(event.target.value)}
              required
              value={role}
            >
              <option value="">Pilih role</option>
              <option value="consumer">Consumer</option>
              <option value="seller">Seller</option>
            </select>
          </label>

          {errorMessage && (
            <p className="rounded-lg bg-[#fff0ed] px-4 py-3 text-sm text-[#a33e2b]" role="alert">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="rounded-lg bg-[#edf5e4] px-4 py-3 text-sm text-[#35452f]" role="status">
              {successMessage}
            </p>
          )}

          <button
            className="w-full rounded-lg bg-[#202a1e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#35452f] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading || Boolean(successMessage)}
            type="submit"
          >
            {isLoading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#727a6d]">
          Sudah punya akun?{" "}
          <Link className="font-semibold text-[#35452f] underline" href="/login">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
