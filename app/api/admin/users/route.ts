import { requireSuperAdmin } from "@/lib/permissions";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { userCreateSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

export async function GET() {
  const authCheck = await requireSuperAdmin();
  if (!authCheck.isSuperAdmin) {
    return authCheck.response;
  }

  const supabase = await createClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(profiles);
}

export async function POST(request: Request) {
  const authCheck = await requireSuperAdmin();
  if (!authCheck.isSuperAdmin) {
    return authCheck.response;
  }

  try {
    const body = await request.json();
    const result = userCreateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { name, email, password, role, status } = result.data;

    // Direct role safety check
    if (role === "super_admin") {
      return NextResponse.json({ error: "Tidak diizinkan mendaftarkan role Super Admin baru." }, { status: 400 });
    }

    const adminClient = createAdminClient();
    
    // Create user in Supabase Auth using Admin API
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authUser.user) {
      return NextResponse.json({ error: authError?.message || "Gagal membuat user di Supabase Auth." }, { status: 500 });
    }

    // Insert user details into public profiles table
    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .insert({
        id: authUser.user.id,
        name,
        email,
        role,
        status,
        fixed: false,
      })
      .select()
      .single();

    if (profileError) {
      // Rollback Auth user creation if profile insert fails
      await adminClient.auth.admin.deleteUser(authUser.user.id);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json(profile, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Terjadi kesalahan server." }, { status: 500 });
  }
}
