"use client";

import { cn } from "@/lib/utils";

interface ScoreIndicatorProps {
  score: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

function getScoreColor(score: number, max: number): string {
  const ratio = score / max;
  if (ratio >= 0.7) return "text-green-600 bg-green-50";
  if (ratio >= 0.4) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
}

export function ScoreIndicator({
  score,
  max = 10,
  size = "md",
  showLabel = true,
}: ScoreIndicatorProps) {
  const colorClass = getScoreColor(score, max);
  const sizeClass = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1.5",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-semibold",
        colorClass,
        sizeClass
      )}
    >
      {score.toFixed(1)}
      {showLabel && (
        <span className="ml-0.5 text-[0.7em] font-normal opacity-70">
          /{max}
        </span>
      )}
    </span>
  );
}
