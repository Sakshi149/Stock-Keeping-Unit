/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FieldType" ADD VALUE 'DATE';
ALTER TYPE "FieldType" ADD VALUE 'BOOLEAN';

-- AlterTable
ALTER TABLE "CategoryField" ADD COLUMN     "defaultValue" TEXT,
ADD COLUMN     "placeholder" TEXT;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Sequence" ADD COLUMN     "step" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ADMIN';

-- CreateIndex
CREATE INDEX "Item_categoryId_idx" ON "Item"("categoryId");
