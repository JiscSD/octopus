-- CreateEnum
CREATE TYPE "ReferenceType" AS ENUM ('DOI', 'URL', 'TEXT');

-- CreateTable
CREATE TABLE "References" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "type" "ReferenceType" NOT NULL,
    "text" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "References_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "References" ADD CONSTRAINT "References_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
