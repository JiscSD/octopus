-- CreateTable
CREATE TABLE "_PublicationVersionToTopic" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PublicationVersionToTopic_AB_unique" ON "_PublicationVersionToTopic"("A", "B");

-- CreateIndex
CREATE INDEX "_PublicationVersionToTopic_B_index" ON "_PublicationVersionToTopic"("B");

-- AddForeignKey
ALTER TABLE "_PublicationVersionToTopic" ADD CONSTRAINT "_PublicationVersionToTopic_A_fkey" FOREIGN KEY ("A") REFERENCES "PublicationVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PublicationVersionToTopic" ADD CONSTRAINT "_PublicationVersionToTopic_B_fkey" FOREIGN KEY ("B") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
