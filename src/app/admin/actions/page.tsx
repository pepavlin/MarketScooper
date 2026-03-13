"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Source {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
}

interface ActionResult {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export default function AdminActionsPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<ActionResult[]>([]);

  useEffect(() => {
    fetch("/api/sources")
      .then((r) => r.json())
      .then(setSources)
      .catch(() => setSources([]));
  }, []);

  async function triggerIngestion(sourceId: string) {
    setLoading(`ingest-${sourceId}`);
    try {
      const res = await fetch("/api/ingestion/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId }),
      });
      const data = await res.json();
      setResults((prev) => [
        {
          success: res.ok,
          message: res.ok
            ? `Ingested ${data.processedItems}/${data.totalItems} documents`
            : `Error: ${data.error}`,
          data,
        },
        ...prev,
      ]);
    } catch (error) {
      setResults((prev) => [
        { success: false, message: `Failed: ${error}` },
        ...prev,
      ]);
    }
    setLoading(null);
  }

  async function triggerAnalysis() {
    setLoading("analysis");
    try {
      const res = await fetch("/api/analysis/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 10 }),
      });
      const data = await res.json();
      setResults((prev) => [
        {
          success: res.ok,
          message: res.ok
            ? `Analyzed ${data.processedItems}/${data.totalItems} documents (${data.errorCount} errors)`
            : `Error: ${data.error}`,
          data,
        },
        ...prev,
      ]);
    } catch (error) {
      setResults((prev) => [
        { success: false, message: `Failed: ${error}` },
        ...prev,
      ]);
    }
    setLoading(null);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ingestion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {sources.length === 0 && (
              <p className="text-sm text-[var(--muted-foreground)]">
                No sources available. Run the seed script first.
              </p>
            )}
            {sources.map((source) => (
              <Button
                key={source.id}
                variant="outline"
                disabled={loading !== null || !source.enabled}
                onClick={() => triggerIngestion(source.id)}
              >
                {loading === `ingest-${source.id}`
                  ? "Running..."
                  : `Ingest: ${source.name}`}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={triggerAnalysis}
            disabled={loading !== null}
          >
            {loading === "analysis"
              ? "Analyzing..."
              : "Trigger Analysis (up to 10 documents)"}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.map((result, i) => (
                <div
                  key={i}
                  className={`text-sm p-2 rounded ${
                    result.success
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {result.message}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
