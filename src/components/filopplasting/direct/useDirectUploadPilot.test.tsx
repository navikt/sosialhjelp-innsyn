import { act, renderHook, waitFor } from "@test/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDirectUploadPilot } from "./useDirectUploadPilot";

const fiksId = "805b3976-47ef-4efb-99d8-929be2d03abc";

afterEach(() => {
    sessionStorage.clear();
    vi.unstubAllGlobals();
});

describe("direct upload pilot", () => {
    it("recovers a lost upload response by checking the same operation after refresh without resending", async () => {
        const submissionId = crypto.randomUUID();
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce(Response.json({ submissionId, navEksternRefId: "ref0001" }))
            .mockRejectedValueOnce(new Error("connection lost"));
        vi.stubGlobal("fetch", fetchMock);
        const first = renderHook(() => useDirectUploadPilot(fiksId));
        await waitFor(() => expect(first.result.current.initialized).toBe(true));
        await act(() => first.result.current.start([new File(["abc"], "test.pdf")]));
        const operationId = first.result.current.items[0].operationId;
        expect(first.result.current.items[0].status).toBe("UNKNOWN");
        first.unmount();

        fetchMock.mockResolvedValueOnce(
            Response.json({
                documents: [
                    {
                        operationId,
                        submissionId,
                        navEksternRefId: "ref0001",
                        filename: "test.pdf",
                        size: 3,
                        converted: false,
                        status: "READY",
                    },
                ],
            })
        );
        const restored = renderHook(() => useDirectUploadPilot(fiksId));
        await waitFor(() => expect(restored.result.current.items[0]?.status).toBe("READY"));
        expect(fetchMock).toHaveBeenCalledTimes(3);
        expect(fetchMock.mock.calls[2][0]).toContain(`/direct/references/ref0001/uploads`);
    });

    it("does not start the remaining files when the first upload has an uncertain outcome", async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce(Response.json({ submissionId: crypto.randomUUID(), navEksternRefId: "ref0001" }))
            .mockRejectedValue(new Error("connection lost"));
        vi.stubGlobal("fetch", fetchMock);
        const { result } = renderHook(() => useDirectUploadPilot(fiksId));
        await waitFor(() => expect(result.current.initialized).toBe(true));
        await act(() => result.current.start([new File(["a"], "a.pdf"), new File(["b"], "b.pdf")]));
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(result.current.stopped).toBe(true);
    });

    it("restores a submitted draft without re-uploading and keeps its operation ids", async () => {
        const operationId = crypto.randomUUID();
        const submissionId = crypto.randomUUID();
        sessionStorage.setItem(
            `direct-upload-test:${fiksId}`,
            JSON.stringify({
                contextId: crypto.randomUUID(),
                reference: "ref0001",
                operations: [operationId],
                submissionId,
                submitting: true,
            })
        );
        const fetchMock = vi.fn().mockResolvedValue(Response.json({ documents: [] }));
        vi.stubGlobal("fetch", fetchMock);
        const { result } = renderHook(() => useDirectUploadPilot(fiksId, "test"));
        await waitFor(() => expect(result.current.initialized).toBe(true));
        expect(result.current.submitting).toBe(true);
        expect(result.current.submissionId).toBe(submissionId);
        expect(result.current.items[0].operationId).toBe(operationId);
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
