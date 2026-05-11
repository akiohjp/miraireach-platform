import { NextRequest, NextResponse } from "next/server";
import { fetchPublishedArticles } from "@/lib/articles";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  try {
    const articles = await fetchPublishedArticles(limit, offset);
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
