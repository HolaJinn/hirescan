import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/prisma";
import path from "path";
import { mkdir, writeFile, unlink } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { put, del } from "@vercel/blob";

// ✅ Helper: publish message to QStash
async function publishToQStash(message: any) {
  const qstashToken = process.env.QSTASH_TOKEN;
  const qstashUrl = process.env.QSTASH_URL;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

  if (!qstashToken || !qstashUrl) {
    console.error("❌ QStash credentials missing");
    return;
  }
  console.log(`${APP_URL}/api/process-resume`)
  const res = await fetch(`${qstashUrl}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${qstashToken}`,
      "Content-Type": "application/json",
    },
    
    body: JSON.stringify({
      destination: `${APP_URL}/api/process-resume`, 
      body: JSON.stringify(message),
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("❌ Failed to publish to QStash:", errText);
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: jobId } = await context.params;
  const formData = await req.formData();

  const fullName = formData.get("fullName") as string;
  const emailFromForm = formData.get("email") as string;
  const file = formData.get("resume") as File;

  if (!file || file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Invalid or missing resume file" },
      { status: 400 }
    );
  }

  const isProd = process.env.VERCEL === "1";

  const job = await prisma.jobDescription.findUnique({
    where: { id: jobId },
    select: { id: true },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  try {
    const uniqueFileName = `${uuidv4()}.pdf`;
    let fileUrl: string;

    if (isProd) {
      const { url } = await put(`resumes/${uniqueFileName}`, file, {
        access: "public",
      });
      fileUrl = url;
    } else {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filePath = path.join(uploadDir, uniqueFileName);
      await writeFile(filePath, buffer);

      fileUrl = `/uploads/${uniqueFileName}`;
    }

    // 🔄 If resume exists for same email & job, delete old one
    if (emailFromForm) {
      const existingResume = await prisma.resume.findFirst({
        where: { jobId, email: emailFromForm },
      });

      if (existingResume) {
        try {
          if (isProd) {
            await del(existingResume.fileUrl);
          } else {
            const oldFilePath = path.join(
              process.cwd(),
              "public",
              existingResume.fileUrl
            );
            await unlink(oldFilePath);
          }
        } catch (fileErr) {
          console.warn("Failed to delete old resume file:", fileErr);
        }

        await prisma.resume.delete({ where: { id: existingResume.id } });
      }
    }

    // ✅ Save resume metadata in DB
    const resume = await prisma.resume.create({
      data: {
        jobId,
        fileUrl,
        candidateName: fullName,
        email: emailFromForm,
      },
    });

    // 📨 Publish message to QStash for async processing
    await publishToQStash({ resumeId: resume.id });

    return NextResponse.json({
      success: true,
      message: "Resume uploaded and queued for processing",
      resumeId: resume.id,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Failed to upload resume" },
      { status: 500 }
    );
  }
}
