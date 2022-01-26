/*
  Warnings:

  - A unique constraint covering the columns `[publicationFrom,publicationTo]` on the table `Links` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Links_publicationFrom_publicationTo_key" ON "Links"("publicationFrom", "publicationTo");
