-- AlterTable
ALTER TABLE "References" ADD COLUMN     "entryId" INT NOT NULL;
CREATE SEQUENCE "references_entryid_seq";
ALTER TABLE "References" ALTER COLUMN "entryId" SET DEFAULT nextval('references_entryid_seq');
ALTER SEQUENCE "references_entryid_seq" OWNED BY "References"."entryId";
