import { afterEach, describe, expect, it, vi } from "vitest";
import { getUpload, uploadFile } from "./directUploadApi";

const operationId = "a83e9646-e03f-4f4c-9ceb-00b1fdfeaf45";
const document = {
    operationId,
    submissionId: "c5ffb227-5555-4db4-b101-b4ac49d3b06b",
    navEksternRefId: "ref0001",
    filename: "test.pdf",
    size: 3,
    converted: false,
    status: "READY",
};

afterEach(() => vi.unstubAllGlobals());

describe("direct upload API", () => {
    it("sends a single multipart file and the operation, context and case headers", async () => {
        const fetchMock = vi.fn().mockResolvedValue(Response.json(document, { status: 201 }));
        vi.stubGlobal("fetch", fetchMock);
        const file = new File(["pdf"], "test.pdf", { type: "application/pdf" });

        expect(await uploadFile(file, operationId, "context-id", "case-id")).toEqual(document);

        const [url, options] = fetchMock.mock.calls[0];
        expect(url).toContain("/api/upload-api/direct/uploads");
        expect(options.method).toBe("POST");
        expect(options.headers).toEqual({
            "Upload-Operation-Id": operationId,
            "Upload-Context-Id": "context-id",
            "Upload-Fiks-Digisos-Id": "case-id",
        });
        expect([...options.body.keys()]).toEqual(["file"]);
        expect(options.body.get("file")).toBe(file);
    });

    it("rejects a status response for a different operation", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue(Response.json({ ...document, operationId: crypto.randomUUID() }))
        );
        await expect(getUpload(operationId)).rejects.toThrow("Unexpected operation ID");
    });
});
