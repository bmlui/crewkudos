/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_Recipient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Kudos" DROP CONSTRAINT "Kudos_senderId_fkey";

-- DropForeignKey
ALTER TABLE "_Recipient" DROP CONSTRAINT "_Recipient_A_fkey";

-- DropForeignKey
ALTER TABLE "_Recipient" DROP CONSTRAINT "_Recipient_B_fkey";

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "name" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name";

-- DropTable
DROP TABLE "_Recipient";

-- CreateTable
CREATE TABLE "KudoRecipient" (
    "id" TEXT NOT NULL,
    "kudoId" TEXT NOT NULL,
    "userOnOrgId" TEXT NOT NULL,

    CONSTRAINT "KudoRecipient_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Kudos" ADD CONSTRAINT "Kudos_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "UserOnOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KudoRecipient" ADD CONSTRAINT "KudoRecipient_kudoId_fkey" FOREIGN KEY ("kudoId") REFERENCES "Kudos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KudoRecipient" ADD CONSTRAINT "KudoRecipient_userOnOrgId_fkey" FOREIGN KEY ("userOnOrgId") REFERENCES "UserOnOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
