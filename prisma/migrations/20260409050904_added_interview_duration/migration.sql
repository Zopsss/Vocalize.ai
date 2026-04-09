/*
  Warnings:

  - The values [PENDING] on the enum `InterviewStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `transcriptMessages` on the `interview-attempts` table. All the data in the column will be lost.
  - The `transcript` column on the `interview-attempts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InterviewStatus_new" AS ENUM ('UPCOMING', 'IN_PROGRESS', 'PROCESSING', 'COMPLETED', 'FAILED');
ALTER TABLE "public"."interview-attempts" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "interview-attempts" ALTER COLUMN "status" TYPE "InterviewStatus_new" USING ("status"::text::"InterviewStatus_new");
ALTER TYPE "InterviewStatus" RENAME TO "InterviewStatus_old";
ALTER TYPE "InterviewStatus_new" RENAME TO "InterviewStatus";
DROP TYPE "public"."InterviewStatus_old";
ALTER TABLE "interview-attempts" ALTER COLUMN "status" SET DEFAULT 'UPCOMING';
COMMIT;

-- AlterTable
ALTER TABLE "interview-attempts" DROP COLUMN "transcriptMessages",
ADD COLUMN     "interviewDuration" INTEGER,
ALTER COLUMN "status" SET DEFAULT 'UPCOMING',
DROP COLUMN "transcript",
ADD COLUMN     "transcript" JSONB;
