import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type ResumeReviewPageProps = {
    params: {
        jobId: string;
        resumeId: string;
    };
};

type Resume = {
    id: string;
    candidateName: string | null;
    email: string | null;
    fileUrl: string;
    uploadedAt: string;
    matchScore: number | null;
    aiSummary: string | null;
    keyStrengths: string[];
    keyWeaknesses: string[];
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
async function getResumeDetails(jobId: string, resumeId: string): Promise<Resume | null> {
    const res = await fetch(`${baseUrl}/api/job-description/${jobId}/resumes/${resumeId}`, {
        cache: 'no-store',
    });

    if (!res.ok) return null;
    return res.json();
}

export default async function ResumeReviewPage({ params }: ResumeReviewPageProps) {
    const { jobId, resumeId } = params;
    const resume = await getResumeDetails(jobId, resumeId);

    if (!resume) {
        return <div className="p-4 text-red-600 font-semibold">Resume not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        {resume.candidateName || "Unnamed Candidate"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{resume.email}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Uploaded:</span>
                        <span className="text-sm">{new Date(resume.uploadedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Match Score:</span>
                        <Badge variant="secondary" className="text-md px-3 py-1">
                            {resume.matchScore ?? "N/A"}
                        </Badge>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-semibold text-lg mb-2">AI Summary</h3>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {resume.aiSummary || "No summary available."}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-2">Key Strengths</h3>
                        {resume.keyStrengths.length > 0 ? (
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {resume.keyStrengths.map((strength, i) => (
                                    <li key={i}>{strength}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">None listed.</p>
                        )}
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-2">Key Weaknesses</h3>
                        {resume.keyWeaknesses.length > 0 ? (
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {resume.keyWeaknesses.map((weakness, i) => (
                                    <li key={i}>{weakness}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">None listed.</p>
                        )}
                    </div>

                    <Separator />

                    <div className="pt-2">
                        <a
                            href={resume.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                        >
                            View Resume PDF →
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
