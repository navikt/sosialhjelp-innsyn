import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDocumentUploadSync } from "./useDocumentUploadSync";
import * as uploadModule from "./api/uploadFile";
import * as deleteModule from "./api/deleteFile";

vi.mock("./api/uploadFile");
vi.mock("./api/deleteFile");

const makeWrapper = (client: QueryClient) =>
    function Wrapper({ children }: { children: ReactNode }) {
        return createElement(QueryClientProvider, { client }, children);
    };
const fileObj = (name: string) => ({ file: new File(["x"], name), error: false }) as never;
const setup = () => {
    const props = {
        contextId: "ctx",
        onUploadRemoved: vi.fn(),
        onUploadsAdded: vi.fn(),
        onUploadResult: vi.fn(),
        target: { type: "soknad" as const, fiksDigisosId: "d" },
    };
    const queryClient = new QueryClient();
    return {
        props,
        queryClient,
        ...renderHook(() => useDocumentUploadSync(props), { wrapper: makeWrapper(queryClient) }),
    };
};

describe("useDocumentUploadSync", () => {
    beforeEach(() => vi.resetAllMocks());
    afterEach(() => vi.unstubAllGlobals());

    it("starts all uploads immediately", async () => {
        vi.mocked(uploadModule.uploadFile).mockImplementation(() => new Promise(() => undefined));
        const { result } = setup();
        act(() => {
            result.current.startUpload([fileObj("1.pdf"), fileObj("2.pdf"), fileObj("3.pdf")]);
        });
        await waitFor(() => expect(uploadModule.uploadFile).toHaveBeenCalledTimes(3));
    });

    it("deletes the stored file when removed during upload, without reporting the result", async () => {
        let resolve!: (r: Awaited<ReturnType<typeof uploadModule.uploadFile>>) => void;
        vi.mocked(uploadModule.uploadFile).mockImplementation(() => new Promise((res) => (resolve = res)));
        vi.mocked(deleteModule.deleteFile).mockResolvedValue();
        const { result, props } = setup();
        act(() => {
            result.current.startUpload([fileObj("1.pdf")]);
        });
        await waitFor(() => expect(uploadModule.uploadFile).toHaveBeenCalledTimes(1));
        const cid = vi.mocked(uploadModule.uploadFile).mock.calls[0][0].correlationId;
        await act(async () => result.current.terminateUpload(cid, cid));
        expect(props.onUploadRemoved).toHaveBeenCalledWith(cid);

        await act(async () =>
            resolve({
                kind: "stored",
                submissionId: "s",
                upload: { id: "server-id", correlationId: cid } as never,
            })
        );
        await waitFor(() => expect(deleteModule.deleteFile).toHaveBeenCalledWith("server-id"));
        expect(props.onUploadResult).not.toHaveBeenCalled();
    });

    it("keeps the row when backend delete fails", async () => {
        vi.mocked(deleteModule.deleteFile).mockRejectedValue(new Error("boom"));
        const { result, props } = setup();
        await act(async () => result.current.terminateUpload("server-id", "c1"));
        expect(props.onUploadRemoved).not.toHaveBeenCalled();
    });

    it("reuses correlationId on retry", async () => {
        vi.mocked(uploadModule.uploadFile).mockResolvedValue({ kind: "failed" });
        const { result, props } = setup();
        await act(async () => {
            result.current.startUpload([fileObj("1.pdf")]);
        });
        await waitFor(() => expect(uploadModule.uploadFile).toHaveBeenCalledTimes(1));
        const cid = vi.mocked(uploadModule.uploadFile).mock.calls[0][0].correlationId;
        await waitFor(() => expect(props.onUploadResult).toHaveBeenCalledWith(cid, { status: "RETRYABLE_FAILED" }));
        act(() => result.current.retryUpload(cid));
        await waitFor(() => expect(uploadModule.uploadFile).toHaveBeenCalledTimes(2));
        expect(vi.mocked(uploadModule.uploadFile).mock.calls[1][0].correlationId).toBe(cid);
    });

    it("marks the row FAILED when retrying after the mutation was garbage-collected", async () => {
        vi.mocked(uploadModule.uploadFile).mockResolvedValue({ kind: "failed" });
        const { result, props, queryClient } = setup();
        await act(async () => {
            result.current.startUpload([fileObj("1.pdf")]);
        });
        await waitFor(() => expect(uploadModule.uploadFile).toHaveBeenCalledTimes(1));
        const cid = vi.mocked(uploadModule.uploadFile).mock.calls[0][0].correlationId;
        await waitFor(() => expect(props.onUploadResult).toHaveBeenCalledWith(cid, { status: "RETRYABLE_FAILED" }));
        queryClient.getMutationCache().clear();
        act(() => result.current.retryUpload(cid));
        expect(props.onUploadResult).toHaveBeenLastCalledWith(cid, { status: "FAILED" });
        expect(uploadModule.uploadFile).toHaveBeenCalledTimes(1);
    });

    it.each([
        [{ type: "klage" as const, klageId: "k1", navEksternRefId: "ref" }, { navEksternRefId: "ref" }],
        [{ type: "klage" as const, klageId: "k1" }, { navEksternRefId: "k1" }],
        [{ type: "soknad" as const, fiksDigisosId: "d" }, { fiksDigisosId: "d" }],
    ])("uploads with target fields for %j", async (target, fields) => {
        vi.mocked(uploadModule.uploadFile).mockResolvedValue({ kind: "failed" });
        const props = {
            contextId: "ctx",
            onUploadRemoved: vi.fn(),
            onUploadsAdded: vi.fn(),
            onUploadResult: vi.fn(),
            target,
        };
        const { result } = renderHook(() => useDocumentUploadSync(props), { wrapper: makeWrapper(new QueryClient()) });
        await act(async () => {
            result.current.startUpload([fileObj("1.pdf")]);
        });
        await waitFor(() => expect(uploadModule.uploadFile).toHaveBeenCalled());
        expect(vi.mocked(uploadModule.uploadFile).mock.calls[0][0].targetFields).toEqual(fields);
    });

    it("shows validations on 422 as FAILED", async () => {
        vi.mocked(uploadModule.uploadFile).mockResolvedValue({
            kind: "rejected",
            validations: ["ENCRYPTED_PDF" as never],
        });
        const { result, props } = setup();
        await act(async () => {
            result.current.startUpload([fileObj("1.pdf")]);
        });
        await waitFor(() =>
            expect(props.onUploadResult).toHaveBeenCalledWith(expect.any(String), {
                status: "FAILED",
                validations: ["ENCRYPTED_PDF"],
            })
        );
    });

    it("deletes stored upload on backend, but not failed placeholders", async () => {
        vi.mocked(deleteModule.deleteFile).mockResolvedValue();
        const { result, props } = setup();
        await act(async () => result.current.terminateUpload("server-id", "c1"));
        expect(deleteModule.deleteFile).toHaveBeenCalledWith("server-id");
        expect(props.onUploadRemoved).toHaveBeenCalledWith("c1");

        vi.mocked(deleteModule.deleteFile).mockClear();
        await act(async () => result.current.terminateUpload("c2", "c2"));
        expect(deleteModule.deleteFile).not.toHaveBeenCalled();
        expect(props.onUploadRemoved).toHaveBeenCalledWith("c2");
    });
});
