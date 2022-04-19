/*
  Warnings:

  - You are about to drop the column `comments` on the `PublicationFlags` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "PublicationFlags_publicationId_category_createdBy_key";

-- AlterTable
ALTER TABLE "PublicationFlags" DROP COLUMN "comments",
ADD COLUMN     "resolved" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "FlagComments" (
    "id" TEXT NOT NULL,
    "flagId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlagComments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FlagComments" ADD CONSTRAINT "FlagComments_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlagComments" ADD CONSTRAINT "FlagComments_flagId_fkey" FOREIGN KEY ("flagId") REFERENCES "PublicationFlags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
