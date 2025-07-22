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
            id: true,
            title: true,
            _count: {
                select: {
                    resumes: true,
                },
            },
        },
        
    });

    const result = jobs.map(job => ({
        jobTitle: job.title,
        count: job._count.resumes,
    }));

    return NextResponse.json(result);
}
