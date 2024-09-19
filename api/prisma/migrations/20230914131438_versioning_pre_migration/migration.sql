/*
  Warnings:

  - You are about to drop the column `affiliationStatement` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the `Affiliations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Affiliations" DROP CONSTRAINT "Affiliations_publicationId_fkey";

-- DropIndex
DROP INDEX "CoAuthors_publicationId_email_key";

-- AlterTable
ALTER TABLE "CoAuthors" ADD COLUMN     "publicationVersionId" TEXT,
ALTER COLUMN "publicationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Funders" ADD COLUMN     "publicationVersionId" TEXT,
ALTER COLUMN "publicationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Publication" DROP COLUMN "affiliationStatement",
ALTER COLUMN "licence" DROP NOT NULL,
ALTER COLUMN "language" DROP NOT NULL,
ALTER COLUMN "currentStatus" DROP NOT NULL,
ALTER COLUMN "createdBy" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PublicationStatus" ADD COLUMN     "publicationVersionId" TEXT,
ALTER COLUMN "publicationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "References" ADD COLUMN     "publicationVersionId" TEXT,
ALTER COLUMN "publicationId" DROP NOT NULL;

-- DropTable
DROP TABLE "Affiliations";

-- CreateTable
CREATE TABLE "PublicationVersion" (
    "id" TEXT NOT NULL,
    "versionOf" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "isLatestVersion" BOOLEAN NOT NULL DEFAULT true,
    "isLatestLiveVersion" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currentStatus" "PublicationStatusEnum" NOT NULL DEFAULT 'DRAFT',
    "publishedDate" TIMESTAMP(3),
    "title" TEXT,
    "licence" "LicenceType" NOT NULL DEFAULT 'CC_BY',
    "conflictOfInterestStatus" BOOLEAN,
    "conflictOfInterestText" TEXT,
    "ethicalStatement" TEXT,
    "ethicalStatementFreeText" TEXT,
    "dataPermissionsStatement" TEXT,
    "dataPermissionsStatementProvidedBy" TEXT,
    "dataAccessStatement" TEXT,
    "selfDeclaration" BOOLEAN DEFAULT false,
    "description" TEXT,
    "keywords" TEXT[],
    "content" TEXT,
    "language" "Languages" NOT NULL DEFAULT 'en',
    "fundersStatement" TEXT,

    CONSTRAINT "PublicationVersion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PublicationVersion" ADD CONSTRAINT "PublicationVersion_versionOf_fkey" FOREIGN KEY ("versionOf") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationVersion" ADD CONSTRAINT "PublicationVersion_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "References" ADD CONSTRAINT "References_publicationVersionId_fkey" FOREIGN KEY ("publicationVersionId") REFERENCES "PublicationVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funders" ADD CONSTRAINT "Funders_publicationVersionId_fkey" FOREIGN KEY ("publicationVersionId") REFERENCES "PublicationVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationStatus" ADD CONSTRAINT "PublicationStatus_publicationVersionId_fkey" FOREIGN KEY ("publicationVersionId") REFERENCES "PublicationVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoAuthors" ADD CONSTRAINT "CoAuthors_publicationVersionId_fkey" FOREIGN KEY ("publicationVersionId") REFERENCES "PublicationVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
