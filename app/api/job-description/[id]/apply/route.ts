// /app/api/jobs/[jobId]/apply/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/prisma";
import path from "path";
import { mkdir, writeFile, unlink } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import pdf from "pdf-parse";
import { getResumeMatchScore } from "@/app/utils/edenAI";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const jobId = params.id;
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
    select: { description: true },
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

    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdf(dataBuffer);
    const resumeText = pdfData.text;

    // Extract fallback email from text if needed
    const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
    const email = emailFromForm || emailMatch?.[0] || null;

    // AI Scoring
    let matchScore = null;
    let aiSummary = null;
    let keyStrengths = null;
    let keyWeaknesses = null;
    let candidateName = fullName;

    try {
      const aiResult = await getResumeMatchScore({
        jobDescription: job.description,
        resumeText,
      });

      matchScore = aiResult.score;
      aiSummary = aiResult.summary;
      keyStrengths = aiResult.keyStrengths;
      keyWeaknesses = aiResult.keyWeaknesses;

      if (!candidateName && aiResult.candidateName) {
        candidateName = aiResult.candidateName;
      }
    } catch (aiErr) {
      console.warn("AI scoring failed:", aiErr);
    }

    // 🔄 Overwrite logic if resume exists for same email and job
    const existingResume = await prisma.resume.findFirst({
      where: {
        jobId,
        email,
      },
    });

    if (existingResume) {
      // Delete old file
      const oldFilePath = path.join(process.cwd(), "public", existingResume.fileUrl);
      try {
        await unlink(oldFilePath);
      } catch (fileErr) {
        console.warn("Failed to delete old resume file:", fileErr);
      }

      // Delete old DB entry
      await prisma.resume.delete({
        where: { id: existingResume.id },
      });
    }

    // Save the new resume
    await prisma.resume.create({
      data: {
        jobId,
        fileUrl,
        rawText: resumeText,
        candidateName,
        email,
        matchScore,
        aiSummary: aiSummary ?? undefined,
        keyStrengths: keyStrengths ?? undefined,
        keyWeaknesses: keyWeaknesses ?? undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Failed to process resume" }, { status: 500 });
  }
}
