export const ANALYSIS_PROMPT_VERSION = "v1";

const MAX_CONTENT_LENGTH = 8000;

function truncateContent(content: string): string {
  if (content.length <= MAX_CONTENT_LENGTH) return content;
  return content.slice(0, MAX_CONTENT_LENGTH) + "\n\n[Content truncated]";
}

export function buildAnalysisPrompt(title: string, content: string): string {
  const safeContent = truncateContent(content);
  return `You are an AI market research analyst. Your task is to analyze the following online discussion/post and extract structured market intelligence.

Analyze this content for signs of:
1. A real problem or pain point people are experiencing
2. Willingness to pay for a solution
3. Dissatisfaction with existing solutions
4. Urgency of the need
5. Active solution-seeking behavior

## Content to analyze

**Title:** ${title}

**Content:**
${safeContent}

## Instructions

Rate each signal on a scale of 0-10 where:
- 0 = No signal at all
- 1-3 = Weak signal
- 4-6 = Moderate signal
- 7-9 = Strong signal
- 10 = Extremely strong signal

For confidence, rate 0.0-1.0 where 1.0 means you are completely certain in your analysis.

Respond ONLY with valid JSON matching this exact schema:

{
  "problemSummary": "Clear summary of the market problem or pain point",
  "buyerSegment": "Target buyer/user segment or null",
  "painLevel": 0-10,
  "urgencySignal": 0-10,
  "paymentSignal": 0-10,
  "dissatisfactionSignal": 0-10,
  "solutionSearchSignal": 0-10,
  "isPotentialOpportunity": true/false,
  "reasoningSummary": "Brief reasoning explanation or null",
  "tags": ["tag1", "tag2"],
  "language": "en",
  "confidence": 0.0-1.0
}

Do not include any text outside of the JSON object.`;
}
