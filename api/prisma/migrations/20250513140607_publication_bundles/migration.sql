-- CreateTable
CREATE TABLE "PublicationBundle" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "PublicationBundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PublicationToPublicationBundle" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PublicationToPublicationBundle_AB_unique" ON "_PublicationToPublicationBundle"("A", "B");

-- CreateIndex
CREATE INDEX "_PublicationToPublicationBundle_B_index" ON "_PublicationToPublicationBundle"("B");

-- AddForeignKey
ALTER TABLE "PublicationBundle" ADD CONSTRAINT "PublicationBundle_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PublicationToPublicationBundle" ADD CONSTRAINT "_PublicationToPublicationBundle_A_fkey" FOREIGN KEY ("A") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PublicationToPublicationBundle" ADD CONSTRAINT "_PublicationToPublicationBundle_B_fkey" FOREIGN KEY ("B") REFERENCES "PublicationBundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
