import { NextResponse } from "next/server";
import { getRecommendedPlaylists } from "@/lib/api/discover";

export async function GET() {
  const playlists = await getRecommendedPlaylists();
  return NextResponse.json(playlists);
} 