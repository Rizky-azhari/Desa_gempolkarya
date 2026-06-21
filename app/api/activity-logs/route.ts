import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { requireSuperAdmin } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function GET() {
  const authResult = await requireSuperAdmin();
  if (!authResult.isSuperAdmin) {
    return authResult.response || NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const adminClient = createAdminClient();
    const { data: logs, error } = await adminClient
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(logs || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Terjadi kesalahan server." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Tidak terotorisasi." }, { status: 401 });
    }

    // Fetch user profile name
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();

    const body = await request.json();
    const { action, details } = body;

    if (!action) {
      return NextResponse.json({ error: "Action is required." }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("activity_logs")
      .insert({
        user_id: user.id,
        user_email: user.email!,
        user_name: profile?.name || "Staf Desa",
        action,
        details: details || null,
      });

    if (error) {
      console.error("Failed to insert activity log:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Terjadi kesalahan server." }, { status: 500 });
  }
}
