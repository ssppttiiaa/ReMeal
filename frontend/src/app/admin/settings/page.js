"use client";

import { useState } from "react";

const initialProfile = {
  name: "Admin ReMeal",
  email: "admin@remeal.id",
};

const initialNotifications = {
  orders: true,
  users: true,
  reports: true,
  system: false,
};

const notificationOptions = [
  { id: "orders", label: "Notifikasi Pesanan", description: "Pembaruan status transaksi dan pesanan platform." },
  { id: "users", label: "Notifikasi Pengguna", description: "Informasi pendaftaran dan aktivitas pengguna." },
  { id: "reports", label: "Notifikasi Laporan", description: "Laporan review atau aktivitas yang perlu ditinjau." },
  { id: "system", label: "Notifikasi Sistem", description: "Informasi pemeliharaan dan status layanan ReMeal." },
];

const fieldClassName =
  "mt-2 h-11 w-full min-w-0 rounded-lg border border-[#202a1e]/10 bg-white px-3 text-sm text-[#30392c] outline-none transition placeholder:text-[#a0a497] focus:border-[#8b9d5e] focus:ring-2 focus:ring-[#dfe8ca]";

function SettingsSection({ title, description, children }) {
  return (
    <section className="min-w-0 rounded-xl border border-[#202a1e]/[0.07] bg-[#fffefa] p-4 sm:p-5">
      <div className="mb-5">
        <h2 className="text-base font-bold text-[#30392c]">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-[#858c7d]">{description}</p>
      </div>
      {children}
    </section>
  );
}

function ProfileDialog({ profile, onCancel, onSave }) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [errors, setErrors] = useState({});

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Nama wajib diisi.";
    if (!email.trim()) nextErrors.email = "Email wajib diisi.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Masukkan alamat email yang valid.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSave({ name: name.trim(), email: email.trim() });
  }

  return (
    <div
      aria-labelledby="profile-dialog-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#202a1e]/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
      role="dialog"
    >
      <form
        className="my-auto w-full max-w-lg rounded-xl bg-[#fffefa] p-5 shadow-xl sm:p-6"
        noValidate
        onSubmit={submit}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#30392c]" id="profile-dialog-title">Edit Profil</h2>
            <p className="mt-1 text-xs leading-5 text-[#858c7d]">Perubahan hanya disimpan sementara di halaman ini.</p>
          </div>
          <button
            aria-label="Tutup edit profil"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg text-[#727a6d] transition hover:bg-[#f4f5ef]"
            onClick={onCancel}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-[#4d5548]">Nama</span>
            <input
              aria-invalid={Boolean(errors.name)}
              className={fieldClassName}
              onChange={(event) => setName(event.target.value)}
              value={name}
            />
            {errors.name ? <span className="mt-1 block text-xs text-[#a34d3e]">{errors.name}</span> : null}
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[#4d5548]">Email</span>
            <input
              aria-invalid={Boolean(errors.email)}
              className={fieldClassName}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              value={email}
            />
            {errors.email ? <span className="mt-1 block text-xs text-[#a34d3e]">{errors.email}</span> : null}
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#202a1e]/10 px-5 text-sm font-semibold text-[#596745] transition hover:bg-[#f4f5ef]"
            onClick={onCancel}
            type="button"
          >
            Batal
          </button>
          <button
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#202a1e] px-5 text-sm font-semibold text-white transition hover:bg-[#35432f]"
            type="submit"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}

function PasswordDialog({ onCancel, onSave }) {
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState({});

  function updatePassword(field, value) {
    setPasswords((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!passwords.current) nextErrors.current = "Password lama wajib diisi.";
    if (!passwords.next) nextErrors.next = "Password baru wajib diisi.";
    if (!passwords.confirm) nextErrors.confirm = "Konfirmasi password wajib diisi.";
    else if (passwords.next && passwords.confirm !== passwords.next) {
      nextErrors.confirm = "Konfirmasi password tidak sama.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPasswords({ current: "", next: "", confirm: "" });
    onSave();
  }

  const fields = [
    { key: "current", label: "Password Lama", autocomplete: "current-password" },
    { key: "next", label: "Password Baru", autocomplete: "new-password" },
    { key: "confirm", label: "Konfirmasi Password Baru", autocomplete: "new-password" },
  ];

  return (
    <div
      aria-labelledby="password-dialog-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#202a1e]/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
      role="dialog"
    >
      <form
        className="my-auto w-full max-w-lg rounded-xl bg-[#fffefa] p-5 shadow-xl sm:p-6"
        noValidate
        onSubmit={submit}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#30392c]" id="password-dialog-title">Ubah Password</h2>
            <p className="mt-1 text-xs leading-5 text-[#858c7d]">
              Form simulasi. Password tidak dikirim atau disimpan.
            </p>
          </div>
          <button
            aria-label="Tutup ubah password"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg text-[#727a6d] transition hover:bg-[#f4f5ef]"
            onClick={onCancel}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {fields.map(({ key, label, autocomplete }) => (
            <label className="block" key={key}>
              <span className="text-xs font-semibold text-[#4d5548]">{label}</span>
              <input
                aria-invalid={Boolean(errors[key])}
                autoComplete={autocomplete}
                className={fieldClassName}
                onChange={(event) => updatePassword(key, event.target.value)}
                type="password"
                value={passwords[key]}
              />
              {errors[key] ? <span className="mt-1 block text-xs text-[#a34d3e]">{errors[key]}</span> : null}
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#202a1e]/10 px-5 text-sm font-semibold text-[#596745] transition hover:bg-[#f4f5ef]"
            onClick={onCancel}
            type="button"
          >
            Batal
          </button>
          <button
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#202a1e] px-5 text-sm font-semibold text-white transition hover:bg-[#35432f]"
            type="submit"
          >
            Simpan Password
          </button>
        </div>
      </form>
    </div>
  );
}

function ConfirmationDialog({ title, message, confirmLabel, onCancel, onConfirm }) {
  return (
    <div
      aria-labelledby="confirmation-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#202a1e]/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
      role="alertdialog"
    >
      <section className="w-full max-w-md rounded-xl bg-[#fffefa] p-5 shadow-xl sm:p-6">
        <h2 className="text-base font-bold text-[#30392c]" id="confirmation-title">{title}</h2>
        <p className="mt-2 break-words text-sm leading-6 text-[#727a6d]">{message}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#202a1e]/10 px-5 text-sm font-semibold text-[#596745] transition hover:bg-[#f4f5ef]"
            onClick={onCancel}
            type="button"
          >
            Batal
          </button>
          <button
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#202a1e] px-5 text-sm font-semibold text-white transition hover:bg-[#35432f]"
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

function NotificationToggle({ option, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#202a1e]/[0.07] py-4 last:border-b-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#30392c]">{option.label}</p>
        <p className="mt-1 text-xs leading-5 text-[#858c7d]">{option.description}</p>
      </div>
      <button
        aria-checked={enabled}
        aria-label={option.label}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
          enabled ? "bg-[#637844]" : "bg-[#c9cdc2]"
        }`}
        onClick={onChange}
        role="switch"
        type="button"
      >
        <span className={`h-4 w-4 rounded-full bg-white shadow transition ${enabled ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState(initialProfile);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [language, setLanguage] = useState("Bahasa Indonesia");
  const [appearance, setAppearance] = useState("System");
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  function saveProfile(nextProfile) {
    setProfile(nextProfile);
    setProfileDialogOpen(false);
    setFeedback("Profil berhasil diperbarui sementara di halaman ini.");
  }

  function finishPasswordSimulation() {
    setPasswordDialogOpen(false);
    setFeedback("Validasi password berhasil. Tidak ada password yang disimpan atau dikirim.");
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8b927f]">Preferensi akun</p>
        <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#202a1e] sm:text-[30px]">
          Pengaturan
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#727a6d]">
          Kelola profil admin dan preferensi penggunaan ReMeal.
        </p>
      </header>

      {feedback ? (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-[#637844]/20 bg-[#e9eedf] px-4 py-3 text-sm text-[#536738]" role="status">
          <span>{feedback}</span>
          <button
            aria-label="Tutup notifikasi"
            className="shrink-0 font-semibold"
            onClick={() => setFeedback("")}
            type="button"
          >
            ×
          </button>
        </div>
      ) : null}

      <div className="grid min-w-0 gap-5 xl:grid-cols-2">
        <SettingsSection
          description="Informasi profil yang ditampilkan pada panel administrasi."
          title="Akun Admin"
        >
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#dce9e7] text-lg font-bold text-[#3c6861]">
              {profile.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toLocaleUpperCase("id-ID")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="break-words text-base font-bold text-[#30392c]">{profile.name}</p>
              <p className="mt-1 break-all text-sm text-[#727a6d]">{profile.email}</p>
              <span className="mt-2 inline-flex rounded-full bg-[#eee8f3] px-2.5 py-1.5 text-[11px] font-semibold text-[#725b84]">
                Super Admin
              </span>
            </div>
            <button
              className="inline-flex min-h-10 w-full shrink-0 items-center justify-center rounded-lg border border-[#202a1e]/10 px-4 text-sm font-semibold text-[#596745] transition hover:bg-[#f4f5ef] sm:w-auto"
              onClick={() => setProfileDialogOpen(true)}
              type="button"
            >
              Edit Profil
            </button>
          </div>
        </SettingsSection>

        <SettingsSection
          description="Informasi akun dan pengelolaan kredensial (belum terhubung ke autentikasi)."
          title="Keamanan"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 space-y-3">
              <div>
                <p className="text-xs text-[#858c7d]">Email terakhir digunakan</p>
                <p className="mt-1 break-all text-sm font-semibold text-[#30392c]">{profile.email}</p>
              </div>
              <div>
                <p className="text-xs text-[#858c7d]">Status keamanan akun</p>
                <span className="mt-1.5 inline-flex items-center gap-2 rounded-full bg-[#f8e9d4] px-2.5 py-1.5 text-[11px] font-semibold text-[#94621f]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c58a35]" />
                  Belum terhubung ke autentikasi
                </span>
              </div>
            </div>
            <button
              className="inline-flex min-h-10 w-full shrink-0 items-center justify-center rounded-lg bg-[#202a1e] px-4 text-sm font-semibold text-white transition hover:bg-[#35432f] sm:w-auto"
              onClick={() => setPasswordDialogOpen(true)}
              type="button"
            >
              Ubah Password
            </button>
          </div>
          <p className="mt-4 rounded-lg bg-[#f8f9f4] px-3.5 py-3 text-xs leading-5 text-[#727a6d]">
            Password tidak disimpan atau dikirim. Form hanya mendemonstrasikan validasi frontend.
          </p>
        </SettingsSection>

        <SettingsSection
          description="Pilih pemberitahuan yang ingin ditampilkan di panel Admin."
          title="Notifikasi"
        >
          <div>
            {notificationOptions.map((option) => (
              <NotificationToggle
                enabled={notifications[option.id]}
                key={option.id}
                onChange={() =>
                  setNotifications((current) => ({ ...current, [option.id]: !current[option.id] }))
                }
                option={option}
              />
            ))}
          </div>
        </SettingsSection>

        <SettingsSection
          description="Preferensi ini hanya berlaku lokal dan tidak mengubah tampilan global aplikasi."
          title="Preferensi"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-[#4d5548]">Bahasa</span>
              <select className={fieldClassName} onChange={(event) => setLanguage(event.target.value)} value={language}>
                <option>Bahasa Indonesia</option>
                <option>English</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-[#4d5548]">Tampilan</span>
              <select className={fieldClassName} onChange={(event) => setAppearance(event.target.value)} value={appearance}>
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </label>
          </div>
          <p className="mt-3 text-xs leading-5 text-[#858c7d]">
            Tema tidak diterapkan; pengaturan tampilan global belum tersedia.
          </p>
        </SettingsSection>

        <SettingsSection
          description="Informasi aplikasi dan peran yang digunakan pada UI development ini."
          title="Informasi Sistem"
        >
          <dl className="grid gap-x-6 sm:grid-cols-2">
            {[
              ["Nama Aplikasi", "ReMeal"],
              ["Versi", "1.0.0"],
              ["Role Saat Ini", "Super Admin"],
              ["Status Sistem", "Aktif"],
            ].map(([label, value]) => (
              <div className="border-b border-[#202a1e]/[0.07] py-3 last:border-b-0" key={label}>
                <dt className="text-xs text-[#858c7d]">{label}</dt>
                <dd className="mt-1 text-sm font-semibold text-[#30392c]">{value}</dd>
              </div>
            ))}
          </dl>
        </SettingsSection>

        <section className="min-w-0 rounded-xl border border-[#f0dfd7] bg-[#fffefa] p-4 sm:p-5 xl:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-[#30392c]">Keluar</h2>
              <p className="mt-1 text-xs leading-5 text-[#858c7d]">
                Autentikasi belum terhubung. Tombol ini hanya menampilkan konfirmasi simulasi.
              </p>
            </div>
            <button
              className="inline-flex min-h-10 w-full shrink-0 items-center justify-center rounded-lg border border-[#a34d3e]/25 px-5 text-sm font-semibold text-[#a34d3e] transition hover:bg-[#f8e9e5] sm:w-auto"
              onClick={() => setLogoutDialogOpen(true)}
              type="button"
            >
              Keluar
            </button>
          </div>
        </section>
      </div>

      <p className="text-center text-[11px] text-[#9aa092]">
        Profil dan preferensi disimpan sementara di state halaman. Autentikasi tidak tersedia.
      </p>

      {profileDialogOpen ? (
        <ProfileDialog
          onCancel={() => setProfileDialogOpen(false)}
          onSave={saveProfile}
          profile={profile}
        />
      ) : null}
      {passwordDialogOpen ? (
        <PasswordDialog
          onCancel={() => setPasswordDialogOpen(false)}
          onSave={finishPasswordSimulation}
        />
      ) : null}
      {logoutDialogOpen ? (
        <ConfirmationDialog
          confirmLabel="Keluar"
          message="Apakah Anda yakin ingin keluar?"
          onCancel={() => setLogoutDialogOpen(false)}
          onConfirm={() => {
            setLogoutDialogOpen(false);
            setFeedback("Simulasi konfirmasi selesai. Tidak ada sesi autentikasi yang diakhiri.");
          }}
          title="Konfirmasi Keluar"
        />
      ) : null}
    </div>
  );
}
