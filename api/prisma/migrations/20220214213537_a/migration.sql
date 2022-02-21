/*
  Warnings:

  - A unique constraint covering the columns `[publicationId,category,createdBy]` on the table `PublicationFlags` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PublicationFlags_publicationId_category_createdBy_key" ON "PublicationFlags"("publicationId", "category", "createdBy");
