import LayananClient from "./LayananClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Layanan Publik",
  description: "Informasi daftar pengurusan surat pengantar administrasi kependudukan (KK, KTP, KIA, NIK), SKTM, Surat Keterangan Usaha (SKU) secara online di Desa Gempolkarya.",
  alternates: {
    canonical: "/layanan",
  },
};

export default function Page() {
  return <LayananClient />;
}
