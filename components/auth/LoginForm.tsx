"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, TreePine, Info, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    if (!email || !password) {
      setErrorMsg("Email dan password wajib diisi.");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // 1. Supabase Auth sign-in
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setErrorMsg("Email atau password tidak sesuai.");
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        setErrorMsg("Pengguna tidak ditemukan.");
        setIsLoading(false);
        return;
      }

      // 2. Fetch profile from database
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        setErrorMsg("Profil pengguna belum terdaftar. Hubungi Super Admin.");
        setIsLoading(false);
        return;
      }

      // 3. Check profile status
      if (profile.status !== "Aktif") {
        await supabase.auth.signOut();
        setErrorMsg("Akun Anda tidak aktif. Silakan hubungi Super Admin.");
        setIsLoading(false);
        return;
      }

      // Sync legacy role to local storage for backward compatibility if any
      localStorage.setItem("demo_user_role", profile.role);

      toast.success(`Selamat datang kembali, ${profile.name}!`);

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (e: any) {
      setErrorMsg(e.message || "Terjadi kesalahan koneksi database.");
      setIsLoading(false);
    }
  };



  return (
    <div className="w-full max-w-md">
      <Card className="border-none rounded-[28px] shadow-xl bg-white dark:bg-[#1A1F0D] border dark:border-border/30 overflow-hidden">
        <CardContent className="p-8 sm:p-10 flex flex-col gap-6">

          {/* Header */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#48521C]/10 text-[#48521C] mb-2">
              <TreePine className="h-7 w-7" />
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-textMain">
              Login Dashboard Desa
            </h2>
            <p className="text-xs sm:text-sm text-textMuted leading-relaxed max-w-[280px]">
              Masuk untuk mengelola data dan layanan internal desa.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {errorMsg && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold text-textMain tracking-wide">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-textMuted" />
                <Input
                  id="email"
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 pr-4 py-6 border-orinoco/30 rounded-xl focus-visible:ring-[#48521C] text-xs font-sans placeholder:text-textMuted/50"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-bold text-textMain tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-textMuted" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 py-6 border-orinoco/30 rounded-xl focus-visible:ring-[#48521C] text-xs font-sans placeholder:text-textMuted/50"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain focus:outline-none"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#48521C] hover:bg-[#999F54] text-white font-bold py-6 rounded-xl transition-all duration-200 shadow-md shadow-[#48521C]/10 text-xs mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Masuk Dashboard"}
            </Button>
          </form>


          {/* Footer Back Link */}
          <div className="flex justify-center mt-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-textMuted hover:text-[#48521C] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke Beranda
            </Link>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
