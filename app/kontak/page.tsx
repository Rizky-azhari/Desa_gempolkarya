import KontakClient from "./KontakClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak Kami",
  description: "Hubungi Kantor Pemerintahan Desa Gempolkarya, Tirtajaya, Karawang. Temukan alamat lengkap kantor desa, nomor telepon, WhatsApp pelayanan publik, email resmi, dan peta lokasi satelit.",
  alternates: {
    canonical: "/kontak",
  },
};

export default function Page() {
  return <KontakClient />;
}
