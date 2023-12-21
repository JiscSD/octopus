-- CreateTable
CREATE TABLE "ExternalResource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publicationVersionId" TEXT NOT NULL,

    CONSTRAINT "ExternalResource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExternalResource" ADD CONSTRAINT "ExternalResource_publicationVersionId_fkey" FOREIGN KEY ("publicationVersionId") REFERENCES "PublicationVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
