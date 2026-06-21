"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useRole } from "@/components/dashboard/RoleContext";
import { roleMenus, roleLabels } from "@/lib/roles";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { ShieldAlert, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentRole, isLoaded } = useRole();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Extract current page key
  // /dashboard -> dashboard
  // /dashboard/profil-desa -> profil-desa
  const pageKey = pathname.replace(/^\/dashboard\/?/, "").split("/")[0] || "dashboard";

  // Check if current page is allowed for the active role
  const isAllowed = isLoaded ? roleMenus[currentRole]?.includes(pageKey) : true;

  return (
    <div className="flex h-screen overflow-hidden bg-eggshell/40 dark:bg-background font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 border-r border-orinoco/20 bg-verdun flex-col text-eggshell h-full">
        <DashboardSidebar />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 bg-verdun border-none text-eggshell w-72">
          <DashboardSidebar onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <DashboardTopbar onMenuToggle={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {!isLoaded ? (
            <div className="flex flex-col gap-6 animate-pulse">
              <div className="h-8 w-48 bg-muted rounded-lg" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-32 bg-muted rounded-2xl" />
                <div className="h-32 bg-muted rounded-2xl" />
                <div className="h-32 bg-muted rounded-2xl" />
              </div>
              <div className="h-96 bg-muted rounded-2xl" />
            </div>
          ) : isAllowed ? (
            children
          ) : (
            <div className="flex items-center justify-center min-h-[60vh] py-12 px-4">
              <Card className="max-w-md w-full border border-red-200 dark:border-red-950/40 rounded-3xl shadow-lg bg-white dark:bg-card">
                <CardContent className="p-8 flex flex-col items-center text-center gap-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                    <Lock className="h-8 w-8" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-heading font-extrabold text-textMain dark:text-foreground">
                      Tidak Memiliki Akses
                    </h2>
                    <p className="text-sm text-textMuted dark:text-muted-foreground font-sans leading-relaxed">
                      Role Anda saat ini (<strong className="text-red-600 dark:text-red-400 font-semibold">{roleLabels[currentRole]}</strong>) tidak memiliki izin untuk membuka halaman ini.
                    </p>
                    <p className="text-xs text-textMuted/80 dark:text-muted-foreground/60 font-sans bg-cardSoft dark:bg-background p-2.5 rounded-xl border border-orinoco/20 dark:border-border/30 mt-2">
                      Silakan hubungi Super Admin untuk penyesuaian hak akses akun Anda.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/dashboard")}
                      className="flex-1 rounded-xl font-semibold border-orinoco/40 text-textMain hover:bg-cardSoft text-xs gap-1.5 py-5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Kembali ke Beranda
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
