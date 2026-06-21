import { createClient } from "@/utils/supabase/client";
import { UserRole } from "./roles";

export interface AuthSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "Aktif" | "Nonaktif";
  fixed: boolean;
}

// Get logged-in user profile details (async)
export async function getLoggedInUser(): Promise<AuthSession | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, email, role, status, fixed")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role as UserRole,
    status: profile.status as "Aktif" | "Nonaktif",
    fixed: !!profile.fixed,
  };
}

// Check if email belongs to the fixed Super Admin
export function isSuperAdminFixed(email: string): boolean {
  return email.toLowerCase() === "superadmin@desa.go.id";
}
