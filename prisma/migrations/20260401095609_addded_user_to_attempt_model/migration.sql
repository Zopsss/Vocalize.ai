/*
  Warnings:

  - Added the required column `userId` to the `interview-attempts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "interview-attempts" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "interview-attempts" ADD CONSTRAINT "interview-attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
