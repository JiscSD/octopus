/*
  Warnings:

  - The values [CC_BY_ND,CC_BY_NC_ND] on the enum `LicenceType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LicenceType_new" AS ENUM ('CC_BY', 'CC_BY_SA', 'CC_BY_NC', 'CC_BY_NC_SA');
ALTER TABLE "Publication" ALTER COLUMN "licence" DROP DEFAULT;
ALTER TABLE "Publication" ALTER COLUMN "licence" TYPE "LicenceType_new" USING ("licence"::text::"LicenceType_new");
ALTER TYPE "LicenceType" RENAME TO "LicenceType_old";
ALTER TYPE "LicenceType_new" RENAME TO "LicenceType";
DROP TYPE "LicenceType_old";
ALTER TABLE "Publication" ALTER COLUMN "licence" SET DEFAULT 'CC_BY';
COMMIT;
