// /app/api/resumes/[resumeId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/utils/prisma';

export async function GET(req: NextRequest, { params }: { params: { resumeId: string } }) {
    try {
        const resume = await prisma.resume.findUnique({
            where: { id: params.resumeId },
        });

        if (!resume) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        return NextResponse.json(resume);
    } catch (err) {
        return NextResponse.json({ error: 'Error fetching resume' }, { status: 500 });
    }
}
