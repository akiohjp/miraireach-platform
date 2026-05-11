import { NextResponse } from "next/server";
import { menuItems } from "@/lib/arabica-data";

export async function GET() {
  return NextResponse.json({
    count: menuItems.length,
    items: menuItems,
  });
}
