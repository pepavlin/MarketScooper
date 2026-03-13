-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('REDDIT', 'HACKERNEWS', 'CSV', 'JSON');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'ANALYZED', 'ERROR', 'IGNORED');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('INGESTION', 'ANALYSIS');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('NEW', 'REVIEWED', 'IGNORED');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL');

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SourceType" NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastFetchAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawDocument" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "url" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RawDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalysisResult" (
    "id" TEXT NOT NULL,
    "rawDocumentId" TEXT NOT NULL,
    "problemSummary" TEXT NOT NULL,
    "buyerSegment" TEXT,
    "painLevel" DOUBLE PRECISION NOT NULL,
    "urgencySignal" DOUBLE PRECISION NOT NULL,
    "paymentSignal" DOUBLE PRECISION NOT NULL,
    "dissatisfactionSignal" DOUBLE PRECISION NOT NULL,
    "solutionSearchSignal" DOUBLE PRECISION NOT NULL,
    "isPotentialOpportunity" BOOLEAN NOT NULL,
    "reasoningSummary" TEXT,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "language" TEXT DEFAULT 'en',
    "confidence" DOUBLE PRECISION NOT NULL,
    "finalScore" DOUBLE PRECISION NOT NULL,
    "scoreBreakdown" JSONB NOT NULL DEFAULT '{}',
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'NEW',
    "modelUsed" TEXT,
    "promptVersion" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalysisResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessingJob" (
    "id" TEXT NOT NULL,
    "type" "JobType" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "sourceId" TEXT,
    "totalItems" INTEGER NOT NULL DEFAULT 0,
    "processedItems" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessingJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppError" (
    "id" TEXT NOT NULL,
    "component" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "context" JSONB NOT NULL DEFAULT '{}',
    "severity" "Severity" NOT NULL DEFAULT 'ERROR',
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppError_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RawDocument_status_idx" ON "RawDocument"("status");

-- CreateIndex
CREATE INDEX "RawDocument_sourceId_idx" ON "RawDocument"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "RawDocument_sourceId_externalId_key" ON "RawDocument"("sourceId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisResult_rawDocumentId_key" ON "AnalysisResult"("rawDocumentId");

-- CreateIndex
CREATE INDEX "AnalysisResult_finalScore_idx" ON "AnalysisResult"("finalScore" DESC);

-- CreateIndex
CREATE INDEX "AnalysisResult_reviewStatus_idx" ON "AnalysisResult"("reviewStatus");

-- CreateIndex
CREATE INDEX "ProcessingJob_status_idx" ON "ProcessingJob"("status");

-- CreateIndex
CREATE INDEX "ProcessingJob_type_idx" ON "ProcessingJob"("type");

-- CreateIndex
CREATE INDEX "AppError_severity_idx" ON "AppError"("severity");

-- CreateIndex
CREATE INDEX "AppError_createdAt_idx" ON "AppError"("createdAt" DESC);

-- AddForeignKey
ALTER TABLE "RawDocument" ADD CONSTRAINT "RawDocument_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisResult" ADD CONSTRAINT "AnalysisResult_rawDocumentId_fkey" FOREIGN KEY ("rawDocumentId") REFERENCES "RawDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessingJob" ADD CONSTRAINT "ProcessingJob_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;
