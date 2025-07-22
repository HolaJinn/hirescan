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
            resumes: {
                select: { matchScore: true },
            },
        },
    });

    const result = jobs.map(job => {
        const scores = job.resumes
            .map(r => r.matchScore)
            .filter(score => score !== null) as number[];

        const average = scores.length > 0
            ? scores.reduce((sum, val) => sum + val, 0) / scores.length
            : 0;

        return {
            jobTitle: job.title,
            score: Math.round(average),
        };
    });

    return NextResponse.json(result);
}
