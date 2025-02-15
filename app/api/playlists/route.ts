import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, description, isPublic } = await req.json();

    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        isPublic,
        userId: session.user.id,
      },
    });

    return NextResponse.json(playlist);
  } catch (error) {
    console.error("[PLAYLIST_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const playlists = await prisma.playlist.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(playlists);
  } catch (error) {
    console.error("[PLAYLISTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 