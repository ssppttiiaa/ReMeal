'use client';

import { useEffect, useState } from 'react';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '');
const TOKEN_KEY = 'remeal.access_token';
const REFRESH_TOKEN_KEY = 'remeal.refresh_token';
const CHECKOUT_KEY = 'remeal.checkout';
const REVIEW_KEY = 'remeal.review.';

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export async function apiRequest(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers);
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (options.body && !isFormData && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers, cache: 'no-store' });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new ApiError(
        `Tidak dapat terhubung ke backend (${API_BASE}). Pastikan server backend berjalan dan URL API benar.`,
        0,
        'API_UNREACHABLE',
      );
    }
    throw error;
  }
  const responseText = await response.text();
  let payload = null;
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      throw new ApiError('Backend mengembalikan respons yang tidak valid.', response.status, 'INVALID_RESPONSE');
    }
  }
  if (response.ok && !responseText && response.status !== 204) {
    throw new ApiError('Backend mengembalikan respons kosong.', response.status, 'EMPTY_RESPONSE');
  }
  if (!response.ok) {
    throw new ApiError(
      payload?.message || `Permintaan gagal (${response.status}).`,
      response.status,
      payload?.code,
    );
  }
  return payload;
}

export async function getConsumerOrder(orderId, token) {
  const order = await apiRequest(`/orders/${orderId}`, { token });
  if (order.product || !order.product_id) return order;
  try {
    return { ...order, product: await apiRequest(`/products/${order.product_id}`) };
  } catch (error) {
    return { ...order, product_lookup_error: error.message };
  }
}

export const getAccessToken = () => typeof window === 'undefined'
  ? null
  : window.localStorage.getItem(TOKEN_KEY);

export function saveSession(session) {
  if (!session?.access_token || !session?.user?.id) {
    throw new Error('Respons autentikasi tidak menyertakan sesi pengguna yang valid.');
  }
  window.localStorage.setItem(TOKEN_KEY, session.access_token);
  if (session.refresh_token) window.localStorage.setItem(REFRESH_TOKEN_KEY, session.refresh_token);
}

export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function saveCheckoutDraft(product, quantity = 1) {
  window.localStorage.setItem(CHECKOUT_KEY, JSON.stringify({ product, quantity }));
}

export function getCheckoutDraft() {
  const value = window.localStorage.getItem(CHECKOUT_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`Data checkout tidak dapat dibaca: ${error.message}`);
  }
}

export function clearCheckoutDraft() {
  window.localStorage.removeItem(CHECKOUT_KEY);
}

export function getStoredReview(orderId) {
  const value = window.localStorage.getItem(`${REVIEW_KEY}${orderId}`);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`Ulasan tersimpan tidak dapat dibaca: ${error.message}`);
  }
}

export function saveStoredReview(orderId, review) {
  window.localStorage.setItem(`${REVIEW_KEY}${orderId}`, JSON.stringify(review));
}

export const formatRupiah = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDateTime = (value) => value
  ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
  : '—';

export function useCountdown(deadline) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    if (!deadline) return undefined;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [deadline]);

  if (now === null) return '…';
  if (!deadline || !Number.isFinite(Date.parse(deadline))) return '—';
  const remaining = Math.max(0, Math.floor((Date.parse(deadline) - now) / 1000));
  const hours = String(Math.floor(remaining / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
  const seconds = String(remaining % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export const statusLabel = (status) => ({
  pending_payment: 'Menunggu pembayaran',
  paid: 'Menunggu konfirmasi toko',
  confirmed: 'Siap diambil',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
  expired: 'Kedaluwarsa',
}[status] || status || 'Status tidak tersedia');
