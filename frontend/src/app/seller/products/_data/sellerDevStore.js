import { productCategories, sampleProducts } from "./products";

const STORAGE_KEY = "remeal.seller.products.dev";

const statusToApi = {
  Tersedia: "available",
  "Segera Berakhir": "ending_soon",
  "Penjualan Ditutup": "closed",
  Habis: "sold_out",
};

const categories = productCategories.map((name) => ({ id: name, name }));

function createSeedProducts() {
  const now = Date.now();

  return sampleProducts.map((product, index) => {
    const saleStart = new Date(now - 60 * 60 * 1000);
    const orderDeadline = new Date(now + (index + 2) * 60 * 60 * 1000);
    const pickupDeadline = new Date(orderDeadline.getTime() + 60 * 60 * 1000);

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      category_id: product.category,
      photo_url: product.image,
      normal_price: product.price,
      discount_price: product.remealPrice,
      stock: product.stock,
      sale_start_at: saleStart.toISOString(),
      order_deadline_at: orderDeadline.toISOString(),
      pickup_deadline_at: pickupDeadline.toISOString(),
      status: statusToApi[product.status] ?? "available",
    };
  });
}

function readProducts() {
  if (typeof window === "undefined") return createSeedProducts();

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === null) {
    const seeded = createSeedProducts();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) throw new Error("Mock products must be an array.");
    return parsed;
  } catch (error) {
    throw new Error(
      `Data Seller Dev Mode tidak dapat dibaca: ${error instanceof Error ? error.message : "format tidak valid."}`,
    );
  }
}

function writeProducts(products) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function getMockProductCategories() {
  return categories;
}

export function getMockSellerProducts() {
  return readProducts();
}

export function createMockSellerProduct(input) {
  const products = readProducts();
  const product = {
    ...input,
    id: globalThis.crypto.randomUUID(),
    status: "available",
  };
  writeProducts([product, ...products]);
  return product;
}

export function updateMockSellerProduct(productId, input) {
  const products = readProducts();
  const index = products.findIndex((product) => product.id === productId);
  if (index < 0) throw new Error("Produk mock tidak ditemukan.");

  const updated = { ...products[index], ...input };
  products[index] = updated;
  writeProducts(products);
  return updated;
}

export function deleteMockSellerProduct(productId) {
  const products = readProducts();
  const remaining = products.filter((product) => product.id !== productId);
  if (remaining.length === products.length) {
    throw new Error("Produk mock tidak ditemukan.");
  }
  writeProducts(remaining);
}

export function closeMockSellerProduct(productId) {
  const products = readProducts();
  const index = products.findIndex((product) => product.id === productId);
  if (index < 0) throw new Error("Produk mock tidak ditemukan.");

  const closed = { ...products[index], status: "closed" };
  products[index] = closed;
  writeProducts(products);
  return closed;
}
