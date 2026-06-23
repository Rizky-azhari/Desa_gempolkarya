import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Global fetch interceptor to append authorization bearer token from sessionStorage for internal API routes
if (typeof window !== "undefined") {
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    let url = "";
    if (typeof input === "string") {
      url = input;
    } else if (input instanceof URL) {
      url = input.pathname;
    } else if (input && typeof input === "object" && "url" in input) {
      url = (input as Request).url;
    }

    const isApiCall = url.startsWith("/api/") || url.startsWith("api/") || url.includes("/api/");

    if (isApiCall) {
      try {
        const keys = Object.keys(sessionStorage);
        console.log("CLIENT: fetch interceptor keys in sessionStorage:", keys);
        const storageKey = keys.find(
          (key) => key.startsWith("sb-") && key.endsWith("-auth-token")
        );
        console.log("CLIENT: fetch interceptor storageKey found:", storageKey);
        if (storageKey) {
          const sessionData = JSON.parse(sessionStorage.getItem(storageKey) || "{}");
          const token = sessionData.access_token || sessionData.currentSession?.access_token;
          console.log("CLIENT: fetch interceptor token found:", token ? "YES (starts with " + token.substring(0, 10) + "...)" : "NO");
          if (token) {
            const newInit = { ...init };
            const headers = new Headers(newInit.headers);
            if (!headers.has("Authorization")) {
              headers.set("Authorization", `Bearer ${token}`);
            }
            newInit.headers = headers;
            return originalFetch(input, newInit);
          }
        }
      } catch (e) {
        console.error("Failed to inject auth token into fetch:", e);
      }
    }
    return init === undefined ? originalFetch(input) : originalFetch(input, init);
  };
}

let clientInstance: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (typeof window === "undefined") {
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
        },
      }
    );
  }

  if (!clientInstance) {
    clientInstance = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          storage: window.sessionStorage,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }
    );
  }

  return clientInstance;
}

export function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const keys = Object.keys(sessionStorage);
    const storageKey = keys.find(
      (key) => key.startsWith("sb-") && key.endsWith("-auth-token")
    );
    if (storageKey) {
      const sessionData = JSON.parse(sessionStorage.getItem(storageKey) || "{}");
      const token = sessionData.access_token || sessionData.currentSession?.access_token;
      if (token) {
        return { Authorization: `Bearer ${token}` };
      }
    }
  } catch (e) {
    console.error("Failed to get auth headers:", e);
  }
  return {};
}
