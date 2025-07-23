import { hash } from "bcrypt";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password} = body;

    // Basic validation
    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!existingToken || !existingToken.email) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    if (existingToken.expires < new Date()) {
      return NextResponse.json(
        { success: false, message: "Token has expired" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.update({
      where: { email: existingToken.email },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({ where: { token } });

    return NextResponse.json({ success: true, message: "Password has been reset successfully" });

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while resetting the password" },
      { status: 500 }
    );
  }
}
