/*
  Warnings:

  - You are about to drop the column `code` on the `Company` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Company_code_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "code";
