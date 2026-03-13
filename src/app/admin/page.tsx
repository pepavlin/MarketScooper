import { prisma } from "@/lib/db";
import { StatsCard } from "@/components/stats-card";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [
    totalDocuments,
    analyzedDocuments,
    pendingDocuments,
    errorDocuments,
    totalAnalyses,
    avgScore,
    totalErrors,
    lastIngestion,
    lastAnalysis,
  ] = await Promise.all([
    prisma.rawDocument.count(),
    prisma.rawDocument.count({ where: { status: "ANALYZED" } }),
    prisma.rawDocument.count({ where: { status: "PENDING" } }),
    prisma.rawDocument.count({ where: { status: "ERROR" } }),
    prisma.analysisResult.count(),
    prisma.analysisResult.aggregate({ _avg: { finalScore: true } }),
    prisma.appError.count({ where: { resolvedAt: null } }),
    prisma.processingJob.findFirst({
      where: { type: "INGESTION", status: "COMPLETED" },
      orderBy: { completedAt: "desc" },
    }),
    prisma.processingJob.findFirst({
      where: { type: "ANALYSIS", status: "COMPLETED" },
      orderBy: { completedAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Documents"
          value={totalDocuments}
          description={`${analyzedDocuments} analyzed, ${pendingDocuments} pending`}
        />
        <StatsCard
          title="Analyses"
          value={totalAnalyses}
          description={`Avg score: ${avgScore._avg.finalScore?.toFixed(1) ?? "N/A"}`}
        />
        <StatsCard
          title="Errors (Pending)"
          value={errorDocuments}
          description={`${totalErrors} app errors unresolved`}
        />
        <StatsCard
          title="Last Ingestion"
          value={
            lastIngestion?.completedAt
              ? formatDate(lastIngestion.completedAt)
              : "Never"
          }
          description={
            lastAnalysis?.completedAt
              ? `Last analysis: ${formatDate(lastAnalysis.completedAt)}`
              : "No analysis yet"
          }
        />
      </div>
    </div>
  );
}
