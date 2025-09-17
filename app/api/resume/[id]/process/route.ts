// /app/api/resume/[id]/process/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/prisma";
import path from "path";
import fs from "fs/promises";
import pdf from "pdf-parse";
import { getResumeMatchScore } from "@/app/utils/openrouterAI";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const resumeId = await params.id;
  console.log("hello")
  try {
    // Fetch resume and job info
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      include: { job: true },
    });

    if (!resume || !resume.job) {
      return NextResponse.json({ error: "Resume or job not found" }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), "public", resume.fileUrl);
    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdf(dataBuffer);
    const resumeText = pdfData.text;

    // Fallback email extraction
    const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
    const email = resume.email || emailMatch?.[0] || null;

    // Call OpenRouter AI
    const aiResult = await getResumeMatchScore({
      jobDescription: resume.job.description,
      resumeText,
    });

    const updatedResume = await prisma.resume.update({
      where: { id: resumeId },
      data: {
        rawText: resumeText,
        email,
        candidateName: aiResult.candidateName || resume.candidateName,
        matchScore: aiResult.score,
        aiSummary: aiResult.summary,
        keyStrengths: aiResult.keyStrengths,
        keyWeaknesses: aiResult.keyWeaknesses,
        status: "COMPLETED",
      },
    });


    return NextResponse.json({ success: true, resume: updatedResume });
  } catch (err) {
    console.error("Failed to process resume:", err);
    return NextResponse.json({ error: "Failed to process resume" }, { status: 500 });
  }
}
