"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createMyStore, getMyStore, updateMyStore, uploadStorePhoto } from "../../../services/stores";

const fieldClassName =
  "mt-2 h-11 w-full min-w-0 rounded-lg border border-[#29261F]/10 bg-white px-3 text-sm text-[#29261F] outline-none transition placeholder:text-[#8B8172] focus:border-[#29261F] focus:ring-2 focus:ring-[#E89B3C]";

function StoreLogo({ src, name, preview = false }) {
  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-xl bg-[#F4C542] text-2xl font-bold text-[#29261F] ${
        preview ? "h-28 w-28" : "h-24 w-24"
      }`}
    >
      {src ? (
        <Image
          alt={`Logo ${name}`}
          className="object-cover"
          fill
          sizes="112px"
          src={src}
          unoptimized
        />
      ) : (
        <span aria-hidden="true">{name.trim().slice(0, 1).toLocaleUpperCase("id-ID") || "T"}</span>
      )}
    </div>
  );
}

function StoreStatus({ isOpen, onChange }) {
  return (
    <section className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-sm font-bold text-[#29261F]">Status Toko</h2>
          <p className="mt-1 text-xs leading-5 text-[#8B8172]">
            Status ini hanya berubah sementara di halaman.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
              isOpen ? "bg-[#F4C542] text-[#29261F]" : "bg-[#FFF9EF] text-[#29261F]"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isOpen ? "bg-[#F4C542]" : "bg-[#E89B3C]"}`} />
            {isOpen ? "Buka" : "Tutup"}
          </span>
          <button
            aria-pressed={isOpen}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#29261F]/10 px-4 text-sm font-semibold text-[#29261F] transition hover:bg-[#F7F1E7]"
            onClick={onChange}
            type="button"
          >
            Ubah ke {isOpen ? "Tutup" : "Buka"}
          </button>
        </div>
      </div>
    </section>
  );
}

function StoreProfile({ store, onEdit }) {
  return (
    <section className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#29261F]">Profil Toko</h2>
          <p className="mt-1 text-xs text-[#8B8172]">Informasi yang ditampilkan kepada konsumen.</p>
        </div>
        <button
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#FFF9EF] px-4 text-sm font-semibold text-white transition hover:bg-[#E89B3C]"
          onClick={onEdit}
          type="button"
        >
          Edit Toko
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
        <StoreLogo name={store.name} src={store.logo} />
        <dl className="grid min-w-0 flex-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <div className="min-w-0 sm:col-span-2">
            <dt className="text-xs text-[#8B8172]">Nama Toko</dt>
            <dd className="mt-1 break-words text-sm font-semibold text-[#29261F]">{store.name}</dd>
          </div>
          <div className="min-w-0 sm:col-span-2">
            <dt className="text-xs text-[#8B8172]">Tipe Bisnis</dt>
            <dd className="mt-1 break-words text-sm leading-6 text-[#29261F]">{store.business_type}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs text-[#8B8172]">Alamat</dt>
            <dd className="mt-1 break-words text-sm leading-5 font-medium text-[#29261F]">{store.address}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs text-[#8B8172]">Nomor Kontak</dt>
            <dd className="mt-1 break-words text-sm font-medium text-[#29261F]">{store.phone}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function OperatingHours({ hours }) {
  return (
    <section className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-6">
      <div>
        <h2 className="text-base font-bold text-[#29261F]">Jam Operasional</h2>
        <p className="mt-1 text-xs text-[#8B8172]">Jadwal buka toko setiap hari.</p>
      </div>
      <div className="mt-5 space-y-2 sm:hidden">
        {hours.map((item) => (
          <article className="flex items-center justify-between gap-3 rounded-lg bg-[#F7F1E7] px-3 py-3" key={item.day}>
            <p className="text-sm font-semibold text-[#29261F]">{item.day}</p>
            <p className="text-right text-xs text-[#29261F]">
              {item.enabled ? `${item.open} - ${item.close}` : "Tutup"}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-5 hidden overflow-hidden rounded-lg border border-[#29261F]/[0.07] sm:block">
        <table className="w-full table-fixed text-left">
          <thead className="bg-[#F7F1E7]">
            <tr className="text-xs font-semibold text-[#8B8172]">
              <th className="w-1/3 px-4 py-3">Hari</th>
              <th className="w-1/3 px-4 py-3">Status</th>
              <th className="w-1/3 px-4 py-3">Jam Operasional</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#29261f]/[0.07]">
            {hours.map((item) => (
              <tr className="text-sm text-[#29261F]" key={item.day}>
                <td className="px-4 py-3 font-medium">{item.day}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold ${item.enabled ? "text-[#29261F]" : "text-[#8B8172]"}`}>
                    {item.enabled ? "Buka" : "Tutup"}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#29261F]">
                  {item.enabled ? `${item.open} - ${item.close}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StoreEditor({ store, onCancel, onSave, isCreating = false }) {
  const committedPreview = useRef(false);
  const [draft, setDraft] = useState(() => ({
    ...store,
    hours: store.hours.map((item) => ({ ...item })),
  }));
  const [preview, setPreview] = useState(store.logo);
  const [photoError, setPhotoError] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!preview || !preview.startsWith("blob:")) return undefined;
    return () => {
      if (preview !== store.logo && !committedPreview.current) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, store.logo]);

  function updateField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function updateHours(index, field, value) {
    setDraft((current) => ({
      ...current,
      hours: current.hours.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
    setErrors((current) => ({ ...current, hours: "" }));
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Pilih file gambar JPG, PNG, atau WebP.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Ukuran logo maksimal 5 MB.");
      event.target.value = "";
      return;
    }

    setPhotoError("");
    setPhotoFile(file);
    const nextPreview = URL.createObjectURL(file);
    setDraft((current) => ({ ...current, logo: nextPreview }));
    setPreview(nextPreview);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!draft.name.trim()) nextErrors.name = "Nama toko wajib diisi.";
    if (!draft.address.trim()) nextErrors.address = "Alamat wajib diisi.";
    if (!draft.phone.trim()) nextErrors.phone = "Kontak wajib diisi.";

    const invalidHours = draft.hours.find(
      (item) => item.enabled && (!item.open || !item.close || item.open >= item.close),
    );
    if (invalidHours) {
      nextErrors.hours = `Jam buka dan tutup ${invalidHours.day} harus valid; jam tutup harus setelah jam buka.`;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setBusy(true);
      try {
        const payload = {
          name: draft.name,
          business_type: draft.business_type || "umkm",
          address: draft.address,
          latitude: draft.latitude || 0,
          longitude: draft.longitude || 0,
          contact_phone: draft.phone,
          opening_hours: draft.hours.filter(h => h.enabled).map(h => ({
            day: h.rawDay,
            open: h.open,
            close: h.close
          }))
        };
        let logoUrl = draft.logo && !draft.logo.startsWith("blob:") ? draft.logo : "";
        if (photoFile) {
          logoUrl = await uploadStorePhoto(photoFile);
        }
        if (logoUrl) {
          payload.photo_url = logoUrl;
        }
        const savedDraft = { ...draft, logo: logoUrl || draft.logo };
        if (isCreating) {
          const res = await createMyStore(payload);
          committedPreview.current = true;
          onSave({ ...savedDraft, id: res.id || res.data?.id });
        } else {
          await updateMyStore(payload);
          committedPreview.current = true;
          onSave(savedDraft);
        }
      } catch (err) {
        setErrors({ form: err.message });
      } finally {
        setBusy(false);
      }
    }
  }

  return (
    <form className="mx-auto max-w-4xl space-y-5" noValidate onSubmit={handleSubmit}>
      <section className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-6">
        <h2 className="text-base font-bold text-[#29261F]">{isCreating ? "Buat Toko Baru" : "Edit Profil Toko"}</h2>
        {errors.form && <p className="mt-2 text-sm text-red-500">{errors.form}</p>}
        <div className="mt-5 grid gap-5 sm:grid-cols-[150px_minmax(0,1fr)]">
          <div>
            <p className="text-xs font-semibold text-[#29261F]">Foto/Logo Toko</p>
            <label className="mt-2 flex cursor-pointer flex-col items-center rounded-lg border border-dashed border-[#29261F] bg-[#F7F1E7] p-3 text-center transition hover:border-[#29261F]">
              <StoreLogo name={draft.name} preview src={preview} />
              <span className="mt-2 text-[11px] font-semibold text-[#29261F]">
                {preview ? "Ganti foto" : "Pilih foto"}
              </span>
              <span className="mt-1 text-[10px] text-[#8B8172]">JPG, PNG, atau WebP · maks. 5 MB</span>
              <input
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={handlePhotoChange}
                type="file"
              />
            </label>
            {photoError ? <p className="mt-1.5 text-xs font-medium text-[#29261F]">{photoError}</p> : null}
          </div>

          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-[#29261F]">Nama Toko *</span>
              <input
                aria-invalid={Boolean(errors.name)}
                className={fieldClassName}
                onChange={(event) => updateField("name", event.target.value)}
                value={draft.name}
              />
              {errors.name ? <span className="mt-1 block text-xs text-[#29261F]">{errors.name}</span> : null}
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-[#29261F]">Tipe Bisnis</span>
              <select
                className={fieldClassName}
                onChange={(event) => updateField("business_type", event.target.value)}
                value={draft.business_type}
              >
                <option value="umkm">UMKM</option>
                <option value="cafe">Cafe</option>
                <option value="warung_makan">Warung Makan</option>
                <option value="supermarket">Supermarket</option>
                <option value="bakery">Bakery</option>
                <option value="other">Lainnya</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-[#29261F]">Alamat *</span>
              <input
                aria-invalid={Boolean(errors.address)}
                className={fieldClassName}
                onChange={(event) => updateField("address", event.target.value)}
                value={draft.address}
              />
              {errors.address ? <span className="mt-1 block text-xs text-[#29261F]">{errors.address}</span> : null}
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-[#29261F]">Nomor Kontak *</span>
              <input
                aria-invalid={Boolean(errors.phone)}
                className={fieldClassName}
                inputMode="tel"
                onChange={(event) => updateField("phone", event.target.value)}
                type="tel"
                value={draft.phone}
              />
              {errors.phone ? <span className="mt-1 block text-xs text-[#29261F]">{errors.phone}</span> : null}
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-6">
        <h2 className="text-base font-bold text-[#29261F]">Jam Operasional</h2>
        <p className="mt-1 text-xs leading-5 text-[#8B8172]">
          Atur hari aktif dan jam buka/tutup toko.
        </p>

        <div className="mt-4 space-y-3">
          {draft.hours.map((item, index) => (
            <div
              className="grid min-w-0 gap-3 rounded-lg bg-[#F7F1E7] p-3 sm:grid-cols-[minmax(85px,0.8fr)_minmax(100px,0.8fr)_minmax(110px,1fr)_minmax(110px,1fr)] sm:items-center"
              key={item.day}
            >
              <p className="text-sm font-semibold text-[#29261F]">{item.day}</p>
              <label className="flex min-h-10 items-center gap-2 text-sm text-[#29261F]">
                <input
                  checked={item.enabled}
                  className="h-4 w-4 accent-[#29261f]"
                  onChange={(event) => updateHours(index, "enabled", event.target.checked)}
                  type="checkbox"
                />
                {item.enabled ? "Buka" : "Tutup"}
              </label>
              <label className="min-w-0">
                <span className="mb-1 block text-[10px] text-[#8B8172]">Jam buka</span>
                <input
                  aria-label={`Jam buka ${item.day}`}
                  className={fieldClassName.replace("mt-2 ", "")}
                  disabled={!item.enabled}
                  onChange={(event) => updateHours(index, "open", event.target.value)}
                  type="time"
                  value={item.open}
                />
              </label>
              <label className="min-w-0">
                <span className="mb-1 block text-[10px] text-[#8B8172]">Jam tutup</span>
                <input
                  aria-label={`Jam tutup ${item.day}`}
                  className={fieldClassName.replace("mt-2 ", "")}
                  disabled={!item.enabled}
                  onChange={(event) => updateHours(index, "close", event.target.value)}
                  type="time"
                  value={item.close}
                />
              </label>
            </div>
          ))}
        </div>
        {errors.hours ? <p className="mt-3 text-xs font-medium text-[#29261F]">{errors.hours}</p> : null}
      </section>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {!isCreating && (
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#29261F]/10 px-5 text-sm font-semibold text-[#29261F] transition hover:bg-[#F7F1E7]"
            disabled={busy}
            onClick={onCancel}
            type="button"
          >
            Batal
          </button>
        )}
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#FFF9EF] px-5 text-sm font-semibold text-white transition hover:bg-[#E89B3C] disabled:opacity-50"
          disabled={busy}
          type="submit"
        >
          {busy ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}

const dayNames = {
  mon: "Senin", tue: "Selasa", wed: "Rabu", thu: "Kamis", fri: "Jumat", sat: "Sabtu", sun: "Minggu"
};

export default function SellerStorePage() {
  const [store, setStore] = useState(null);
  const [editing, setEditing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getMyStore()
      .then((res) => {
        if (!active) return;
        const mappedHours = Object.keys(dayNames).map(rawDay => {
          const found = (res.opening_hours || []).find(h => h.day === rawDay);
          return {
            rawDay,
            day: dayNames[rawDay],
            enabled: !!found,
            open: found ? found.open : "08:00",
            close: found ? found.close : "20:00"
          };
        });

        setStore({
          id: res.id,
          name: res.name || "",
          business_type: res.business_type || "umkm",
          address: res.address || "",
          phone: res.contact_phone || "",
          logo: res.photo_url || "",
          latitude: res.latitude || 0,
          longitude: res.longitude || 0,
          isOpen: true,
          hours: mappedHours
        });
      })
      .catch((err) => {
        if (!active) return;
        if (err.message.toLowerCase().includes("tidak ditemukan") || err.message.toLowerCase().includes("not found") || err.message.toLowerCase().includes("belum memiliki toko") || err.status === 403) {
          // Toko belum dibuat, setup initial state kosong untuk pembuatan
          const initialHours = Object.keys(dayNames).map(rawDay => ({
            rawDay,
            day: dayNames[rawDay],
            enabled: true,
            open: "08:00",
            close: "20:00"
          }));
          setStore({
            id: "",
            name: "",
            business_type: "umkm",
            address: "",
            phone: "",
            logo: "",
            latitude: 0,
            longitude: 0,
            isOpen: true,
            hours: initialHours
          });
          setEditing(true);
        } else {
          setError(err.message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!store || !store.logo || !store.logo.startsWith("blob:")) return undefined;
    return () => URL.revokeObjectURL(store.logo);
  }, [store ? store.logo : null]);

  function handleSave(updatedStore) {
    setStore(updatedStore);
    setEditing(false);
    setFeedback("Perubahan toko berhasil disimpan!");
  }

  function handleCancel() {
    setEditing(false);
    setFeedback("");
  }

  function toggleStoreStatus() {
    setStore((current) => ({ ...current, isOpen: !current.isOpen }));
    setFeedback("Status toko berhasil diubah sementara; belum tersimpan ke database.");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">Profil usaha</p>
        <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#29261F] sm:text-[30px]">
          Toko
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#8B8172]">
          Kelola informasi toko dan jam operasional.
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
      
      {error && <p className="text-red-500 font-semibold">{error}</p>}
      
      {loading ? (
        <p>Memuat profil toko...</p>
      ) : store && !editing ? (
        <>
          <StoreStatus isOpen={store.isOpen} onChange={toggleStoreStatus} />
          <StoreProfile onEdit={() => { setFeedback(""); setEditing(true); }} store={store} />
          <OperatingHours hours={store.hours} />
        </>
      ) : store && editing ? (
        <StoreEditor isCreating={!store.id} onCancel={handleCancel} onSave={handleSave} store={store} />
      ) : null}
    </div>
  );
}
