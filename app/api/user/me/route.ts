// /app/api/user/me/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import { requireUser } from "@/app/utils/hooks";

export async function GET() {
  const session = await requireUser();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstName: true,
      lastName: true,
      image: true,
      email: true,
      companyId: true,
      verified: true,
    },
  });

  return NextResponse.json(user);
}
