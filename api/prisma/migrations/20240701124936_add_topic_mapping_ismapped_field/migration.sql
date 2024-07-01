-- AlterTable
ALTER TABLE "TopicMapping" ADD COLUMN     "isMapped" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "topicId" DROP NOT NULL;
