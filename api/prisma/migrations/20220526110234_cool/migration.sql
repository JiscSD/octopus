-- CreateTable
CREATE TABLE "Affiliations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "ror" TEXT,
    "publicationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Affiliations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Affiliations" ADD CONSTRAINT "Affiliations_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
