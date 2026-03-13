const FORMULA_VERSION = "v1";

const WEIGHTS = {
  painLevel: 0.2,
  urgencySignal: 0.15,
  paymentSignal: 0.25,
  dissatisfactionSignal: 0.15,
  solutionSearchSignal: 0.15,
  confidence: 0.1,
} as const;

interface ScoreInput {
  painLevel: number;
  urgencySignal: number;
  paymentSignal: number;
  dissatisfactionSignal: number;
  solutionSearchSignal: number;
  confidence: number;
}

export interface ScoreResult {
  finalScore: number;
  scoreBreakdown: {
    formula: string;
    weights: typeof WEIGHTS;
    contributions: Record<string, number>;
    rawValues: Record<string, number>;
  };
}

export function calculateScore(input: ScoreInput): ScoreResult {
  const contributions = {
    painLevel: input.painLevel * WEIGHTS.painLevel,
    urgencySignal: input.urgencySignal * WEIGHTS.urgencySignal,
    paymentSignal: input.paymentSignal * WEIGHTS.paymentSignal,
    dissatisfactionSignal:
      input.dissatisfactionSignal * WEIGHTS.dissatisfactionSignal,
    solutionSearchSignal:
      input.solutionSearchSignal * WEIGHTS.solutionSearchSignal,
    confidence: input.confidence * 10 * WEIGHTS.confidence,
  };

  const finalScore = Object.values(contributions).reduce(
    (sum, val) => sum + val,
    0
  );

  return {
    finalScore: Math.round(finalScore * 100) / 100,
    scoreBreakdown: {
      formula: FORMULA_VERSION,
      weights: WEIGHTS,
      contributions,
      rawValues: {
        painLevel: input.painLevel,
        urgencySignal: input.urgencySignal,
        paymentSignal: input.paymentSignal,
        dissatisfactionSignal: input.dissatisfactionSignal,
        solutionSearchSignal: input.solutionSearchSignal,
        confidence: input.confidence,
      },
    },
  };
}
