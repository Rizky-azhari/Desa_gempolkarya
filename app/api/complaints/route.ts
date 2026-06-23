import { createClient } from "@/utils/supabase/server";
import { generateTicketNumber } from "@/lib/ticket";
import { complaintSchema } from "@/lib/validators";
import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/permissions";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: complaints, error } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(complaints);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = complaintSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const {
      title,
      description,
      category,
      whatsapp,
      reporter_name,
      address,
      rt_rw,
      incident_location,
      photo_url,
      is_anonymous
    } = body;

    const ticketNumber = generateTicketNumber();
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from("complaints")
      .insert({
        ticket_number: ticketNumber,
        reporter_name: is_anonymous ? "Anonim" : (reporter_name || "Umum"),
        whatsapp,
        address,
        rt_rw,
        category,
        title,
        description,
        incident_location,
        photo_url,
        is_anonymous: !!is_anonymous,
        status: "Dikirim",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Terjadi kesalahan server." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const authCheck = await requireSuperAdmin();
  if (!authCheck.isSuperAdmin) {
    return authCheck.response || NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Complaint ID is required." }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("complaints")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Terjadi kesalahan server." }, { status: 500 });
  }
}
