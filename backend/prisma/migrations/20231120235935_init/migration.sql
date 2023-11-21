-- AlterTable
ALTER TABLE "users" ADD COLUMN     "confirmationToken" TEXT,
ADD COLUMN     "isConfirmed" BOOLEAN NOT NULL DEFAULT false;
