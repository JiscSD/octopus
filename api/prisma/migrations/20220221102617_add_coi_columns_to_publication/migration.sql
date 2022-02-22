-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "conflictOfInterestStatus" BOOLEAN DEFAULT false,
ADD COLUMN     "conflictOfInterestText" TEXT;
