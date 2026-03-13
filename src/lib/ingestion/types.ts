export interface RawDocumentInput {
  externalId: string;
  url?: string;
  title: string;
  content: string;
  author?: string;
  metadata?: Record<string, unknown>;
  fetchedAt?: Date;
}

export interface SourceConnector {
  type: string;
  fetch(config: Record<string, unknown>): Promise<RawDocumentInput[]>;
}
