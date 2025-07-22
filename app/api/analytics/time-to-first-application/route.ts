import { NextResponse } from 'next/server';
import prisma from '@/app/utils/prisma';
import { requireUser } from '@/app/utils/hooks';

export async function GET() {
    const session = await requireUser();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const jobs = await prisma.jobDescription.findMany({
        where: {
            user: { email: session.user.email }
        },
        select: {
            title: true,
            createdAt: true,
            resumes: {
                orderBy: { uploadedAt: 'asc' },
                take: 1,
                select: { uploadedAt: true },   
            },
        },
    });

    const result = jobs.map(job => {
        const firstUpload = job.resumes[0]?.uploadedAt;
        const diffHours = firstUpload
            ? Math.round((firstUpload.getTime() - job.createdAt.getTime()) / 1000 / 60 / 60)
            : null;

        return {
            jobTitle: job.title,
            hours: diffHours ?? 'N/A',
        };
    });

    return NextResponse.json(result);
}
