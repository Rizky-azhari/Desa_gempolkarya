import GaleriClient from "./GaleriClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri & Dokumentasi Kegiatan",
  description: "Koleksi dokumentasi foto kegiatan pembangunan fisik, musyawarah desa, program sosial kemasyarakatan, kegiatan Posyandu, dan festival keagamaan di Desa Gempolkarya.",
  alternates: {
    canonical: "/galeri",
  },
};

export default function Page() {
  return <GaleriClient />;
}
