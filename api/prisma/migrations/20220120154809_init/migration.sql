-- DropForeignKey
ALTER TABLE "Links" DROP CONSTRAINT "Links_publicationFrom_fkey";

-- DropForeignKey
ALTER TABLE "Links" DROP CONSTRAINT "Links_publicationTo_fkey";

-- AddForeignKey
ALTER TABLE "Links" ADD CONSTRAINT "Links_publicationFrom_fkey" FOREIGN KEY ("publicationFrom") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Links" ADD CONSTRAINT "Links_publicationTo_fkey" FOREIGN KEY ("publicationTo") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
