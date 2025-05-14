-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "candidateName" TEXT,
    "email" TEXT,
    "linkedinUrl" TEXT,
    "matchScore" DOUBLE PRECISION,
    "aiSummary" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "JobDescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
