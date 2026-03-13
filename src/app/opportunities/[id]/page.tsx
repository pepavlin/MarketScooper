import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ScoreIndicator } from "@/components/score-indicator";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewActions } from "@/components/review-actions";
import { formatDate } from "@/lib/utils";

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await prisma.analysisResult.findUnique({
    where: { id },
    include: {
      rawDocument: {
        include: { source: true },
      },
    },
  });

  if (!result) {
    notFound();
  }

  const breakdown = result.scoreBreakdown as {
    formula?: string;
    weights?: Record<string, number>;
    contributions?: Record<string, number>;
    rawValues?: Record<string, number>;
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link
          href="/opportunities"
          className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          ← Back to Opportunities
        </Link>
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{result.problemSummary}</h1>
          <div className="flex items-center gap-3 mb-3">
            <StatusBadge status={result.reviewStatus} />
            <span className="text-sm text-[var(--muted-foreground)]">
              Source: {result.rawDocument.source.name}
            </span>
            <span className="text-sm text-[var(--muted-foreground)]">
              Analyzed: {formatDate(result.processedAt)}
            </span>
          </div>
          <ReviewActions
            documentId={result.rawDocumentId}
            analysisId={result.id}
            currentStatus={result.reviewStatus}
          />
        </div>

        {/* Score Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Score Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">
                  Final Score
                </div>
                <ScoreIndicator score={result.finalScore} size="lg" />
              </div>
              <div className="text-center">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">
                  Pain Level
                </div>
                <ScoreIndicator score={result.painLevel} size="lg" />
              </div>
              <div className="text-center">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">
                  Payment Signal
                </div>
                <ScoreIndicator score={result.paymentSignal} size="lg" />
              </div>
              <div className="text-center">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">
                  Urgency
                </div>
                <ScoreIndicator score={result.urgencySignal} size="lg" />
              </div>
              <div className="text-center">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">
                  Dissatisfaction
                </div>
                <ScoreIndicator score={result.dissatisfactionSignal} size="lg" />
              </div>
              <div className="text-center">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">
                  Solution Search
                </div>
                <ScoreIndicator score={result.solutionSearchSignal} size="lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        {breakdown.contributions && (
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown (Formula {breakdown.formula})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(breakdown.contributions).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-[var(--muted-foreground)]">
                        {key} (weight: {breakdown.weights?.[key]})
                      </span>
                      <span className="font-mono">
                        {(value as number).toFixed(2)}
                      </span>
                    </div>
                  )
                )}
                <div className="border-t pt-2 flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span className="font-mono">
                    {result.finalScore.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Details */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-1">Buyer Segment</div>
              <div className="text-sm text-[var(--muted-foreground)]">
                {result.buyerSegment ?? "Not identified"}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Reasoning</div>
              <div className="text-sm text-[var(--muted-foreground)]">
                {result.reasoningSummary ?? "No reasoning provided"}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Confidence</div>
              <div className="text-sm">
                {(result.confidence * 100).toFixed(0)}%
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">
                Potential Opportunity
              </div>
              <div className="text-sm">
                {result.isPotentialOpportunity ? "Yes" : "No"}
              </div>
            </div>
            {Array.isArray(result.tags) && (result.tags as string[]).length > 0 && (
              <div>
                <div className="text-sm font-medium mb-1">Tags</div>
                <div className="flex flex-wrap gap-1">
                  {(result.tags as string[]).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="text-xs text-[var(--muted-foreground)] pt-2 border-t">
              Model: {result.modelUsed} | Prompt: {result.promptVersion} |
              Retries: {result.retryCount} | Language: {result.language}
            </div>
          </CardContent>
        </Card>

        {/* Raw Content */}
        <Card>
          <CardHeader>
            <CardTitle>Original Content</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-medium mb-2">
              {result.rawDocument.title}
            </h3>
            <div className="text-sm text-[var(--muted-foreground)] whitespace-pre-wrap bg-[var(--muted)] p-4 rounded-md max-h-96 overflow-auto">
              {result.rawDocument.content}
            </div>
            <div className="mt-2 text-xs text-[var(--muted-foreground)]">
              Author: {result.rawDocument.author ?? "Unknown"} |{" "}
              {result.rawDocument.url && (
                <a
                  href={result.rawDocument.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  View Original
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
