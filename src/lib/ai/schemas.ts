import { z } from "zod";

export const analysisOutputSchema = z.object({
  problemSummary: z
    .string()
    .min(10)
    .describe("A clear summary of the market problem or pain point"),
  buyerSegment: z
    .string()
    .nullable()
    .describe("Target buyer segment or persona"),
  painLevel: z
    .number()
    .min(0)
    .max(10)
    .describe("How severe the pain point is (0-10)"),
  urgencySignal: z
    .number()
    .min(0)
    .max(10)
    .describe("How urgently the person needs a solution (0-10)"),
  paymentSignal: z
    .number()
    .min(0)
    .max(10)
    .describe("Willingness to pay for a solution (0-10)"),
  dissatisfactionSignal: z
    .number()
    .min(0)
    .max(10)
    .describe("Dissatisfaction with current solutions (0-10)"),
  solutionSearchSignal: z
    .number()
    .min(0)
    .max(10)
    .describe("Actively searching for solutions (0-10)"),
  isPotentialOpportunity: z
    .boolean()
    .describe("Whether this represents a viable market opportunity"),
  reasoningSummary: z
    .string()
    .nullable()
    .describe("Brief explanation of the analysis reasoning"),
  tags: z
    .array(z.string())
    .describe("Relevant tags/categories"),
  language: z
    .string()
    .nullable()
    .describe("Detected language code (e.g., 'en')"),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("Confidence in the analysis (0-1)"),
});

export type AnalysisOutput = z.infer<typeof analysisOutputSchema>;
