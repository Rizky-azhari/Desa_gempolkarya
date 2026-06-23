import PemerintahanClient from "./PemerintahanClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pemerintahan Desa",
  description: "Lihat struktur organisasi pemerintah desa, daftar perangkat desa, jajaran BPD, kepala dusun, serta ketua RT dan RW di Desa Gempolkarya, Kecamatan Tirtajaya, Kabupaten Karawang.",
  alternates: {
    canonical: "/pemerintahan",
  },
};

export default function Page() {
  return <PemerintahanClient />;
}
