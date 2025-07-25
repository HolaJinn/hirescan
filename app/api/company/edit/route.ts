// app/api/company/route.ts
import { requireUser } from "@/app/utils/hooks";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await requireUser()
  const data = await req.json();

  if (!session?.user || !session.user.companyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updated = await prisma.company.update({
    where: { id: session.user.companyId },
    data: {
      name: data.name,
      description: data.description,
      website: data.website,
    },
  });

  return NextResponse.json(updated);
}
