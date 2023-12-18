/*
  Warnings:

  - Changed the type of `type` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('DUMMY', 'REQUEST_CONTROL');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "type",
ADD COLUMN     "type" "EventType" NOT NULL;
