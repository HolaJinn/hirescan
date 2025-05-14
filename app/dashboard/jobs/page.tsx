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

export default async function JobsPage() {
    const jobs = await prisma.jobDescription.findMany({
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
            {/* Header with job count and create button */}
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

            {/* Job cards list */}
            <div className="space-y-4">
                {jobs.map((job) => (
                    <Dialog key={job.id}>
                        <DialogTrigger asChild>
                            <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200">
                                <CardHeader>
                                    <CardTitle>{job.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {job.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex gap-2">
                                    <Link href={`/dashboard/jobs/${job.id}/edit`}>
                                        <Button variant="outline">Edit</Button>
                                    </Link>
                                    <form action={`/dashboard/jobs/${job.id}/delete`} method="POST">
                                        <Button variant="destructive" type="submit">
                                            Delete
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </DialogTrigger>

                        {/* Modal content */}
                        <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-xl">{job.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <label className="text-sm font-medium text-muted-foreground">Full Description</label>
                                <Textarea
                                    readOnly
                                    value={job.description}
                                    className="resize-none h-60 text-base"
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
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
