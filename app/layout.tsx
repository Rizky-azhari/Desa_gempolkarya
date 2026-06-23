import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/ui-custom/FloatingWhatsApp";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const headingFont = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://desa-gempolkarya.vercel.app"),
  title: {
    default: "Website Resmi Desa Gempolkarya | Tirtajaya, Karawang",
    template: "%s | Website Resmi Desa Gempolkarya"
  },
  description: "Portal resmi pelayanan publik, berita pembangunan, demografi, dan profil Desa Gempolkarya, Kecamatan Tirtajaya, Kabupaten Karawang.",
  keywords: [
    "Desa Gempolkarya",
    "Website Resmi Desa Gempolkarya",
    "Desa Gempolkarya Kecamatan Tirtajaya",
    "Desa Gempolkarya Kabupaten Karawang",
    "Layanan Desa Gempolkarya",
    "Pengaduan Desa Gempolkarya",
    "Berita Desa Gempolkarya",
    "Kantor Desa Gempolkarya",
    "Tirtajaya",
    "Karawang",
    "Pemerintahan Desa Gempolkarya"
  ],
  authors: [{ name: "Pemerintah Desa Gempolkarya" }],
  creator: "Pemerintah Desa Gempolkarya",
  publisher: "Pemerintah Desa Gempolkarya",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://desa-gempolkarya.vercel.app",
    title: "Website Resmi Desa Gempolkarya",
    description: "Portal pelayanan online, pengaduan masyarakat, data demografi, dan informasi kegiatan pembangunan di Desa Gempolkarya, Kecamatan Tirtajaya, Kabupaten Karawang.",
    siteName: "Desa Gempolkarya",
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Resmi Desa Gempolkarya",
    description: "Portal pelayanan online, pengaduan masyarakat, data demografi, dan informasi kegiatan pembangunan di Desa Gempolkarya.",
  },
  verification: {
    google: "E_Gh3eHCTGncsSg0E5ZQSqKjVxR0joEbNEi4L5nCpB0",
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "GovernmentOffice",
  "@id": "https://desa-gempolkarya.vercel.app/#government",
  "name": "Pemerintah Desa Gempolkarya",
  "alternateName": "Website Resmi Desa Gempolkarya",
  "description": "Kantor pelayanan pemerintahan Desa Gempolkarya, Kecamatan Tirtajaya, Kabupaten Karawang, Jawa Barat.",
  "url": "https://desa-gempolkarya.vercel.app",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jl. Raya Gempolkarya No. 01, Kecamatan Tirtajaya",
    "addressLocality": "Kabupaten Karawang",
    "addressRegion": "Jawa Barat",
    "postalCode": "41358",
    "addressCountry": "ID"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+6281234567890",
    "contactType": "customer service",
    "areaServed": "ID",
    "availableLanguage": "Indonesian"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <FloatingWhatsApp />
          <Toaster position="top-center" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
