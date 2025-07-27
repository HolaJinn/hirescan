// /app/api/profile/edit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import { requireUser } from "@/app/utils/hooks";

export async function PATCH(req: NextRequest) {
  const session = await requireUser();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { firstName, lastName } = body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName,
        lastName,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
