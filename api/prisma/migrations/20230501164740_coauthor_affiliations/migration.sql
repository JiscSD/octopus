-- AlterTable
ALTER TABLE "CoAuthors" ADD COLUMN     "affiliations" JSONB[],
ADD COLUMN     "isIndependent" BOOLEAN NOT NULL DEFAULT false;
