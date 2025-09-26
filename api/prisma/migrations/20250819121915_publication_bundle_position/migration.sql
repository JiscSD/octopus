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
CREATE TABLE "PublicationBundleEntry" (
    "id" TEXT NOT NULL,
    "publicationBundleId" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "PublicationBundleEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublicationBundleEntry_publicationBundleId_publicationId_key" ON "PublicationBundleEntry"("publicationBundleId", "publicationId");

-- AddForeignKey
ALTER TABLE "PublicationBundleEntry" ADD CONSTRAINT "PublicationBundleEntry_publicationBundleId_fkey" FOREIGN KEY ("publicationBundleId") REFERENCES "PublicationBundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationBundleEntry" ADD CONSTRAINT "PublicationBundleEntry_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
