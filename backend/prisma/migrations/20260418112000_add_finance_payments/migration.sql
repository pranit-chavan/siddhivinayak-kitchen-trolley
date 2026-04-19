-- CreateEnum
CREATE TYPE "public"."PaymentMode" AS ENUM ('UPI', 'CASH', 'BANK_TRANSFER', 'CHEQUE');

-- CreateEnum
CREATE TYPE "public"."PaymentType" AS ENUM ('ADVANCE', 'PARTIAL', 'FINAL_BALANCE', 'OTHER');

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" UUID NOT NULL,
    "customerName" TEXT NOT NULL,
    "projectId" UUID,
    "amount" DECIMAL(12,2) NOT NULL,
    "mode" "public"."PaymentMode" NOT NULL,
    "type" "public"."PaymentType" NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "reference" TEXT,
    "notes" TEXT,
    "recordedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Payment_projectId_paymentDate_idx" ON "public"."Payment"("projectId", "paymentDate");

-- CreateIndex
CREATE INDEX "Payment_paymentDate_idx" ON "public"."Payment"("paymentDate");

-- CreateIndex
CREATE INDEX "Payment_type_idx" ON "public"."Payment"("type");

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
