/*
  Warnings:

  - You are about to drop the `_PublicationToTopic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PublicationToTopic" DROP CONSTRAINT "_PublicationToTopic_A_fkey";

-- DropForeignKey
ALTER TABLE "_PublicationToTopic" DROP CONSTRAINT "_PublicationToTopic_B_fkey";

-- DropTable
DROP TABLE "_PublicationToTopic";
