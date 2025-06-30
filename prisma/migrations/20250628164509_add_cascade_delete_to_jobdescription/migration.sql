-- DropForeignKey
ALTER TABLE "JobDescription" DROP CONSTRAINT "JobDescription_userId_fkey";

-- AddForeignKey
ALTER TABLE "JobDescription" ADD CONSTRAINT "JobDescription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
