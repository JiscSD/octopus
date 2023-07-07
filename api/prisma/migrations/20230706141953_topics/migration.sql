-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "url_slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "keywords" TEXT[],
    "language" "Languages" NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicBookmark" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopicBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicTranslation" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "language" "Languages" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "TopicTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PublicationToTopic" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Topic_url_slug_key" ON "Topic"("url_slug");

-- CreateIndex
CREATE UNIQUE INDEX "TopicBookmark_topicId_userId_key" ON "TopicBookmark"("topicId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "_PublicationToTopic_AB_unique" ON "_PublicationToTopic"("A", "B");

-- CreateIndex
CREATE INDEX "_PublicationToTopic_B_index" ON "_PublicationToTopic"("B");

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicBookmark" ADD CONSTRAINT "TopicBookmark_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicBookmark" ADD CONSTRAINT "TopicBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicTranslation" ADD CONSTRAINT "TopicTranslation_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PublicationToTopic" ADD CONSTRAINT "_PublicationToTopic_A_fkey" FOREIGN KEY ("A") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PublicationToTopic" ADD CONSTRAINT "_PublicationToTopic_B_fkey" FOREIGN KEY ("B") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
