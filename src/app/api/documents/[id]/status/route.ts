import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { status, reviewStatus } = body;

    const updateData: Record<string, unknown> = {};

    if (status && ["PENDING", "ANALYZED", "ERROR", "IGNORED"].includes(status)) {
      updateData.status = status;
    }

    if (reviewStatus && ["NEW", "REVIEWED", "IGNORED"].includes(reviewStatus)) {
      // Update review status on the analysis result
      const analysis = await prisma.analysisResult.findUnique({
        where: { rawDocumentId: id },
      });

      if (analysis) {
        await prisma.analysisResult.update({
          where: { id: analysis.id },
          data: { reviewStatus },
        });
      }
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.rawDocument.update({
        where: { id },
        data: updateData,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update document status" },
      { status: 500 }
    );
  }
}
