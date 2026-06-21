import { requireSuperAdmin } from "@/lib/permissions";
import { createAdminClient } from "@/utils/supabase/admin";
import { userEditSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireSuperAdmin();
  if (!authCheck.isSuperAdmin) {
    return authCheck.response;
  }

  const { id } = await params;

  try {
    const adminClient = createAdminClient();

    // Check if user exists and is not fixed (protected)
    const { data: existingProfile, error: getError } = await adminClient
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (getError || !existingProfile) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    if (existingProfile.fixed) {
      return NextResponse.json({ error: "Akun sistem tidak dapat diubah." }, { status: 400 });
    }

    const body = await request.json();
    const result = userEditSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { name, email, password, role, status } = result.data;

    // Do not allow setting role to super_admin for regular users
    if (role === "super_admin") {
      return NextResponse.json({ error: "Tidak diizinkan mengubah role menjadi Super Admin." }, { status: 400 });
    }

    // Update Supabase Auth if credentials changed
    const authUpdateData: any = {};
    if (email.toLowerCase() !== existingProfile.email.toLowerCase()) {
      authUpdateData.email = email;
    }
    if (password && password.trim() !== "") {
      authUpdateData.password = password;
    }

    if (Object.keys(authUpdateData).length > 0) {
      const { error: authError } = await adminClient.auth.admin.updateUserById(id, authUpdateData);
      if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 500 });
      }
    }

    // Update the profile table details
    const { data: updatedProfile, error: profileError } = await adminClient
      .from("profiles")
      .update({
        name,
        email,
        role,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Terjadi kesalahan server." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireSuperAdmin();
  if (!authCheck.isSuperAdmin) {
    return authCheck.response;
  }

  const { id } = await params;

  try {
    const adminClient = createAdminClient();

    // Check if user exists and is not fixed (protected)
    const { data: existingProfile, error: getError } = await adminClient
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (getError || !existingProfile) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    if (existingProfile.fixed) {
      return NextResponse.json({ error: "Akun sistem tidak dapat dihapus." }, { status: 400 });
    }

    // Delete user in Supabase Auth (profiles will cascade delete)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(id);
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Pengguna berhasil dihapus." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Terjadi kesalahan server." }, { status: 500 });
  }
}
