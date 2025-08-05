-- AlterEnum
ALTER TYPE "NotificationActionTypeEnum" ADD VALUE 'PUBLICATION_VERSION_LINKED_FROM';

-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "enableLinkedFromNotifications" BOOLEAN NOT NULL DEFAULT true;
