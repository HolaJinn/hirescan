import { notFound, redirect } from "next/navigation"
import { prisma } from "@/app/utils/prisma"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { revalidatePath } from "next/cache"

type Params = Promise<{ jobId: string }>

export default async function EditJobPage({ params }: { params: Params }) {
    const { jobId } = await params;
    const job = await prisma.jobDescription.findUnique({
        where: { id: jobId },
    })

    if (!job) return notFound()

    async function updateJob(formData: FormData) {
        "use server"

        const title = formData.get("title") as string
        const description = formData.get("description") as string

        await prisma.jobDescription.update({
            where: { id: jobId },
            data: {
                title,
                description,
            },
        })

        revalidatePath("/dashboard/jobs")
        redirect("/dashboard/jobs")
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
            <h1 className="text-2xl font-bold">Edit Job</h1>
            <form action={updateJob} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                        Job Title
                    </label>
                    <Input id="title" name="title" defaultValue={job.title} required />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                        Description
                    </label>
                    <Textarea
                        id="description"
                        name="description"
                        defaultValue={job.description}
                        required
                        className="min-h-[200px]"
                    />
                </div>

                <Button type="submit">Save Changes</Button>
            </form>
        </div>
    )
}
