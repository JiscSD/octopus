-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_USER', 'FUNDER', 'USER');

-- CreateEnum
CREATE TYPE "PublicationStatusEnum" AS ENUM ('DRAFT', 'LIVE', 'HIDDEN');

-- CreateEnum
CREATE TYPE "PublicationType" AS ENUM ('PROBLEM', 'PROTOCOL', 'ANALYSIS', 'REAL_WORLD_APPLICATION', 'HYPOTHESIS', 'DATA', 'INTERPRETATION', 'PEER_REVIEW');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "orcid" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publication" (
    "id" TEXT NOT NULL,
    "url_slug" TEXT NOT NULL,
    "type" "PublicationType" NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "doi" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Links" (
    "id" TEXT NOT NULL,
    "publicationFrom" TEXT NOT NULL,
    "publicationTo" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Publication_url_slug_key" ON "Publication"("url_slug");

-- AddForeignKey
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationStatus" ADD CONSTRAINT "PublicationStatus_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Links" ADD CONSTRAINT "Links_publicationFrom_fkey" FOREIGN KEY ("publicationFrom") REFERENCES "Publication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Links" ADD CONSTRAINT "Links_publicationTo_fkey" FOREIGN KEY ("publicationTo") REFERENCES "Publication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
