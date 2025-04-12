/*
  Warnings:

  - You are about to drop the column `expiresOn` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `packageId` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `isOnline` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `commentLikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `commentReplies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `favourite_videos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `package_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `storeOwner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `syspayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `video` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `view` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_userID_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_videoID_fkey";

-- DropForeignKey
ALTER TABLE "commentLikes" DROP CONSTRAINT "commentLikes_commentId_fkey";

-- DropForeignKey
ALTER TABLE "commentLikes" DROP CONSTRAINT "commentLikes_userId_fkey";

-- DropForeignKey
ALTER TABLE "commentReplies" DROP CONSTRAINT "commentReplies_parentCommentId_fkey";

-- DropForeignKey
ALTER TABLE "commentReplies" DROP CONSTRAINT "commentReplies_userId_fkey";

-- DropForeignKey
ALTER TABLE "favourite_videos" DROP CONSTRAINT "favourite_videos_userID_fkey";

-- DropForeignKey
ALTER TABLE "favourite_videos" DROP CONSTRAINT "favourite_videos_videoID_fkey";

-- DropForeignKey
ALTER TABLE "like" DROP CONSTRAINT "like_userID_fkey";

-- DropForeignKey
ALTER TABLE "like" DROP CONSTRAINT "like_videoID_fkey";

-- DropForeignKey
ALTER TABLE "store" DROP CONSTRAINT "store_storeOwnerID_fkey";

-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_packageId_fkey";

-- DropForeignKey
ALTER TABLE "syspayment" DROP CONSTRAINT "syspayment_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "video" DROP CONSTRAINT "video_storeID_fkey";

-- DropForeignKey
ALTER TABLE "video" DROP CONSTRAINT "video_userID_fkey";

-- DropForeignKey
ALTER TABLE "view" DROP CONSTRAINT "view_userID_fkey";

-- DropForeignKey
ALTER TABLE "view" DROP CONSTRAINT "view_videoID_fkey";

-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "store" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "expiresOn",
DROP COLUMN "packageId",
DROP COLUMN "status",
DROP COLUMN "updateAt",
ADD COLUMN     "artistId" TEXT,
ADD COLUMN     "contentId" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "isOnline",
ADD COLUMN     "fullname" TEXT;

-- DropTable
DROP TABLE "comment";

-- DropTable
DROP TABLE "commentLikes";

-- DropTable
DROP TABLE "commentReplies";

-- DropTable
DROP TABLE "favourite_videos";

-- DropTable
DROP TABLE "like";

-- DropTable
DROP TABLE "package_type";

-- DropTable
DROP TABLE "storeOwner";

-- DropTable
DROP TABLE "syspayment";

-- DropTable
DROP TABLE "video";

-- DropTable
DROP TABLE "view";

-- CreateTable
CREATE TABLE "content" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "mediaUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storeId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,

    CONSTRAINT "content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FanEngagement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "action" TEXT,
    "value" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FanEngagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favourite_content" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT,
    "productId" TEXT,
    "storeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "favourite_content_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store" ADD CONSTRAINT "store_storeOwnerID_fkey" FOREIGN KEY ("storeOwnerID") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "content"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FanEngagement" ADD CONSTRAINT "FanEngagement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FanEngagement" ADD CONSTRAINT "FanEngagement_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favourite_content" ADD CONSTRAINT "favourite_content_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favourite_content" ADD CONSTRAINT "favourite_content_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "content"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favourite_content" ADD CONSTRAINT "favourite_content_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favourite_content" ADD CONSTRAINT "favourite_content_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
