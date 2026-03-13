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

export default async function AdminSourcesPage() {
  const sources = await prisma.source.findMany({
    include: {
      _count: {
        select: { documents: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Sources</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Enabled</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead>Last Fetch</TableHead>
            <TableHead>Last Error</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sources.map((source) => (
            <TableRow key={source.id}>
              <TableCell className="font-medium">{source.name}</TableCell>
              <TableCell>
                <StatusBadge status={source.type} />
              </TableCell>
              <TableCell>
                <span
                  className={
                    source.enabled ? "text-green-600" : "text-red-600"
                  }
                >
                  {source.enabled ? "Active" : "Disabled"}
                </span>
              </TableCell>
              <TableCell>{source._count.documents}</TableCell>
              <TableCell className="text-xs text-[var(--muted-foreground)]">
                {source.lastFetchAt
                  ? formatDate(source.lastFetchAt)
                  : "Never"}
              </TableCell>
              <TableCell className="text-xs text-red-600 max-w-48 truncate">
                {source.lastError ?? "-"}
              </TableCell>
            </TableRow>
          ))}
          {sources.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-[var(--muted-foreground)]"
              >
                No sources configured. Run the seed script first.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
