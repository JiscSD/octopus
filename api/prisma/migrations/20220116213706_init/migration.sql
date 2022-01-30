-- DropForeignKey
ALTER TABLE "Publication" DROP CONSTRAINT "Publication_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "PublicationStatus" DROP CONSTRAINT "PublicationStatus_publicationId_fkey";

-- AddForeignKey
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationStatus" ADD CONSTRAINT "PublicationStatus_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
