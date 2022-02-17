-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "conflictOfInterestExplanatoryText" TEXT,
ADD COLUMN     "conflictOfInterestStatus" BOOLEAN DEFAULT false,
ADD COLUMN     "conflictOfInterestSupportText" TEXT;
