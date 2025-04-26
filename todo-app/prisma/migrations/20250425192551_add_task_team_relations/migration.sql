-- CreateIndex
CREATE INDEX "Task_assignedToTeamId_idx" ON "Task"("assignedToTeamId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedToTeamId_fkey" FOREIGN KEY ("assignedToTeamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
