import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

// One-time setup route: creates auth users and profiles using Supabase Admin API
// Call: GET /api/setup/seed-users
// Remove or disable this route after first use.

const SEED_USERS = [
  {
    email: "superadmin@desa.go.id",
    password: "SuperAdmin123",
    name: "Super Admin",
    role: "super_admin",
    fixed: true,
  },
  {
    email: "admin@desa.go.id",
    password: "Admin123",
    name: "Staf Admin Desa",
    role: "admin_desa",
    fixed: false,
  },
  {
    email: "kepala.desa@desa.go.id",
    password: "Kepala123",
    name: "Kepala Desa",
    role: "kepala_desa",
    fixed: false,
  },
  {
    email: "sekretaris@desa.go.id",
    password: "Sekretaris123",
    name: "Sekretaris Desa",
    role: "sekretaris_desa",
    fixed: false,
  },
];

export async function GET() {
  try {
    const adminClient = createAdminClient();
    const results: { email: string; status: string; error?: string }[] = [];

    for (const u of SEED_USERS) {
      try {
        // Delete existing user by email first (so we can re-seed cleanly)
        const { data: listData } = await adminClient.auth.admin.listUsers();
        const existing = listData?.users?.find((usr) => usr.email === u.email);

        if (existing) {
          await adminClient.auth.admin.deleteUser(existing.id);
        }

        // Also clean up any orphaned profile rows
        await adminClient
          .from("profiles")
          .delete()
          .eq("email", u.email);

        // Create user via Admin API (handles password hashing + all required fields)
        const { data: created, error: createError } =
          await adminClient.auth.admin.createUser({
            email: u.email,
            password: u.password,
            email_confirm: true, // mark email as confirmed so login works immediately
            user_metadata: { name: u.name },
          });

        if (createError || !created?.user) {
          results.push({
            email: u.email,
            status: "error",
            error: createError?.message ?? "No user returned",
          });
          continue;
        }

        // Insert matching profile
        const { error: profileError } = await adminClient
          .from("profiles")
          .insert({
            id: created.user.id,
            name: u.name,
            email: u.email,
            role: u.role,
            status: "Aktif",
            fixed: u.fixed,
          });

        if (profileError) {
          results.push({
            email: u.email,
            status: "auth_ok_profile_error",
            error: profileError.message,
          });
        } else {
          results.push({ email: u.email, status: "ok" });
        }
      } catch (err: unknown) {
        results.push({
          email: u.email,
          status: "exception",
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    const allOk = results.every((r) => r.status === "ok");
    return NextResponse.json(
      { success: allOk, results },
      { status: allOk ? 200 : 207 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
