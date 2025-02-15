import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // 验证输入
    if (!email || !password || !name) {
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return new NextResponse(
        JSON.stringify({ error: "Email already exists" }),
        { status: 400 }
      );
    }

    // 创建用户
    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
} 