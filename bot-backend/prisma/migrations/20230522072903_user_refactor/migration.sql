/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[state]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `state` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userId_fkey";

-- DropIndex
DROP INDEX "User_userId_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "userId",
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "discordId" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "User_state_key" ON "User"("state");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_state_fkey" FOREIGN KEY ("state") REFERENCES "Token"("ownedBy") ON DELETE RESTRICT ON UPDATE CASCADE;
