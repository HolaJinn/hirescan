-- CreateEnum
CREATE TYPE "public"."ResumeStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "public"."Resume" ADD COLUMN     "status" "public"."ResumeStatus" NOT NULL DEFAULT 'PENDING';
