-- CreateTable
CREATE TABLE "UserMapping" (
    "userId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "source" "PublicationImportSource" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMapping_value_source_key" ON "UserMapping"("value", "source");

-- AddForeignKey
ALTER TABLE "UserMapping" ADD CONSTRAINT "UserMapping_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
