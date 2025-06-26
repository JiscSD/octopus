-- CreateEnum
CREATE TYPE "NotificationTypeEnum" AS ENUM ('BULLETIN');

-- CreateEnum
CREATE TYPE "NotificationActionTypeEnum" AS ENUM ('PUBLICATION_VERSION_CREATED', 'PUBLICATION_RED_FLAGGED');

-- CreateEnum
CREATE TYPE "NotificationStatusEnum" AS ENUM ('PENDING', 'FAILED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastBulletinSentAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enableBookmarkNotifications" BOOLEAN NOT NULL DEFAULT true,
    "enableBookmarkVersionNotifications" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationTypeEnum" NOT NULL,
    "actionType" "NotificationActionTypeEnum" NOT NULL,
    "payload" JSONB,
    "status" "NotificationStatusEnum" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
