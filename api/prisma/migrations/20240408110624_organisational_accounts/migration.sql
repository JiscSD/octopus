/*
  Warnings:

  - The values [FUNDER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

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
