-- CreateEnum
CREATE TYPE "TopicMappingSource" AS ENUM ('ARI');

-- CreateTable
CREATE TABLE "TopicMapping" (
    "topicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source" "TopicMappingSource" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TopicMapping_title_source_key" ON "TopicMapping"("title", "source");

-- AddForeignKey
ALTER TABLE "TopicMapping" ADD CONSTRAINT "TopicMapping_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
