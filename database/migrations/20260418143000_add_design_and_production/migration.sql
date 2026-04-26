-- CreateEnum
CREATE TYPE "public"."ProductionStage" AS ENUM (
    'MATERIAL_ORDERED',
    'MATERIAL_RECEIVED',
    'CUTTING',
    'LAMINATION',
    'POLISHING',
    'HARDWARE',
    'QC',
    'READY'
);

-- CreateTable
CREATE TABLE "public"."ProjectDesign" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "roomWidth" DECIMAL(10,2) NOT NULL,
    "roomDepth" DECIMAL(10,2) NOT NULL,
    "roomHeight" DECIMAL(10,2) NOT NULL,
    "counterColor" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "updatedById" UUID,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductionJob" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "currentStage" "public"."ProductionStage" NOT NULL DEFAULT 'MATERIAL_ORDERED',
    "completedStages" JSONB NOT NULL,
    "notes" TEXT,
    "updatedById" UUID,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectDesign_projectId_key" ON "public"."ProjectDesign"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionJob_projectId_key" ON "public"."ProductionJob"("projectId");

-- CreateIndex
CREATE INDEX "ProductionJob_currentStage_idx" ON "public"."ProductionJob"("currentStage");

-- AddForeignKey
ALTER TABLE "public"."ProjectDesign" ADD CONSTRAINT "ProjectDesign_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectDesign" ADD CONSTRAINT "ProjectDesign_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductionJob" ADD CONSTRAINT "ProductionJob_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductionJob" ADD CONSTRAINT "ProductionJob_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
