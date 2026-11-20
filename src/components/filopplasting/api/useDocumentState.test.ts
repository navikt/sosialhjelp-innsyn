import { describe, expect, it } from "vitest";
import { documentStateReducer, UploadState } from "./useDocumentState";

const placeholder = (cid: string): UploadState => ({
    id: cid,
    correlationId: cid,
    originalFilename: "a.pdf",
    converted: false,
    status: "PENDING",
});

describe("documentStateReducer uploadResult", () => {
    it("replaces the placeholder by correlationId and sets submissionId", () => {
        const stored: UploadState = { ...placeholder("c1"), id: "server", filId: "f", status: "COMPLETE" };
        const state = documentStateReducer(
            { uploads: [placeholder("c1"), placeholder("c2")] },
            { type: "uploadResult", correlationId: "c1", upload: stored, submissionId: "s1" }
        );
        expect(state.submissionId).toBe("s1");
        expect(state.uploads).toEqual([stored, placeholder("c2")]);
    });

    it("keeps existing submissionId when none is given", () => {
        const state = documentStateReducer(
            { submissionId: "s0", uploads: [placeholder("c1")] },
            { type: "uploadResult", correlationId: "c1", upload: { ...placeholder("c1"), status: "RETRYABLE_FAILED" } }
        );
        expect(state.submissionId).toBe("s0");
        expect(state.uploads?.[0].status).toBe("RETRYABLE_FAILED");
    });
});

describe("documentStateReducer refresh", () => {
    it("keeps client-only placeholders and keeps submissionId when server has none", () => {
        const state = documentStateReducer(
            { submissionId: "s0", uploads: [placeholder("c1")] },
            { type: "refresh", state: { submissionId: "", uploads: [], validations: [], status: "OPEN" } }
        );
        expect(state.submissionId).toBe("s0");
        expect(state.uploads).toEqual([placeholder("c1")]);
    });
});
