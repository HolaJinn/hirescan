'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ApplicationForm({ jobId }: { jobId: string }) {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return alert('Please upload a resume')

        const formData = new FormData()
        formData.append('fullName', fullName)
        formData.append('email', email)
        formData.append('resume', file)

        setLoading(true)

        const res = await fetch(`/api/job-description/${jobId}/apply`, {
            method: 'POST',
            body: formData,
        })

        setLoading(false)

        if (res.ok) {
            setSubmitted(true)
        } else {
            alert('Submission failed.')
        }
    }

    if (submitted) {
        return (
            <div className="text-center">
                <p className="text-green-600 text-lg font-semibold">Application submitted!</p>
                <p className="text-sm text-gray-600 mt-2">We'll review your resume shortly.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Resume (PDF)</label>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
                {loading ? 'Submitting...' : 'Submit Application'}
            </button>
        </form>
    )
}
