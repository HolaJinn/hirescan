"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react";

export default function CreateJobPage() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [generating, setGenerating] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const res = await fetch("/api/job-description", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description }),
        })

        if (res.ok) {
            router.push("/dashboard/jobs")
        } else {
            const data = await res.json()
            setError(data.message || "Something went wrong.")
            setLoading(false)
        }
    }

    const handleGenerate = async () => {
        if (!title.trim()) {
            setError("Please enter a job title before generating.")
            return
        }

        setGenerating(true)
        setError("")

        try {
            const res = await fetch("/api/generate-job-description", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title }),
            })

            const data = await res.json()
            console.log(data)

            if (res.ok && data.description) {
                setDescription(data.description)
            } else {
                setError(data.message || "Failed to generate job description.")
            }
        } catch (err) {
            setError("An error occurred while generating.")
        } finally {
            setGenerating(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
            <h1 className="text-2xl font-bold">Create Job Description</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                        id="title"
                        placeholder="e.g. Full Stack Developer"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleGenerate}
                        disabled={generating}
                    >
                        {generating ? (
                            "Generating..."
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
                                Generate with AI
                            </>
                        )}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        Enter a job title above and click to auto-generate a description using AI.
                    </p>
                </div>


                <div className="space-y-2">
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea
                        id="description"
                        placeholder="Describe the responsibilities, requirements, etc..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        required
                    />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Job"}
                </Button>
            </form>
        </div>
    )
}
