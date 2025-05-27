import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/app/utils/prisma";
import pdf from "pdf-parse";
import { getResumeMatchScore } from "@/app/utils/edenAI";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const files = formData.getAll("resumes") as File[];
    const jobId = formData.get("jobId") as string;

    if (!files.length) {
        return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    for (const file of files) {
        if (file.type !== "application/pdf") {
            return NextResponse.json(
                { error: `Invalid file type: ${file.name} is not a PDF.` },
                { status: 400 }
            );
        }
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const savedFiles = [];

    const job = await prisma.jobDescription.findUnique({
        where: { id: jobId },
        select: { description: true },
    });

    if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    for (const file of files) {
        try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uniqueFileName = `${uuidv4()}.pdf`;
            const filePath = path.join(uploadDir, uniqueFileName);

            // Save PDF file
            await writeFile(filePath, buffer);

            const fileUrl = `/uploads/${uniqueFileName}`;
            const dataBuffer = await fs.readFile(filePath);

            let resumeText: string;
            try {
                const pdfData = await pdf(dataBuffer);
                resumeText = pdfData.text;
            } catch (parseErr) {
                console.error(`Failed to parse PDF (${file.name}):`, parseErr);
                continue; // Skip this file
            }

            // Extract basic name and email
            const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
            const email = emailMatch ? emailMatch[0] : null;

            // AI scoring
            let matchScore = null;
            let aiSummary = null;
            let keyStrengths = null;
            let keyWeaknesses = null;
            let candidateName = null;

            try {
                const result = await getResumeMatchScore({
                    jobDescription: job.description,
                    resumeText,
                });

                matchScore = result.score;
                aiSummary = result.summary;
                keyStrengths = result.keyStrengths;
                keyWeaknesses = result.keyWeaknesses;
                candidateName = result.candidateName;
            } catch (aiErr) {
                console.error(`AI scoring failed for ${file.name}:`, aiErr);
                continue; // Skip this file
            }

            // Save to DB
            const savedResume = await prisma.resume.create({
                data: {
                    fileUrl,
                    jobId,
                    rawText: resumeText,
                    candidateName,
                    email,
                    matchScore,
                    aiSummary,
                    keyStrengths,
                    keyWeaknesses,
                },
            });

            savedFiles.push({
                name: file.name,
                path: fileUrl,
                id: savedResume.id,
            });

        } catch (err) {
            console.error(`Unexpected error processing ${file.name}:`, err);
            // Skip to next file
            continue;
        }
    }

    if (!savedFiles.length) {
        return NextResponse.json({ error: "No valid resumes uploaded." }, { status: 400 });
    }

    return NextResponse.json({ uploaded: savedFiles }, { status: 200 });
}
