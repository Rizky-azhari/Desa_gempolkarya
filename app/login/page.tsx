"use client";

import React, { useEffect, useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function clearSession() {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch (e) {
        console.error("Failed to clear session on login load:", e);
      } finally {
        setLoading(false);
      }
    }
    clearSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFFF5] flex items-center justify-center font-sans">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orinoco/30 border-t-[#48521C]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFFF5] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <LoginForm />
    </div>
  );
}
