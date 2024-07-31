// app/api/save-consultation/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { userId, conclusion } = await request.json();

    if (!userId || !conclusion) {
      return NextResponse.json(
        { error: "Missing userId or conclusion" },
        { status: 400 }
      );
    }

    const consultation = await prisma.consultation.create({
      data: {
        userId,
        conclusion,
      },
    });

    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    console.error("Error saving consultation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
