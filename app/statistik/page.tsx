import StatistikClient from "./StatistikClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistik & Kependudukan",
  description: "Visualisasi data infografis kependudukan resmi Desa Gempolkarya: pertumbuhan penduduk, sebaran kelompok umur, data pekerjaan, dan tingkat pendidikan.",
  alternates: {
    canonical: "/statistik",
  },
};

export default function Page() {
  return <StatistikClient />;
}
