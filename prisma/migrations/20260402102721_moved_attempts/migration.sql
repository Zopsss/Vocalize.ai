/*
  Warnings:

  - You are about to drop the column `attempts` on the `interview-attempts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "interview" ADD COLUMN     "attemptsCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "interview-attempts" DROP COLUMN "attempts";
