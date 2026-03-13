import Anthropic from "@anthropic-ai/sdk";
import { createChildLogger } from "@/lib/logger";
import type { AIProvider } from "./provider";

const log = createChildLogger("ai:anthropic");

export class AnthropicProvider implements AIProvider {
  name = "anthropic";
  private client: Anthropic;
  private model: string;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
  }

  async generateAnalysis(prompt: string): Promise<string> {
    log.info({ model: this.model }, "Calling Anthropic API");

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
      system:
        "You are a market research analyst. Always respond with valid JSON only. No markdown, no explanations — just the JSON object.",
    });

    const content = response.content[0];
    if (!content || content.type !== "text") {
      throw new Error("Empty response from Anthropic");
    }

    return content.text;
  }
}
