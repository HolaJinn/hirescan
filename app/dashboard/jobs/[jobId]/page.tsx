// app/dashboard/jobs/[jobId]/JobDashboard.tsx
import ResumeList from '@/app/components/ResumeList';
import prisma from '@/app/utils/prisma';

type Params = {
    jobId: string;
};

export default async function JobDashboard({ params }: { params: Params }) {
    const { jobId } = await params;

    const job = await prisma.jobDescription.findUnique({
        where: { id: jobId }
    });
    const resumes = await prisma.resume.findMany({
        where: { jobId: jobId },
        orderBy: {
            uploadedAt: 'desc',
        },
    });

    console.log(resumes.length)

    return (
        <div className="p-4">
            <h1 className="text-2xl text-center font-bold mb-4">Resumes for Job: {job?.title}</h1>
            <ResumeList initialResumes={resumes} jobId={jobId} />
        </div>
    );
}
