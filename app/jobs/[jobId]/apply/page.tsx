import { prisma } from '@/app/utils/prisma';
import ApplicationForm from '@/app/components/ApplicationForm';

export default async function ApplyPage({ params }: { params: { jobId: string } }) {
    const job = await prisma.jobDescription.findUnique({
        where: { id: params.jobId },
        select: { id: true, title: true, status: true },
    });

    if (!job || job.status !== 'OPEN') {
        return (
            <div className="max-w-xl mx-auto py-20 px-4 text-center">
                <h1 className="text-2xl font-bold mb-4 text-red-600">Job Not Available</h1>
                <p className="text-gray-600 mb-6">
                    The job you're trying to apply for either doesn't exist or is no longer open.
                </p>
            </div>
        );
    }

    // 👇 Increment the view count
    await prisma.jobDescription.update({
        where: { id: job.id },
        data: { views: { increment: 1 } }
    });

    return (
        <div className="max-w-xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-4 text-center">
                Apply for: {job.title}
            </h1>
            <ApplicationForm jobId={job.id} />
        </div>
    );
}
