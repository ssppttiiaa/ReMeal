"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { SELLER_DEV_MODE } from "@/lib/sellerDevMode";
import { getSellerOrders, verifySellerOrderQR } from "@/services/orders";
import { formatOrderPrice } from "../orders/_data/orders";

const demoQrCode = "DEV-RM002";

function messageFromError(error) {
  return error instanceof Error ? error.message : "Verifikasi QR gagal. Silakan coba lagi.";
}

function orderCode(order) {
  return order?.order_code ?? order?.id ?? "—";
}

function productName(order) {
  if (typeof order?.product === "string") return order.product;
  return order?.product?.name ?? order?.product_name ?? "Produk pesanan";
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function ScannerMark() {
  return (
    <svg aria-hidden="true" className="h-12 w-12 text-[#29261F]" fill="none" viewBox="0 0 48 48">
      <path
        d="M7 18V9a2 2 0 0 1 2-2h9M30 7h9a2 2 0 0 1 2 2v9M41 30v9a2 2 0 0 1-2 2h-9M18 41H9a2 2 0 0 1-2-2v-9M16 16h6v6h-6zM27 16h5v5h-5zM16 27h5v5h-5zM27 27h5v5h-5z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function SellerQrPickupPage() {
  const [qrCode, setQrCode] = useState("");
  const [orders, setOrders] = useState([]);
  const [verifiedOrder, setVerifiedOrder] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const scannerRef = useRef(null);

  const refreshOrders = useCallback(async () => {


    setLoadingOrders(true);
    setError("");
    try {
      const response = await getSellerOrders();
      const rows = Array.isArray(response) ? response : response?.data;
      if (!Array.isArray(rows)) throw new Error("Format daftar pesanan dari API tidak valid.");
      setOrders(rows);
    } catch (reason) {
      setError(messageFromError(reason));
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void refreshOrders(); }, 0);
    return () => window.clearTimeout(timer);
  }, [refreshOrders]);

  const stopCamera = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(console.error).finally(() => {
        scannerRef.current.clear();
        scannerRef.current = null;
        setCameraActive(false);
      });
    } else {
      setCameraActive(false);
    }
  }, []);

  useEffect(() => () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(console.error);
    }
  }, []);

  const verifyCode = useCallback(async (value = qrCode) => {
    const code = value.trim();
    if (!code || verifying) return;
    setError("");
    setFeedback("");
    setVerifiedOrder(null);



    setVerifying(true);
    try {
      const response = await verifySellerOrderQR(code);
      const order = response?.data ?? response;
      if (!order || typeof order !== "object") {
        throw new Error("Backend tidak mengembalikan detail pesanan setelah verifikasi.");
      }
      setVerifiedOrder(order);
      setQrCode("");
      setFeedback("QR valid. Pesanan telah ditandai selesai oleh backend.");
      stopCamera();
      await refreshOrders();
    } catch (reason) {
      setError(messageFromError(reason));
    } finally {
      setVerifying(false);
    }
  }, [orders, qrCode, refreshOrders, stopCamera, verifying]);

  async function startCamera(mode = facingMode) {
    setError("");
    setFeedback("");
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop().catch(() => {});
        scannerRef.current.clear();
      }
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;
      setCameraActive(true);
      
      await html5QrCode.start(
        { facingMode: mode },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setQrCode(decodedText);
          void verifyCode(decodedText);
        },
        () => {} // ignore frame errors
      );
    } catch (reason) {
      setError(messageFromError(reason));
      stopCamera();
    }
  }

  const toggleCamera = () => {
    const newMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newMode);
    if (cameraActive) {
      startCamera(newMode);
    }
  };

  const readyCount = orders.filter((order) => order.status === "confirmed" || order.status === "Siap Diambil").length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">Validasi pengambilan</p>
        <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.035em] text-[#29261F] sm:text-[30px]">
          QR Pickup
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#8B8172]">
          Pindai QR atau masukkan kode untuk memverifikasi dan menyelesaikan pesanan.
        </p>
      </header>



      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)]">
        <section aria-label="Pemindaian QR" className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-6">
          <div className="mx-auto flex min-h-[290px] max-w-xl flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#29261F] bg-[#F7F1E7] px-4 py-8 text-center sm:min-h-[340px]">
            <div id="qr-reader" className={cameraActive ? "w-full max-w-sm rounded-lg overflow-hidden" : "hidden"}></div>
            {!cameraActive && (
              <div className="grid h-20 w-20 place-items-center rounded-2xl bg-[#F4C542]"><ScannerMark /></div>
            )}
            <h2 className="mt-5 text-base font-bold text-[#29261F]">Pindai QR Code Pesanan</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[#8B8172]">
              Kamera memerlukan izin browser. Masukkan kode manual jika kamera bermasalah.
            </p>
            <div className="mt-5 flex w-full max-w-sm flex-col gap-2">
              <label className="sr-only" htmlFor="pickup-qr-code">Kode QR pesanan</label>
              <input
                autoComplete="off"
                className="h-11 w-full min-w-0 rounded-lg border border-[#29261F]/20 bg-[#FFF9EF] px-3 text-sm text-[#29261F] outline-none focus:ring-2 focus:ring-[#E89B3C]"
                id="pickup-qr-code"
                onChange={(event) => setQrCode(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void verifyCode();
                  }
                }}
                placeholder="Masukkan kode QR"
                value={qrCode}
              />
              <div className="flex flex-col gap-2 sm:flex-row">
                {cameraActive ? (
                  <>
                    <button className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[#29261F]/20 px-2 text-sm font-semibold text-[#29261F]" onClick={toggleCamera} type="button">
                      Kamera {facingMode === "environment" ? "Depan" : "Belakang"}
                    </button>
                    <button className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[#29261F]/20 px-2 text-sm font-semibold text-[#29261F]" onClick={stopCamera} type="button">
                      Tutup
                    </button>
                  </>
                ) : (
                  <button className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[#29261F]/20 px-4 text-sm font-semibold text-[#29261F] hover:bg-[#F8E7A8]" onClick={() => void startCamera()} type="button">
                    Buka Kamera
                  </button>
                )}
                <button
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[#F4C542] px-4 text-sm font-semibold text-[#29261F] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!qrCode.trim() || verifying}
                  onClick={() => void verifyCode()}
                  type="button"
                >
                  {verifying ? "Memverifikasi…" : "Verifikasi QR"}
                </button>
              </div>

            </div>
          </div>
          <p className="mt-4 text-center text-[11px] text-[#8B8172]">
            {loadingOrders ? "Memuat daftar pesanan…" : `${readyCount} pesanan siap pickup · data dari backend`}
          </p>
        </section>

        <section aria-live="polite" className="space-y-4">
          <article className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-5 sm:p-6">
            <h2 className="text-base font-bold text-[#29261F]">Hasil verifikasi</h2>
            {verifiedOrder ? (
              <>
                <div className="mt-4 rounded-lg bg-[#F4C542] px-4 py-3 text-sm font-bold text-[#29261F]">QR valid · Pesanan selesai</div>
                <dl className="mt-4 divide-y divide-[#29261f]/[0.07]">
                  <div className="py-3"><dt className="text-xs text-[#8B8172]">Nomor pesanan</dt><dd className="mt-1 break-all text-sm font-bold text-[#29261F]">{orderCode(verifiedOrder)}</dd></div>
                  <div className="py-3"><dt className="text-xs text-[#8B8172]">Produk</dt><dd className="mt-1 text-sm font-semibold text-[#29261F]">{productName(verifiedOrder)}</dd></div>
                  <div className="grid grid-cols-2 gap-3 py-3">
                    <div><dt className="text-xs text-[#8B8172]">Jumlah</dt><dd className="mt-1 text-sm font-semibold text-[#29261F]">{verifiedOrder.quantity ?? 0} item</dd></div>
                    <div><dt className="text-xs text-[#8B8172]">Total</dt><dd className="mt-1 text-sm font-semibold text-[#29261F]">{formatOrderPrice(verifiedOrder.total_price ?? 0)}</dd></div>
                  </div>
                  <div className="py-3"><dt className="text-xs text-[#8B8172]">Waktu pengambilan</dt><dd className="mt-1 text-sm font-semibold text-[#29261F]">{formatDate(verifiedOrder.completed_at)}</dd></div>
                </dl>
              </>
            ) : (
              <p className="mt-2 text-sm leading-6 text-[#8B8172]">Hasil scan dan detail pesanan akan muncul di sini.</p>
            )}
          </article>
          {error ? <p className="rounded-lg border border-[#E89B3C] bg-[#FFF9EF] px-4 py-3 text-sm font-medium text-[#29261F]" role="alert">{error}</p> : null}
          {feedback ? <p className="rounded-lg border border-[#29261F]/10 bg-[#F8E7A8] px-4 py-3 text-sm font-medium text-[#29261F]" role="status">{feedback}</p> : null}
          {!loadingOrders && !error && orders.length === 0 ? <p className="rounded-lg bg-[#FFF9EF] p-4 text-sm text-[#8B8172]">Belum ada pesanan untuk toko ini.</p> : null}
        </section>
      </div>
    </div>
  );
}
