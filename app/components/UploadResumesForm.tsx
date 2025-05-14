"use client"

import { useState } from "react"
import { toast } from "sonner"

export function UploadResumesForm({ jobId }: { jobId: string }) {
    const [uploading, setUploading] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        formData.append("jobId", jobId)
        setUploading(true)

        try {
            const response = await fetch("/api/upload-resumes", {
                method: "POST",
                body: formData,
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Upload failed")
            }

            toast.success("Resumes uploaded successfully! ✅")
        } catch (error: any) {
            toast.error(error.message || "Something went wrong while uploading.")
        } finally {
            setUploading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="file"
                name="resumes"
                accept="application/pdf"
                multiple
                required
                className="text-sm file:border-0 file:bg-primary file:text-primary-foreground file:px-4 file:py-2 file:rounded-md file:cursor-pointer"
            />
            <button
                type="submit"
                disabled={uploading}
                className="mt-2 px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
                {uploading ? "Uploading..." : "Upload"}
            </button>
        </form>
    )
}
