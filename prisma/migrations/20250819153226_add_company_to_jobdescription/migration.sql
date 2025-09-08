/*
  Warnings:

  - Added the required column `companyId` to the `JobDescription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."JobDescription" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."JobDescription" ADD CONSTRAINT "JobDescription_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
