import PengaduanClient from "./PengaduanClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pusat Pengaduan & Aspirasi Warga",
  description: "Layanan aspirasi dan laporan pengaduan online warga Desa Gempolkarya secara transparan dan aman terkait infrastruktur jalan, ketertiban umum, dan pelayanan publik.",
  alternates: {
    canonical: "/pengaduan",
  },
};

export default function Page() {
  return <PengaduanClient />;
}
