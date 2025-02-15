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
    const hierarchies = await prisma.tagHierarchy.findMany();

    // 按标签组织层级关系
    const groupedHierarchies = hierarchies.reduce((acc, hierarchy) => {
      // 处理父标签
      if (!acc[hierarchy.childTag]) {
        acc[hierarchy.childTag] = { parents: [], children: [] };
      }
      acc[hierarchy.childTag].parents.push(hierarchy.parentTag);

      // 处理子标签
      if (!acc[hierarchy.parentTag]) {
        acc[hierarchy.parentTag] = { parents: [], children: [] };
      }
      acc[hierarchy.parentTag].children.push(hierarchy.childTag);

      return acc;
    }, {} as Record<string, { parents: string[]; children: string[] }>);

    return NextResponse.json(groupedHierarchies);
  } catch (error) {
    console.error('获取层级关系失败:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 