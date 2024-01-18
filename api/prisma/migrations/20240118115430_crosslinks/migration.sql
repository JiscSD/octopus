-- CreateTable
CREATE TABLE "Crosslink" (
    "id" TEXT NOT NULL,
    "publicationFromId" TEXT NOT NULL,
    "publicationToId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Crosslink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrosslinkVote" (
    "crosslinkId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "up" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Crosslink_publicationFromId_publicationToId_key" ON "Crosslink"("publicationFromId", "publicationToId");

-- CreateIndex
CREATE UNIQUE INDEX "CrosslinkVote_crosslinkId_createdBy_key" ON "CrosslinkVote"("crosslinkId", "createdBy");

-- AddForeignKey
ALTER TABLE "Crosslink" ADD CONSTRAINT "Crosslink_publicationFromId_fkey" FOREIGN KEY ("publicationFromId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crosslink" ADD CONSTRAINT "Crosslink_publicationToId_fkey" FOREIGN KEY ("publicationToId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crosslink" ADD CONSTRAINT "Crosslink_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrosslinkVote" ADD CONSTRAINT "CrosslinkVote_crosslinkId_fkey" FOREIGN KEY ("crosslinkId") REFERENCES "Crosslink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrosslinkVote" ADD CONSTRAINT "CrosslinkVote_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
