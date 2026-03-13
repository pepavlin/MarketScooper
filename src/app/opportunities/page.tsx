import Link from "next/link";
import { prisma } from "@/lib/db";
import { ScoreIndicator } from "@/components/score-indicator";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SearchParams {
  sort?: string;
  order?: string;
  status?: string;
  minScore?: string;
}

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const sortField = params.sort ?? "finalScore";
  const sortOrder = params.order === "asc" ? "asc" : "desc";
  const statusFilter = params.status;
  const minScore = params.minScore ? parseFloat(params.minScore) : undefined;

  const orderBy: Record<string, "asc" | "desc"> = {};
  if (
    [
      "finalScore",
      "painLevel",
      "urgencySignal",
      "paymentSignal",
      "dissatisfactionSignal",
      "createdAt",
    ].includes(sortField)
  ) {
    orderBy[sortField] = sortOrder;
  } else {
    orderBy.finalScore = "desc";
  }

  const where: Record<string, unknown> = {};
  if (statusFilter && ["NEW", "REVIEWED", "IGNORED"].includes(statusFilter)) {
    where.reviewStatus = statusFilter;
  }
  if (minScore !== undefined) {
    where.finalScore = { gte: minScore };
  }

  const results = await prisma.analysisResult.findMany({
    where,
    include: {
      rawDocument: {
        include: { source: true },
      },
    },
    orderBy,
    take: 100,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Opportunities</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            {results.length} results found
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/opportunities?status=NEW"
            className="text-sm px-3 py-1.5 rounded-md border hover:bg-[var(--muted)] transition-colors"
          >
            New
          </Link>
          <Link
            href="/opportunities?status=REVIEWED"
            className="text-sm px-3 py-1.5 rounded-md border hover:bg-[var(--muted)] transition-colors"
          >
            Reviewed
          </Link>
          <Link
            href="/opportunities?minScore=5"
            className="text-sm px-3 py-1.5 rounded-md border hover:bg-[var(--muted)] transition-colors"
          >
            Score 5+
          </Link>
          <Link
            href="/opportunities"
            className="text-sm px-3 py-1.5 rounded-md border hover:bg-[var(--muted)] transition-colors"
          >
            All
          </Link>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              <SortLink field="problemSummary" current={sortField} order={sortOrder} searchParams={params}>
                Problem
              </SortLink>
            </TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Buyer Segment</TableHead>
            <TableHead>
              <SortLink field="finalScore" current={sortField} order={sortOrder} searchParams={params}>
                Score
              </SortLink>
            </TableHead>
            <TableHead>
              <SortLink field="painLevel" current={sortField} order={sortOrder} searchParams={params}>
                Pain
              </SortLink>
            </TableHead>
            <TableHead>
              <SortLink field="paymentSignal" current={sortField} order={sortOrder} searchParams={params}>
                Payment
              </SortLink>
            </TableHead>
            <TableHead>
              <SortLink field="urgencySignal" current={sortField} order={sortOrder} searchParams={params}>
                Urgency
              </SortLink>
            </TableHead>
            <TableHead>
              <SortLink field="dissatisfactionSignal" current={sortField} order={sortOrder} searchParams={params}>
                Dissatisfaction
              </SortLink>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <SortLink field="createdAt" current={sortField} order={sortOrder} searchParams={params}>
                Date
              </SortLink>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.id}>
              <TableCell>
                <Link
                  href={`/opportunities/${result.id}`}
                  className="font-medium hover:underline line-clamp-2"
                >
                  {result.problemSummary}
                </Link>
              </TableCell>
              <TableCell className="text-xs">
                {result.rawDocument.source.name}
              </TableCell>
              <TableCell className="text-xs">
                {result.buyerSegment ?? "-"}
              </TableCell>
              <TableCell>
                <ScoreIndicator score={result.finalScore} size="sm" />
              </TableCell>
              <TableCell>
                <ScoreIndicator score={result.painLevel} size="sm" showLabel={false} />
              </TableCell>
              <TableCell>
                <ScoreIndicator score={result.paymentSignal} size="sm" showLabel={false} />
              </TableCell>
              <TableCell>
                <ScoreIndicator score={result.urgencySignal} size="sm" showLabel={false} />
              </TableCell>
              <TableCell>
                <ScoreIndicator score={result.dissatisfactionSignal} size="sm" showLabel={false} />
              </TableCell>
              <TableCell>
                <StatusBadge status={result.reviewStatus} />
              </TableCell>
              <TableCell className="text-xs text-[var(--muted-foreground)]">
                {formatDate(result.createdAt)}
              </TableCell>
            </TableRow>
          ))}
          {results.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-[var(--muted-foreground)]">
                No opportunities found. Run ingestion and analysis first.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function SortLink({
  field,
  current,
  order,
  searchParams,
  children,
}: {
  field: string;
  current: string;
  order: string;
  searchParams: SearchParams;
  children: React.ReactNode;
}) {
  const nextOrder = field === current && order === "desc" ? "asc" : "desc";
  const indicator = field === current ? (order === "desc" ? " ↓" : " ↑") : "";
  const params = new URLSearchParams();
  if (searchParams.status) params.set("status", searchParams.status);
  if (searchParams.minScore) params.set("minScore", searchParams.minScore);
  params.set("sort", field);
  params.set("order", nextOrder);
  return (
    <Link
      href={`/opportunities?${params.toString()}`}
      className="hover:text-[var(--foreground)] whitespace-nowrap"
    >
      {children}
      {indicator}
    </Link>
  );
}
