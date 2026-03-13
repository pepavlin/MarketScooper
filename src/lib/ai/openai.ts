import OpenAI from "openai";
import { createChildLogger } from "@/lib/logger";
import type { AIProvider } from "./provider";

const log = createChildLogger("ai:openai");

export class OpenAIProvider implements AIProvider {
  name = "openai";
  private client: OpenAI;
  private model: string;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  }

  async generateAnalysis(prompt: string): Promise<string> {
    log.info({ model: this.model }, "Calling OpenAI API");

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: "system",
          content:
            "You are a market research analyst. Always respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    return content;
  }
}
