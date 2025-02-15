import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const newTracks = await prisma.track.findMany({
      where: {
        releaseDate: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 最近一周
        },
      },
      include: {
        artist: true,
        album: true,
        tags: true,
      },
      orderBy: {
        releaseDate: 'desc',
      },
      take: 20,
    });

    return NextResponse.json(newTracks);
  } catch (error) {
    console.error("[NEW_TRACKS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 