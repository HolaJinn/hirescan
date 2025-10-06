// /app/api/process-resume/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/prisma";
import path from "path";
import fs from "fs/promises";
import { getResumeMatchScore } from "@/app/utils/openrouterAI";

export async function POST(req: NextRequest) {
  const { resumeId } = await req.json();
  if (!resumeId) {
    return NextResponse.json({ error: "Missing resumeId" }, { status: 400 });
  }

  const isProd = process.env.VERCEL === "1";
  const pdf = require("pdf-parse");

  try {
    // 1️⃣ Fetch resume and associated job
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      include: { job: true },
    });

    if (!resume || !resume.job) {
      return NextResponse.json(
        { error: "Resume or job not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Read PDF content
    let dataBuffer: Buffer;
    if (isProd) {
      const response = await fetch(resume.fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch resume PDF: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      dataBuffer = Buffer.from(arrayBuffer);
    } else {
      const filePath = path.join(process.cwd(), "public", resume.fileUrl);
      dataBuffer = await fs.readFile(filePath);
    }

    // 3️⃣ Extract text
    const pdfData = await pdf(dataBuffer);
    const resumeText = pdfData.text;

    // 4️⃣ Try to get candidate email
    const emailMatch = resumeText.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/
    );
    const email = resume.email || emailMatch?.[0] || null;

    // 5️⃣ Call AI service
    const aiResult = await getResumeMatchScore({
      jobDescription: resume.job.description,
      resumeText,
    });

    // 6️⃣ Update DB with results
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

    console.log(`✅ Resume ${resumeId} processed successfully`);
    return NextResponse.json({ success: true, resume: updatedResume });
  } catch (err) {
    console.error("❌ Failed to process resume:", err);
    return NextResponse.json(
      { error: "Failed to process resume" },
      { status: 500 }
    );
  }
}
