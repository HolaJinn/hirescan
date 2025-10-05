// app/dashboard/page.tsx
import { prisma } from "@/app/utils/prisma"
import { requireUser } from "@/app/utils/hooks"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"

// ✅ Map job statuses to styles
const statusStyles: Record<string, string> = {
  OPEN: "bg-green-100 text-green-700",
  CLOSED: "bg-red-100 text-red-700",
  DRAFT: "bg-gray-100 text-gray-700",
  PAUSED: "bg-yellow-100 text-yellow-700",
}

export default async function DashboardPage() {
  const session = await requireUser()
  if (!session?.user) return redirect("/login")
  if (!session?.user.verified) return redirect("/validate-email")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, companyId: true },
  })

  const showCreateCompanyBanner = user?.role === "owner" && !user?.companyId

  // ✅ Fetch latest 3 jobs for this user (only if company exists)
  const jobs = !showCreateCompanyBanner
    ? await prisma.jobDescription.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          _count: { select: { resumes: true } },
        },
      })
    : []

  return (
    <div className="space-y-8 p-6">
      {/* Greeting */}
      <section>
        <h1 className="text-2xl font-bold">
          Welcome back, {session.user.name} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here are your most recent jobs. Keep building your team!
        </p>
      </section>

      {/* 🚧 Show company onboarding card if profile is incomplete */}
      {showCreateCompanyBanner ? (
        <Card className="border-dashed border-2 border-yellow-400 bg-yellow-50/30 shadow-none">
          <CardHeader>
            <CardTitle className="text-yellow-700">
              🚧 Company Profile Incomplete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700 mb-4">
              You haven’t completed your company profile yet. This helps you
              stand out to applicants and build trust.
            </p>
            <Link href="/dashboard/company-onboarding">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md transition">
                Complete Company Profile
              </button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Latest Jobs</h2>
            <Link href="/dashboard/jobs">
              <Button variant="outline">View All Jobs</Button>
            </Link>
          </div>

          {jobs.length === 0 && (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">No jobs created yet.</p>
              <Link href="/dashboard/jobs/create">
                <Button className="mt-4">+ Create Your First Job</Button>
              </Link>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {/* ✅ Fix job title cut-off */}
                    <CardTitle className="truncate leading-normal">
                      {job.title}
                    </CardTitle>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyles[job.status]}`}
                    >
                      {job.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {job._count.resumes}{" "}
                    {job._count.resumes === 1 ? "resume" : "resumes"}
                  </p>

                  {/* ✅ Two buttons side by side */}
                  <div className="mt-3 flex gap-2">
                    <Link href={`/dashboard/jobs/${job.id}/details`} className="w-1/2">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/dashboard/jobs/${job.id}`} className="w-1/2">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                        Show Resumes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
