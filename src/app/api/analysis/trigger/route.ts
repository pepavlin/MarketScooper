import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeDocument } from "@/lib/ai/analyzer";
import { createChildLogger } from "@/lib/logger";

const log = createChildLogger("api:analysis");

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const limit = (body.limit as number) ?? 10;

    // Find pending documents
    const documents = await prisma.rawDocument.findMany({
      where: { status: "PENDING" },
      take: limit,
      orderBy: { createdAt: "asc" },
    });

    if (documents.length === 0) {
      return NextResponse.json({
        message: "No pending documents to analyze",
        processedItems: 0,
      });
    }

    // Create processing job
    const job = await prisma.processingJob.create({
      data: {
        type: "ANALYSIS",
        status: "RUNNING",
        totalItems: documents.length,
        startedAt: new Date(),
      },
    });

    log.info(
      { jobId: job.id, count: documents.length },
      "Starting analysis batch"
    );

    let processedCount = 0;
    let errorCount = 0;

    for (const doc of documents) {
      try {
        const result = await analyzeDocument(doc.title, doc.content);

        await prisma.analysisResult.create({
          data: {
            rawDocumentId: doc.id,
            problemSummary: result.analysis.problemSummary,
            buyerSegment: result.analysis.buyerSegment,
            painLevel: result.analysis.painLevel,
            urgencySignal: result.analysis.urgencySignal,
            paymentSignal: result.analysis.paymentSignal,
            dissatisfactionSignal: result.analysis.dissatisfactionSignal,
            solutionSearchSignal: result.analysis.solutionSearchSignal,
            isPotentialOpportunity: result.analysis.isPotentialOpportunity,
            reasoningSummary: result.analysis.reasoningSummary,
            tags: result.analysis.tags,
            language: result.analysis.language,
            confidence: result.analysis.confidence,
            finalScore: result.finalScore,
            scoreBreakdown: result.scoreBreakdown,
            modelUsed: result.modelUsed,
            promptVersion: result.promptVersion,
            retryCount: result.retryCount,
          },
        });

        await prisma.rawDocument.update({
          where: { id: doc.id },
          data: { status: "ANALYZED" },
        });

        processedCount++;
      } catch (error) {
        errorCount++;
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        log.error(
          { docId: doc.id, error: errorMessage },
          "Document analysis failed"
        );

        await prisma.rawDocument.update({
          where: { id: doc.id },
          data: { status: "ERROR" },
        });

        await prisma.appError.create({
          data: {
            component: "analysis",
            message: `Failed to analyze document ${doc.id}: ${errorMessage}`,
            context: { documentId: doc.id, jobId: job.id },
            severity: "ERROR",
          },
        });
      }
    }

    await prisma.processingJob.update({
      where: { id: job.id },
      data: {
        status: errorCount === documents.length ? "FAILED" : "COMPLETED",
        processedItems: processedCount,
        errorCount,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      jobId: job.id,
      totalItems: documents.length,
      processedItems: processedCount,
      errorCount,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    log.error({ error: errorMessage }, "Analysis trigger failed");

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
