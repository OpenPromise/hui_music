import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // 检查邮箱是否已存在
    const exists = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (exists) {
      return new NextResponse("User already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        subscription: {
          create: {
            type: "free",
            status: "active"
          }
        }
      }
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 