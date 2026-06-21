"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "./RoleContext";
import { roleMenus } from "@/lib/roles";
import { RoleBadge } from "./RoleBadge";
import {
  LayoutDashboard,
  Landmark,
  BarChart3,
  ClipboardList,
  AlertTriangle,
  Newspaper,
  Store,
  Image as ImageIcon,
  Map,
  Users,
  UserCog,
  Settings,
  X,
  ChevronRight,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { villageProfile } from "@/data/village";

interface DashboardSidebarProps {
  onClose?: () => void;
}

const menuItems = [
  { key: "dashboard", href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { key: "profil-desa", href: "/dashboard/profil-desa", label: "Profil Desa", icon: Landmark },
  { key: "data-desa", href: "/dashboard/data-desa", label: "Data Kependudukan", icon: BarChart3 },
  { key: "layanan", href: "/dashboard/layanan", label: "Layanan Publik", icon: ClipboardList },
  { key: "pengaduan", href: "/dashboard/pengaduan", label: "Pengaduan Warga", icon: AlertTriangle },
  { key: "berita", href: "/dashboard/berita", label: "Berita & Kegiatan", icon: Newspaper },
  { key: "umkm", href: "/dashboard/umkm", label: "Direktori UMKM", icon: Store },
  { key: "galeri", href: "/dashboard/galeri", label: "Galeri Kegiatan", icon: ImageIcon },
  { key: "rt-rw", href: "/dashboard/rt-rw", label: "Rukun Tetangga & RW", icon: Map },
  { key: "perangkat-desa", href: "/dashboard/perangkat-desa", label: "Aparatur Desa", icon: Users },
  { key: "pengguna", href: "/dashboard/pengguna", label: "Kelola Pengguna", icon: UserCog },
  { key: "pengaturan-role", href: "/dashboard/pengaturan-role", label: "Pengaturan Hak Akses", icon: Settings },
];

export function DashboardSidebar({ onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { currentRole, isLoaded } = useRole();

  const allowedMenus = isLoaded ? roleMenus[currentRole] || [] : [];
  const filteredMenuItems = menuItems.filter((item) => allowedMenus.includes(item.key));

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-orinoco/10 shrink-0">
        <div className="flex flex-col gap-0.5">
          <span className="font-heading text-lg font-extrabold text-white tracking-wide">
            {villageProfile.name} Admin
          </span>
          <span className="text-[10px] text-orinoco/70 uppercase tracking-widest font-semibold font-sans">
            Sistem Desa Mandiri
          </span>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-[#FCFFF5] hover:bg-[#3a4217] h-8 w-8 rounded-lg lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Current Active Role Indicator */}
      <div className="px-6 py-4 border-b border-orinoco/10 bg-black/10 flex flex-col gap-1">
        <span className="text-[10px] text-orinoco/70 uppercase font-semibold font-sans tracking-wide">
          Hak Akses Saat Ini
        </span>
        <div className="mt-1">
          {isLoaded ? (
            <RoleBadge role={currentRole} className="!bg-white/15 !text-[#FCFFF5] !border-white/25" />
          ) : (
            <div className="h-5 w-24 bg-white/10 rounded animate-pulse" />
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group text-xs font-semibold font-sans ${
                isActive
                  ? "bg-[#FCFFF5] text-[#1F2A13] shadow-md shadow-black/5"
                  : "text-[#DBDDAF] hover:bg-[#3a4217] hover:text-[#FCFFF5]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-[#48521C]" : "text-[#DBDDAF] group-hover:text-[#FCFFF5]"}`} />
                <span>{item.label}</span>
              </div>
              <ChevronRight className={`h-3 w-3 opacity-0 transition-all ${isActive ? "opacity-30 translate-x-0.5" : "group-hover:opacity-50"}`} />
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-orinoco/10 mt-auto shrink-0 bg-black/5">
        <Link href="/" onClick={onClose} className="w-full">
          <Button
            variant="outline"
            className="w-full justify-center border-orinoco/20 hover:bg-[#3a4217] hover:border-orinoco/30 hover:text-white bg-transparent text-[#DBDDAF] rounded-xl text-xs font-bold gap-2 py-4"
          >
            <Globe className="h-4 w-4" />
            Ke Situs Publik
          </Button>
        </Link>
      </div>
    </div>
  );
}
