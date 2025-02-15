import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const permissions = await prisma.tagPermission.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // 按标签分组权限
    const groupedPermissions = permissions.reduce((acc, permission) => {
      if (!acc[permission.tag]) {
        acc[permission.tag] = [];
      }
      acc[permission.tag].push({
        user: permission.user,
        role: permission.role,
      });
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(groupedPermissions);
  } catch (error) {
    console.error('获取权限失败:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 