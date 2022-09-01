/*
  Warnings:

  - Added the required column `originalRef` to the `References` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "References" ADD COLUMN     "originalRef" TEXT NOT NULL;
