/*
  Warnings:

  - You are about to drop the column `defaultPublicationId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_defaultPublicationId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "defaultPublicationId",
ADD COLUMN     "defaultTopicId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_defaultTopicId_fkey" FOREIGN KEY ("defaultTopicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
