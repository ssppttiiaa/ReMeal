import { notFound } from "next/navigation";
import ProductForm from "../../_components/ProductForm";
import { sampleProducts } from "../../_data/products";

export const metadata = {
  title: "Edit Produk | ReMeal",
};

export default async function EditSellerProductPage({ params }) {
  const { id } = await params;
  const product = sampleProducts.find((item) => item.id === id);

  if (!product) notFound();

  return <ProductForm mode="edit" product={product} />;
}