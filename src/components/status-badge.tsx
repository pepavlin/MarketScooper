"use client";

import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
  PENDING: { variant: "outline", label: "Pending" },
  ANALYZED: { variant: "default", label: "Analyzed" },
  ERROR: { variant: "destructive", label: "Error" },
  IGNORED: { variant: "secondary", label: "Ignored" },
  NEW: { variant: "outline", label: "New" },
  REVIEWED: { variant: "default", label: "Reviewed" },
  RUNNING: { variant: "default", label: "Running" },
  COMPLETED: { variant: "default", label: "Completed" },
  FAILED: { variant: "destructive", label: "Failed" },
  INFO: { variant: "secondary", label: "Info" },
  WARNING: { variant: "outline", label: "Warning" },
  CRITICAL: { variant: "destructive", label: "Critical" },
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] ?? { variant: "outline" as const, label: status };
  return <Badge variant={style.variant}>{style.label}</Badge>;
}
