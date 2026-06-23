import ProfilClient from "./ProfilClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Desa",
  description: "Pelajari sejarah asal-usul, visi dan misi pembangunan, letak geografis, serta kondisi umum wilayah Desa Gempolkarya, Kecamatan Tirtajaya, Kabupaten Karawang.",
  alternates: {
    canonical: "/profil",
  },
};

export default function Page() {
  return <ProfilClient />;
}
