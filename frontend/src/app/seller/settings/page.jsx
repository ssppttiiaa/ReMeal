"use client";

import { useState } from "react";
import { PanelPreferences } from "../../_components/PanelPreferences";

const initialAccount = {
  name: "Roti & Rasa",
  email: "seller@remeal.id",
  phone: "081234567890",
};

const initialNotifications = {
  orders: true,
  expiringProducts: true,
  newReviews: true,
};

const inputClassName =
  "mt-2 h-11 w-full min-w-0 rounded-lg border border-[#29261F]/10 bg-white px-3 text-sm text-[#29261F] outline-none transition placeholder:text-[#8B8172] focus:border-[#29261F] focus:ring-2 focus:ring-[#E89B3C]";

function SettingsSection({ eyebrow, title, description, children }) {
  return (
    <section className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-6">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">{eyebrow}</p>
        <h2 className="mt-1 text-base font-bold text-[#29261F]">{title}</h2>
        {description ? <p className="mt-1 text-xs leading-5 text-[#8B8172]">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function FieldError({ children }) {
  return children ? <p className="mt-1.5 text-xs font-medium text-[#29261F]">{children}</p> : null;
}

function NotificationToggle({ label, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
      <span className="min-w-0">
        <span className="block break-words text-sm font-semibold text-[#29261F]">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-[#8B8172]">{description}</span>
      </span>
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input
          checked={checked}
          className="peer sr-only"
          onChange={onChange}
          type="checkbox"
        />
        <span className="absolute inset-0 rounded-full bg-[#F7F1E7] transition peer-checked:bg-[#F4C542] peer-focus-visible:ring-2 peer-focus-visible:ring-[#E89B3C] peer-focus-visible:ring-offset-2" />
        <span className="absolute left-1 h-4 w-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

function ProfileEditor({ account, onCancel, onSave }) {
  const [draft, setDraft] = useState(account);
  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!draft.name.trim()) nextErrors.name = "Nama wajib diisi.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
      nextErrors.email = "Masukkan alamat email dengan format valid.";
    }
    if (!draft.phone.trim()) nextErrors.phone = "Nomor telepon wajib diisi.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSave({ ...draft, name: draft.name.trim(), email: draft.email.trim() });
    }
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <label className="block">
        <span className="text-xs font-semibold text-[#29261F]">Nama *</span>
        <input
          aria-invalid={Boolean(errors.name)}
          autoComplete="name"
          className={inputClassName}
          onChange={(event) => updateField("name", event.target.value)}
          value={draft.name}
        />
        <FieldError>{errors.name}</FieldError>
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-[#29261F]">Email *</span>
        <input
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          className={inputClassName}
          onChange={(event) => updateField("email", event.target.value)}
          type="email"
          value={draft.email}
        />
        <FieldError>{errors.email}</FieldError>
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-[#29261F]">Nomor Telepon *</span>
        <input
          aria-invalid={Boolean(errors.phone)}
          autoComplete="tel"
          className={inputClassName}
          inputMode="tel"
          onChange={(event) => updateField("phone", event.target.value)}
          type="tel"
          value={draft.phone}
        />
        <FieldError>{errors.phone}</FieldError>
      </label>
      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#29261F]/10 px-5 text-sm font-semibold text-[#29261F] transition hover:bg-[#F7F1E7]"
          onClick={onCancel}
          type="button"
        >
          Batal
        </button>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#FFF9EF] px-5 text-sm font-semibold text-white transition hover:bg-[#E89B3C]"
          type="submit"
        >
          Simpan Perubahan
        </button>
      </div>
    </form>
  );
}

function PasswordEditor({ onCancel, onSuccess }) {
  const [passwords, setPasswords] = useState({ current: "", next: "", confirmation: "" });
  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setPasswords((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!passwords.current) nextErrors.current = "Password lama wajib diisi.";
    if (!passwords.next) nextErrors.next = "Password baru wajib diisi.";
    else if (passwords.next.length < 8) nextErrors.next = "Password baru minimal 8 karakter.";
    if (!passwords.confirmation) nextErrors.confirmation = "Konfirmasi password wajib diisi.";
    else if (passwords.next !== passwords.confirmation) {
      nextErrors.confirmation = "Konfirmasi password belum sama.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onSuccess();
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <label className="block">
        <span className="text-xs font-semibold text-[#29261F]">Password Lama *</span>
        <input
          autoComplete="current-password"
          className={inputClassName}
          onChange={(event) => updateField("current", event.target.value)}
          type="password"
          value={passwords.current}
        />
        <FieldError>{errors.current}</FieldError>
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-[#29261F]">Password Baru *</span>
        <input
          autoComplete="new-password"
          className={inputClassName}
          onChange={(event) => updateField("next", event.target.value)}
          type="password"
          value={passwords.next}
        />
        <FieldError>{errors.next}</FieldError>
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-[#29261F]">Konfirmasi Password Baru *</span>
        <input
          autoComplete="new-password"
          className={inputClassName}
          onChange={(event) => updateField("confirmation", event.target.value)}
          type="password"
          value={passwords.confirmation}
        />
        <FieldError>{errors.confirmation}</FieldError>
      </label>
      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#29261F]/10 px-5 text-sm font-semibold text-[#29261F] transition hover:bg-[#F7F1E7]"
          onClick={onCancel}
          type="button"
        >
          Batal
        </button>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#FFF9EF] px-5 text-sm font-semibold text-white transition hover:bg-[#E89B3C]"
          type="submit"
        >
          Simpan Password
        </button>
      </div>
    </form>
  );
}

export default function SellerSettingsPage() {
  const [account, setAccount] = useState(initialAccount);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [editingProfile, setEditingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [logoutConfirmation, setLogoutConfirmation] = useState(false);

  function saveProfile(updatedAccount) {
    setAccount(updatedAccount);
    setEditingProfile(false);
    setFeedback("Profil berhasil diperbarui sementara di halaman; belum tersimpan ke server.");
  }

  function updateNotification(key, checked) {
    setNotifications((current) => ({ ...current, [key]: checked }));
  }

  function changePassword() {
    setChangingPassword(false);
    setFeedback("Simulasi ubah password berhasil. Password autentikasi tidak diubah.");
  }

  function requestLogout() {
    setLogoutConfirmation(true);
    setFeedback("");
  }

  function confirmLogout() {
    setLogoutConfirmation(false);
    setFeedback("Logout belum tersedia karena autentikasi belum terhubung.");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">Akun seller</p>
        <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#29261F] sm:text-[30px]">
          Pengaturan
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#8B8172]">
          Kelola akun dan preferensi seller.
        </p>
      </header>

      {feedback ? (
        <p
          aria-live="polite"
          className="rounded-xl border border-[#29261F] bg-[#F4C542] px-4 py-3 text-sm font-medium leading-5 text-[#29261F]"
          role="status"
        >
          {feedback}
        </p>
      ) : null}

      <SettingsSection
        description="Informasi akun seller yang digunakan pada profil."
        eyebrow="Akun"
        title="Profil"
      >
        {editingProfile ? (
          <ProfileEditor
            account={account}
            onCancel={() => setEditingProfile(false)}
            onSave={saveProfile}
          />
        ) : (
          <div>
            <dl className="grid gap-4 sm:grid-cols-3">
              <div className="min-w-0">
                <dt className="text-xs text-[#8B8172]">Nama</dt>
                <dd className="mt-1 break-words text-sm font-semibold text-[#29261F]">{account.name}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-xs text-[#8B8172]">Email</dt>
                <dd className="mt-1 break-words text-sm font-semibold text-[#29261F]">{account.email}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-xs text-[#8B8172]">Nomor Telepon</dt>
                <dd className="mt-1 break-words text-sm font-semibold text-[#29261F]">{account.phone}</dd>
              </div>
            </dl>
            <button
              className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#FFF9EF] px-4 text-sm font-semibold text-white transition hover:bg-[#E89B3C]"
              onClick={() => {
                setFeedback("");
                setEditingProfile(true);
              }}
              type="button"
            >
              Edit Profil
            </button>
          </div>
        )}
      </SettingsSection>

      <SettingsSection
        description="Status keamanan masih berupa informasi contoh; fitur autentikasi belum dihubungkan."
        eyebrow="Keamanan"
        title="Password & keamanan akun"
      >
        {changingPassword ? (
          <PasswordEditor
            onCancel={() => setChangingPassword(false)}
            onSuccess={changePassword}
          />
        ) : (
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold tracking-[0.12em] text-[#29261F]" aria-label="Password">
                ••••••••••
              </p>
              <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#F8E7A8] px-2.5 py-1.5 text-[11px] font-semibold text-[#29261F]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E89B3C]" />
                Belum terhubung
              </span>
            </div>
            <button
              className="inline-flex min-h-10 items-center justify-center self-start rounded-lg border border-[#29261F]/10 px-4 text-sm font-semibold text-[#29261F] transition hover:bg-[#F7F1E7] sm:self-auto"
              onClick={() => {
                setFeedback("");
                setChangingPassword(true);
              }}
              type="button"
            >
              Ubah Password
            </button>
          </div>
        )}
      </SettingsSection>

      <SettingsSection
        description="Pilihan notifikasi hanya aktif selama halaman ini terbuka."
        eyebrow="Notifikasi"
        title="Preferensi notifikasi"
      >
        <div className="divide-y divide-[#29261f]/[0.07]">
          <NotificationToggle
            checked={notifications.orders}
            description="Dapatkan pemberitahuan saat ada pesanan baru."
            label="Notifikasi Pesanan"
            onChange={(event) => updateNotification("orders", event.target.checked)}
          />
          <NotificationToggle
            checked={notifications.expiringProducts}
            description="Ingatkan saat produk mendekati batas waktu penjualan."
            label="Notifikasi Produk Segera Berakhir"
            onChange={(event) => updateNotification("expiringProducts", event.target.checked)}
          />
          <NotificationToggle
            checked={notifications.newReviews}
            description="Beri tahu saat konsumen memberikan review baru."
            label="Notifikasi Review Baru"
            onChange={(event) => updateNotification("newReviews", event.target.checked)}
          />
        </div>
      </SettingsSection>

      <PanelPreferences />

      <SettingsSection
        description="Keluar hanya akan tersedia setelah autentikasi terhubung."
        eyebrow="Sesi"
        title="Sesi akun"
      >
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#29261F] px-5 text-sm font-semibold text-[#29261F] transition hover:bg-[#FFF9EF]"
          onClick={requestLogout}
          type="button"
        >
          Keluar
        </button>
      </SettingsSection>

      {logoutConfirmation ? (
        <div
          aria-labelledby="logout-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF9EF]/45 p-4"
          role="dialog"
        >
          <div className="w-full max-w-md rounded-xl bg-[#FFF9EF] p-5 shadow-xl sm:p-6">
            <h2 className="text-base font-bold text-[#29261F]" id="logout-title">
              Konfirmasi Keluar
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#8B8172]">
              Apakah Anda yakin ingin keluar?
            </p>
            <p className="mt-2 text-xs leading-5 text-[#8B8172]">
              Aksi ini hanya simulasi; autentikasi belum terhubung.
            </p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#29261F]/10 px-4 text-sm font-semibold text-[#29261F] transition hover:bg-[#F7F1E7]"
                onClick={() => setLogoutConfirmation(false)}
                type="button"
              >
                Batal
              </button>
              <button
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#FFF9EF] px-4 text-sm font-semibold text-white transition hover:bg-[#FFF9EF]"
                onClick={confirmLogout}
                type="button"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <p className="text-center text-[11px] text-[#8B8172]">
        Pengaturan contoh — perubahan tidak dikirim atau disimpan ke server.
      </p>
    </div>
  );
}
