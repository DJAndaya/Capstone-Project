/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "items" DROP COLUMN "imageUrl";

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
