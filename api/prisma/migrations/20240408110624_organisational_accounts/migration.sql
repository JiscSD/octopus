/*
  Warnings:

  - The values [FUNDER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

  NOTE: confirmed that as of 08/04/24, when this was written, only USER values exist for this enum in deployed environments' databases.
  Decided to remove FUNDER because it is unused and could be confused with ORGANISATION.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('SUPER_USER', 'USER', 'ORGANISATION');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "defaultPublicationId" TEXT,
ADD COLUMN     "ror" TEXT,
ADD COLUMN     "url" TEXT,
ALTER COLUMN "orcid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_defaultPublicationId_fkey" FOREIGN KEY ("defaultPublicationId") REFERENCES "Publication"("id") ON DELETE SET NULL ON UPDATE CASCADE;
