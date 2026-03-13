import type { SourceType } from "@prisma/client";
import type { SourceConnector } from "./types";
import { RedditConnector } from "./reddit";
import { HackerNewsConnector } from "./hackernews";
import { CsvJsonImportConnector } from "./csv-import";

export type { RawDocumentInput, SourceConnector } from "./types";

const connectors: Record<string, () => SourceConnector> = {
  REDDIT: () => new RedditConnector(),
  HACKERNEWS: () => new HackerNewsConnector(),
  CSV: () => new CsvJsonImportConnector(),
  JSON: () => new CsvJsonImportConnector(),
};

export function getConnector(type: SourceType): SourceConnector {
  const factory = connectors[type];
  if (!factory) {
    throw new Error(`No connector registered for source type: ${type}`);
  }
  return factory();
}
