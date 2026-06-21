/**
 * Logs a user activity/action to the Supabase database.
 * This runs client-side by sending a POST request to the /api/activity-logs API endpoint.
 * 
 * @param action - Short description of what the user did (e.g. "Mengupdate Profil Desa")
 * @param details - Optional details (e.g. "Merubah visi dari X ke Y")
 */
export async function logActivity(action: string, details?: string) {
  try {
    const { getAuthHeaders } = await import("@/utils/supabase/client");
    const res = await fetch("/api/activity-logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ action, details }),
    });
    if (!res.ok) {
      console.warn("Gagal mengirim log aktivitas ke server:", await res.text());
    }
  } catch (err) {
    console.warn("Gagal logActivity:", err);
  }
}
