import { describe, it, expect } from "vitest";
import { calculateScore } from "@/lib/scoring";

describe("calculateScore", () => {
  it("should calculate correct score with all signals at maximum", () => {
    const result = calculateScore({
      painLevel: 10,
      urgencySignal: 10,
      paymentSignal: 10,
      dissatisfactionSignal: 10,
      solutionSearchSignal: 10,
      confidence: 1.0,
    });

    // (10*0.2) + (10*0.15) + (10*0.25) + (10*0.15) + (10*0.15) + (1*10*0.1) = 2+1.5+2.5+1.5+1.5+1 = 10
    expect(result.finalScore).toBe(10);
  });

  it("should calculate correct score with all signals at zero", () => {
    const result = calculateScore({
      painLevel: 0,
      urgencySignal: 0,
      paymentSignal: 0,
      dissatisfactionSignal: 0,
      solutionSearchSignal: 0,
      confidence: 0,
    });

    expect(result.finalScore).toBe(0);
  });

  it("should calculate correct score with mixed signals", () => {
    const result = calculateScore({
      painLevel: 8,
      urgencySignal: 5,
      paymentSignal: 7,
      dissatisfactionSignal: 6,
      solutionSearchSignal: 4,
      confidence: 0.8,
    });

    // (8*0.2) + (5*0.15) + (7*0.25) + (6*0.15) + (4*0.15) + (0.8*10*0.1)
    // = 1.6 + 0.75 + 1.75 + 0.9 + 0.6 + 0.8 = 6.4
    expect(result.finalScore).toBe(6.4);
  });

  it("should include score breakdown with weights", () => {
    const result = calculateScore({
      painLevel: 5,
      urgencySignal: 5,
      paymentSignal: 5,
      dissatisfactionSignal: 5,
      solutionSearchSignal: 5,
      confidence: 0.5,
    });

    expect(result.scoreBreakdown.formula).toBe("v1");
    expect(result.scoreBreakdown.weights).toEqual({
      painLevel: 0.2,
      urgencySignal: 0.15,
      paymentSignal: 0.25,
      dissatisfactionSignal: 0.15,
      solutionSearchSignal: 0.15,
      confidence: 0.1,
    });
    expect(result.scoreBreakdown.contributions.painLevel).toBe(1);
    expect(result.scoreBreakdown.contributions.paymentSignal).toBe(1.25);
    expect(result.scoreBreakdown.rawValues.painLevel).toBe(5);
  });

  it("should weight payment signal highest", () => {
    const baseInput = {
      painLevel: 0,
      urgencySignal: 0,
      paymentSignal: 0,
      dissatisfactionSignal: 0,
      solutionSearchSignal: 0,
      confidence: 0,
    };

    const paymentOnly = calculateScore({ ...baseInput, paymentSignal: 10 });
    const painOnly = calculateScore({ ...baseInput, painLevel: 10 });
    const urgencyOnly = calculateScore({ ...baseInput, urgencySignal: 10 });

    expect(paymentOnly.finalScore).toBeGreaterThan(painOnly.finalScore);
    expect(paymentOnly.finalScore).toBeGreaterThan(urgencyOnly.finalScore);
  });
});
