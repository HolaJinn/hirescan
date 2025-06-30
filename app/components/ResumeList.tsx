'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Eye, Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';

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
    const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);
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

    const handleDelete = async () => {
        if (!resumeToDelete) return;

        const res = await fetch(`/api/job-description/${jobId}/resumes/${resumeToDelete.id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            setResumes((prev) => prev.filter((r) => r.id !== resumeToDelete.id));
            setResumeToDelete(null);
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
    const getMatchTier = (score: number | null) => {
        if (score === null) return { label: 'Not Scored', color: 'bg-gray-300' };
        if (score >= 85) return { label: 'Top Match', color: 'bg-green-500' };
        if (score >= 70) return { label: 'Strong Fit', color: 'bg-yellow-400' };
        if (score >= 50) return { label: 'Average', color: 'bg-orange-400' };
        return { label: 'Low Match', color: 'bg-red-500' };
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
                {resumes.map((resume, index) => (
                    <li
                        key={resume.id}
                        className="border rounded-xl p-5 shadow hover:shadow-lg transition-shadow duration-300 bg-white flex justify-between items-center"
                    >
                        <div className="flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {resume.candidateName || 'Unnamed Candidate'}{' '}
                            </h3>
                            <p className="text-sm text-gray-600">{resume.email}</p>
                            <div className="mt-2">
                                {resume.matchScore !== null ? (
                                    <>
                                        <div className="flex justify-between items-center text-sm mb-1">
                                            <span className="text-gray-700 mr-2 font-medium">Match Score: {resume.matchScore}%</span>
                                            <span className={`text-white px-2 py-0.5 rounded text-xs ${getMatchTier(resume.matchScore).color}`}>
                                                {getMatchTier(resume.matchScore).label}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className={`${getMatchTier(resume.matchScore).color} h-full`}
                                                style={{ width: `${resume.matchScore}%` }}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-500">Match score not available</p>
                                )}
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

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button
                                        onClick={() => setResumeToDelete(resume)}
                                        className="text-sm px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center gap-2"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete this resume? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => setResumeToDelete(null)}>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
