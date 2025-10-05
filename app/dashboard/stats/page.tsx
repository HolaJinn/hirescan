import { requireUser } from '@/app/utils/hooks';
import { redirect } from 'next/navigation';
import prisma from '@/app/utils/prisma';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Charts from '../../components/Charts';

type JobWithCount = {
  title: string;
  _count: { resumes: number };
};

type JobWithResumes = {
  title: string;
  resumes: { matchScore: number | null }[];
};

type JobWithFirstApplication = {
  title: string;
  createdAt: Date;
  resumes: { uploadedAt: Date }[];
};

type JobWithConversion = {
  title: string;
  views: number;
  _count: { resumes: number };
};

async function getApplicantsPerJob(companyId: string) {
  const jobs: JobWithCount[] = await prisma.jobDescription.findMany({
    where: { companyId},
    select: { title: true, _count: { select: { resumes: true } } },
  });

  return jobs.map(job => ({
    jobTitle: job.title,
    count: job._count.resumes,
  }));
}

async function getAverageMatchScore(companyId: string) {
  const jobs: JobWithResumes[] = await prisma.jobDescription.findMany({
    where: { companyId },
    select: { title: true, resumes: { select: { matchScore: true } } },
  });

  return jobs.map(job => {
    const scores = job.resumes
      .map(r => r.matchScore)
      .filter((s): s is number => s !== null);

    const average = scores.length
      ? scores.reduce((sum, val) => sum + val, 0) / scores.length
      : 0;

    return { jobTitle: job.title, score: Math.round(average) };
  });
}

async function getTimeToFirstApplication(companyId: string) {
  const jobs: JobWithFirstApplication[] = await prisma.jobDescription.findMany({
    where: { companyId },
    select: {
      title: true,
      createdAt: true,
      resumes: { orderBy: { uploadedAt: 'asc' }, take: 1, select: { uploadedAt: true } },
    },
  });

  return jobs.map(job => {
    const firstUpload = job.resumes[0]?.uploadedAt;
    const diffHours = firstUpload
      ? Math.round((firstUpload.getTime() - job.createdAt.getTime()) / 1000 / 60 / 60)
      : null;

    return { jobTitle: job.title, hours: diffHours ?? 0 };
  });
}

async function getConversionRate(companyId: string) {
  const jobs: JobWithConversion[] = await prisma.jobDescription.findMany({
    where: { companyId },
    select: { title: true, views: true, _count: { select: { resumes: true } } },
  });

  return jobs.map(job => {
    const rate = job.views > 0 ? (job._count.resumes / job.views) * 100 : 0;
    return { jobTitle: job.title, rate: parseFloat(rate.toFixed(1)) };
  });
}

export default async function StatsPage() {
  const session = await requireUser();
  if (!session?.user) return redirect('/login');
  if (!session?.user.verified) return redirect('/validate-email');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, companyId: true },
  });

  const showCreateCompanyBanner = user?.role === 'owner' && !user?.companyId;

  const [
    applicantsPerJob,
    averageMatchScore,
    timeToFirstApplication,
    conversionRate,
  ] = await Promise.all([
    getApplicantsPerJob(user!.companyId!),
    getAverageMatchScore(user!.companyId!),
    getTimeToFirstApplication(user!.companyId!),
    getConversionRate(user!.companyId!),
  ]);

  const COLORS = ["#8b5cf6", "#6366f1", "#22c55e", "#f97316", "#ef4444"];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Welcome, {session.user.name} 👋</h1>

      {showCreateCompanyBanner ? (
        <Card className="border-dashed border-2 border-yellow-400 bg-yellow-50/30 shadow-none">
          <CardHeader>
            <CardTitle className="text-yellow-700">🚧 Company Profile Incomplete</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700 mb-4">
              You haven’t completed your company profile yet. This helps you stand out to applicants and build trust.
            </p>
            <Link href="/dashboard/company-onboarding">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md transition">
                Complete Company Profile
              </button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Charts
          applicantsPerJob={applicantsPerJob}
          averageMatchScore={averageMatchScore}
          timeToFirstApplication={timeToFirstApplication}
          conversionRate={conversionRate}
        />
      )}
    </div>
  );
}
