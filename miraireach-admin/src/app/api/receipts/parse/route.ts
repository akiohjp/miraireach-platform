import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseWithJwt } from "@/lib/supabase-route";
import { analyzeReceiptWithGemini } from "@/lib/receipt-gemini-analyze";

export const runtime = "nodejs";
export const maxDuration = 60;

const PATH_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[^/]+$/i;

function bufferToBase64(buf: ArrayBuffer): string {
  return Buffer.from(buf).toString("base64");
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { storagePath?: string; mimeType?: string };
  try {
    body = (await req.json()) as { storagePath?: string; mimeType?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const storagePath = typeof body.storagePath === "string" ? body.storagePath.trim() : "";
  const mimeType = typeof body.mimeType === "string" && body.mimeType.startsWith("image/") ? body.mimeType : "image/jpeg";

  if (!PATH_RE.test(storagePath)) {
    return NextResponse.json({ error: "Invalid storage path" }, { status: 400 });
  }

  const supabase = createSupabaseWithJwt(token);
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: blob, error: dlErr } = await supabase.storage.from("receipts").download(storagePath);
  if (dlErr || !blob) {
    return NextResponse.json(
      { error: dlErr?.message ?? "Could not download receipt" },
      { status: dlErr?.message?.includes("not found") ? 404 : 400 },
    );
  }

  const ab = await blob.arrayBuffer();
  const base64 = bufferToBase64(ab);

  try {
    const parsed = await analyzeReceiptWithGemini(base64, mimeType);
    return NextResponse.json({ parsed });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Gemini error";
    if (msg.includes("GEMINI_API_KEY")) {
      return NextResponse.json({ error: "Server OCR not configured", detail: msg }, { status: 503 });
    }
    return NextResponse.json({ error: "OCR failed", detail: msg }, { status: 502 });
  }
}
