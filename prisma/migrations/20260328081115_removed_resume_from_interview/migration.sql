-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_resumeId_fkey";

-- AlterTable
ALTER TABLE "Interview" ALTER COLUMN "resumeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resume"("id") ON DELETE SET NULL ON UPDATE CASCADE;
