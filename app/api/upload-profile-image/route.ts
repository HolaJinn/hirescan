import { writeFile } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/utils/hooks";
import { prisma } from "@/app/utils/prisma";
import { mkdirSync, existsSync } from "fs";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const session = await requireUser();
  const formData = await req.formData();
  const file = formData.get("profileImage") as File;

  if (!file || !file.name) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const isProd = process.env.VERCEL === "1";
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  let imageUrl: string;

  if (isProd) {
    // ✅ Upload to Vercel Blob in production
    const { url } = await put(`profile-images/${fileName}`, file, {
      access: "public",
    });
    imageUrl = url;
  } else {
    // ✅ Localhost: save to public/uploads/images
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public", "uploads", "images");
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    imageUrl = `/uploads/images/${fileName}`;
  }

  // ✅ Update user image in DB
  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: imageUrl },
  });

  return NextResponse.redirect(new URL("/dashboard/profile", req.url));
}
