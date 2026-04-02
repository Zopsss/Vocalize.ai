/*
  Warnings:

  - Added the required column `attempts` to the `interview-attempts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "interview-attempts" ADD COLUMN     "attempts" INTEGER NOT NULL;
