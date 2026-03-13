import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getConnector } from "@/lib/ingestion";
import { createChildLogger } from "@/lib/logger";

const log = createChildLogger("api:ingestion");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sourceId } = body;

    if (!sourceId) {
      return NextResponse.json(
        { error: "sourceId is required" },
        { status: 400 }
      );
    }

    const source = await prisma.source.findUnique({ where: { id: sourceId } });
    if (!source) {
      return NextResponse.json(
        { error: "Source not found" },
        { status: 404 }
      );
    }

    // Create processing job
    const job = await prisma.processingJob.create({
      data: {
        type: "INGESTION",
        status: "RUNNING",
        sourceId: source.id,
        startedAt: new Date(),
      },
    });

    log.info({ sourceId, jobId: job.id }, "Starting ingestion");

    try {
      const connector = getConnector(source.type);
      const documents = await connector.fetch(
        source.config as Record<string, unknown>
      );

      let processedCount = 0;
      let errorCount = 0;

      for (const doc of documents) {
        try {
          await prisma.rawDocument.upsert({
            where: {
              sourceId_externalId: {
                sourceId: source.id,
                externalId: doc.externalId,
              },
            },
            create: {
              sourceId: source.id,
              externalId: doc.externalId,
              url: doc.url,
              title: doc.title,
              content: doc.content,
              author: doc.author,
              metadata: doc.metadata ?? {},
              fetchedAt: doc.fetchedAt ?? new Date(),
            },
            update: {
              title: doc.title,
              content: doc.content,
              metadata: doc.metadata ?? {},
            },
          });
          processedCount++;
        } catch (error) {
          errorCount++;
          log.warn(
            { externalId: doc.externalId, error: String(error) },
            "Failed to upsert document"
          );
        }
      }

      // Update job and source
      await prisma.processingJob.update({
        where: { id: job.id },
        data: {
          status: "COMPLETED",
          totalItems: documents.length,
          processedItems: processedCount,
          errorCount,
          completedAt: new Date(),
        },
      });

      await prisma.source.update({
        where: { id: source.id },
        data: { lastFetchAt: new Date(), lastError: null },
      });

      log.info(
        { jobId: job.id, processedCount, errorCount },
        "Ingestion completed"
      );

      return NextResponse.json({
        jobId: job.id,
        totalItems: documents.length,
        processedItems: processedCount,
        errorCount,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      await prisma.processingJob.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          errorMessage,
          completedAt: new Date(),
        },
      });

      await prisma.source.update({
        where: { id: source.id },
        data: { lastError: errorMessage },
      });

      await prisma.appError.create({
        data: {
          component: "ingestion",
          message: errorMessage,
          context: { sourceId, jobId: job.id },
          severity: "ERROR",
        },
      });

      log.error({ error: errorMessage, jobId: job.id }, "Ingestion failed");

      return NextResponse.json(
        { error: errorMessage, jobId: job.id },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
