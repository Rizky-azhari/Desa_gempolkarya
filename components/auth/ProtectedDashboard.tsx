"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { canAccessMenu, UserRole } from "@/lib/roles";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedDashboardProps {
  children: React.ReactNode;
}

export function ProtectedDashboard({ children }: ProtectedDashboardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        // Get user profile
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!userProfile) {
          await supabase.auth.signOut();
          router.push("/login");
          return;
        }

        if (userProfile.status !== "Aktif") {
          await supabase.auth.signOut();
          router.push("/login");
          return;
        }

        setProfile(userProfile);
      } catch (error) {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FCFFF5] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orinoco/30 border-t-[#48521C]" />
          <p className="text-xs font-semibold text-[#48521C] tracking-wide animate-pulse">
            Memverifikasi Sesi...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  // Parse path key (e.g. "/dashboard/profil-desa" -> "profil-desa")
  const segments = pathname.split("/").filter(Boolean);
  const menuKey = segments[1] || "dashboard";

  // Check role access
  const hasAccess = canAccessMenu(profile.role as UserRole, menuKey);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#FCFFF5] dark:bg-[#111407] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white dark:bg-[#1A1F0D] border border-orinoco/30 dark:border-border/30 rounded-[28px] p-8 sm:p-10 shadow-xl flex flex-col items-center gap-6">
          <div className="h-16 w-16 rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-600 flex items-center justify-center">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-textMain dark:text-foreground">
              Tidak Memiliki Akses
            </h1>
            <p className="text-xs sm:text-sm text-textMuted dark:text-muted-foreground leading-relaxed">
              Role Anda ({profile.role.replace("_", " ").toUpperCase()}) tidak memiliki izin untuk membuka halaman ini.
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-[#48521C] hover:bg-[#999F54] text-white font-bold py-5 rounded-xl transition-all gap-2 text-xs cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
