/*
  Warnings:

  - You are about to drop the `_PublicationToPublicationBundle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PublicationToPublicationBundle" DROP CONSTRAINT "_PublicationToPublicationBundle_A_fkey";

-- DropForeignKey
ALTER TABLE "_PublicationToPublicationBundle" DROP CONSTRAINT "_PublicationToPublicationBundle_B_fkey";

-- DropTable
DROP TABLE "_PublicationToPublicationBundle";

-- CreateTable
CREATE TABLE "PublicationBundlePublication" (
    "id" TEXT NOT NULL,
    "publicationBundleId" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "PublicationBundlePublication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublicationBundlePublication_publicationBundleId_publicatio_key" ON "PublicationBundlePublication"("publicationBundleId", "publicationId");

-- AddForeignKey
ALTER TABLE "PublicationBundlePublication" ADD CONSTRAINT "PublicationBundlePublication_publicationBundleId_fkey" FOREIGN KEY ("publicationBundleId") REFERENCES "PublicationBundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationBundlePublication" ADD CONSTRAINT "PublicationBundlePublication_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
