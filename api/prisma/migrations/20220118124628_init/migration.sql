-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "currentStatus" "PublicationStatusEnum" NOT NULL DEFAULT E'DRAFT';
