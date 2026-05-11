import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function normalizeSupabaseUrl(raw: string | undefined): string {
  if (!raw?.trim()) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  return raw
    .trim()
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/$/, "");
}

/** Server-only: bypasses RLS. Use in trusted Route Handlers / cron, never in browser. */
export function createSupabaseServiceRole(): SupabaseClient {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
