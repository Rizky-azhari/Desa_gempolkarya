import PotensiClient from "./PotensiClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Potensi Desa & Keunggulan Wilayah",
  description: "Jelajahi keunggulan komoditas Desa Gempolkarya, pariwisata perkebunan durian bawor, kerajinan kriya anyaman bambu, budidaya perikanan air tawar, serta situs budaya religi desa.",
  alternates: {
    canonical: "/potensi",
  },
};

export default function Page() {
  return <PotensiClient />;
}
