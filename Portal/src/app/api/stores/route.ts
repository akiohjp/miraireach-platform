import { NextResponse } from "next/server";
import { stores } from "@/lib/arabica-data";

export async function GET() {
  return NextResponse.json({
    count: stores.length,
    stores,
  });
}
