/*
  Warnings:

  - You are about to drop the `PublicationBookmarks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PublicationBookmarks" DROP CONSTRAINT "PublicationBookmarks_publicationId_fkey";

-- DropForeignKey
ALTER TABLE "PublicationBookmarks" DROP CONSTRAINT "PublicationBookmarks_userId_fkey";

-- DropTable
DROP TABLE "PublicationBookmarks";
