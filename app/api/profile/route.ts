import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const profile = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        bio: true,
        avatarUrl: true,
        joinedAt: true,
        preferences: true,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[PROFILE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, bio, preferences } = body;

    const profile = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        bio,
        preferences,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[PROFILE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 