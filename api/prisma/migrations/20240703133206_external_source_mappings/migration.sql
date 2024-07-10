/*
  Warnings:

  - You are about to drop the column `defaultPublicationId` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PublicationImportSource" AS ENUM ('ARI');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_defaultPublicationId_fkey";

-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "externalSource" "PublicationImportSource";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "defaultPublicationId",
ADD COLUMN     "defaultTopicId" TEXT;

-- CreateTable
CREATE TABLE "TopicMapping" (
    "topicId" TEXT,
    "isMapped" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "source" "PublicationImportSource" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TopicMapping_title_source_key" ON "TopicMapping"("title", "source");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_defaultTopicId_fkey" FOREIGN KEY ("defaultTopicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicMapping" ADD CONSTRAINT "TopicMapping_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
