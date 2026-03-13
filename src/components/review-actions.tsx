"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ReviewActionsProps {
  documentId: string;
  analysisId: string;
  currentStatus: string;
}

export function ReviewActions({
  documentId,
  analysisId,
  currentStatus,
}: ReviewActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function updateReviewStatus(status: string) {
    setLoading(status);
    setMessage(null);
    try {
      const res = await fetch(`/api/documents/${documentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewStatus: status }),
      });
      if (res.ok) {
        setMessage(`Marked as ${status.toLowerCase()}`);
        router.refresh();
      } else {
        setMessage("Failed to update status");
      }
    } catch {
      setMessage("Failed to update status");
    }
    setLoading(null);
  }

  async function reanalyze() {
    setLoading("reanalyze");
    setMessage(null);
    try {
      const res = await fetch(`/api/analysis/reanalyze/${documentId}`, {
        method: "POST",
      });
      if (res.ok) {
        setMessage("Reanalysis complete");
        router.refresh();
      } else {
        const data = await res.json();
        setMessage(`Reanalysis failed: ${data.error}`);
      }
    } catch {
      setMessage("Reanalysis failed");
    }
    setLoading(null);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {currentStatus !== "REVIEWED" && (
        <Button
          variant="outline"
          size="sm"
          disabled={loading !== null}
          onClick={() => updateReviewStatus("REVIEWED")}
        >
          {loading === "REVIEWED" ? "Updating..." : "Mark Reviewed"}
        </Button>
      )}
      {currentStatus !== "IGNORED" && (
        <Button
          variant="outline"
          size="sm"
          disabled={loading !== null}
          onClick={() => updateReviewStatus("IGNORED")}
        >
          {loading === "IGNORED" ? "Updating..." : "Mark Ignored"}
        </Button>
      )}
      {currentStatus !== "NEW" && (
        <Button
          variant="outline"
          size="sm"
          disabled={loading !== null}
          onClick={() => updateReviewStatus("NEW")}
        >
          {loading === "NEW" ? "Updating..." : "Reset to New"}
        </Button>
      )}
      <Button
        variant="secondary"
        size="sm"
        disabled={loading !== null}
        onClick={reanalyze}
      >
        {loading === "reanalyze" ? "Reanalyzing..." : "Reanalyze"}
      </Button>
      {message && (
        <span className="text-xs text-[var(--muted-foreground)]">{message}</span>
      )}
    </div>
  );
}
