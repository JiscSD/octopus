/*

  N.B. the following warnings were raised, and this migration has been manually edited to use RENAME COLUMN instead of dropping and recreating them.

  Warnings:

  - You are about to drop the column `publicationFrom` on the `Links` table. All the data in the column will be lost.
  - You are about to drop the column `publicationTo` on the `Links` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publicationFromId,publicationToId]` on the table `Links` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicationFromId` to the `Links` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicationToId` to the `Links` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Links" DROP CONSTRAINT "Links_publicationFrom_fkey";

-- DropForeignKey
ALTER TABLE "Links" DROP CONSTRAINT "Links_publicationTo_fkey";

-- DropIndex
DROP INDEX "Links_publicationFrom_publicationTo_key";

-- AlterTable
ALTER TABLE "Links" RENAME COLUMN "publicationFrom" TO "publicationFromId";
ALTER TABLE "Links" RENAME COLUMN "publicationTo" TO "publicationToId";
ALTER TABLE "Links" ADD COLUMN "versionToId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Links_publicationFromId_publicationToId_key" ON "Links"("publicationFromId", "publicationToId");

-- AddForeignKey
ALTER TABLE "Links" ADD CONSTRAINT "Links_publicationFromId_fkey" FOREIGN KEY ("publicationFromId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Links" ADD CONSTRAINT "Links_publicationToId_fkey" FOREIGN KEY ("publicationToId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Links" ADD CONSTRAINT "Links_versionToId_fkey" FOREIGN KEY ("versionToId") REFERENCES "PublicationVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
