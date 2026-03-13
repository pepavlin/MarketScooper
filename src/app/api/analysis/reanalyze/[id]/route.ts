import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeDocument } from "@/lib/ai/analyzer";
import { createChildLogger } from "@/lib/logger";

const log = createChildLogger("api:reanalyze");

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const document = await prisma.rawDocument.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    log.info({ documentId: id }, "Reanalyzing document");

    // Delete existing analysis if present
    await prisma.analysisResult.deleteMany({
      where: { rawDocumentId: id },
    });

    const result = await analyzeDocument(document.title, document.content);

    const analysis = await prisma.analysisResult.create({
      data: {
        rawDocumentId: document.id,
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
      where: { id },
      data: { status: "ANALYZED" },
    });

    return NextResponse.json({ analysis });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    log.error({ documentId: id, error: errorMessage }, "Reanalysis failed");

    await prisma.appError.create({
      data: {
        component: "reanalysis",
        message: errorMessage,
        context: { documentId: id },
        severity: "ERROR",
      },
    });

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
