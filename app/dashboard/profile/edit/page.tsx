// app/recruiter/profile/page.tsx
import { requireUser } from '@/app/utils/hooks';
import { redirect } from 'next/navigation';
import { prisma } from '@/app/utils/prisma';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
          resumes: {
            select: { matchScore: true },
          },
        },
      },
    },
  });

  if (!user) return <p className="text-center mt-10">User not found</p>;

  const totalJobs = user.jobDescriptions.length;
  const totalApplicants = user.jobDescriptions.reduce((sum, job) => sum + job.resumes.length, 0);
  const avgMatchScore = (() => {
    const allScores = user.jobDescriptions.flatMap(job =>
      job.resumes.map(r => r.matchScore).filter(s => s !== null) as number[]
    );
    return allScores.length > 0
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0;
  })();

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image ?? ''} />
            <AvatarFallback>
              {user.firstName?.[0] ?? 'U'}{user.lastName?.[0] ?? ''}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Link href="/recruiter/profile/edit">
          <Button variant="outline">Edit Profile</Button>
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
        {user.jobDescriptions.length === 0 ? (
          <p className="text-muted-foreground">No jobs posted yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.jobDescriptions.map(job => (
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
