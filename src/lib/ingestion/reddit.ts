import { createChildLogger } from "@/lib/logger";
import type { RawDocumentInput, SourceConnector } from "./types";

const log = createChildLogger("ingestion:reddit");

interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  permalink: string;
  created_utc: number;
  subreddit: string;
  score: number;
  num_comments: number;
}

interface RedditListingResponse {
  data: {
    children: Array<{ data: RedditPost }>;
    after: string | null;
  };
}

export class RedditConnector implements SourceConnector {
  type = "REDDIT";

  async fetch(config: Record<string, unknown>): Promise<RawDocumentInput[]> {
    const subreddit = config.subreddit as string;
    const limit = (config.limit as number) ?? 25;
    const sort = (config.sort as string) ?? "new";

    if (!subreddit) {
      throw new Error("Reddit connector requires 'subreddit' in config");
    }

    const url = `https://www.reddit.com/r/${subreddit}/${sort}.json?limit=${limit}`;
    log.info({ subreddit, limit, sort }, "Fetching Reddit posts");

    const response = await fetch(url, {
      headers: {
        "User-Agent": "MarketScooper/1.0 (Research Bot)",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Reddit API error: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as RedditListingResponse;
    const posts = data.data.children.map((child) => child.data);

    log.info({ count: posts.length, subreddit }, "Fetched Reddit posts");

    return posts
      .filter((post) => post.selftext && post.selftext.length > 50)
      .map((post) => ({
        externalId: post.id,
        url: `https://www.reddit.com${post.permalink}`,
        title: post.title,
        content: post.selftext,
        author: post.author,
        metadata: {
          subreddit: post.subreddit,
          score: post.score,
          numComments: post.num_comments,
        },
        fetchedAt: new Date(post.created_utc * 1000),
      }));
  }
}
