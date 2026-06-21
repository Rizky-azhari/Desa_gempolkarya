"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TreePine, Mail, Phone, MapPin } from "lucide-react";
import { villageProfile } from "@/data/village";

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith("/dashboard") || pathname === "/login") {
    return null;
  }

  return (
    <footer className="w-full bg-verdun text-eggshell border-t border-orinoco/20">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="flex flex-col gap-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-eggshell text-verdun shadow-sm">
                <TreePine className="h-5 w-5" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight">
                Desa {villageProfile.name}
              </span>
            </div>
            <p className="text-sm text-orinoco/80 max-w-sm font-sans leading-relaxed">
              Website resmi Desa {villageProfile.name}, Kecamatan {villageProfile.district}, Kabupaten {villageProfile.regency}. Menyediakan pelayanan publik transparan dan informasi terkini bagi warga.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href="#"
                className="h-8 w-8 flex items-center justify-center rounded-lg bg-eggshell/10 hover:bg-eggshell/20 text-eggshell transition-all"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="#"
                className="h-8 w-8 flex items-center justify-center rounded-lg bg-eggshell/10 hover:bg-eggshell/20 text-eggshell transition-all"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.71.054 1.139.052 1.9.24 2.502.475.619.24 1.148.559 1.679 1.088.53.528.848 1.057 1.088 1.679.235.602.422 1.363.475 2.502.043.926.054 1.281.054 3.71s-.01 2.784-.054 3.71c-.052 1.139-.24 1.9-.475 2.502-.24.619-.559 1.148-1.088 1.679-.529.53-1.057.848-1.679 1.088-.602.235-1.363.422-2.502.475-.926.043-1.281.054-3.71.054s-2.784-.01-3.71-.054c-1.139-.052-1.9-.24-2.502-.475a4.591 4.591 0 01-1.679-1.088 4.591 4.591 0 01-1.088-1.679c-.235-.602-.422-1.363-.475-2.502-.043-.926-.054-1.281-.054-3.71s.01-2.784.054-3.71c.052-1.139.24-1.9.475-2.502a4.592 4.592 0 011.088-1.679A4.592 4.592 0 017.58 2.42c.602-.236 1.363-.421 2.502-.475.927-.044 1.281-.054 3.71-.054zm0-1.802h-.468C8.457.198 8.084.208 7.15.25c-1.287.058-2.332.262-3.197.6a7.19 7.19 0 00-2.592 1.684A7.19 7.19 0 00.68 5.126c-.338.865-.542 1.91-.6 3.197-.042.934-.052 1.307-.052 4.678 0 3.371.01 3.744.052 4.678.058 1.287.262 2.332.6 3.197a7.19 7.19 0 001.684 2.592 7.19 7.19 0 002.592 1.684c.865.338 1.91.542 3.197.6.934.042 1.307.052 4.678.052 3.371 0 3.744-.01 4.678-.052 1.287-.058 2.332-.262 3.197-.6a7.19 7.19 0 002.592-1.684 7.19 7.19 0 001.684-2.592c.338-.865.542-1.91.6-3.197.042-.934.052-1.307.052-4.678 0-3.371-.01-3.744-.052-4.678-.058-1.287-.262-2.332-.6-3.197a7.19 7.19 0 00-1.684-2.592A7.19 7.19 0 0019.85.85c-.865-.338-1.91-.542-3.197-.6-.934-.042-1.307-.052-4.678-.052zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16.25a4.25 4.25 0 110-8.5 4.25 4.25 0 010 8.5zm7.062-9.105a1.116 1.116 0 11-2.23 0 1.116 1.116 0 012.23 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="#"
                className="h-8 w-8 flex items-center justify-center rounded-lg bg-eggshell/10 hover:bg-eggshell/20 text-eggshell transition-all"
                aria-label="Youtube"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-base font-bold text-orinoco tracking-wide">
              Tautan Cepat
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-orinoco/80 font-sans">
              <li>
                <Link href="/" className="hover:text-eggshell transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-eggshell transition-colors">
                  Profil Desa
                </Link>
              </li>
              <li>
                <Link href="/layanan" className="hover:text-eggshell transition-colors">
                  Layanan Publik
                </Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-eggshell transition-colors">
                  Berita & Kegiatan
                </Link>
              </li>
              <li>
                <Link href="/statistik" className="hover:text-eggshell transition-colors">
                  Statistik Penduduk
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-base font-bold text-orinoco tracking-wide">
              Kontak & Alamat
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-orinoco/80 font-sans">
              <li className="flex gap-2.5 items-start">
                <MapPin className="h-5 w-5 shrink-0 text-smoke" />
                <span>{villageProfile.address}</span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Phone className="h-4 w-4 shrink-0 text-smoke" />
                <span>{villageProfile.phone}</span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Mail className="h-4 w-4 shrink-0 text-smoke" />
                <span>{villageProfile.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-orinoco/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-orinoco/60 font-sans">
          <p>© {currentYear} Pemerintah Desa {villageProfile.name}. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Kebijakan Privasi</a>
            <a href="#" className="hover:underline">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
