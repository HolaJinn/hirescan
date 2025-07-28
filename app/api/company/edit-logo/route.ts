import { writeFile } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/utils/hooks";
import { prisma } from "@/app/utils/prisma";

export async function POST(req: NextRequest) {
  const session = await requireUser();

  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("logo") as File;

  if (!file || !file.name) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const filePath = join(process.cwd(), "public/uploads/images", fileName);
  const logoUrl = `/uploads/images/${fileName}`;

  await writeFile(filePath, buffer);

  await prisma.company.update({
    where: { id: session.user.companyId },
    data: { logoUrl },
  });

  return NextResponse.json({ success: true, logoUrl });
}
