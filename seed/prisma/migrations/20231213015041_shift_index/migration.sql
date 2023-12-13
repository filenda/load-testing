-- CreateIndex
CREATE INDEX "idx_shift" ON "Shift"("worker_id", "is_deleted", "start", "end", "profession");
