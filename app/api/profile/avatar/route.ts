import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    // 这里添加实际的文件上传逻辑
    // 例如上传到云存储服务
    const fileUrl = "https://placeholder-url.com/avatar.jpg";

    // 更新用户头像
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: fileUrl },
    });

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 