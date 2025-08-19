-- AlterEnum
ALTER TYPE "NotificationActionTypeEnum" ADD VALUE 'PUBLICATION_VERSION_PEER_REVIEWED';

-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "enablePeerReviewNotifications" BOOLEAN NOT NULL DEFAULT true;
