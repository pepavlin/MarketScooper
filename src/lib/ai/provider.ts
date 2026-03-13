export interface AIProvider {
  name: string;
  generateAnalysis(prompt: string): Promise<string>;
}

export function getAIProviderName(): string {
  return process.env.AI_PROVIDER ?? "openai";
}
