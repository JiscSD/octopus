/*
  Warnings:

  - You are about to drop the column `publicationId` on the `CoAuthors` table. All the data in the column will be lost.
  - You are about to drop the column `publicationId` on the `Funders` table. All the data in the column will be lost.
  - You are about to drop the column `conflictOfInterestStatus` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `conflictOfInterestText` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `currentStatus` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `dataAccessStatement` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `dataPermissionsStatement` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `dataPermissionsStatementProvidedBy` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `ethicalStatement` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `ethicalStatementFreeText` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `fundersStatement` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `keywords` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `licence` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `publishedDate` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `selfDeclaration` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `publicationId` on the `PublicationStatus` table. All the data in the column will be lost.
  - You are about to drop the column `publicationId` on the `References` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publicationVersionId,email]` on the table `CoAuthors` will be added. If there are existing duplicate values, this will fail.
  - Made the column `publicationVersionId` on table `CoAuthors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `publicationVersionId` on table `Funders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `publicationVersionId` on table `PublicationStatus` required. This step will fail if there are existing NULL values in that column.
  - Made the column `publicationVersionId` on table `References` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CoAuthors" DROP CONSTRAINT "CoAuthors_publicationId_fkey";

-- DropForeignKey
ALTER TABLE "Funders" DROP CONSTRAINT "Funders_publicationId_fkey";

-- DropForeignKey
ALTER TABLE "Publication" DROP CONSTRAINT "Publication_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "PublicationStatus" DROP CONSTRAINT "PublicationStatus_publicationId_fkey";

-- DropForeignKey
ALTER TABLE "References" DROP CONSTRAINT "References_publicationId_fkey";

-- AlterTable
ALTER TABLE "CoAuthors" DROP COLUMN "publicationId",
ALTER COLUMN "publicationVersionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Funders" DROP COLUMN "publicationId",
ALTER COLUMN "publicationVersionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Publication" DROP COLUMN "conflictOfInterestStatus",
DROP COLUMN "conflictOfInterestText",
DROP COLUMN "content",
DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
DROP COLUMN "currentStatus",
DROP COLUMN "dataAccessStatement",
DROP COLUMN "dataPermissionsStatement",
DROP COLUMN "dataPermissionsStatementProvidedBy",
DROP COLUMN "description",
DROP COLUMN "ethicalStatement",
DROP COLUMN "ethicalStatementFreeText",
DROP COLUMN "fundersStatement",
DROP COLUMN "keywords",
DROP COLUMN "language",
DROP COLUMN "licence",
DROP COLUMN "publishedDate",
DROP COLUMN "selfDeclaration",
DROP COLUMN "title",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "PublicationStatus" DROP COLUMN "publicationId",
ALTER COLUMN "publicationVersionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "References" DROP COLUMN "publicationId",
ALTER COLUMN "publicationVersionId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CoAuthors_publicationVersionId_email_key" ON "CoAuthors"("publicationVersionId", "email");
