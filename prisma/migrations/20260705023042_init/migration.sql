/*
  Warnings:

  - A unique constraint covering the columns `[registration]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `registration` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `registration` VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_registration_key` ON `user`(`registration`);
