/*
  Warnings:

  - The values [PUBLICATION_VERSION_CREATED,PUBLICATION_RED_FLAGGED] on the enum `NotificationActionTypeEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationActionTypeEnum_new" AS ENUM ('PUBLICATION_BOOKMARK_VERSION_CREATED', 'PUBLICATION_BOOKMARK_RED_FLAG_RAISED', 'PUBLICATION_BOOKMARK_RED_FLAG_RESOLVED', 'PUBLICATION_BOOKMARK_RED_FLAG_COMMENTED');
ALTER TABLE "Notification" ALTER COLUMN "actionType" TYPE "NotificationActionTypeEnum_new" USING ("actionType"::text::"NotificationActionTypeEnum_new");
ALTER TYPE "NotificationActionTypeEnum" RENAME TO "NotificationActionTypeEnum_old";
ALTER TYPE "NotificationActionTypeEnum_new" RENAME TO "NotificationActionTypeEnum";
DROP TYPE "NotificationActionTypeEnum_old";
COMMIT;

-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "enableBookmarkFlagNotifications" BOOLEAN NOT NULL DEFAULT true;
