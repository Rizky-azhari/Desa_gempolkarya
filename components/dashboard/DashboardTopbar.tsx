"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Home, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRole } from "./RoleContext";
import { RoleBadge } from "./RoleBadge";
import { villageProfile } from "@/data/village";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface DashboardTopbarProps {
  onMenuToggle: () => void;
}

const routeTitles: Record<string, string> = {
  dashboard: "Overview & Statistik",
  "profil-desa": "Profil Desa",
  "data-desa": "Data Demografi Penduduk",
  layanan: "Administrasi Layanan Publik",
  pengaduan: "Daftar Pengaduan Warga",
  berita: "Manajemen Portal Berita",
  umkm: "Direktori UMKM Desa",
  galeri: "Arsip Galeri Kegiatan",
  "rt-rw": "Data Kewilayahan RT/RW",
  "perangkat-desa": "Aparatur Pemerintahan Desa",
  pengguna: "Kelola Pengguna Dashboard",
  "pengaturan-role": "Konfigurasi Hak Akses Role",
};

export function DashboardTopbar({ onMenuToggle }: DashboardTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentRole, userEmail, userName, isLoaded } = useRole();
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const pageKey = pathname.replace(/^\/dashboard\/?/, "").split("/")[0] || "dashboard";
  const title = routeTitles[pageKey] || "Dashboard Internal";

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      localStorage.removeItem("demo_user_role");
      
      toast.success("Berhasil keluar dari dashboard.");
      router.push("/login");
      router.refresh();
    } catch (e: any) {
      toast.error("Gagal melakukan logout.");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-background/80 backdrop-blur-md border-b border-orinoco/20 dark:border-border/40 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between shrink-0 shadow-sm">
      {/* Left side: Hamburger (mobile only) & Page Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden rounded-xl h-9 w-9 border-orinoco/20"
        >
          <Menu className="h-4 w-4 text-textMain" />
        </Button>
        <div className="flex flex-col">
          <h1 className="font-heading text-sm md:text-base font-extrabold text-textMain dark:text-foreground tracking-tight leading-none">
            {title}
          </h1>
          <span className="hidden sm:inline text-[10px] text-textMuted dark:text-muted-foreground font-semibold font-sans tracking-wide mt-0.5">
            Desa {villageProfile.name}, {villageProfile.regency}
          </span>
        </div>
      </div>

      {/* Right side: Logged-in User info & Logout */}
      <div className="flex items-center gap-3 md:gap-4 font-sans">
        {isLoaded && userName && (
          <div className="flex items-center gap-3 pr-2 border-r border-orinoco/20">
            {/* Avatar Initials */}
            <div className="h-9 w-9 rounded-xl bg-[#48521C] text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
              {getInitials(userName)}
            </div>
            
            {/* Profile Info (hidden on extra small screens) */}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-textMain leading-tight">
                {userName}
              </span>
              <span className="text-[10px] text-textMuted dark:text-muted-foreground font-medium">
                {userEmail}
              </span>
            </div>

            {/* Role Badge */}
            <div className="hidden md:block">
              <RoleBadge role={currentRole} />
            </div>
          </div>
        )}

        {/* Home shortcut button */}
        <Link href="/">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl h-9 w-9 border-orinoco/20 text-textMuted hover:text-[#48521C] hover:bg-[#FCFFF5] transition-colors"
            title="Lihat Situs Publik"
          >
            <Home className="h-4 w-4" />
          </Button>
        </Link>

        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-xl h-9 w-9 border-orinoco/20 text-textMuted hover:text-[#48521C] hover:bg-[#FCFFF5] dark:hover:bg-slate-800 transition-colors cursor-pointer relative"
          title="Ubah Tema"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Logout Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleLogout}
          className="rounded-xl h-9 w-9 border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer"
          title="Keluar dari Dashboard"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
