import PetaClient from "./PetaClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peta RT & RW Wilayah Desa",
  description: "Direktori administrasi wilayah Rukun Tetangga (RT) dan Rukun Warga (RW) di Desa Gempolkarya, Tirtajaya, Karawang. Lengkap dengan kontak ketua lingkungan dan peta satelit geografis.",
  alternates: {
    canonical: "/peta-rt-rw",
  },
};

export default function Page() {
  return <PetaClient />;
}
