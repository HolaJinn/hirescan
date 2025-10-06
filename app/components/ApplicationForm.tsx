'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'

export default function ApplicationForm({ jobId }: { jobId: string }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return alert('Please upload a resume')

    const formData = new FormData()
    formData.append('fullName', fullName)
    formData.append('email', email)
    formData.append('resume', file)

    setLoading(true)

    const res = await fetch(`/api/job-description/${jobId}/apply/v2`, {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Resume Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Resume (PDF)</label>
        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition w-fit">
            <Upload className="w-4 h-4" />
            <span>{file ? 'Change File' : 'Upload Resume'}</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="hidden"
            />
          </label>
          {file && <span className="ml-3 text-sm text-gray-600 truncate">{file.name}</span>}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  )
}
