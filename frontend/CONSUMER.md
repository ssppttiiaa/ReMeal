# Dokumentasi Frontend Consumer

## Sebelum

- Area `src/app/consumer/` hanya memiliki halaman home berupa placeholder.
- Belum ada navigasi konsumen, katalog produk, detail produk atau toko, checkout, pembayaran, pesanan, QR pickup, maupun profil.
- Belum ada styling khusus consumer atau penerapan palet warna ReMeal.

## Sesudah

- Area consumer memiliki layout bersama dengan navigasi desktop dan mobile.
- Home menampilkan kategori dan produk rekomendasi.
- Katalog mendukung pencarian, filter kategori, lokasi, dan pengurutan sesuai API.
- Halaman detail produk dan toko, checkout, metode pembayaran, daftar/detail pesanan, QR pickup, dan profil sudah tersedia.
- Tampilan responsif menggunakan palet ReMeal:
  - Biru dongker/ungu gelap: `#281C59`
  - Teal: `#4E8D9C`
  - Hijau mint: `#85C79A`
  - Kuning pucat: `#EDF7BD`

## Route

| Route | Kegunaan |
| --- | --- |
| `/consumer` | Home konsumen |
| `/consumer/products` | Katalog, pencarian, filter, dan urut harga |
| `/consumer/products/[productId]` | Detail produk |
| `/consumer/stores/[storeId]` | Detail UMKM/toko |
| `/consumer/checkout` | Detail pickup dan ringkasan belanja |
| `/consumer/payment` | Pilihan metode pembayaran |
| `/consumer/orders` | Riwayat pesanan |
| `/consumer/orders/[orderId]` | Status dan detail pesanan serta tampilan ulasan |
| `/consumer/qr` | QR pickup pesanan setelah pembayaran terkonfirmasi |
| `/consumer/profile` | Lihat dan ubah profil serta logout |
| `/consumer/auth` | Registrasi konsumen, OTP, dan login |

## Integrasi Backend

- API backend default: `http://localhost:4000/api/v1`. Untuk alamat lain, atur `NEXT_PUBLIC_API_URL`, misalnya `https://api.example.com/api/v1`.
- Jika backend tidak dapat dijangkau, helper API menampilkan pesan koneksi yang menyebut URL yang gagal dihubungi, bukan hanya `Failed to fetch`. Untuk profil, backend yang tidak dapat dijangkau berbeda dari sesi tidak valid; tautan login hanya ditampilkan saat token tidak ada atau API membalas `401`.
- Home, kategori, katalog, detail produk/toko, ulasan toko, pesanan, profil, checkout, pembayaran, dan QR pickup menggunakan data endpoint backend.
- Login, registrasi/OTP, pemulihan kata sandi, profil, pesanan, pembayaran, pembatalan, ulasan/laporan, dan keluhan memakai token dari backend. Token disimpan di `localStorage` browser.
- Checkout mengikuti kontrak backend: satu produk per pesanan. Backend memvalidasi dan mengunci stok saat pesanan dibuat.
- Status pembayaran tidak dibuat di frontend. Gateway mock membutuhkan konfirmasi webhook backend; QR pickup hanya ditampilkan bila API detail pesanan mengembalikan `qr_code`.
- Ulasan hanya dapat dikirim untuk pesanan yang dinyatakan selesai oleh backend.
- Pencarian, kategori, lokasi, radius, dan urutan `nearest`, `almost_gone`, `cheapest`, `highest_rating`, serta `ending_soon` memakai parameter API.

Jalankan backend pada port 4000 dan pastikan konfigurasi CORS mengizinkan origin frontend. Untuk memastikan backend hidup, periksa `http://localhost:4000/health`. Perbaikan error profil terakhir hanya mengubah penanganan error di frontend dan menjalankan backend lokal untuk verifikasi; tidak ada kode backend yang diubah. Untuk pengujian pembayaran mock, gunakan webhook backend; frontend tidak menandai pesanan sebagai lunas.

## Menjalankan Frontend

Dari direktori `frontend`, jalankan:

```powershell
npm run dev
```

Jika PowerShell belum mengenali `npm` atau `node`, tambahkan direktori instalasi Node.js ke `PATH` untuk sesi terminal tersebut:

```powershell
$env:Path = "C:\Program Files\nodejs;$env:Path"
npm run dev
```

Kemudian buka `http://localhost:3000/consumer`. Jika port 3000 sudah digunakan oleh server Next.js yang aktif, gunakan server tersebut.