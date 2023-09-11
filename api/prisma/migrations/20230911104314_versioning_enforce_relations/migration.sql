/*
  Warnings:

  - Made the column `publicationVersionId` on table `CoAuthors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `publicationVersionId` on table `Funders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `publicationVersionId` on table `PublicationStatus` required. This step will fail if there are existing NULL values in that column.
  - Made the column `publicationVersionId` on table `References` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CoAuthors" ALTER COLUMN "publicationVersionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Funders" ALTER COLUMN "publicationVersionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "PublicationStatus" ALTER COLUMN "publicationVersionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "References" ALTER COLUMN "publicationVersionId" SET NOT NULL;
