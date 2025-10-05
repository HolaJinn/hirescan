-- AlterTable
ALTER TABLE "public"."JobDescription" ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "verified" SET DEFAULT true;
