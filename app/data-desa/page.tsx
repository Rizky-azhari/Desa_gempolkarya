import DataDesaClient from "./DataDesaClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Desa & Statistik",
  description: "Transparansi data demografi resmi Desa Gempolkarya: rasio penduduk, sebaran kelompok usia, tingkat pendidikan, mata pencaharian, dan keragaman agama.",
  alternates: {
    canonical: "/data-desa",
  },
};

export default function Page() {
  return <DataDesaClient />;
}
