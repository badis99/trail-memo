-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_decisionId_fkey";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "Decision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
