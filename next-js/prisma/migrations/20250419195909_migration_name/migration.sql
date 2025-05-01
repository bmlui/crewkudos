/*
  Warnings:

  - You are about to drop the column `name` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "UserOnOrganization" ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT '';
