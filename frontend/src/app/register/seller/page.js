import RegisterForm from "../../_components/RegisterForm";

export const metadata = {
  title: "Daftar Mitra Toko | ReMeal",
  description: "Daftarkan usaha kulinermu di ReMeal dan jual makanan surplus sebelum terbuang.",
};

export default function SellerRegisterPage() {
  return <RegisterForm role="seller" />;
}
