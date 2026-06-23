import BeritaClient from "./BeritaClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Berita & Kegiatan Desa",
  description: "Dapatkan berita pembangunan, agenda musyawarah, pengumuman bantuan sosial, layanan desa, dan dokumentasi kegiatan resmi di Desa Gempolkarya, Kecamatan Tirtajaya, Kabupaten Karawang.",
  alternates: {
    canonical: "/berita",
  },
};

export default function Page() {
  return <BeritaClient />;
}
