-- CreateTable
CREATE TABLE "PublicationBookmarks" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PublicationBookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublicationBookmarks_publicationId_userId_key" ON "PublicationBookmarks"("publicationId", "userId");

-- AddForeignKey
ALTER TABLE "PublicationBookmarks" ADD CONSTRAINT "PublicationBookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationBookmarks" ADD CONSTRAINT "PublicationBookmarks_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
