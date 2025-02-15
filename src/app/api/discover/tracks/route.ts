import { NextResponse } from "next/server";
import { getNewTracks } from "@/lib/api/discover";

export async function GET() {
  const tracks = await getNewTracks();
  return NextResponse.json(tracks);
} 