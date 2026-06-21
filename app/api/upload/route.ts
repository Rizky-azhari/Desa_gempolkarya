import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const ALLOWED_BUCKETS = ["news", "gallery", "umkm", "officials", "complaints"];
const PUBLIC_BUCKETS = ["complaints"]; // buckets that allow unauthenticated uploads

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = formData.get("bucket") as string | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
    }

    if (!bucket || !ALLOWED_BUCKETS.includes(bucket)) {
      return NextResponse.json({ error: "Nama bucket tidak valid." }, { status: 400 });
    }

    // Validate file size: Max 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Ukuran file terlalu besar (Maksimal 5MB)." }, { status: 400 });
    }

    // Validate mime type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung. Gunakan format JPG, PNG, WEBP, atau GIF." },
        { status: 400 }
      );
    }

    // For internal dashboard uploads, verify authenticated session first
    const isPublicBucket = PUBLIC_BUCKETS.includes(bucket);
    if (!isPublicBucket) {
      const serverClient = await createClient();
      const { data: { user } } = await serverClient.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Tidak terotorisasi. Silakan login terlebih dahulu." }, { status: 401 });
      }
    }

    // Use admin client for actual upload (bypasses RLS, works for both public and authenticated uploads)
    const adminClient = createAdminClient();

    // Generate unique file name
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;

    const fileBuffer = await file.arrayBuffer();

    const { data, error } = await adminClient.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = adminClient.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return NextResponse.json({
      path: data.path,
      url: publicUrl,
    });
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan server saat mengunggah." },
      { status: 500 }
    );
  }
}
