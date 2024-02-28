/*
  Warnings:

  - Made the column `versionToId` on table `Links` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Links" ALTER COLUMN "versionToId" SET NOT NULL;
