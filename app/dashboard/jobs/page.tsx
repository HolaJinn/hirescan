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

export default async function JobsPage() {
    const jobs = await prisma.jobDescription.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { resumes: true }
            }
        }
    })

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Your Job Listings</h1>
                    <p className="text-muted-foreground">
                        {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
                    </p>
                </div>
                <Link href="/dashboard/jobs/create">
                    <Button>+ Create Job</Button>
                </Link>
            </div>

            {/* Jobs List */}
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
                                        <CardTitle>{job.title}</CardTitle>
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
                            {/* View Resumes Button (Left Side) */}
                            <Link href={`/dashboard/jobs/${job.id}`}>
                                <Button className="bg-purple-100 text-purple-900 hover:bg-purple-200">
                                    View Resumes ({job._count.resumes})
                                </Button>
                            </Link>

                            {/* Right Side Buttons */}
                            <div className="flex items-center gap-2">
                                <Link href={`/dashboard/jobs/${job.id}/edit`}>
                                    <Button variant="outline">Edit</Button>
                                </Link>

                                <Dialog>
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
                                </Dialog>

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
                        You haven’t created any job descriptions yet.
                    </p>
                )}
            </div>
        </div>
    )
}
