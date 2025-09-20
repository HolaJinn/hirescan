// app/utils/resumeProcessor.ts
import prisma from "@/app/utils/prisma";
import path from "path";
import fs from "fs/promises";
import pdf from "pdf-parse";
import { unlink } from "fs/promises";
// import { getResumeMatchScore } from "@/app/utils/edenAI";

export async function processResumeWithAI(resumeId: string) {
  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
    include: { job: true }, // need job description
  });

  if (!resume || !resume.job) {
    throw new Error("Resume or job not found");
  }

  const filePath = path.join(process.cwd(), "public", resume.fileUrl);
  const dataBuffer = await fs.readFile(filePath);
  const pdfData = await pdf(dataBuffer);
  const resumeText = pdfData.text;

  // Extract fallback email
  const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
  const email = resume.email || emailMatch?.[0] || null;

  // try {
  //   // const aiResult = await getResumeMatchScore({
  //   //   jobDescription: resume.job.description,
  //   //   resumeText,
  //   // });

  //   // await prisma.resume.update({
  //   //   where: { id: resumeId },
  //   //   data: {
  //   //     rawText: resumeText,
  //   //     email,
  //   //     candidateName: aiResult.candidateName || resume.candidateName,
  //   //     matchScore: aiResult.score,
  //   //     aiSummary: aiResult.summary,
  //   //     keyStrengths: aiResult.keyStrengths,
  //   //     keyWeaknesses: aiResult.keyWeaknesses,
  //   //   },
  //   });
  // } catch (err) {
  //   console.warn("AI scoring failed:", err);
  // }
}
