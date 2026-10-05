'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiRequest, saveSession } from '../../../lib/consumer-api';

export default function ConsumerAuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || params.get('token_hash');
    const requestedMode = params.get('mode');
    if (token) {
      setResetToken(token);
      setMode('reset');
    } else if (requestedMode === 'forgot') {
      setMode('forgot');
    } else if (requestedMode === 'register') {
      router.replace('/register');
    } else {
      const next = params.get('next');
      router.replace(next ? `/login?next=${encodeURIComponent(next)}` : '/login');
    }
  }, [router]);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            full_name: fullName,
            ...(identifier.includes('@') ? { email: identifier } : { phone: identifier }),
            password,
            role: 'consumer',
          }),
        });
        setMode('verify');
        setMessage('Registrasi berhasil. Masukkan kode OTP yang dikirimkan ke akunmu.');
      } else if (mode === 'verify') {
        const session = await apiRequest('/auth/verify-otp', {
          method: 'POST',
          body: JSON.stringify({ identifier, otp }),
        });
        if (session.user?.role !== 'consumer') throw new Error('Akun ini bukan akun konsumen.');
        saveSession(session);
        router.replace(new URLSearchParams(window.location.search).get('next') || '/consumer');
      } else if (mode === 'forgot') {
        const result = await apiRequest('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ identifier }),
        });
        setMessage(result.message || 'Jika akun terdaftar, instruksi pemulihan akan dikirim.');
      } else if (mode === 'reset') {
        const result = await apiRequest('/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({ token: resetToken, new_password: password }),
        });
        setMode('login');
        setPassword('');
        setMessage(result.message || 'Kata sandi berhasil diperbarui.');
      } else {
        const session = await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ identifier, password }),
        });
        if (session.user?.role !== 'consumer') throw new Error('Akun ini bukan akun konsumen.');
        saveSession(session);
        router.replace(new URLSearchParams(window.location.search).get('next') || '/consumer');
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-card panel">
      <span className="eyebrow">Akun ReMeal</span>
      <h1 className="page-title">{({ register: 'Buat akun konsumen', verify: 'Verifikasi akun', forgot: 'Lupa kata sandi', reset: 'Atur kata sandi baru' })[mode] || 'Masuk ke ReMeal'}</h1>
      <p className="page-subtitle">Gunakan akunmu untuk memesan dan memantau makanan.</p>
      <form onSubmit={submit} className="auth-form">
        {mode === 'register' && <label className="field"><span>Nama lengkap</span><input required autoComplete="name" value={fullName} onChange={event => setFullName(event.target.value)} /></label>}
        {['login', 'register', 'verify', 'forgot'].includes(mode) && <label className="field"><span>{mode === 'verify' ? 'Email atau nomor HP yang didaftarkan' : 'Email atau nomor HP'}</span><input required autoComplete="username" value={identifier} onChange={event => setIdentifier(event.target.value)} /></label>}
        {mode === 'verify' && <label className="field"><span>Kode OTP</span><input required autoComplete="one-time-code" value={otp} onChange={event => setOtp(event.target.value)} /></label>}
        {mode === 'reset' && <label className="field"><span>Token pemulihan</span><input required value={resetToken} onChange={event => setResetToken(event.target.value)} /></label>}
        {['login', 'register', 'reset'].includes(mode) && <label className="field"><span>{mode === 'reset' ? 'Kata sandi baru' : 'Kata sandi'}</span><input required minLength={mode === 'register' || mode === 'reset' ? 8 : 1} type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={event => setPassword(event.target.value)} /></label>}
        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p className="form-success" role="status">{message}</p>}
        <button className="button-secondary full-button" type="submit" disabled={loading}>
          {loading ? 'Memproses…' : ({ register: 'Daftar', verify: 'Verifikasi OTP', forgot: 'Kirim instruksi', reset: 'Simpan kata sandi' })[mode] || 'Masuk'}
        </button>
      </form>
      {(mode === 'forgot' || mode === 'reset') && <p className="auth-switch"><Link href="/login" className="text-link">Kembali ke login</Link></p>}
      <Link href="/" className="text-link">Kembali ke beranda</Link>
    </section>
  );
}
