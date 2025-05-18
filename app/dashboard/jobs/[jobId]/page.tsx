// app/dashboard/jobs/[jobId]/JobDashboard.tsx
import ResumeList from '@/app/components/ResumeList';
import prisma from '@/app/utils/prisma';

type Params = {
    jobId: string;
};

export default async function JobDashboard({ params }: { params: Params }) {
    const jobId = params.jobId;

    const resumes = await prisma.resume.findMany({
        where: { jobId },
        orderBy: {
            uploadedAt: 'desc',
        },
    });

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Resumes for Job ID: {jobId}</h1>
            <ResumeList initialResumes={resumes} jobId={jobId} />
        </div>
    );
}
