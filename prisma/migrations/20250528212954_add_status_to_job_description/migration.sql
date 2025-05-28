-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('OPEN', 'CLOSED', 'DRAFT', 'PAUSED');

-- AlterTable
ALTER TABLE "JobDescription" ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'DRAFT';
