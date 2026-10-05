import ProductForm from "../../_components/ProductForm";

export const metadata = {
  title: "Edit Produk | ReMeal",
};

export default async function EditSellerProductPage({ params }) {
  const { id } = await params;
  return <ProductForm mode="edit" productId={id} />;
}