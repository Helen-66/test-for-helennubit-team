import { searchMovies } from "@/lib/tmdb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1", 10);

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
  }

  try {
    const results = await searchMovies(query, page);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Failed to search movies" }, { status: 500 });
  }
}
