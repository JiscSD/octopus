-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "orcid" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Verification_orcid_key" ON "Verification"("orcid");
