-- CreateTable
CREATE TABLE "AdditionalInformation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publicationVersionId" TEXT NOT NULL,

    CONSTRAINT "AdditionalInformation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AdditionalInformation" ADD CONSTRAINT "AdditionalInformation_publicationVersionId_fkey" FOREIGN KEY ("publicationVersionId") REFERENCES "PublicationVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
