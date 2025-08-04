-- AlterEnum
ALTER TYPE "NotificationActionTypeEnum" ADD VALUE 'PUBLICATION_VERSION_RED_FLAG_RAISED';

-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "enableVersionFlagNotifications" BOOLEAN NOT NULL DEFAULT true;
