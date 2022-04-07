-- CreateTable
CREATE TABLE "PublicationRatings" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "PublicationRatings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PublicationRatings" ADD CONSTRAINT "PublicationRatings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationRatings" ADD CONSTRAINT "PublicationRatings_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
