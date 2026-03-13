import { describe, it, expect } from "vitest";
import { analysisOutputSchema } from "@/lib/ai/schemas";

describe("analysisOutputSchema", () => {
  const validOutput = {
    problemSummary: "Users struggle with expensive project management tools",
    buyerSegment: "Small SaaS founders",
    painLevel: 7.5,
    urgencySignal: 6.0,
    paymentSignal: 8.0,
    dissatisfactionSignal: 7.0,
    solutionSearchSignal: 5.5,
    isPotentialOpportunity: true,
    reasoningSummary: "Strong payment signals and clear pain point",
    tags: ["saas", "project-management", "pricing"],
    language: "en",
    confidence: 0.85,
  };

  it("should accept valid output", () => {
    const result = analysisOutputSchema.safeParse(validOutput);
    expect(result.success).toBe(true);
  });

  it("should reject missing problemSummary", () => {
    const { problemSummary, ...invalid } = validOutput;
    const result = analysisOutputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("should reject short problemSummary", () => {
    const result = analysisOutputSchema.safeParse({
      ...validOutput,
      problemSummary: "Too short",
    });
    expect(result.success).toBe(false);
  });

  it("should reject painLevel above 10", () => {
    const result = analysisOutputSchema.safeParse({
      ...validOutput,
      painLevel: 11,
    });
    expect(result.success).toBe(false);
  });

  it("should reject painLevel below 0", () => {
    const result = analysisOutputSchema.safeParse({
      ...validOutput,
      painLevel: -1,
    });
    expect(result.success).toBe(false);
  });

  it("should reject confidence above 1", () => {
    const result = analysisOutputSchema.safeParse({
      ...validOutput,
      confidence: 1.5,
    });
    expect(result.success).toBe(false);
  });

  it("should accept null buyerSegment", () => {
    const result = analysisOutputSchema.safeParse({
      ...validOutput,
      buyerSegment: null,
    });
    expect(result.success).toBe(true);
  });

  it("should accept null reasoningSummary", () => {
    const result = analysisOutputSchema.safeParse({
      ...validOutput,
      reasoningSummary: null,
    });
    expect(result.success).toBe(true);
  });

  it("should accept empty tags array", () => {
    const result = analysisOutputSchema.safeParse({
      ...validOutput,
      tags: [],
    });
    expect(result.success).toBe(true);
  });

  it("should reject non-boolean isPotentialOpportunity", () => {
    const result = analysisOutputSchema.safeParse({
      ...validOutput,
      isPotentialOpportunity: "yes",
    });
    expect(result.success).toBe(false);
  });
});
