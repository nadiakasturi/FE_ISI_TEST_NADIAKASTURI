-- Menambahkan kolom "updatedAt" dengan nilai default
ALTER TABLE "Log" 
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,  
  ADD COLUMN "username" TEXT NOT NULL DEFAULT '';  

-- Membuat index untuk userId
CREATE INDEX "Log_userId_idx" ON "Log"("userId");
