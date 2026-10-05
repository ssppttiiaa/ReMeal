import RegisterForm from "../_components/RegisterForm";

export const metadata = {
  title: "Daftar Pembeli | ReMeal",
  description: "Buat akun pembeli ReMeal untuk memesan makanan surplus dari UMKM sekitar.",
};

export default function ConsumerRegisterPage() {
  return <RegisterForm role="consumer" />;
}
