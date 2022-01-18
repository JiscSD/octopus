/*
  Warnings:

  - A unique constraint covering the columns `[apiKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_apiKey_key" ON "User"("apiKey");
