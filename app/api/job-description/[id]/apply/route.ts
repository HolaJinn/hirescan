import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/prisma";
import path from "path";
import { mkdir, writeFile, unlink } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: jobId } = await context.params; 
  const formData = await req.formData();

  const fullName = formData.get("fullName") as string;
  const emailFromForm = formData.get("email") as string;
  const file = formData.get("resume") as File;

  if (!file || file.type !== "application/pdf") {
    return NextResponse.json({ error: "Invalid or missing resume file" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const job = await prisma.jobDescription.findUnique({
    where: { id: jobId },
    select: { id: true },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueFileName = `${uuidv4()}.pdf`;
    const filePath = path.join(uploadDir, uniqueFileName);
    const fileUrl = `/uploads/${uniqueFileName}`;

    await writeFile(filePath, buffer);

    // 🔄 If resume exists for same email & job, delete old one
    if (emailFromForm) {
      const existingResume = await prisma.resume.findFirst({
        where: { jobId, email: emailFromForm },
      });

      if (existingResume) {
        try {
          const oldFilePath = path.join(process.cwd(), "public", existingResume.fileUrl);
          await unlink(oldFilePath);
        } catch (fileErr) {
          console.warn("Failed to delete old resume file:", fileErr);
        }

        await prisma.resume.delete({ where: { id: existingResume.id } });
      }
    }

    // ✅ Save only basic metadata for now (AI later)
    const resume = await prisma.resume.create({
      data: {
        jobId,
        fileUrl,
        candidateName: fullName,
        email: emailFromForm,
      },
    });

    return NextResponse.json({ success: true, resumeId: resume.id });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Failed to upload resume" }, { status: 500 });
  }
}
