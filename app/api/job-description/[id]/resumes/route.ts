// /app/api/jobs/[jobId]/resumes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/utils/prisma';

export async function GET(req: NextRequest, { params }: { params: { jobId: string } }) {
    const { jobId } = params;
    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get("sortBy") || "uploadedAt"; // 'score' or 'uploadedAt'
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";

    try {
        const resumes = await prisma.resume.findMany({
            where: { jobId },
            orderBy: {
                [sortBy]: order,
            },
            select: {
                id: true,
                candidateName: true,
                email: true,
                fileUrl: true,
                matchScore: true,
                uploadedAt: true,
            },
        });

        return NextResponse.json(resumes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
    }
}
