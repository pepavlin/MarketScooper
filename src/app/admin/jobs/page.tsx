import { prisma } from "@/lib/db";
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

export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
  const jobs = await prisma.processingJob.findMany({
    include: { source: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Processing Jobs</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Processed</TableHead>
            <TableHead>Errors</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead>Retries</TableHead>
            <TableHead>Error Message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.type}</TableCell>
              <TableCell>
                <StatusBadge status={job.status} />
              </TableCell>
              <TableCell className="text-xs">
                {job.source?.name ?? "-"}
              </TableCell>
              <TableCell>
                {job.processedItems}/{job.totalItems}
              </TableCell>
              <TableCell className={job.errorCount > 0 ? "text-red-600" : ""}>
                {job.errorCount}
              </TableCell>
              <TableCell className="text-xs text-[var(--muted-foreground)]">
                {job.startedAt ? formatDate(job.startedAt) : "-"}
              </TableCell>
              <TableCell className="text-xs text-[var(--muted-foreground)]">
                {job.completedAt ? formatDate(job.completedAt) : "-"}
              </TableCell>
              <TableCell>{job.retryCount}</TableCell>
              <TableCell className="text-xs text-red-600 max-w-48 truncate">
                {job.errorMessage ?? "-"}
              </TableCell>
            </TableRow>
          ))}
          {jobs.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center py-8 text-[var(--muted-foreground)]"
              >
                No jobs yet. Trigger ingestion or analysis first.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
