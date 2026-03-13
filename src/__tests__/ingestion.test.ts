import { describe, it, expect } from "vitest";
import { CsvJsonImportConnector } from "@/lib/ingestion/csv-import";

describe("CsvJsonImportConnector", () => {
  const connector = new CsvJsonImportConnector();

  it("should import records from data array", async () => {
    const result = await connector.fetch({
      data: [
        {
          id: "test-1",
          title: "Test Record",
          content: "This is test content",
          author: "tester",
        },
        {
          id: "test-2",
          title: "Another Record",
          text: "This uses text field instead",
        },
      ],
    });

    expect(result).toHaveLength(2);
    expect(result[0].externalId).toBe("test-1");
    expect(result[0].title).toBe("Test Record");
    expect(result[0].content).toBe("This is test content");
    expect(result[1].content).toBe("This uses text field instead");
  });

  it("should filter out records with empty content", async () => {
    const result = await connector.fetch({
      data: [
        { id: "valid", title: "Has content", content: "Some content" },
        { id: "empty", title: "No content", content: "" },
      ],
    });

    expect(result).toHaveLength(1);
    expect(result[0].externalId).toBe("valid");
  });

  it("should throw when data is not provided", async () => {
    await expect(connector.fetch({})).rejects.toThrow(
      "CSV/JSON connector requires 'data' array in config"
    );
  });

  it("should generate externalId when not provided", async () => {
    const result = await connector.fetch({
      data: [{ title: "No ID", content: "Has content" }],
    });

    expect(result).toHaveLength(1);
    expect(result[0].externalId).toMatch(/^import-/);
  });

  it("should support body field as content fallback", async () => {
    const result = await connector.fetch({
      data: [{ id: "body-test", title: "Body Field", body: "Body content" }],
    });

    expect(result[0].content).toBe("Body content");
  });
});
