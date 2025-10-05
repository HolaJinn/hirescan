import { prisma } from '@/app/utils/prisma';
import ApplicationForm from '@/app/components/ApplicationForm';
import Link from 'next/link';
import TiptapViewer from '@/app/components/TipTapViewer';

interface ApplyPageProps {
  params: Promise<{ jobId: string }>;
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { jobId } = await params;

  const job = await prisma.jobDescription.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      company: {
        select: {
          name: true,
          website: true,
          industry: true,
          description: true,
          logoUrl: true,
        },
      },
    },
  });

  if (!job || job.status !== 'OPEN') {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Job Not Available</h1>
        <p className="text-gray-600 mb-6">
          The job you're trying to apply for either doesn't exist or is no longer open.
        </p>
        <Link href="/" className="text-purple-600 underline font-medium">
          Go back to jobs
        </Link>
      </div>
    );
  }

  // Increment views
  await prisma.jobDescription.update({
    where: { id: job.id },
    data: { views: { increment: 1 } },
  });

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-10">
      {/* Company Banner */}
      <div className="relative bg-purple-400 text-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center p-6">
          {job.company.logoUrl && (
            <img
              src={job.company.logoUrl}
              alt={job.company.name}
              className="w-20 h-20 object-contain bg-white rounded-lg p-2 shadow-md"
            />
          )}
          <div className="ml-4">
            <h2 className="text-2xl font-bold">{job.company.name}</h2>
            {job.company.industry && <p className="text-purple-900">{job.company.industry}</p>}
            {job.company.website && (
              <a
                href={job.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline hover:text-purple-200"
              >
                Visit Website
              </a>
            )}
          </div>
        </div>
        {job.company.description && (
          <div className="bg-purple-500 px-6 py-4 text-sm">
            {job.company.description}
          </div>
        )}
      </div>

      {/* Job Info */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h1 className="text-2xl font-bold text-purple-700">{job.title}</h1>
        <TiptapViewer content={job.description} />
      </div>

      {/* Application Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-purple-700">Apply Now</h2>
        <ApplicationForm jobId={job.id} />
      </div>
    </div>
  );
}
