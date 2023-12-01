/*
  Warnings:

  - You are about to drop the column `description` on the `reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "description",
ADD COLUMN     "comment" TEXT;
