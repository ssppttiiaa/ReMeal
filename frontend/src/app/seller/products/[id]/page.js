import { redirect } from "next/navigation";

export default async function ProductAliasPage({ params }) {
  const { id } = await params;

  redirect(`/seller/products/${id}/edit`);
}