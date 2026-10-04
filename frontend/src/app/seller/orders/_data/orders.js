export const orderStatuses = [
  "Menunggu Pembayaran",
  "Diproses",
  "Siap Diambil",
  "Selesai",
  "Dibatalkan",
];

export const sampleOrders = [
  {
    id: "RM001",
    status: "Diproses",
    items: [{ name: "Roti Cokelat", quantity: 2, price: 8000 }],
    total: 16000,
    time: "14:20",
    orderedAt: "2 Okt 2026, 14:20",
    pickupDeadline: "2 Okt 2026, 19:30",
    paymentMethod: "QRIS",
    paymentStatus: "Berhasil (data contoh)",
  },
  {
    id: "RM002",
    status: "Siap Diambil",
    items: [{ name: "Rice Bowl Ayam Teriyaki", quantity: 1, price: 21000 }],
    total: 21000,
    time: "14:05",
    orderedAt: "2 Okt 2026, 14:05",
    pickupDeadline: "2 Okt 2026, 19:00",
    paymentMethod: "QRIS",
    paymentStatus: "Berhasil (data contoh)",
  },
  {
    id: "RM003",
    status: "Selesai",
    items: [{ name: "Brownies Cokelat (4 potong)", quantity: 2, price: 19000 }],
    total: 38000,
    time: "13:42",
    orderedAt: "2 Okt 2026, 13:42",
    pickupDeadline: "2 Okt 2026, 18:30",
    paymentMethod: "QRIS",
    paymentStatus: "Berhasil (data contoh)",
  },
  {
    id: "RM004",
    status: "Menunggu Pembayaran",
    items: [{ name: "Donat Cokelat", quantity: 1, price: 7000 }],
    total: 7000,
    time: "13:30",
    orderedAt: "2 Okt 2026, 13:30",
    pickupDeadline: "2 Okt 2026, 19:00",
    paymentMethod: "Belum dipilih",
    paymentStatus: "Menunggu pembayaran",
  },
  {
    id: "RM005",
    status: "Dibatalkan",
    items: [{ name: "Es Kopi Susu Gula Aren", quantity: 1, price: 15000 }],
    total: 15000,
    time: "12:55",
    orderedAt: "2 Okt 2026, 12:55",
    pickupDeadline: null,
    paymentMethod: "QRIS",
    paymentStatus: "Dibatalkan (data contoh)",
  },
];

export function formatOrderPrice(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getOrderQuantity(order) {
  return order.items.reduce((total, item) => total + item.quantity, 0);
}

export function getOrderProductsLabel(order) {
  return order.items.map((item) => item.name).join(", ");
}
