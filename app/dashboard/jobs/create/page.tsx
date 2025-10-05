"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Sparkles, Loader2 } from "lucide-react"
import TiptapEditor from "@/app/components/TipTapEditor"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"


export default function CreateJobPage() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [generating, setGenerating] = useState(false)
    const [aiGenerated, setAiGenerated] = useState(false)

    // Submit handler
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

    const handleGenerateFromPrompt = async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt first.")
            return
        }

        setGenerating(true)
        setError("")

        try {
            const res = await fetch("/api/generate-job", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();


            // Set each state separately (TypeScript-safe)
            setTitle(data.title)
            setDescription(data.description)
            setAiGenerated(true)
        } catch (err) {
            console.error(err)
            setError("An error occurred while generating.")
        } finally {
            setGenerating(false)
        }
    }



    return (
        <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
            <h1 className="text-2xl font-bold">Create Job</h1>

            <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manual">Manual</TabsTrigger>
                    <TabsTrigger value="ai">AI Prompt</TabsTrigger>
                </TabsList>

                {/* Manual Job Creation */}
                <TabsContent value="manual">
                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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

                        <div className="space-y-2">
                            <Label htmlFor="description">Job Description</Label>
                            <TiptapEditor value={description} onChange={setDescription} />
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Job"}
                        </Button>
                    </form>
                </TabsContent>

                {/* AI Prompt Job Creation */}
                <TabsContent value="ai">
                    {!aiGenerated ? (
                        <div className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="prompt">Describe the Job Requirements</Label>
                                <Textarea
                                    id="prompt"
                                    placeholder="e.g. I want a senior backend engineer with 5 years of experience in Node.js and AWS..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    rows={5}
                                />
                            </div>

                            <Button
                                type="button"
                                onClick={handleGenerateFromPrompt}
                                disabled={generating}
                                className="w-full"
                            >
                                {generating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
                                        Generate Job with AI
                                    </>
                                )}
                            </Button>

                            {error && <p className="text-sm text-red-600">{error}</p>}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Job Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Job Description</Label>
                                <TiptapEditor value={description} onChange={setDescription} />
                            </div>

                            {error && <p className="text-sm text-red-600">{error}</p>}

                            <Button type="submit" disabled={loading}>
                                {loading ? "Creating..." : "Create Job"}
                            </Button>
                        </form>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
