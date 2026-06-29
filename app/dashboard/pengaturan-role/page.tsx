"use client";

import React, { useEffect, useState } from "react";
import { Shield, Check, X, Info, ShieldAlert, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoggedInUser } from "@/lib/auth";
import { UserRole, roleLabels, roleMenus } from "@/lib/roles";
import { RoleBadge } from "@/components/dashboard/RoleBadge";

export default function RoleSettingsPage() {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    async function checkRole() {
      const activeUser = await getLoggedInUser();
      if (activeUser && activeUser.role === "super_admin") {
        setIsSuperAdmin(true);
      }
    }
    checkRole();
  }, []);

  const roleDescriptions: Record<UserRole, string> = {
    super_admin: "Akses sistem penuh. Memiliki izin mutlak untuk mengelola pengguna, data desa, dan seluruh modul administrasi.",
    admin_desa: "Administrator operasional desa. Memiliki semua hak akses pengelolaan kecuali pengelolaan pengguna dan pengaturan role.",
  };

  const allModules = [
    { key: "dashboard", label: "Overview & Statistik" },
    { key: "profil-desa", label: "Profil Desa" },
    { key: "data-desa", label: "Data Kependudukan" },
    { key: "layanan", label: "Layanan Publik" },
    { key: "pengaduan", label: "Pengaduan Warga" },
    { key: "berita", label: "Berita & Kegiatan" },
    { key: "umkm", label: "Direktori UMKM" },
    { key: "galeri", label: "Galeri Kegiatan" },
    { key: "rt-rw", label: "Rukun Tangga & RW" },
    { key: "perangkat-desa", label: "Aparatur Desa" },
    { key: "pengguna", label: "Kelola Pengguna" },
    { key: "pengaturan-role", label: "Pengaturan Role" },
  ];

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4 text-center font-sans">
        <div className="max-w-md flex flex-col items-center gap-4">
          <ShieldAlert className="h-12 w-12 text-red-500" />
          <h2 className="text-lg font-bold text-textMain">Akses Terbatas</h2>
          <p className="text-xs text-textMuted leading-relaxed">
            Halaman ini hanya dapat diakses oleh akun dengan peran Super Admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-extrabold text-textMain dark:text-foreground tracking-tight">
          Konfigurasi Hak Akses Role
        </h2>
        <p className="text-xs text-textMuted dark:text-muted-foreground">
          Daftar peran internal, deskripsi wewenang, dan matriks hak akses menu pada dashboard desa.
        </p>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(roleLabels).map((roleKey) => {
          const role = roleKey as UserRole;
          return (
            <Card key={role} className="border border-orinoco/20 dark:border-border/40 rounded-2xl shadow-sm bg-white dark:bg-card hover:shadow-md transition-all duration-200">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <RoleBadge role={role} />
                  <Badge variant="outline" className="font-sans text-[10px] text-textMuted dark:text-muted-foreground bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-border/30">
                    {roleMenus[role]?.length || 0} Modul
                  </Badge>
                </div>
                <CardDescription className="text-xs text-textMuted dark:text-muted-foreground font-sans leading-relaxed pt-2">
                  {roleDescriptions[role]}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Permission Matrix Table */}
      <Card className="border border-orinoco/20 dark:border-border/40 rounded-2xl shadow-sm bg-white dark:bg-card overflow-hidden">
        <CardHeader className="p-5 border-b border-orinoco/10 dark:border-border/20 bg-[#FCFFF5] dark:bg-cardSoft/30">
          <CardTitle className="text-sm font-bold text-[#48521C] dark:text-orinoco flex items-center gap-1.5">
            <Shield className="h-4.5 w-4.5" />
            Matriks Otorisasi Akses Menu
          </CardTitle>
          <CardDescription className="text-xs text-textMuted dark:text-muted-foreground">
            Tabel pemetaan hak akses modul dashboard berdasarkan peran pengguna.
          </CardDescription>
        </CardHeader>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-orinoco/20 dark:border-border/40 bg-slate-50/50 dark:bg-slate-900/30 text-textMain dark:text-foreground font-bold">
                <th className="p-4 w-1/4">Modul / Menu Halaman</th>
                {Object.keys(roleLabels).map((roleKey) => (
                  <th key={roleKey} className="p-4 text-center">
                    <span className="truncate max-w-[80px] inline-block text-textMain dark:text-foreground">
                      {roleLabels[roleKey as UserRole]}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-orinoco/10 dark:divide-border/20 text-textMain dark:text-foreground font-sans">
              {allModules.map((module) => (
                <tr key={module.key} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                  <td className="p-4 font-bold text-textMain dark:text-foreground">{module.label}</td>
                  {Object.keys(roleLabels).map((roleKey) => {
                    const role = roleKey as UserRole;
                    const hasAccess = roleMenus[role]?.includes(module.key);
                    return (
                      <td key={roleKey} className="p-4 text-center">
                        <div className="flex justify-center">
                          {hasAccess ? (
                            <div className="h-5 w-5 rounded-full bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 flex items-center justify-center border border-green-200 dark:border-green-900/30">
                              <Check className="h-3 w-3" />
                            </div>
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-red-50/50 dark:bg-red-950/20 text-red-400 dark:text-red-400/80 flex items-center justify-center border border-red-100 dark:border-red-900/30">
                              <X className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
