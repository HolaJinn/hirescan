import { prisma } from "@/app/utils/prisma"
import { requireUser } from "@/app/utils/hooks"
import TiptapViewer from "@/app/components/TipTapViewer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function JobDetailPage(context: { params: Promise<{ jobId: string }> }) {
    const session = await requireUser()
    const { jobId: jobId } = await context.params;


    const job = await prisma.jobDescription.findUnique({
        where: { id: jobId },
        include: {
            user: { select: { firstName: true, lastName: true } },
            _count: { select: { resumes: true } },
        },
    })

    if (!job) {
        return <div>❌ Job not found</div>
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{job.title}</h1>
                <Link href="/dashboard/jobs">
                    <Button variant="outline">← Back to Jobs</Button>
                </Link>
            </div>

            <p className="text-sm text-muted-foreground">
                Created by {job.user.firstName} {job.user.lastName} ·{" "}
                {job._count.resumes}{" "}
                {job._count.resumes === 1 ? "resume" : "resumes"} submitted
            </p>

            <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground">
                    Full Description
                </label>
                <TiptapViewer content={job.description} />
            </div>
        </div>
    )
}
