import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function requireSuperAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      authenticated: false,
      isSuperAdmin: false,
      response: new NextResponse(
        JSON.stringify({ error: "Sesi tidak ditemukan atau kedaluwarsa. Silakan login kembali." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, email, role, status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "super_admin") {
    return {
      authenticated: true,
      isSuperAdmin: false,
      response: new NextResponse(
        JSON.stringify({ error: "Anda tidak memiliki akses (Forbidden)." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  if (profile.status !== "Aktif") {
    return {
      authenticated: true,
      isSuperAdmin: false,
      response: new NextResponse(
        JSON.stringify({ error: "Akun Anda tidak aktif." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  return { authenticated: true, isSuperAdmin: true, user, profile };
}

export async function requireAdminOrSuperAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      authenticated: false,
      isAdminOrSuperAdmin: false,
      response: new NextResponse(
        JSON.stringify({ error: "Sesi tidak ditemukan atau kedaluwarsa. Silakan login kembali." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, email, role, status")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "super_admin" && profile.role !== "admin_desa")) {
    return {
      authenticated: true,
      isAdminOrSuperAdmin: false,
      response: new NextResponse(
        JSON.stringify({ error: "Anda tidak memiliki akses (Forbidden)." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  if (profile.status !== "Aktif") {
    return {
      authenticated: true,
      isAdminOrSuperAdmin: false,
      response: new NextResponse(
        JSON.stringify({ error: "Akun Anda tidak aktif." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  return { authenticated: true, isAdminOrSuperAdmin: true, user, profile };
}
