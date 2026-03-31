/*
  Warnings:

  - You are about to drop the column `extractedText` on the `resume` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "resume" DROP COLUMN "extractedText",
ADD COLUMN     "resumeObject" JSONB;
