import { notFound, redirect } from "next/navigation"
import { prisma } from "@/app/utils/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { revalidatePath } from "next/cache"

type Params = Promise<{ jobId: string }>

export default async function DeleteJobPage({ params }: { params: Params }) {
    const { jobId } = await params;
    const job = await prisma.jobDescription.findUnique({
        where: { id: jobId },
    })

    if (!job) return notFound()

    async function deleteJob() {
        "use server"

        await prisma.jobDescription.delete({
            where: { id: jobId },
        })

        revalidatePath("/dashboard/jobs")
        redirect("/dashboard/jobs")
    }

    return (
        <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Delete Job</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground">
                        Are you sure you want to delete the job titled <span className="font-medium">{job.title}</span>?
                        This action cannot be undone.
                    </p>

                    <form action={deleteJob} className="flex justify-between">
                        <Link href="/dashboard/jobs">
                            <Button variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" variant="destructive">
                            Delete Permanently
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
