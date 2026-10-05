"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../../services/auth";
import AuthShell, { AuthAlert, AuthField, authButtonClass, authInputClass } from "./AuthShell";

const copy = {
  consumer: {
    badge: "Untuk pembeli 🛍️",
    title: "Makan enak sambil selamatkan makanan.",
    subtitle: "Buat akun pembeli untuk memesan makanan surplus dari UMKM di sekitarmu dengan harga lebih hemat.",
    accent: "#dcebd3",
    heading: "Daftar sebagai pembeli",
    perks: ["Harga surplus lebih hemat", "Pesan & ambil langsung di toko", "Bantu kurangi food waste"],
  },
  seller: {
    badge: "Untuk mitra toko 🏪",
    title: "Ubah surplus jadi pemasukan.",
    subtitle: "Daftarkan usaha kulinermu, jual makanan berlebih sebelum terbuang, dan jangkau pelanggan baru.",
    accent: "#ffe4a9",
    heading: "Daftar sebagai mitra toko",
    perks: ["Kelola produk & stok dengan mudah", "Pembayaran langsung tercatat", "Toko diverifikasi admin agar terpercaya"],
  },
};

export default function RegisterForm({ role }) {
  const router = useRouter();
  const text = copy[role];
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      setErrorMessage("Kata sandi minimal 8 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak sama.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({ full_name: fullName, email, phone, password, role });
      if (result.confirmationRequired) {
        setSuccessMessage("Pendaftaran berhasil! Buka email kamu dan klik tautan konfirmasi untuk mengaktifkan akun.");
      } else {
        setSuccessMessage("Pendaftaran berhasil. Mengarahkan ke verifikasi OTP...");
        window.setTimeout(() => router.push("/verify-otp"), 700);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Pendaftaran gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell
      badge={text.badge}
      title={text.title}
      subtitle={text.subtitle}
      accent={text.accent}
      aside={
        <ul className="max-w-md space-y-3">
          {text.perks.map((perk) => (
            <li
              key={perk}
              className="flex items-center gap-3 rounded-2xl border-2 border-[#211f1c] bg-[#fffdf8] px-4 py-3 text-sm font-bold shadow-[3px_3px_0px_0px_#211f1c]"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-[#211f1c] bg-[#ffc72c] text-xs font-black">✓</span>
              {perk}
            </li>
          ))}
        </ul>
      }
      footer={
        <div className="space-y-2">
          <p>
            Sudah punya akun?{" "}
            <Link className="font-black text-[#211f1c] underline underline-offset-4" href="/login">
              Masuk
            </Link>
          </p>
          {role === "consumer" ? (
            <p>
              Punya usaha kuliner?{" "}
              <Link className="font-black text-[#211f1c] underline underline-offset-4" href="/register/seller">
                Daftar jadi mitra
              </Link>
            </p>
          ) : (
            <p>
              Ingin membeli makanan?{" "}
              <Link className="font-black text-[#211f1c] underline underline-offset-4" href="/register">
                Daftar sebagai pembeli
              </Link>
            </p>
          )}
        </div>
      }
    >
      <span
        className="inline-block rounded-full border-2 border-[#211f1c] px-3 py-1 text-xs font-black lg:hidden"
        style={{ backgroundColor: text.accent }}
      >
        {text.badge}
      </span>
      <h1 className="mt-3 text-3xl font-black tracking-tight lg:mt-0">{text.heading}</h1>
      {role === "seller" ? (
        <p className="mt-3 rounded-xl border-2 border-dashed border-[#211f1c] bg-[#ffe4a9]/60 px-4 py-3 text-xs font-bold leading-5">
          Setelah daftar, lengkapi profil toko. Toko akan aktif setelah disetujui oleh admin.
        </p>
      ) : (
        <p className="mt-2 text-sm font-medium text-[#716e68]">Isi email atau nomor HP — salah satu saja cukup.</p>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <AuthField label={role === "seller" ? "Nama pemilik" : "Nama lengkap"}>
          <input
            autoComplete="name"
            className={authInputClass}
            id={`register-${role}-name`}
            onChange={(event) => setFullName(event.target.value)}
            required
            type="text"
            value={fullName}
          />
        </AuthField>

        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField label="Email">
            <input
              autoComplete="email"
              className={authInputClass}
              id={`register-${role}-email`}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@email.com"
              type="email"
              value={email}
            />
          </AuthField>
          <AuthField label="Nomor HP">
            <input
              autoComplete="tel"
              className={authInputClass}
              id={`register-${role}-phone`}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="08xxxxxxxxxx"
              type="tel"
              value={phone}
            />
          </AuthField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField label="Kata sandi">
            <input
              autoComplete="new-password"
              className={authInputClass}
              id={`register-${role}-password`}
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Min. 8 karakter"
              required
              type="password"
              value={password}
            />
          </AuthField>
          <AuthField label="Ulangi kata sandi">
            <input
              autoComplete="new-password"
              className={authInputClass}
              id={`register-${role}-confirm`}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              type="password"
              value={confirmPassword}
            />
          </AuthField>
        </div>

        <AuthAlert>{errorMessage}</AuthAlert>
        <AuthAlert type="success">{successMessage}</AuthAlert>

        <button
          className={authButtonClass}
          disabled={isLoading || Boolean(successMessage)}
          id={`register-${role}-submit`}
          type="submit"
        >
          {isLoading ? "Mendaftarkan..." : role === "seller" ? "Daftar jadi mitra" : "Buat akun"}
        </button>
      </form>
    </AuthShell>
  );
}
