/*
  Warnings:

  - The values [PLAGARISM] on the enum `PublicationFlagCategoryEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "LicenceType" AS ENUM ('CC_BY', 'CC_BY_SA', 'CC_BY_ND', 'CC_BY_NC', 'CC_BY_NC_SA', 'CC_BY_NC_ND');

-- AlterEnum
BEGIN;
CREATE TYPE "PublicationFlagCategoryEnum_new" AS ENUM ('PLAGIARISM', 'ETHICAL_ISSUES', 'MISREPRESENTATION', 'UNDECLARED_IMAGE_MANIPULATION', 'COPYRIGHT', 'INAPPROPRIATE');
ALTER TABLE "PublicationFlags" ALTER COLUMN "category" TYPE "PublicationFlagCategoryEnum_new" USING ("category"::text::"PublicationFlagCategoryEnum_new");
ALTER TYPE "PublicationFlagCategoryEnum" RENAME TO "PublicationFlagCategoryEnum_old";
ALTER TYPE "PublicationFlagCategoryEnum_new" RENAME TO "PublicationFlagCategoryEnum";
DROP TYPE "PublicationFlagCategoryEnum_old";
COMMIT;

-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "licence" "LicenceType";
