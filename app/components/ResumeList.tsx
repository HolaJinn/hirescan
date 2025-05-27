'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Eye, Trash2 } from 'lucide-react';

type Resume = {
    id: string;
    candidateName: string | null;
    email: string | null;
    fileUrl: string;
    matchScore: number | null;
    uploadedAt: Date;
};

export default function ResumeList({
    initialResumes,
    jobId,
}: {
    initialResumes: Resume[];
    jobId: string;
}) {
    const [resumes, setResumes] = useState<Resume[]>(initialResumes);
    const [sortBy, setSortBy] = useState<'matchScore' | 'uploadedAt'>('uploadedAt');

    useEffect(() => {
        const fetchSorted = async () => {
            const res = await fetch(`/api/job-description/${jobId}/resumes?sortBy=${sortBy}&order=desc`);
            if (!res.ok) {
                console.error('Failed to fetch resumes');
                return;
            }

            const data = await res.json();
            if (Array.isArray(data)) {
                setResumes(data);
            } else if (Array.isArray(data.resumes)) {
                setResumes(data.resumes);
            } else {
                console.error('Invalid data format', data);
            }
        };
        fetchSorted();
    }, [sortBy, jobId]);

    const handleDelete = async (resumeId: string) => {
        const confirm = window.confirm('Are you sure you want to delete this resume?');
        if (!confirm) return;

        const res = await fetch(`/api/job-description/${jobId}/resumes/${resumeId}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            setResumes((prev) => prev.filter((r) => r.id !== resumeId));
        } else {
            console.error('Failed to delete resume');
        }
    };

    const renderStars = (score: number | null) => {
        if (score === null) return 'N/A';
        const starsOutOf5 = Math.round((score / 100) * 5);
        return (
            <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, idx) =>
                    idx < starsOutOf5 ? (
                        <Star key={idx} size={16} fill="currentColor" stroke="none" />
                    ) : (
                        <Star key={idx} size={16} />
                    )
                )}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Uploaded Resumes</h2>
                <div>
                    <label className="mr-2 text-sm font-medium">Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'matchScore' | 'uploadedAt')}
                        className="border border-gray-300 rounded px-3 py-1 text-sm"
                    >
                        <option value="uploadedAt">Upload Date</option>
                        <option value="matchScore">Match Score</option>
                    </select>
                </div>
            </div>

            <ul className="space-y-4">
                {resumes.map((resume) => (
                    <li
                        key={resume.id}
                        className="border rounded-xl p-5 shadow hover:shadow-lg transition-shadow duration-300 bg-white flex justify-between items-center"
                    >
                        <div className="flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {resume.candidateName || 'Unnamed Candidate'}
                            </h3>
                            <p className="text-sm text-gray-600">{resume.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-700">Match Score:</span>
                                {renderStars(resume.matchScore)}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="flex gap-3 flex-col items-end sm:flex-row sm:items-center">
                            <Link
                                href={`/dashboard/jobs/${jobId}/resume/${resume.id}`}
                                className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
                            >
                                <Eye size={16} />
                                View
                            </Link>
                            <button
                                onClick={() => handleDelete(resume.id)}
                                className="text-sm px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center gap-2"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
