// /app/api/resumes/[resumeId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/utils/prisma';

export async function GET(req: NextRequest, { params }: { params: { resumeId: string } }) {
    const { resumeId } = await params;
    try {
        const resume = await prisma.resume.findUnique({
            where: { id: resumeId },
        });

        if (!resume) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        return NextResponse.json(resume);
    } catch (err) {
        return NextResponse.json({ error: 'Error fetching resume' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { resumeId: string } }
) {
    const { resumeId } = await params;

    try {
        await prisma.resume.delete({
            where: { id: resumeId },
        });
        return NextResponse.json({ message: 'Deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting resume:', error);
        return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
    }
}