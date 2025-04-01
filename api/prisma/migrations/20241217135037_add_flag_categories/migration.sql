-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PublicationFlagCategoryEnum" ADD VALUE 'UNDECLARED_AI';
ALTER TYPE "PublicationFlagCategoryEnum" ADD VALUE 'NOT_IN_OCTOPUS_FORMAT';
ALTER TYPE "PublicationFlagCategoryEnum" ADD VALUE 'IRRELEVANT_LINKED_PUBLICATION';
