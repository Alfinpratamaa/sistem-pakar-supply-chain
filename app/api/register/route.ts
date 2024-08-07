import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
  const { username, email, password } = await req.json();

  try {
    const checkUser = await prisma.user?.findUnique({
      where: {
        email,
      },
    });

    if (!checkUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user?.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
    }

    return NextResponse.json(
      { message: "success created account" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "failed created account" },
      { status: 400 }
    );
  }
};
