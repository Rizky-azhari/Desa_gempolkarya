"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();

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

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="rounded-xl border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-semibold gap-1.5 cursor-pointer"
    >
      <LogOut className="h-4 w-4" />
      Keluar
    </Button>
  );
}
