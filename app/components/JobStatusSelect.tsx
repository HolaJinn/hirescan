"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"

export function JobStatusSelect({
    jobId,
    currentStatus,
}: {
    jobId: string
    currentStatus: string
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newStatus = e.target.value

        await fetch(`/api/job-description/${jobId}/status/`, {
            method: "POST",
            body: JSON.stringify({ status: newStatus }),
            headers: { "Content-Type": "application/json" },
        })

        startTransition(() => {
            router.refresh()
        })
    }

    return (
        <select
            name="status"
            defaultValue={currentStatus}
            onChange={handleChange}
            disabled={isPending}
            className="border rounded px-2 py-1 text-sm bg-white"
        >
            <option value="OPEN">Open</option>
            <option value="PAUSED">Paused</option>
            <option value="DRAFT">Draft</option>
            <option value="CLOSED">Closed</option>
        </select>
    )
}
