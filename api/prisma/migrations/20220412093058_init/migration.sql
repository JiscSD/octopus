-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_USER', 'FUNDER', 'USER');

-- CreateEnum
CREATE TYPE "PublicationStatusEnum" AS ENUM ('DRAFT', 'LIVE', 'HIDDEN');

-- CreateEnum
CREATE TYPE "PublicationType" AS ENUM ('PROBLEM', 'PROTOCOL', 'ANALYSIS', 'REAL_WORLD_APPLICATION', 'HYPOTHESIS', 'DATA', 'INTERPRETATION', 'PEER_REVIEW');

-- CreateEnum
CREATE TYPE "PublicationFlagCategoryEnum" AS ENUM ('PLAGIARISM', 'ETHICAL_ISSUES', 'MISREPRESENTATION', 'UNDECLARED_IMAGE_MANIPULATION', 'COPYRIGHT', 'INAPPROPRIATE');

-- CreateEnum
CREATE TYPE "LicenceType" AS ENUM ('CC_BY', 'CC_BY_SA', 'CC_BY_ND', 'CC_BY_NC', 'CC_BY_NC_SA', 'CC_BY_NC_ND');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "orcid" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "apiKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "employment" JSONB[],
    "works" JSONB[],
    "education" JSONB[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publication" (
    "id" TEXT NOT NULL,
    "url_slug" TEXT NOT NULL,
    "type" "PublicationType" NOT NULL,
    "title" TEXT,
    "licence" "LicenceType",
    "conflictOfInterestStatus" BOOLEAN DEFAULT false,
    "conflictOfInterestText" TEXT,
    "description" TEXT,
    "keywords" TEXT[],
    "content" TEXT,
    "doi" TEXT,
    "publishedDate" TIMESTAMP(3),
    "currentStatus" "PublicationStatusEnum" NOT NULL DEFAULT E'DRAFT',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Links" (
    "id" TEXT NOT NULL,
    "publicationFrom" TEXT NOT NULL,
    "publicationTo" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationStatus" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "status" "PublicationStatusEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicationStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoAuthors" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "confirmedCoAuthor" BOOLEAN NOT NULL DEFAULT false,
    "linkedUser" TEXT,

    CONSTRAINT "CoAuthors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationFlags" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "category" "PublicationFlagCategoryEnum" NOT NULL,
    "comments" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicationFlags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationRatings" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "PublicationRatings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_orcid_key" ON "User"("orcid");

-- CreateIndex
CREATE UNIQUE INDEX "User_apiKey_key" ON "User"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "Publication_url_slug_key" ON "Publication"("url_slug");

-- CreateIndex
CREATE UNIQUE INDEX "Links_publicationFrom_publicationTo_key" ON "Links"("publicationFrom", "publicationTo");

-- CreateIndex
CREATE UNIQUE INDEX "CoAuthors_publicationId_email_key" ON "CoAuthors"("publicationId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationFlags_publicationId_category_createdBy_key" ON "PublicationFlags"("publicationId", "category", "createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationRatings_publicationId_userId_category_key" ON "PublicationRatings"("publicationId", "userId", "category");

-- AddForeignKey
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Links" ADD CONSTRAINT "Links_publicationFrom_fkey" FOREIGN KEY ("publicationFrom") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Links" ADD CONSTRAINT "Links_publicationTo_fkey" FOREIGN KEY ("publicationTo") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationStatus" ADD CONSTRAINT "PublicationStatus_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoAuthors" ADD CONSTRAINT "CoAuthors_linkedUser_fkey" FOREIGN KEY ("linkedUser") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoAuthors" ADD CONSTRAINT "CoAuthors_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationFlags" ADD CONSTRAINT "PublicationFlags_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationFlags" ADD CONSTRAINT "PublicationFlags_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationRatings" ADD CONSTRAINT "PublicationRatings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationRatings" ADD CONSTRAINT "PublicationRatings_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
