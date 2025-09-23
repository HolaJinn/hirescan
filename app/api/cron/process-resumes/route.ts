import { NextResponse } from "next/server";
import prisma from "@/app/utils/prisma";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET() {
  try {
    const pendingResumes = await prisma.resume.findMany({
      where: { status: "PENDING" },
      select: { id: true },
    });

    if (pendingResumes.length === 0) {
      return NextResponse.json({ message: "No pending resumes found" });
    }

    for (const resume of pendingResumes) {
      try {
        await axios.post(`${BASE_URL}/api/resume/${resume.id}/process`);
        console.log(`✅ Processed resume ${resume.id}`);
      } catch (err) {
        console.error(`❌ Failed to process resume ${resume.id}:`, err);
      }
    }

    return NextResponse.json({
      message: `Processed ${pendingResumes.length} pending resumes`,
    });
  } catch (error) {
    console.error("❌ Cron route failed:", error);
    return NextResponse.json({ error: "Cron route failed" }, { status: 500 });
  }
}
