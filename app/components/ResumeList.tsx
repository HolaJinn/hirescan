'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
    const [sortBy, setSortBy] = useState<'score' | 'uploadedAt'>('uploadedAt');

    useEffect(() => {
        const fetchSorted = async () => {
            const res = await fetch(`/api/job-description/${jobId}/resumes?sortBy=${sortBy}&order=desc`);
            const data = await res.json();
            setResumes(data);
        };
        fetchSorted();
    }, [sortBy, jobId]);

    return (
        <>
            <div className="mb-4">
                <label className="mr-2 font-semibold">Sort by:</label>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'score' | 'uploadedAt')}
                    className="border rounded px-2 py-1"
                >
                    <option value="uploadedAt">Upload Date</option>
                    <option value="score">Match Score</option>
                </select>
            </div>

            <ul className="space-y-3">
                {resumes.map((resume) => (
                    <li key={resume.id} className="border rounded p-3 shadow-md">
                        <div className="flex justify-between">
                            <div>
                                <h2 className="text-lg font-medium">{resume.candidateName || 'Unnamed Candidate'}</h2>
                                <p className="text-sm text-gray-600">{resume.email}</p>
                                <p className="text-sm">Score: {resume.matchScore ?? 'N/A'}</p>
                                <p className="text-sm">
                                    Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                                </p>
                            </div>
                            <Link
                                href={`/dashboard/resumes/${resume.id}`}
                                className="text-blue-600 hover:underline self-center"
                            >
                                View Details →
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}
