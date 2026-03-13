import { createChildLogger } from "@/lib/logger";
import type { RawDocumentInput, SourceConnector } from "./types";

const log = createChildLogger("ingestion:hackernews");

interface HNItem {
  id: number;
  title?: string;
  text?: string;
  by?: string;
  url?: string;
  time?: number;
  score?: number;
  descendants?: number;
  type?: string;
  kids?: number[];
}

const HN_API = "https://hacker-news.firebaseio.com/v0";

async function fetchItem(id: number): Promise<HNItem | null> {
  const response = await fetch(`${HN_API}/item/${id}.json`);
  if (!response.ok) return null;
  return response.json();
}

export class HackerNewsConnector implements SourceConnector {
  type = "HACKERNEWS";

  async fetch(config: Record<string, unknown>): Promise<RawDocumentInput[]> {
    const limit = (config.limit as number) ?? 20;
    const fetchComments = (config.fetchComments as boolean) ?? true;

    log.info({ limit, fetchComments }, "Fetching HN stories");

    // Fetch latest Ask HN and Show HN stories
    const response = await fetch(`${HN_API}/newstories.json`);
    if (!response.ok) {
      throw new Error(`HN API error: ${response.status}`);
    }

    const storyIds = (await response.json()) as number[];
    const topIds = storyIds.slice(0, limit * 3); // Fetch more to filter

    const stories = await Promise.all(topIds.map(fetchItem));
    const relevant = stories
      .filter(
        (s): s is HNItem =>
          s !== null &&
          s.title !== undefined &&
          (s.title.startsWith("Ask HN") ||
            s.title.startsWith("Show HN") ||
            (s.text !== undefined && s.text.length > 50))
      )
      .slice(0, limit);

    log.info({ count: relevant.length }, "Filtered relevant HN stories");

    const results: RawDocumentInput[] = [];

    for (const story of relevant) {
      let content = story.text ?? "";

      // Fetch top-level comments for more context
      if (fetchComments && story.kids && story.kids.length > 0) {
        const commentIds = story.kids.slice(0, 5);
        const comments = await Promise.all(commentIds.map(fetchItem));
        const commentTexts = comments
          .filter((c): c is HNItem => c !== null && !!c.text)
          .map((c) => c.text!)
          .join("\n\n---\n\n");

        if (commentTexts) {
          content = content
            ? `${content}\n\n--- Comments ---\n\n${commentTexts}`
            : commentTexts;
        }
      }

      if (content.length < 50) continue;

      results.push({
        externalId: String(story.id),
        url: story.url ?? `https://news.ycombinator.com/item?id=${story.id}`,
        title: story.title ?? "Untitled",
        content,
        author: story.by,
        metadata: {
          score: story.score,
          descendants: story.descendants,
          type: story.type,
        },
        fetchedAt: story.time ? new Date(story.time * 1000) : new Date(),
      });
    }

    return results;
  }
}
