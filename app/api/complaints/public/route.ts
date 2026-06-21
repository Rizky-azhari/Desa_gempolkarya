import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const adminClient = createAdminClient();
    
    const { data: complaints, error } = await adminClient
      .from("complaints")
      .select("id, ticket_number, category, title, description, reporter_name, status, officer_note, is_anonymous, created_at, photo_url")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map database fields to the format expected by the frontend
    const publicData = complaints.map((c) => ({
      id: c.ticket_number, // The frontend uses ticket_number as ID for search
      reporterName: c.is_anonymous ? "Anonim" : (c.reporter_name || "Umum"),
      title: c.title,
      description: c.description,
      category: c.category,
      date: c.created_at.split("T")[0],
      status: c.status === "Dikirim" ? "Belum Diproses" : c.status === "Diproses" || c.status === "Ditindaklanjuti" ? "Sedang Diproses" : "Selesai",
      response: c.officer_note || null,
      responseDate: c.officer_note ? c.created_at.split("T")[0] : null, // Mock response date as created_at or updated_at
      photoUrl: c.photo_url || null
    }));

    return NextResponse.json(publicData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Terjadi kesalahan server." }, { status: 500 });
  }
}
