import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Next.js loads `.env.local` from the project root (next to `package.json`).
 * If your file only exists under `src/`, copy or symlink it to the root.
 */
function normalizeSupabaseUrl(raw: string | undefined): string {
  if (!raw?.trim()) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  return raw
    .trim()
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/$/, "");
}

function getAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
  }
  return key;
}

/**
 * Supabase client for the browser (Client Components).
 * For Server Components / Route Handlers with cookies, add `@supabase/ssr` and a separate helper.
 */
export function createBrowserSupabaseClient(): SupabaseClient {
  return createClient(normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL), getAnonKey(), {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

let browserSingleton: SupabaseClient | null = null;

/** Singleton on the client to avoid multiple GoTrue instances in dev HMR. */
export function getBrowserSupabase(): SupabaseClient {
  if (typeof window === "undefined") {
    return createBrowserSupabaseClient();
  }
  if (!browserSingleton) {
    browserSingleton = createBrowserSupabaseClient();
  }
  return browserSingleton;
}
