import ProductForm from "../_components/ProductForm";

export const metadata = {
  title: "Tambah Produk | ReMeal",
};

export default function NewSellerProductPage() {
  return <ProductForm mode="create" />;
}