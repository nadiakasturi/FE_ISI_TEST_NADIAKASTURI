/*
  Warnings:

  - Added the required column `teamId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assignedTo_fkey";

-- DropIndex
DROP INDEX "Task_assignedTo_idx";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "teamId" INTEGER NOT NULL,
ALTER COLUMN "assignedTo" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Task_teamId_idx" ON "Task"("teamId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
