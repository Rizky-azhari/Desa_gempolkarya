import HomeClient from "./HomeClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website Resmi Desa Gempolkarya | Tirtajaya, Karawang",
  description: "Portal resmi pelayanan publik, berita pembangunan, data kependudukan, profil desa, dan pengaduan warga Desa Gempolkarya, Kecamatan Tirtajaya, Kabupaten Karawang.",
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  return <HomeClient />;
}
