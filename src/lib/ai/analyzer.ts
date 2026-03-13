import { createChildLogger } from "@/lib/logger";
import type { AIProvider } from "./provider";
import { getAIProviderName } from "./provider";
import { OpenAIProvider } from "./openai";
import { AnthropicProvider } from "./anthropic";
import { analysisOutputSchema, type AnalysisOutput } from "./schemas";
import { buildAnalysisPrompt, ANALYSIS_PROMPT_VERSION } from "./prompts";
import { calculateScore } from "@/lib/scoring";

const log = createChildLogger("ai:analyzer");

function createProvider(): AIProvider {
  const providerName = getAIProviderName();
  switch (providerName) {
    case "openai":
      return new OpenAIProvider();
    case "anthropic":
      return new AnthropicProvider();
    default:
      throw new Error(`Unknown AI provider: ${providerName}`);
  }
}

export interface AnalysisResultData {
  analysis: AnalysisOutput;
  finalScore: number;
  scoreBreakdown: Record<string, unknown>;
  modelUsed: string;
  promptVersion: string;
  retryCount: number;
}

const MAX_RETRIES = 2;

export async function analyzeDocument(
  title: string,
  content: string
): Promise<AnalysisResultData> {
  const provider = createProvider();
  const prompt = buildAnalysisPrompt(title, content);

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      log.info(
        { attempt, provider: provider.name },
        "Running AI analysis"
      );

      const rawResponse = await provider.generateAnalysis(prompt);

      // Parse and validate
      const parsed = JSON.parse(rawResponse);
      const analysis = analysisOutputSchema.parse(parsed);

      // Calculate score
      const { finalScore, scoreBreakdown } = calculateScore(analysis);

      return {
        analysis,
        finalScore,
        scoreBreakdown,
        modelUsed: provider.name,
        promptVersion: ANALYSIS_PROMPT_VERSION,
        retryCount: attempt,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      log.warn(
        { attempt, error: lastError.message },
        "Analysis attempt failed"
      );
    }
  }

  throw lastError ?? new Error("Analysis failed after retries");
}
