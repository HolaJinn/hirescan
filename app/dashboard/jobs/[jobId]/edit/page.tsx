import { notFound, redirect } from "next/navigation";
import { prisma } from "@/app/utils/prisma";
import EditJobForm from "./editJobForm";

interface PageProps {
  params: { jobId: string };
}

export default async function EditJobPage({ params }: PageProps) {
  const { jobId } = params;
  const job = await prisma.jobDescription.findUnique({
    where: { id: jobId },
  });

  if (!job) return notFound();

  // Server action to update the job
  async function updateJob(title: string, description: string) {
    "use server";

    await prisma.jobDescription.update({
      where: { id: jobId },
      data: { title, description },
    });

    redirect("/dashboard/jobs");
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Edit Job</h1>

      <EditJobForm
        jobId={jobId}
        initialTitle={job.title}
        initialDescription={job.description}
        onSubmit={updateJob}
      />
    </div>
  );
}
