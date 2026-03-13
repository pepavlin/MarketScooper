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

export default async function AdminErrorsPage() {
  const errors = await prisma.appError.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Error Log</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Component</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Context</TableHead>
            <TableHead>Resolved</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {errors.map((error) => (
            <TableRow key={error.id}>
              <TableCell className="text-xs text-[var(--muted-foreground)] whitespace-nowrap">
                {formatDate(error.createdAt)}
              </TableCell>
              <TableCell>
                <StatusBadge status={error.severity} />
              </TableCell>
              <TableCell className="text-xs font-medium">
                {error.component}
              </TableCell>
              <TableCell className="text-xs max-w-64 truncate">
                {error.message}
              </TableCell>
              <TableCell className="text-xs max-w-48 truncate font-mono">
                {JSON.stringify(error.context)}
              </TableCell>
              <TableCell className="text-xs">
                {error.resolvedAt
                  ? formatDate(error.resolvedAt)
                  : "No"}
              </TableCell>
            </TableRow>
          ))}
          {errors.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-[var(--muted-foreground)]"
              >
                No errors recorded.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
