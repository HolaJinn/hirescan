import { requireUser } from '@/app/utils/hooks';
import { redirect } from 'next/navigation';
import { prisma } from '@/app/utils/prisma';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { AvatarUploader } from '@/app/components/AvatarUploader';

type Resume = { matchScore: number | null };
type Job = {
  id: string;
  title: string;
  status: string;
  views: number;
  resumes: Resume[];
};

export default async function RecruiterProfilePage() {
  const session = await requireUser();
  if (!session?.user) return redirect('/api/auth/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      image: true,
      jobDescriptions: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          status: true,
          views: true,
          resumes: { select: { matchScore: true } },
        },
      },
    },
  });

  if (!user) return <p className="text-center mt-10">User not found</p>;

  // Type the array explicitly
  const jobDescriptions: Job[] = user.jobDescriptions;

  const totalJobs = jobDescriptions.length;

  const totalApplicants = jobDescriptions.reduce<number>(
    (sum: number, job: Job) => sum + job.resumes.length,
    0
  );

  const avgMatchScore = (() => {
    const allScores: number[] = jobDescriptions.flatMap((job: Job) =>
      job.resumes
        .map(r => r.matchScore)
        .filter((score): score is number => score !== null) // type guard
    );
    return allScores.length > 0
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0;
  })();

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <AvatarUploader
            imageUrl={user.image}
            firstName={user.firstName}
            lastName={user.lastName}
          />
          <div>
            <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Link href="/dashboard/profile/edit">
          <Button variant="default" className="rounded-full px-6 py-2 shadow">
            <Sparkles className="mr-1 h-4 w-4" /> Edit Profile
          </Button>
        </Link>
      </div>

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Jobs Posted</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-purple-600">{totalJobs}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Applicants</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-blue-600">{totalApplicants}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Match Score</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-green-600">{avgMatchScore}%</CardContent>
        </Card>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Posted Jobs</h2>
        {jobDescriptions.length === 0 ? (
          <p className="text-muted-foreground">No jobs posted yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobDescriptions.map((job: Job) => (
              <Card key={job.id}>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>{job.title}</CardTitle>
                  <Badge variant="outline" className="capitalize">{job.status.toLowerCase()}</Badge>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {job.views} views • {job.resumes.length} applicants
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
