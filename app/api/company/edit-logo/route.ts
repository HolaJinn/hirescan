import { writeFile } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/utils/hooks";
import { prisma } from "@/app/utils/prisma";
import { mkdirSync, existsSync } from "fs";
import { put } from "@vercel/blob";

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

  const isProd = process.env.VERCEL === "1";
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  let logoUrl: string;

  if (isProd) {
    // ✅ Upload to Vercel Blob in production
    const { url } = await put(`company-logos/${fileName}`, file, {
      access: "public",
    });
    logoUrl = url;
  } else {
    // ✅ Localhost: save to public/logos
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public","uploads", "logos");
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    logoUrl = `/uploads/logos/${fileName}`;
  }

  // ✅ Update company logo in DB
  await prisma.company.update({
    where: { id: session.user.companyId },
    data: { logoUrl },
  });

  return NextResponse.json({ success: true, logoUrl });
}
