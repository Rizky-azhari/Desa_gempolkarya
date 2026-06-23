import UMKMClient from "./UMKMClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Direktori UMKM & Usaha Warga",
  description: "Dukung usaha mikro warga Desa Gempolkarya. Temukan produk lokal kuliner tradisional, kriya anyaman bambu, komoditas hasil pertanian pangan, dan hubungi kontak WhatsApp pemilik secara langsung.",
  alternates: {
    canonical: "/umkm",
  },
};

export default function Page() {
  return <UMKMClient />;
}
