/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `resume` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "resume_userId_key" ON "resume"("userId");
