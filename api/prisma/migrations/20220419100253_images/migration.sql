-- CreateEnum
CREATE TYPE "ImageExtension" AS ENUM ('png', 'jpg', 'jpeg');

-- CreateTable
CREATE TABLE "Images" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "extension" "ImageExtension" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
