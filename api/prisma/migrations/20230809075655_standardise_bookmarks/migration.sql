/*
  Warnings:

  - You are about to drop the `TopicBookmark` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BookmarkType" AS ENUM ('PUBLICATION', 'TOPIC');

-- DropForeignKey
ALTER TABLE "TopicBookmark" DROP CONSTRAINT "TopicBookmark_topicId_fkey";

-- DropForeignKey
ALTER TABLE "TopicBookmark" DROP CONSTRAINT "TopicBookmark_userId_fkey";

-- DropTable
DROP TABLE "TopicBookmark";

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "type" "BookmarkType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_entityId_type_userId_key" ON "Bookmark"("entityId", "type", "userId");

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
