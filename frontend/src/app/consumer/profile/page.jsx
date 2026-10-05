'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { apiRequest, clearSession, getAccessToken } from '../../../lib/consumer-api';

export default function ProfilePage() {
  const router = useRouter();
  const avatarInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [error, setError] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setError('Masuk untuk melihat dan mengubah profil.');
      setNeedsLogin(true);
      return;
    }
    apiRequest('/me', { token })
      .then(result => {
        setProfile(result);
        setFullName(result.full_name || '');
        setPhone(result.phone || '');
        setAvatarUrl(result.avatar_url || '');
      })
      .catch(requestError => {
        setError(requestError.message);
        setNeedsLogin(requestError.status === 401);
      });
  }, []);

  async function saveProfile(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      let nextAvatarUrl = avatarUrl;
      if (avatarFile) {
        setNotice('Mengunggah foto profil…');
        const formData = new FormData();
        formData.append('file', avatarFile);
        const uploadResult = await apiRequest('/upload/avatars', {
          method: 'POST',
          token: getAccessToken(),
          body: formData,
        });
        const uploadedUrl = uploadResult?.data?.url;
        if (typeof uploadedUrl !== 'string' || !uploadedUrl) {
          throw new Error('Backend tidak mengembalikan URL foto profil yang valid.');
        }
        nextAvatarUrl = uploadedUrl;
      }

      const result = await apiRequest('/me', {
        method: 'PATCH',
        token: getAccessToken(),
        body: JSON.stringify({
          full_name: fullName,
          phone,
          ...(nextAvatarUrl ? { avatar_url: nextAvatarUrl } : {}),
        }),
      });
      setProfile(result);
      setAvatarUrl(result.avatar_url || '');
      setAvatarFile(null);
      setAvatarPreview('');
      setNotice('Profil berhasil diperbarui.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  function selectAvatar(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Pilih file gambar untuk foto profil.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran foto maksimal 5 MB.');
      return;
    }

    setError('');
    setNotice('Foto dipilih. Simpan perubahan untuk memperbarui foto profil.');
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function removeAvatar() {
    if (avatarFile) {
      setAvatarFile(null);
      setAvatarPreview('');
      setAvatarUrl(profile.avatar_url || '');
      setError('');
      setNotice('Foto yang dipilih dibatalkan.');
      return;
    }
    if (profile.avatar_url || avatarUrl) {
      setNotice('Penghapusan foto tersimpan belum didukung oleh backend saat ini.');
      return;
    }

    setAvatarFile(null);
    setAvatarPreview('');
    setAvatarUrl('');
    setError('');
  }

  async function logout() {
    setBusy(true);
    setError('');
    try {
      await apiRequest('/auth/logout', { method: 'POST', token: getAccessToken() });
      clearSession();
      router.replace('/consumer');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitComplaint(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await apiRequest('/complaints', {
        method: 'POST',
        token: getAccessToken(),
        body: JSON.stringify({ subject: complaintSubject.trim(), description: complaintDescription.trim() }),
      });
      setComplaintSubject('');
      setComplaintDescription('');
      setNotice('Keluhan berhasil dikirim ke tim ReMeal.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return <>
    <span className="eyebrow">Akun ReMeal kamu</span><h1 className="page-title">Profil</h1>
    {error && <p className="form-error" role="alert">{error} {needsLogin && <Link href={`/login?next=${encodeURIComponent('/consumer/profile')}`} className="text-link">Masuk</Link>}</p>}
    {notice && <p className="form-success" role="status">{notice}</p>}
    {!profile ? error ? null : <p className="page-subtitle">Memuat profil…</p> : <>
      <section className="profile-head">
        <div className="profile-avatar-control">
          <div className="profile-avatar-frame">
            {avatarPreview || avatarUrl
              ? <img src={avatarPreview || avatarUrl} alt="Foto profil" className="profile-avatar" />
              : <span className="profile-avatar">{profile.full_name?.slice(0, 2)?.toUpperCase() || 'RM'}</span>}
            <button
              className="profile-avatar-upload"
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              aria-label="Pilih foto profil"
              disabled={busy}
            >
              <Camera size={15} />
            </button>
          </div>
          <button className="profile-avatar-remove" type="button" onClick={removeAvatar} disabled={busy}>Remove</button>
          <input
            ref={avatarInputRef}
            className="profile-avatar-input"
            type="file"
            accept="image/*"
            onChange={selectAvatar}
            aria-label="Pilih file foto profil"
          />
        </div>
        <div className="profile-head-copy"><h1>{profile.full_name}</h1><p>{profile.email || profile.phone}</p></div>
        <span className="profile-role">{profile.role}</span>
      </section>
      <form className="panel profile-form" onSubmit={saveProfile}>
        <h2>Informasi profil</h2>
        <label className="field"><span>Nama lengkap</span><input required value={fullName} onChange={event => setFullName(event.target.value)} /></label>
        <label className="field"><span>Nomor HP</span><input value={phone} onChange={event => setPhone(event.target.value)} /></label>
        <button className="button-secondary" type="submit" disabled={busy}>{busy ? 'Menyimpan…' : 'Simpan perubahan'}</button>
      </form>
      <form className="panel profile-form" onSubmit={submitComplaint}>
        <h2>Bantuan dan keluhan</h2>
        <label className="field"><span>Subjek</span><input required value={complaintSubject} onChange={event => setComplaintSubject(event.target.value)} /></label>
        <label className="field"><span>Penjelasan</span><textarea required value={complaintDescription} onChange={event => setComplaintDescription(event.target.value)} /></label>
        <button className="button-outline" type="submit" disabled={busy}>{busy ? 'Mengirim…' : 'Kirim keluhan'}</button>
      </form>
      <button className="button-outline" style={{ marginTop: 22, color: '#a04452' }} disabled={busy} onClick={logout}>{busy ? 'Memproses…' : 'Keluar dari akun'}</button>
    </>}
  </>;
}
