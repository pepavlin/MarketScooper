import { createChildLogger } from "@/lib/logger";
import type { RawDocumentInput, SourceConnector } from "./types";

const log = createChildLogger("ingestion:csv-import");

interface CsvJsonRecord {
  id?: string;
  externalId?: string;
  url?: string;
  title?: string;
  content?: string;
  text?: string;
  body?: string;
  author?: string;
}

export class CsvJsonImportConnector implements SourceConnector {
  type = "CSV";

  async fetch(config: Record<string, unknown>): Promise<RawDocumentInput[]> {
    const data = config.data as CsvJsonRecord[] | undefined;

    if (!data || !Array.isArray(data)) {
      throw new Error(
        "CSV/JSON connector requires 'data' array in config"
      );
    }

    log.info({ count: data.length }, "Importing CSV/JSON records");

    return data
      .filter((record) => {
        const content = record.content ?? record.text ?? record.body;
        return content && content.length > 0;
      })
      .map((record, index) => ({
        externalId:
          record.externalId ?? record.id ?? `import-${Date.now()}-${index}`,
        url: record.url,
        title: record.title ?? "Imported Record",
        content: (record.content ?? record.text ?? record.body)!,
        author: record.author,
        metadata: {},
      }));
  }
}
