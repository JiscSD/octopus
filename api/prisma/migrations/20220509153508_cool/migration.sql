/*
  Warnings:

  - Added the required column `link` to the `Funders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Funders" ADD COLUMN     "link" TEXT NOT NULL;
