/*
  Warnings:

  - A unique constraint covering the columns `[publicationId,userId,category]` on the table `PublicationRatings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PublicationRatings_publicationId_userId_category_key" ON "PublicationRatings"("publicationId", "userId", "category");
