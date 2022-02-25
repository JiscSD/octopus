-- CreateEnum
CREATE TYPE "PublicationFlagCategoryEnum" AS ENUM ('PLAGARISM', 'ETHICAL_ISSUES', 'MISREPRESENTATION', 'UNDECLARED_IMAGE_MANIPULATION', 'COPYRIGHT', 'INAPPROPRIATE');

-- CreateTable
CREATE TABLE "PublicationFlags" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "category" "PublicationFlagCategoryEnum" NOT NULL,
    "comments" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicationFlags_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PublicationFlags" ADD CONSTRAINT "PublicationFlags_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationFlags" ADD CONSTRAINT "PublicationFlags_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
