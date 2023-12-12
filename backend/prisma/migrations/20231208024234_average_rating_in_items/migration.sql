/*
  Warnings:

  - You are about to drop the `image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "image" DROP CONSTRAINT "image_itemId_fkey";

-- AlterTable
ALTER TABLE "items" ADD COLUMN     "averageRating" DOUBLE PRECISION;

-- DropTable
DROP TABLE "image";

-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
