import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useDocumentUploadSync } from "./useDocumentUploadSync";
import * as uploadModule from "./api/uploadFile";
import * as deleteModule from "./api/deleteFile";

vi.mock("./api/uploadFile");
vi.mock("./api/deleteFile");

const fileObj = (name: string) => ({ file: new File(["x"], name), error: false }) as never;
const setup = () => {
    const props = {
        contextId: "ctx",
        onUploadRemoved: vi.fn(),
        onUploadsAdded: vi.fn(),
        onUploadResult: vi.fn(),
        target: { type: "soknad" as const, fiksDigisosId: "d" },
    };
    return { props, ...renderHook(() => useDocumentUploadSync(props)) };
};

describe("useDocumentUploadSync", () => {
    beforeEach(() => vi.resetAllMocks());
    afterEach(() => vi.unstubAllGlobals());

    it("limits to 2 requests in flight", async () => {
        const resolvers: (() => void)[] = [];
        vi.mocked(uploadModule.uploadFile).mockImplementation(
            () => new Promise((res) => resolvers.push(() => res({ kind: "failed" })))
        );
        const { result } = setup();
        act(() => {
            result.current.startUpload([fileObj("1.pdf"), fileObj("2.pdf"), fileObj("3.pdf")]);
        });
        expect(uploadModule.uploadFile).toHaveBeenCalledTimes(2);
        await act(async () => resolvers[0]());
        expect(uploadModule.uploadFile).toHaveBeenCalledTimes(3);
    });

    it("reuses correlationId on retry", async () => {
        vi.mocked(uploadModule.uploadFile).mockResolvedValue({ kind: "failed" });
        const { result, props } = setup();
        await act(async () => {
            result.current.startUpload([fileObj("1.pdf")]);
        });
        const cid = vi.mocked(uploadModule.uploadFile).mock.calls[0][0].correlationId;
        expect(props.onUploadResult).toHaveBeenCalledWith(cid, expect.objectContaining({ status: "RETRYABLE_FAILED" }));
        await act(async () => result.current.retryUpload(cid));
        expect(vi.mocked(uploadModule.uploadFile).mock.calls[1][0].correlationId).toBe(cid);
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
        const { result } = renderHook(() => useDocumentUploadSync(props));
        await act(async () => {
            result.current.startUpload([fileObj("1.pdf")]);
        });
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
        expect(props.onUploadResult).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({ status: "FAILED", validations: ["ENCRYPTED_PDF"] })
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
