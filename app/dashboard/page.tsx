// app/dashboard/page.tsx
import { requireUser } from '@/app/utils/hooks';
import { redirect } from 'next/navigation';
import prisma from '@/app/utils/prisma';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

async function getApplicantsPerJob(userId: string) {
  const jobs = await prisma.jobDescription.findMany({
    where: { userId },
    select: {
      title: true,
      _count: {
        select: { resumes: true }
      }
    }
  });

  return jobs.map(job => ({
    jobTitle: job.title,
    count: job._count.resumes
  }));
}

async function getAverageMatchScore(userId: string) {
  const jobs = await prisma.jobDescription.findMany({
    where: { userId },
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

  return result; // 🔥 This was missing
}

async function getTimeToFirstApplication(userId: string) {
  const jobs = await prisma.jobDescription.findMany({
    where: {
      userId
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
  return result;
}

async function getConversionRate(userId: string) {
  const jobs = await prisma.jobDescription.findMany({
    where: { userId },
    select: {
      title: true,
      views: true,
      _count: {
        select: { resumes: true },
      },
    },
  });

  return jobs.map(job => {
    const rate = job.views > 0 ? (job._count.resumes / job.views) * 100 : 0;
    return {
      jobTitle: job.title,
      rate: rate.toFixed(1), // 1 decimal point
    };
  });
}
export default async function DashboardPage() {
  const session = await requireUser();
  if (!session?.user) return redirect('/login');
  if (!session?.user.verified) return redirect('/validate-email');

  const [applicantsPerJob, averageMatchScore, timeToFirstApplication, conversionRate] = await Promise.all([
    getApplicantsPerJob(session?.user.id),
    getAverageMatchScore(session?.user.id),
    getTimeToFirstApplication(session?.user.id),
    getConversionRate(session?.user.id)
  ]);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Welcome, {session.user.name} 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Applicants per Job */}
        <Card>
          <CardHeader>
            <CardTitle>Applicants per Job</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {applicantsPerJob.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{item.jobTitle}</span>
                <span className="font-semibold text-purple-600">{item.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Average Match Score */}
        <Card>
          <CardHeader>
            <CardTitle>Average Match Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {averageMatchScore.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{item.jobTitle}</span>
                <span className="font-semibold text-green-600">{item.score}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Time to First Application */}
        <Card>
          <CardHeader>
            <CardTitle>Time to First Application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {timeToFirstApplication.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{item.jobTitle}</span>
                <span className="font-semibold text-orange-500">
                  {item.hours === 'N/A' ? 'N/A' : `${item.hours}h`}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {conversionRate.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{item.jobTitle}</span>
                <span className="font-semibold text-blue-600">{item.rate}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
