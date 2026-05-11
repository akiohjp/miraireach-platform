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

function getAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
  }
  return key;
}

/** Supabase client scoped to the user JWT (Route Handlers / server). */
export function createSupabaseWithJwt(accessToken: string): SupabaseClient {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  return createClient(url, getAnonKey(), {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
