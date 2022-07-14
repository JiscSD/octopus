/*
  Warnings:

  - You are about to drop the `PublicationRatings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PublicationRatings" DROP CONSTRAINT "PublicationRatings_publicationId_fkey";

-- DropForeignKey
ALTER TABLE "PublicationRatings" DROP CONSTRAINT "PublicationRatings_userId_fkey";

-- DropTable
DROP TABLE "PublicationRatings";
