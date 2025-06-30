// /app/api/jobs/[jobId]/resumes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/utils/prisma';

type Params = {
    id: string;
};

export async function GET(req: NextRequest, { params }: { params: Params}) {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get("sortBy") || "uploadedAt"; // 'score' or 'uploadedAt'
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";
    console.log(id)
    try {
        const resumes = await prisma.resume.findMany({
            where: { jobId: id },
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
