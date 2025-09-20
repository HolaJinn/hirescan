import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { prisma } from "@/app/utils/prisma"
import { UploadResumesForm } from "@/app/components/UploadResumesForm"
import { JobStatusSelect } from "@/app/components/JobStatusSelect"
import { requireUser } from "@/app/utils/hooks"
import CopyApplyLinkButton from "@/app/components/CopyApplyLinkButton"

interface JobsPageProps {
    searchParams: Promise<{ filter?: string }>;
}

// ✅ server action to allow filtering
async function getJobs(companyId: string, onlyMine: boolean, userId: string) {
    return prisma.jobDescription.findMany({
        orderBy: { createdAt: "desc" },
        where: {
            companyId,
            ...(onlyMine ? { userId } : {}),
        },
        include: {
            _count: { select: { resumes: true } },
            user: { select: { firstName: true, lastName: true } },
        },
    });
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
    const session = await requireUser();

    // Fetch current user with company info
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { company: true }
    });

    const showCompanyOnboarding = !user?.companyId;

    const { filter } = await searchParams;
    const onlyMine = filter === "mine";


    const jobs = showCompanyOnboarding
        ? []
        : await getJobs(user!.companyId!, onlyMine, session.user.id);

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                    <h1 className="text-2xl font-bold">Job Listings</h1>
                    {!showCompanyOnboarding && (
                        <p className="text-muted-foreground">
                            {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
                            {onlyMine && " (only yours)"}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {!showCompanyOnboarding && (
                        <>
                            {/* Toggle filter button */}
                            {onlyMine ? (
                                <Link href="/dashboard/jobs">
                                    <Button variant="outline">Show All Company Jobs</Button>
                                </Link>
                            ) : (
                                <Link href="/dashboard/jobs?filter=mine">
                                    <Button variant="outline">Show Only My Jobs</Button>
                                </Link>
                            )}

                            <Link href="/dashboard/jobs/create">
                                <Button>+ Create Job</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* 🚧 Show company onboarding card if profile is incomplete */}
            {showCompanyOnboarding && (
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
            )}

            {/* Jobs List */}
            {!showCompanyOnboarding && (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <Card
                            key={job.id}
                            className="hover:shadow-md transition-shadow duration-200"
                        >
                            <CardHeader>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div className="cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <CardTitle>{job.title}</CardTitle>
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-full
                                                    ${{
                                                        OPEN: "bg-green-100 text-green-700",
                                                        CLOSED: "bg-red-100 text-red-700",
                                                        DRAFT: "bg-gray-100 text-gray-700",
                                                        PAUSED: "bg-yellow-100 text-yellow-700",
                                                    }[job.status]
                                                    }`}>
                                                    {job.status}
                                                </span>
                                            </div>

                                            <p className="text-sm text-muted-foreground">
                                                Created by{" "}
                                                <span className="font-medium">
                                                    {job.user.firstName} {job.user.lastName}
                                                </span>
                                            </p>

                                            <p className="text-sm text-muted-foreground">
                                                {job._count.resumes} {job._count.resumes === 1 ? "resume" : "resumes"} submitted
                                            </p>
                                            <CardDescription className="line-clamp-2">
                                                {job.description}
                                            </CardDescription>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl">{job.title}</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <p className="text-sm text-muted-foreground">
                                                {job._count.resumes} {job._count.resumes === 1 ? "resume" : "resumes"} submitted
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Full Description
                                            </label>
                                            <Textarea
                                                readOnly
                                                value={job.description}
                                                className="resize-none h-[30rem] text-base"
                                            />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>

                            <CardContent className="flex items-center justify-between flex-wrap gap-2">
                                <Link href={`/dashboard/jobs/${job.id}`}>
                                    <Button className="bg-purple-100 text-purple-900 hover:bg-purple-200">
                                        View Resumes ({job._count.resumes})
                                    </Button>
                                </Link>

                                {/* Right Side Buttons */}
                                <div className="flex items-center gap-2">
                                    <JobStatusSelect jobId={job.id} currentStatus={job.status} />
                                    <CopyApplyLinkButton jobId={job.id} />
                                    <Link href={`/dashboard/jobs/${job.id}/edit`}>
                                        <Button variant="outline">Edit</Button>
                                    </Link>

                                    {/* <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">Upload Resumes</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Upload Resumes</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-2">
                                                <UploadResumesForm jobId={job.id} />
                                            </div>
                                        </DialogContent>
                                    </Dialog> */}

                                    <form action={`/dashboard/jobs/${job.id}/delete`} method="POST">
                                        <Button variant="destructive" type="submit">
                                            Delete
                                        </Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {jobs.length === 0 && (
                        <p className="text-muted-foreground">
                            No job descriptions found.
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
