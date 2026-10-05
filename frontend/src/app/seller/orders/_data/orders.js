export const orderStatuses = [
  "Menunggu Pembayaran",
  "Diproses",
  "Siap Diambil",
  "Selesai",
  "Dibatalkan",
];

export function formatOrderPrice(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getOrderQuantity(order) {
  if (!order || !order.items) return 0;
  return order.items.reduce((total, item) => total + (item.quantity || 1), 0);
}

export function getOrderProductsLabel(order) {
  if (!order || !order.items) return "";
  return order.items.map((item) => item.product_name || item.name).join(", ");
}
